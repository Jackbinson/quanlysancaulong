import { Controller, Get, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Param } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard'; 
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';

// DTO cho các hàm trong controller
class CreateMembershipDto {
  name: string;
  discount_percent: number;
  price: number;
  duration_days: number;
}
class SubscribeDto {
    packageId: number;
}

@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  // API 1: Xem TẤT CẢ các gói thành viên (PUBLIC/Tính năng 10)
  @Get()
  findAll() {
    return this.membershipService.findAll();
  }

  // API 2: Tạo gói thành viên (CHỈ ADMIN/Tính năng 9)
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipService.create(createMembershipDto);
  }

  // API 3: Đăng ký/Mua gói thành viên (USER/Tính năng 11)
  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribe(@Req() req, @Body() subscribeDto: SubscribeDto) {
    const userId = req.user.userId;
    
    const user = await this.membershipService.subscribe(userId, subscribeDto.packageId);
    
    return {
        message: 'Đăng ký gói thành viên thành công.',
        user: user
    };
  }
}