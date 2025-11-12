import { Controller, Get, UseGuards, Request, Param, Patch, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard'; 
import { Roles, Role } from '../shared/decorators/roles.decorator';

// DTO cho việc cập nhật Role
class UpdateRoleDto {
    role: Role;
}

@Controller('users') 
export class UserController {
  constructor(private readonly userService: UserService) {}

  // API 1: Xem TẤT CẢ Users (Giữ nguyên)
  @Roles('admin') 
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Get()
  async getAllUsers() {
    return this.userService.findAll(); 
  }

  // API 2: Xem hồ sơ (Profile) (Giữ nguyên)
  @UseGuards(JwtAuthGuard)
  @Get('profile') 
  async getProfile(@Request() req) {
    const user = await this.userService.findOneById(req.user.userId);
    return { /* ... */ };
  }

  // API MỚI (Tính năng 19): Cập nhật vai trò User
  // Route: PATCH /api/users/:id/role
  @Roles('admin') // <-- Chỉ Admin mới có quyền
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/role')
  async updateUserRole(
    @Param('id') userId: number, 
    @Body() updateRoleDto: UpdateRoleDto
  ) {
    const numericUserId = parseInt(userId as any, 10);
    const updatedUser = await this.userService.updateRole(numericUserId, updateRoleDto.role);
    
    return {
        message: `Đã cập nhật vai trò cho User ID ${numericUserId} thành ${updateRoleDto.role}.`,
        user: updatedUser
    };
  }
}