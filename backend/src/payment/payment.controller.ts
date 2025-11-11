import { Controller, Post, Body, HttpCode, HttpStatus, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';

// DTO cho Thanh toán đầu vào
class CreatePaymentDto {
  bookingId: number;
  paymentType: 'deposit' | 'full' | 'membership';
}

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // API Thanh toán (Chỉ user đã đăng nhập mới được gọi)
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
}