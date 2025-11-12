import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Membership } from '../entities/membership.entity';
import { User } from '../entities/user.entity'; // Cần thiết để cập nhật user khi đăng ký
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Membership, User]), // Đăng ký Membership và User Entity
    AuthModule, // Thừa hưởng Guard và Passport
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService], // Xuất để BookingService có thể sử dụng (để kiểm tra ưu đãi)
})
export class MembershipModule {}