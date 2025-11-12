import { Controller, Post, Get, Body, HttpCode, HttpStatus, Req, UseGuards, BadRequestException, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard'; 
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';

// DTO cho User (Giữ nguyên)
class CreateBookingDto {
  courtId: number;
  startTime: string; 
  endTime: string; 
}

// DTO MỚI cho Staff (Tính năng 14)
class StaffCreateBookingDto {
  courtId: number;
  startTime: string; 
  endTime: string;  
  userId?: number; // ID của User (nếu là thành viên)
  customerName?: string; // Tên (nếu là khách vãng lai)
}


@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // API 1: User tự tạo Booking
  @UseGuards(JwtAuthGuard) 
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBooking(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    const userId = req.user.userId; 
    const booking = await this.bookingService.create(userId, createBookingDto);
    return { message: 'Đặt sân thành công.', booking: booking };
  }
  
  // API 2: User xem lịch sử
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserBookings(@Req() req) {
    const userId = req.user.userId;
    const bookings = await this.bookingService.findUserBookings(userId);
    return { message: 'Lịch sử đặt sân.', data: bookings };
  }
  
  // API 3 (Tính năng 7): Staff/Admin xem TẤT CẢ lịch đặt sân
  @Roles('staff', 'admin') 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('all') 
  async getAllSystemBookings() {
      const bookings = await this.bookingService.findAllBookings();
      return { message: 'Lịch đặt toàn hệ thống.', data: bookings };
  }
  
  // API 4 (Tính năng 8): Staff/Admin Check-in cho khách
  @Roles('staff', 'admin') 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/checkin')
  async checkInBooking(@Param('id', ParseIntPipe) bookingId: number, @Req() req) { // <-- Dùng ParseIntPipe
      const staffId = req.user.userId;
      // Không cần parseInt nữa, Pipe đã xử lý
      const booking = await this.bookingService.checkIn(bookingId, staffId); 
      return { message: `Check-in Booking ID ${bookingId} thành công.`, booking: booking };
  }

  // API 5 MỚI (Tính năng 14): Staff tạo Booking cho khách vãng lai
  @Roles('staff', 'admin') // <-- CHỈ STAFF/ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('staff-create')
  @HttpCode(HttpStatus.CREATED)
  async staffCreateBooking(@Body() dto: StaffCreateBookingDto, @Req() req) {
    const staffId = req.user.userId; // ID của nhân viên đang đăng nhập

    const booking = await this.bookingService.staffCreate(staffId, dto);
    
    return {
        message: 'Staff đã tạo Booking thành công.',
        booking: booking
    };
  }
}