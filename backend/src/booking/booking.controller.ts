import { Controller, Post, Get, Body, HttpCode, HttpStatus, Req, UseGuards, BadRequestException, Param, Patch } from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard'; 
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';

// DTO cho Body (Đầu vào từ client)
class CreateBookingDto {
  courtId: number;
  startTime: string; // ISO 8601 string
  endTime: string;   // ISO 8601 string
}

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // API 1: Tạo Booking mới (User)
  @UseGuards(JwtAuthGuard) 
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBooking(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    const userId = req.user.userId; 

    const booking = await this.bookingService.create(userId, createBookingDto);
    
    return {
        message: 'Đặt sân thành công.',
        booking: booking
    };
  }
  
  // API 2: Xem lịch sử Booking của chính User đó
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserBookings(@Req() req) {
    const userId = req.user.userId;
    
    const bookings = await this.bookingService.findUserBookings(userId);
    
    return {
        message: 'Lịch sử đặt sân.',
        data: bookings
    };
  }
  
  // API MỚI (Tính năng 7): Xem TẤT CẢ lịch đặt sân (Staff/Admin)
  @Roles('staff', 'admin') 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('all') // Route: GET /api/bookings/all
  async getAllSystemBookings() {
      const bookings = await this.bookingService.findAllBookings();
      
      return {
          message: 'Lịch đặt toàn hệ thống.',
          data: bookings
      };
  }
  
  // API MỚI (Tính năng 8): Check-in cho khách (Staff/Admin)
  // Route: PATCH /api/bookings/:id/checkin
  @Roles('staff', 'admin') 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/checkin')
  async checkInBooking(@Param('id') bookingId: number, @Req() req) {
      // Lấy ID Staff từ Token
      const staffId = req.user.userId;

      // Chuyển đổi ID từ string sang number
      const id = parseInt(bookingId as any, 10);
      
      const booking = await this.bookingService.checkIn(id, staffId);
      
      return {
          message: `Check-in Booking ID ${id} thành công.`,
          booking: booking
      };
  }

}