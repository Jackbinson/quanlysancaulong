import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // Kế thừa AuthGuard('jwt') để tự động xử lý xác thực JWT

    // Dòng này là điểm mà NestJS chạy các logic xác thực (JwtStrategy)
    // AuthGuard sẽ tự động giải mã token và gắn user vào request
    
    // Bạn có thể tùy chỉnh logic xử lý request ở đây, ví dụ:
    /*
    canActivate(context: ExecutionContext) {
        // Thêm logic custom trước khi chạy strategy (ví dụ: kiểm tra quyền truy cập)
        return super.canActivate(context);
    }
    */
    
    // Xử lý lỗi nếu xác thực thất bại
    handleRequest(err, user, info) {
        // err: Lỗi xảy ra trong quá trình xác thực (ví dụ: lỗi giải mã)
        // user: Đối tượng user được trả về từ JwtStrategy.validate()
        // info: Thông tin lỗi của Passport (ví dụ: Token hết hạn)

        // Nếu có lỗi (token hết hạn, token không hợp lệ) hoặc user rỗng, ném lỗi 401.
        if (err || !user) {
            throw err || new UnauthorizedException('Không có quyền truy cập. Token không hợp lệ hoặc đã hết hạn.');
        }
        
        // Nếu thành công, trả về đối tượng user đã được xác thực
        return user; 
    }
}