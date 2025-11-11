import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { Court } from '../entities/court.entity';

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
  ) {}

  // Lấy lịch sử booking của một người dùng (Cho User)
  async findUserBookings(userId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { user_id: userId },
      relations: ['court'], 
    });
  }
  
  // API MỚI (Tính năng 7): Xem TẤT CẢ booking của hệ thống (Cho Staff/Admin)
  async findAllBookings(): Promise<Booking[]> {
    return this.bookingsRepository.find({
        // Tải thông tin user và court để Staff/Admin dễ dàng quản lý
        relations: ['court', 'user'], 
    });
  }

  // API MỚI (Tính năng 8): Check-in cho khách
  async checkIn(bookingId: number, staffId: number): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({ where: { id: bookingId } });

    if (!booking) {
        throw new NotFoundException(`Booking ID ${bookingId} không tồn tại.`);
    }

    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
        throw new BadRequestException(`Booking này đang ở trạng thái '${booking.status}' và không thể Check-in.`);
    }

    // Thực hiện Check-in
    booking.status = 'checked_in';
    booking.staff_checkin_id = staffId;

    await this.bookingsRepository.save(booking);
    return booking;
  }
  
  // ... (Các hàm khác như checkConflict, create vẫn giữ nguyên) ...
  private async checkConflict(courtId: number, startTime: Date, endTime: Date): Promise<boolean> {
    
    // Logic xung đột đã được sửa để tìm bất kỳ Booking nào có thời gian chồng chéo
    const conflictBooking = await this.bookingsRepository.createQueryBuilder('booking')
        .where('booking.court_id = :courtId', { courtId })
        .andWhere("booking.status != 'cancelled'")
        // Điều kiện: [start_time, end_time] của booking cũ chồng chéo lên [startTime, endTime] của booking mới
        .andWhere('booking.start_time < :endTime', { endTime }) 
        .andWhere('booking.end_time > :startTime', { startTime })
        .getOne();

    return !!conflictBooking; 
  }

  // Tạo Booking mới
  async create(userId: number, createBookingDto: CreateBookingDto): Promise<Booking> {
    const { courtId, startTime, endTime } = createBookingDto;
    
    // 1. Chuyển đổi chuỗi thời gian sang đối tượng Date
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    if (startDateTime >= endDateTime) {
        throw new BadRequestException('Thời gian kết thúc phải sau thời gian bắt đầu.');
    }

    // 2. Kiểm tra xung đột (Conflict Check)
    const isConflict = await this.checkConflict(courtId, startDateTime, endDateTime);
    if (isConflict) {
        throw new BadRequestException('Sân đã được đặt trong khoảng thời gian này.');
    }

    // 3. Kiểm tra sân có tồn tại không
    const court = await this.courtsRepository.findOne({ where: { id: courtId } });
    if (!court || court.status === 'maintenance') {
        throw new BadRequestException('Sân không tồn tại hoặc đang bảo trì.');
    }

    // 4. Tính toán giá (Đơn giản)
    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    const hours = durationMs / (1000 * 60 * 60);

    if (hours < 0.5) { 
        throw new BadRequestException('Thời gian đặt tối thiểu là 30 phút.');
    }

    const calculatedPrice = court.hourly_rate * hours;


    // 5. Tạo và Lưu Booking
    const newBooking = this.bookingsRepository.create({
      user_id: userId,
      court_id: courtId,
      start_time: startDateTime,
      end_time: endDateTime,
      price: calculatedPrice,
      deposit: calculatedPrice * 0.2, // 20% tiền cọc
      status: 'pending', 
    });

    await this.bookingsRepository.save(newBooking);
    return newBooking;
  }
}