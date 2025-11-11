import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../decorators/roles.decorator'; // Import enum Role (nếu có)

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector dùng để đọc metadata (ở đây là @Roles('admin'))
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 1. Lấy vai trò (roles) cần thiết từ metadata của route
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(), // Phương thức (method)
      context.getClass(),   // Controller class
    ]);

    // Nếu không có @Roles() được đặt trên route, cho phép truy cập
    if (!requiredRoles) {
      return true;
    }

    // 2. Lấy thông tin người dùng từ request (đã được JwtStrategy gắn vào)
    const { user } = context.switchToHttp().getRequest();
    
    // 3. Kiểm tra xem vai trò của user có nằm trong requiredRoles không
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}