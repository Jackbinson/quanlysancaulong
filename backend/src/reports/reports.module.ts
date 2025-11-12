import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Payment } from '../entities/payment.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]), // Chỉ cần truy cập bảng Payment
    AuthModule, // Cần để sử dụng Guards (Bảo mật)
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}