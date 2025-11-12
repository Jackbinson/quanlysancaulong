import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { Court } from '../entities/court.entity';
import { User } from '../entities/user.entity'; // <-- Cần cho logic giảm giá
import { Membership } from '../entities/membership.entity'; // <-- Cần cho logic giảm giá

// DTO cho Booking
interface CreateBookingDto {
  courtId: number;
  startTime: string;
  endTime: string;
}

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Court)
    private courtsRepository: Repository<Court>,
    @InjectRepository(User) // <-- TIÊM USER REPOSITORY (để lấy membership)
    private userRepository: Repository<User>,
  ) {}

  // ----------------------------------------------------------------------
  // API READ & ACTION (Staff/User)
  // ----------------------------------------------------------------------

  async findUserBookings(userId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { user_id: userId },
      relations: ['court'],
    });
  }
  
  async findAllBookings(): Promise<Booking[]> {
    return this.bookingsRepository.find({
        relations: ['court', 'user'],
    });
  }

  async checkIn(bookingId: number, staffId: number): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({ where: { id: bookingId } });

    if (!booking) {
        throw new NotFoundException(`Booking ID ${bookingId} không tồn tại.`);
    }

    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
        throw new BadRequestException(`Booking này đang ở trạng thái '${booking.status}' và không thể Check-in.`);
    }

    booking.status = 'checked_in';
    booking.staff_checkin_id = staffId;

    await this.bookingsRepository.save(booking);
    return booking;
  }

  // ----------------------------------------------------------------------
  // API CREATE (ĐÃ THÊM LOGIC GIẢM GIÁ)
  // ----------------------------------------------------------------------
  
  private async checkConflict(courtId: number, startTime: Date, endTime: Date): Promise<boolean> {
    
    // Logic xung đột: Sử dụng QueryBuilder an toàn để kiểm tra chồng chéo thời gian
    const conflictBooking = await this.bookingsRepository.createQueryBuilder('booking')
        .where('booking.court_id = :courtId', { courtId })
        .andWhere("booking.status != 'cancelled'") 
        .andWhere('booking.start_time < :endTime', { endTime }) 
        .andWhere('booking.end_time > :startTime', { startTime })
        .getOne();

    return !!conflictBooking; 
  }

  // Tạo Booking mới (Tính năng 4 + 12)
  async create(userId: number, createBookingDto: CreateBookingDto): Promise<Booking> {
    const { courtId, startTime, endTime } = createBookingDto;
    
    // 1. Kiểm tra thời gian và xung đột (GIỮ NGUYÊN)
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    if (startDateTime >= endDateTime) {
        throw new BadRequestException('Thời gian kết thúc phải sau thời gian bắt đầu.');
    }
    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    const hours = durationMs / (1000 * 60 * 60);

    if (hours < 0.5) { 
        throw new BadRequestException('Thời gian đặt tối thiểu là 30 phút.');
    }

    const isConflict = await this.checkConflict(courtId, startDateTime, endDateTime);
    if (isConflict) {
        throw new BadRequestException('Sân đã được đặt trong khoảng thời gian này.');
    }

    // 3. Kiểm tra sân có tồn tại không
    const court = await this.courtsRepository.findOne({ where: { id: courtId } });
    if (!court || court.status === 'maintenance') {
        throw new BadRequestException('Sân không tồn tại hoặc đang bảo trì.');
    }

    // 4. Tính toán giá GỐC và Áp dụng Giảm giá
    let basePrice = court.hourly_rate * hours; 
    let discountAmount = 0; 
    let finalPrice = basePrice;

    // --- TÍNH NĂNG 12: LOGIC GIẢM GIÁ THÀNH VIÊN ---
    // User Repository cần có trong Constructor để chạy đoạn này
    const user = await this.userRepository.findOne({ 
        where: { id: userId },
        relations: ['membership'], // Load thông tin gói thành viên
    });

    if (user && user.membership && user.membership.discount_percent > 0) {
        const discountPercent = user.membership.discount_percent;

        discountAmount = basePrice * (discountPercent / 100);
        finalPrice = basePrice - discountAmount; // ÁP DỤNG GIẢM GIÁ
        this.logger.log(`User ${userId} áp dụng giảm giá ${discountPercent}% (${discountAmount.toFixed(0)} VNĐ).`);
    }
    // --------------------------------------------------------

    // 5. Tạo và Lưu Booking
    const newBooking = this.bookingsRepository.create({
      user_id: userId,
      court_id: courtId,
      start_time: startDateTime,
      end_time: endDateTime,
      price: finalPrice, // <-- GIÁ ĐÃ GIẢM
      discount: discountAmount, // <-- LƯU SỐ TIỀN GIẢM GIÁ
      deposit: finalPrice * 0.2, // 20% tiền cọc (Tính trên giá đã giảm)
      status: 'pending', 
    });

    await this.bookingsRepository.save(newBooking);
    return newBooking;
  }
}