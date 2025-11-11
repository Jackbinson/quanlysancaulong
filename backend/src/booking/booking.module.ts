import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../entities/booking.entity';
import { User } from '../entities/user.entity'; // Cần thiết cho các quan hệ
import { Court } from '../entities/court.entity'; // Cần thiết cho các quan hệ
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { AuthModule } from '../auth/auth.module'; // Dùng để bảo vệ API

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, User, Court]),
    AuthModule, // <-- Cần để sử dụng PassportModule và JwtModule
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}