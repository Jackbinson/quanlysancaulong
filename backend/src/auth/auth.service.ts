import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt'; 
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt'; 

// Định nghĩa cấu trúc dữ liệu khi user đăng nhập
interface LoginDto {
  email: string;
  password: string;
}

// Định nghĩa cấu trúc dữ liệu khi user đăng ký
interface RegisterDto {
  email: string;
  password: string;
  full_name?: string;
}

@Injectable()
export class AuthService {
  // KHAI BÁO LOGGER ĐỂ GHI LOG LỖI CRASH
  private readonly logger = new Logger(AuthService.name); 

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, 
    private jwtService: JwtService, 
  ) {}

  // TÍNH NĂNG 1: Xử lý Đăng ký (Register)
  async register(registerDto: RegisterDto): Promise<User> {
    // LOẠI BỎ 'role' KHỎI DTO VÌ NÓ LÀ LỖ HỔNG BẢO MẬT
    const { email, password, full_name } = registerDto;

    // 1. Kiểm tra email đã tồn tại
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email đã được đăng ký.');
    }

    // 2. Băm (Hash) mật khẩu
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt); 

    // 3. Tạo user mới
    const newUser = this.usersRepository.create({
      email,
      password_hash, 
      full_name: full_name || 'Khách hàng',
      role: 'user', // <-- LUÔN GÁN MẶC ĐỊNH LÀ 'user'
    });

    // 4. Lưu vào Database
    return this.usersRepository.save(newUser);
  }

  // TÍNH NĂNG 2: Xử lý Đăng nhập (Login)
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    // THÊM TRY/CATCH ĐỂ NGĂN CRASH
    try {
        const { email, password } = loginDto;

        // 1. Tìm user trong DB
        const user = await this.usersRepository.findOne({ 
          where: { email },
          select: ['id', 'email', 'password_hash', 'role', 'full_name'], 
        });

        if (!user) {
          throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu.');
        }

        // 2. So sánh mật khẩu (An toàn)
        const isPasswordMatching = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordMatching) {
          throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu.');
        }

        // 3. Tạo JWT (Token)
        const payload = { 
          email: user.email, 
          sub: user.id, 
          role: user.role,
        };
        
        return {
          accessToken: this.jwtService.sign(payload),
        };
    } catch (error) {
        // Ghi Log lỗi chi tiết
        this.logger.error(`[CRITICAL] Lỗi trong Auth Service Login: ${error.message}`, error.stack);
        
        // Nếu lỗi là lỗi logic đã định nghĩa, ném lại
        if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
            throw error;
        }

        // Nếu là lỗi hệ thống, ném lỗi 401 chung chung để bảo mật
        throw new UnauthorizedException('Lỗi hệ thống trong quá trình đăng nhập.');
    }
  }
}