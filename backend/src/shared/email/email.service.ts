import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { User } from '../../entities/user.entity';
import { Booking } from '../../entities/booking.entity';
import { Payment } from '../../entities/payment.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter;

  constructor() {
    // Cấu hình máy chủ gửi email (Sử dụng Gmail làm ví dụ)
    // ⚠️ QUAN TRỌNG: Bạn phải sử dụng "App Password" (Mật khẩu ứng dụng) của Google
    // nếu bạn bật 2-Step Verification, không phải mật khẩu Gmail thông thường.
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true cho cổng 465, false cho các cổng khác
      auth: {
        user: process.env.EMAIL_USER, // Lấy từ file .env (ví dụ: banquanly@gmail.com)
        pass: process.env.EMAIL_PASSWORD, // Lấy từ file .env (Mật khẩu ứng dụng)
      },
    });
  }

  // Hàm gửi email xác nhận thanh toán
  async sendPaymentConfirmation(user: User, booking: Booking, payment: Payment) {
    const startTime = new Date(booking.start_time).toLocaleString('vi-VN');
    const endTime = new Date(booking.end_time).toLocaleString('vi-VN');

    const mailOptions = {
      from: `"QLSCL Admin" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Xác nhận Đặt sân Thành công (Booking ID: ${booking.id})`,
      html: `
        <h1>Chào ${user.full_name},</h1>
        <p>Cảm ơn bạn đã đặt sân tại QLSCL. Lịch đặt của bạn đã được xác nhận thành công.</p>
        
        <h2>Chi tiết Giao dịch:</h2>
        <ul>
          <li><strong>Mã Booking:</strong> ${booking.id}</li>
          <li><strong>Sân:</strong> ${booking.court.name}</li>
          <li><strong>Thời gian:</strong> ${startTime} - ${endTime}</li>
          <li><strong>Tổng tiền:</strong> ${booking.price} VNĐ</li>
          <li><strong>Đã thanh toán (Cọc):</strong> ${payment.amount} VNĐ</li>
          <li><strong>Trạng thái:</strong> ${booking.status}</li>
        </ul>
        <p>Cảm ơn bạn đã tin tưởng dịch vụ!</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email xác nhận đã gửi tới ${user.email} cho Booking ID ${booking.id}`);
    } catch (error) {
      this.logger.error(`Không thể gửi email tới ${user.email}: ${error.message}`, error.stack);
    }
  }
}