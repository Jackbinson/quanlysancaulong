import { Controller, Post, Body, HttpCode, HttpStatus, Inject } from '@nestjs/common'; // <-- Import Inject
import { IAuthService, AUTH_SERVICE_TOKEN } from './auth.service.interface'; // <-- Import Token

// Định nghĩa cấu trúc dữ liệu (DTO)
class RegisterUserDto {
  email: string;
  password: string;
  full_name?: string;
}

class LoginUserDto {
  email: string;
  password: string;
}


@Controller('auth') 
export class AuthController {
  // SỬ DỤNG @Inject VỚI TOKEN
  constructor(@Inject(AUTH_SERVICE_TOKEN) private readonly authService: IAuthService) {} 

  // Tính năng 1: Đăng ký tài khoản
  @Post('register') 
  @HttpCode(HttpStatus.CREATED) 
  async register(@Body() registerDto: RegisterUserDto) {
    const user = await this.authService.register(registerDto); 
    return {
      message: 'Đăng ký thành công.',
      user: {
        id: user.id,
        email: user.email,
        role: user.role, 
        full_name: user.full_name,
      },
    };
  }

  // TÍNH NĂNG 2: Đăng nhập
  @Post('login') // Đường dẫn đầy đủ: POST /api/auth/login
  @HttpCode(HttpStatus.OK) // Mã trạng thái 200 (OK)
  async login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto); 
  }
}