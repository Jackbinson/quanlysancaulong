import { Controller, Get, Post, Body, UseGuards, HttpStatus, HttpCode, Req } from '@nestjs/common';
import { CourtService } from './court.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard'; 
import { RolesGuard } from '../shared/guards/roles.guard'; // <-- Import RolesGuard
import { Roles, Role } from '../shared/decorators/roles.decorator'; // <-- Import Roles Decorator và Type Role

// Định nghĩa DTO cho việc tạo sân
class CreateCourtDto {
  name: string;
  hourly_rate: number;
}

@Controller('courts')
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  // 1. API CÔNG KHAI: Xem danh sách sân
  @Get()
  findAll() {
    // API này không cần bảo vệ (Public)
    return this.courtService.findAll();
  }

  // 2. API BẢO MẬT VÀ PHÂN QUYỀN: Tạo sân mới
  // Chỉ cho phép vai trò 'admin' hoặc 'staff'
  @Roles('admin', 'staff') // <-- ÁP DỤNG QUYỀN HẠN
  @UseGuards(JwtAuthGuard, RolesGuard) // <-- CHẠY 2 GUARD (Xác thực JWT rồi mới Phân quyền Role)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCourtDto: CreateCourtDto, @Req() req) {
    // Sau khi vượt qua RolesGuard, bạn không cần kiểm tra quyền nữa
    console.log(`Admin/Staff ID ${req.user.userId} created court: ${createCourtDto.name}`);
    
    return this.courtService.create(createCourtDto);
  }
}