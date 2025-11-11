import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Định nghĩa Interface cho Payload (giống như khi tạo token)
export interface JwtPayload {
  email: string;
  sub: number; // User ID
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Lấy JWT từ header 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      // Đảm bảo token chưa hết hạn
      ignoreExpiration: false, 
      // Khóa bí mật dùng để giải mã Token (PHẢI KHỚP với JwtModule đã cấu hình)
      secretOrKey: 'DAY_LA_KHOA_BI_MAT_CUA_BAN', 
    });
  }

  // Phương thức này được gọi sau khi Token được giải mã và xác minh thành công.
  // Payload (tải trọng) đã được kiểm tra tính hợp lệ.
  async validate(payload: JwtPayload) {
    // Trả về đối tượng user để NestJS gắn vào request.user
    // Dữ liệu này sẽ có sẵn trong Controller/Service được bảo vệ.
    return { 
        userId: payload.sub, 
        email: payload.email, 
        role: payload.role 
    };
  }
}