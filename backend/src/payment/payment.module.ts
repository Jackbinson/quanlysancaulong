import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { Booking } from '../entities/booking.entity';
import { User } from '../entities/user.entity'; // <-- 1. IMPORT USER
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AuthModule } from '../auth/auth.module';
import { EmailService } from '../shared/email/email.service'; // <-- 2. IMPORT EMAIL SERVICE

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Booking, User]), // <-- 3. THÊM USER
    AuthModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, EmailService], // <-- 4. THÊM EMAIL SERVICE
  exports: [PaymentService],
})
export class PaymentModule {}