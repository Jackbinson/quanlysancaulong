import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { Booking } from '../entities/booking.entity';
import { User } from '../entities/user.entity'; 
import { EmailService } from '../shared/email/email.service'; 

// DTO cho Thanh toán đầu vào
interface CreatePaymentDto {
  bookingId: number;
  paymentType: 'deposit' | 'full' | 'membership';
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(User) 
    private userRepository: Repository<User>,
    private emailService: EmailService, 
  ) {}

  // --------------------------------------------------------
  // API MỚI (Tính năng 16): Admin xem tất cả giao dịch
  // --------------------------------------------------------
  async findAll(): Promise<Payment[]> {
    this.logger.log('Admin requested all payment transactions.');
    return this.paymentsRepository.find({
        // Tải các mối quan hệ để Admin xem chi tiết
        relations: ['user', 'booking', 'booking.court'],
        order: {
            transaction_date: 'DESC' // Sắp xếp giao dịch mới nhất lên đầu
        }
    });
  }
  // --------------------------------------------------------

  // Logic xử lý thanh toán (Giữ nguyên)
  async processPayment(userId: number, dto: CreatePaymentDto): Promise<Payment> {
    const { bookingId, paymentType } = dto;

    // 1. Tìm Booking (Load thêm 'court' để gửi email)
    const booking = await this.bookingsRepository.findOne({ 
        where: { id: bookingId },
        relations: ['court'] 
    });

    if (!booking) {
      throw new NotFoundException(`Booking ID ${bookingId} không tồn tại.`);
    }
    if (booking.user_id !== userId) {
      throw new BadRequestException('Bạn không phải là chủ của Booking này.');
    }
    if (booking.status === 'confirmed') {
      throw new BadRequestException('Booking này đã được thanh toán và xác nhận.');
    }

    // 2. Ghi nhận giao dịch (Giữ nguyên)
    const amount = booking.deposit; 
    const newPayment = this.paymentsRepository.create({
      user_id: userId,
      booking_id: bookingId,
      amount: amount,
      payment_type: paymentType,
      payment_status: 'completed',
    });
    await this.paymentsRepository.save(newPayment);

    // 3. Cập nhật trạng thái Booking (Giữ nguyên)
    booking.status = 'confirmed';
    await this.bookingsRepository.save(booking);

    // 4. GỬI EMAIL XÁC NHẬN (Tính năng 6)
    try {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (user) {
            this.emailService.sendPaymentConfirmation(user, booking, newPayment);
        }
    } catch (emailError) {
        this.logger.error(`Lỗi khi chuẩn bị gửi email (Payment thành công): ${emailError.message}`);
    }

    return newPayment;
  }
}