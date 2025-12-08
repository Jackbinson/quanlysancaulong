import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

import { Booking } from '../entities/booking.entity';
import { Court } from '../entities/court.entity';
import { User } from '../entities/user.entity';

// DTO cho User
interface CreateBookingDto {
  courtId: number;
  startTime: string;
  endTime: string;
}

// DTO cho Staff (Tính năng 14)
interface StaffCreateBookingDto extends CreateBookingDto {
  userId?: number;
  customerName?: string;
}

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,

    @InjectRepository(Court)
    private courtsRepository: Repository<Court>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ----------------------------------------------------------------------
  // 🟢 API: User xem lịch sử đặt sân
  // ----------------------------------------------------------------------
  async findUserBookings(userId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { user_id: userId },
      relations: ['court'],
    });
  }

  // ----------------------------------------------------------------------
  // 🟢 API: Staff/Admin xem tất cả booking
  // ----------------------------------------------------------------------
  async findAllBookings(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      relations: ['court', 'user'],
    });
  }

  // ----------------------------------------------------------------------
  // 🟢 API: Staff check-in
  // ----------------------------------------------------------------------
  async checkIn(bookingId: number, staffId: number): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException(`Booking ID ${bookingId} không tồn tại.`);
    }

    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      throw new BadRequestException(
        `Booking này đang ở trạng thái '${booking.status}' và không thể Check-in.`,
      );
    }

    booking.status = 'checked_in';
    booking.staff_checkin_id = staffId;

    await this.bookingsRepository.save(booking);
    return booking;
  }

  // ----------------------------------------------------------------------
  // 🟢 CHECK CONFLICT (Kiểm tra giờ trùng)
  // ----------------------------------------------------------------------
  private async checkConflict(
    courtId: number,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean> {
    const conflictBooking = await this.bookingsRepository
      .createQueryBuilder('booking')
      .where('booking.court_id = :courtId', { courtId })
      .andWhere("booking.status != 'cancelled'")
      .andWhere('booking.start_time < :endTime', { endTime })
      .andWhere('booking.end_time > :startTime', { startTime })
      .getOne();

    return !!conflictBooking;
  }

  // ----------------------------------------------------------------------
  // 🟢 API: USER ĐẶT SÂN
  // ----------------------------------------------------------------------
  async create(userId: number, dto: CreateBookingDto): Promise<Booking> {
    const { courtId, startTime, endTime } = dto;

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    if (startDateTime >= endDateTime) {
      throw new BadRequestException(
        'Thời gian kết thúc phải sau thời gian bắt đầu.',
      );
    }

    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    const hours = durationMs / (1000 * 60 * 60);

    if (hours < 0.5) {
      throw new BadRequestException('Thời gian đặt tối thiểu là 30 phút.');
    }

    const isConflict = await this.checkConflict(
      courtId,
      startDateTime,
      endDateTime,
    );
    if (isConflict) {
      throw new BadRequestException('Sân đã được đặt trong khoảng thời gian này.');
    }

    // Kiểm tra sân
    const court = await this.courtsRepository.findOne({
      where: { id: courtId },
    });
    if (!court || court.status === 'maintenance') {
      throw new BadRequestException('Sân không tồn tại hoặc đang bảo trì.');
    }

    // Tính giá gốc
    let basePrice = court.hourly_rate * hours;
    let discountAmount = 0;
    let finalPrice = basePrice;

    // Áp dụng giảm giá thành viên
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['membership'],
    });

    if (user?.membership?.discount_percent > 0) {
      const discountPercent = user.membership.discount_percent;

      discountAmount = basePrice * (discountPercent / 100);
      finalPrice = basePrice - discountAmount;

      this.logger.log(
        `User ${userId} áp dụng giảm giá ${discountPercent}% (${discountAmount.toFixed(
          0,
        )} VNĐ).`,
      );
    }

    // Tạo booking
    const newBooking = this.bookingsRepository.create({
      user_id: userId,
      court_id: courtId,
      start_time: startDateTime,
      end_time: endDateTime,
      price: finalPrice,
      discount: discountAmount,
      deposit: finalPrice * 0.2,
      status: 'pending',
    });

    await this.bookingsRepository.save(newBooking);
    return newBooking;
  }

  // ----------------------------------------------------------------------
  // ⭐ API ANDROID CẦN: LẤY DANH SÁCH SLOT ĐÃ ĐẶT
  // ----------------------------------------------------------------------
  async getBookedSlots(date: string, courtId: number) {
    if (!date || !courtId) {
      throw new BadRequestException('Thiếu date hoặc courtId.');
    }

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const bookings = await this.bookingsRepository.find({
      where: {
        court_id: courtId,
        start_time: Between(startOfDay, endOfDay),
      },
    });

    return bookings.map((b) => ({
      startTime: b.start_time.toISOString().substring(11, 16), // HH:mm
      endTime: b.end_time.toISOString().substring(11, 16),
    }));
  }

  // ----------------------------------------------------------------------
  // 🟢 STAFF TẠO BOOKING CHO KHÁCH VÃNG LAI
  // ----------------------------------------------------------------------
  async staffCreate(
    staffId: number,
    dto: StaffCreateBookingDto,
  ): Promise<Booking> {
    const { courtId, startTime, endTime, userId, customerName } = dto;

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    if (startDateTime >= endDateTime) {
      throw new BadRequestException(
        'Thời gian kết thúc phải sau thời gian bắt đầu.',
      );
    }

    const isConflict = await this.checkConflict(
      courtId,
      startDateTime,
      endDateTime,
    );
    if (isConflict) {
      throw new BadRequestException(
        'Sân đã được đặt trong khoảng thời gian này.',
      );
    }

    const court = await this.courtsRepository.findOne({
      where: { id: courtId },
    });
    if (!court || court.status === 'maintenance') {
      throw new BadRequestException('Sân không tồn tại hoặc đang bảo trì.');
    }

    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    const hours = durationMs / (1000 * 60 * 60);

    let basePrice = court.hourly_rate * hours;
    let discountAmount = 0;
    let finalPrice = basePrice;

    // Nếu staff nhập userId → áp dụng giảm giá thành viên
    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['membership'],
      });

      if (user?.membership?.discount_percent > 0) {
        const discountPercent = user.membership.discount_percent;

        discountAmount = basePrice * (discountPercent / 100);
        finalPrice = basePrice - discountAmount;

        this.logger.log(
          `Staff ${staffId} áp dụng giảm giá ${discountPercent}% cho User ${userId}.`,
        );
      }
    }

    const newBooking = this.bookingsRepository.create({
      user_id: userId || null,
      court_id: courtId,
      start_time: startDateTime,
      end_time: endDateTime,
      price: finalPrice,
      discount: discountAmount,
      deposit: finalPrice,
      status: 'confirmed',
      staff_checkin_id: staffId,
    });

    await this.bookingsRepository.save(newBooking);

    if (customerName) {
      this.logger.log(
        `Booking ${newBooking.id} được tạo cho khách vãng lai: ${customerName}`,
      );
    }

    return newBooking;
  }

  // ----------------------------------------------------------------------
  // 🟢 ADMIN: RESET TẤT CẢ DỮ LIỆU
  // ----------------------------------------------------------------------
  async resetAllTransactions() {
    try {
      await this.bookingsRepository.query('DELETE FROM payments;');
      await this.bookingsRepository.query('DELETE FROM bookings;');

      return {
        success: true,
        message:
          'Toàn bộ dữ liệu giao dịch, thanh toán và lịch đặt đã được xóa sạch.',
      };
    } catch (error) {
      this.logger.error('LỖI XÓA SẠCH DỮ LIỆU:', error.message);
      throw new InternalServerErrorException('Không thể xóa sạch dữ liệu.');
    }
  }
}
