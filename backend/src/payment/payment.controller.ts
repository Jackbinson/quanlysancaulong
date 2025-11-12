import { Controller, Post, Body, HttpCode, HttpStatus, Req, UseGuards, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';

// DTO cho Thanh toán đầu vào
class CreatePaymentDto {
  bookingId: number;
  paymentType: 'deposit' | 'full' | 'membership';
}

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // API 1: User tạo Thanh toán (Giữ nguyên)
  // Route: POST /api/payments
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPayment(@Body() dto: CreatePaymentDto, @Req() req) {
    const userId = req.user.userId;
    const payment = await this.paymentService.processPayment(userId, dto);
    return {
      message: 'Thanh toán và xác nhận Booking thành công.',
      payment: payment,
    };
  }

  // --------------------------------------------------------
  // API MỚI (Tính năng 16): Admin xem tất cả giao dịch
  // --------------------------------------------------------
  // Route: GET /api/payments
  @Roles('admin') // <-- CHỈ ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllPayments() {
    return this.paymentService.findAll();
  }
}