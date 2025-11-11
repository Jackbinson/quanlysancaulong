import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity'; // <-- Import Entity Payment
import { Booking } from '../entities/booking.entity'; // <-- Cần thiết để cập nhật trạng thái
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AuthModule } from '../auth/auth.module'; // Dùng để bảo vệ API

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Booking]), // Đăng ký Payment và Booking Entity
    AuthModule, // Thừa hưởng cơ chế bảo mật (Guard)
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService], // Export nếu các module khác cần ghi nhận Payment
})
export class PaymentModule {}