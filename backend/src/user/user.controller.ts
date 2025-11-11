import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard'; 
import { Roles } from '../shared/decorators/roles.decorator';

@Controller('users') // Base route: /api/users
export class UserController {
  constructor(private readonly userService: UserService) {}

  // API 1: Xem TẤT CẢ Users (Quản lý)
  // Route: GET /api/users
  @Roles('admin') // <-- BẮT BUỘC CHỈ ADMIN MỚI ĐƯỢC VÀO
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Get()
  async getAllUsers() {
    // Gọi hàm Service tìm kiếm tất cả người dùng
    return this.userService.findAll(); 
  }

  // API 2: Xem hồ sơ của chính user đó (Profile)
  // Route: GET /api/users/profile
  @UseGuards(JwtAuthGuard)
  @Get('profile') // <-- Sub-route là 'profile'
  async getProfile(@Request() req) {
    // Dùng findOneById, chỉ trả về user từ Token
    const user = await this.userService.findOneById(req.user.userId);
    
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    };
  }
}