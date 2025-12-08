import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Param,
  Patch,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';

// --- DTO CHO USER ---
class CreateBookingDto {
  courtId: number;
  startTime: string;
  endTime: string;
}

// --- DTO CHO STAFF ---
class StaffCreateBookingDto {
  courtId: number;
  startTime: string;
  endTime: string;
  userId?: number;
  customerName?: string;
}

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // -----------------------------
  // 1) USER TỰ ĐẶT SÂN
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBooking(@Body() dto: CreateBookingDto, @Req() req) {
    const userId = req.user.userId;
    const booking = await this.bookingService.create(userId, dto);

    return {
      message: 'Đặt sân thành công.',
      booking,
    };
  }

  // -----------------------------
  // 2) USER XEM LỊCH SỬ
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserBookings(@Req() req) {
    const userId = req.user.userId;
    const bookings = await this.bookingService.findUserBookings(userId);

    return {
      message: 'Lịch sử đặt sân.',
      data: bookings,
    };
  }

  // -----------------------------
  // 3) STAFF/ADMIN xem toàn bộ booking
  // -----------------------------
  @Roles('staff', 'admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('all')
  async getAllSystemBookings() {
    const bookings = await this.bookingService.findAllBookings();
    return {
      message: 'Lịch đặt toàn hệ thống.',
      data: bookings,
    };
  }

  // -----------------------------
  // 4) STAFF check-in cho khách
  // -----------------------------
  @Roles('staff', 'admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/checkin')
  async checkInBooking(
    @Param('id', ParseIntPipe) bookingId: number,
    @Req() req,
  ) {
    const staffId = req.user.userId;
    const booking = await this.bookingService.checkIn(bookingId, staffId);

    return {
      message: `Check-in Booking ID ${bookingId} thành công.`,
      booking,
    };
  }

  // -----------------------------
  // ⭐ API QUAN TRỌNG CHO ANDROID ⭐
  // LẤY CÁC SLOT ĐÃ ĐẶT THEO NGÀY + SÂN
  // -----------------------------
  @Get('slots')
  async getBookedSlots(
    @Query('date') date: string,
    @Query('courtId') courtId: number,
  ) {
    return this.bookingService.getBookedSlots(date, courtId);
  }

  // -----------------------------
  // 5) STAFF tạo booking cho khách vãng lai
  // -----------------------------
  @Roles('staff', 'admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('staff-create')
  @HttpCode(HttpStatus.CREATED)
  async staffCreateBooking(@Body() dto: StaffCreateBookingDto, @Req() req) {
    const staffId = req.user.userId;
    const booking = await this.bookingService.staffCreate(staffId, dto);

    return {
      message: 'Staff đã tạo Booking thành công.',
      booking,
    };
  }
}
