import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Court } from '../entities/court.entity';
import { CourtService } from './court.service';
import { CourtController } from './court.controller';
import { AuthModule } from '../auth/auth.module'; // Cần để sử dụng Guard

@Module({
  imports: [
    TypeOrmModule.forFeature([Court]),
    AuthModule, // <-- Import AuthModule để dùng các cơ chế bảo mật
  ],
  providers: [CourtService],
  controllers: [CourtController],
  exports: [CourtService],
})
export class CourtModule {}