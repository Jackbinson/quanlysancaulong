import { InjectionToken } from '@nestjs/common';

// 1. Định nghĩa Interface (giữ nguyên)
export interface IAuthService {
    // Thêm các định nghĩa hàm login, register, v.v.
    login(dto: any): Promise<any>;
    register(dto: any): Promise<any>;
}

// 2. Định nghĩa Injection Token (Sửa lỗi ts(2693))
export const AUTH_SERVICE_TOKEN: InjectionToken = 'IAuthService';