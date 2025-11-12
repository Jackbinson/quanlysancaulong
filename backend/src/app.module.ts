import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
// --- Import TẤT CẢ Entity ---
import { User } from './entities/user.entity';
import { Booking } from './entities/booking.entity'; 
import { Court } from './entities/court.entity'; 
import { Membership } from './entities/membership.entity'; 
import { Payment } from './entities/payment.entity'; 
import { Notification } from './entities/notification.entity';
// ---- user module import --- 
import { UserModule } from './user/user.module'; 
// ---- court module import ---
import { CourtModule } from './court/court.module';
// ---- booking module import ---
import { BookingModule } from './booking/booking.module';
// ---- payment module import ---
import { PaymentModule } from './payment/payment.module';
// ---- membership module import --- 
import { MembershipModule } from './membership/membership.module';
@Module({
  imports: [
    // Cấu hình TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER, // Phải là 'postgres' nếu bạn làm theo bước trước
      password: process.env.DB_PASSWORD, // Phải là 'xuanhungduong05'
      database: process.env.DB_NAME,
      
      // --- PHẦN SỬA LỖI CUỐI CÙNG ---
      entities: [User, Booking, Court, Membership, Payment, Notification],
      autoLoadEntities: true, 
      synchronize: false, // <-- ĐÃ TẮT ĐỒNG BỘ HÓA ĐỂ TRÁNH LỖI DỮ LIỆU CŨ
    }),

    AuthModule, 
    UserModule, // <-- ĐÃ ĐƯỢC IMPORT
    CourtModule, // <-- ĐÃ ĐƯỢC IMPORT
    BookingModule, // <-- ĐÃ ĐƯỢC IMPORT
    PaymentModule, // <-- ĐÃ ĐƯỢC IMPORT
    MembershipModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}