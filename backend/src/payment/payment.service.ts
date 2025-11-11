import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { Booking } from '../entities/booking.entity';

// DTO cho Thanh toán đầu vào (chỉ cần ID Booking, loại thanh toán)
interface CreatePaymentDto {
  bookingId: number;
  paymentType: 'deposit' | 'full' | 'membership';
}

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
  ) {}

  // Logic xử lý thanh toán
  async processPayment(userId: number, dto: CreatePaymentDto): Promise<Payment> {
    const { bookingId, paymentType } = dto;

    // 1. Tìm Booking
    const booking = await this.bookingsRepository.findOne({ where: { id: bookingId } });

    if (!booking) {
      throw new NotFoundException(`Booking ID ${bookingId} không tồn tại.`);
    }

    if (booking.user_id !== userId) {
      throw new BadRequestException('Bạn không phải là chủ của Booking này.');
    }

    if (booking.status === 'confirmed') {
      throw new BadRequestException('Booking này đã được thanh toán và xác nhận.');
    }

    // 2. Ghi nhận giao dịch
    const amount = booking.price; // Giả sử thanh toán toàn bộ cho đơn giản

    const newPayment = this.paymentsRepository.create({
      user_id: userId,
      booking_id: bookingId,
      amount: amount,
      payment_type: paymentType,
      payment_status: 'completed',
    });

    await this.paymentsRepository.save(newPayment);

    // 3. Cập nhật trạng thái Booking
    booking.status = 'confirmed';
    await this.bookingsRepository.save(booking);

    return newPayment;
  }
}