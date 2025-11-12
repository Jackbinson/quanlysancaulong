// src/types/user.types.ts
export interface User {
    id: string;
    email: string;
    role: 'user' | 'admin'; // Có thể mở rộng thêm các vai trò khác
    token: string; // JWT token hoặc session token
    // Thêm các trường khác nếu cần, ví dụ: name, phone, avatar
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    // Thêm các trường khác cho đăng ký, ví dụ:
    // name: string;
    // phoneNumber?: string;
}