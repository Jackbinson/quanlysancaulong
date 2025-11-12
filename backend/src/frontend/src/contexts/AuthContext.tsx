// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/AuthService';
import { LoginCredentials, RegisterCredentials, User } from '../types/User.types'; // Đã sửa đường dẫn

// Định nghĩa kiểu dữ liệu cho AuthContext
interface AuthContextType {
    currentUser: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Thêm trạng thái loading

    useEffect(() => {
        // Kiểm tra người dùng đã đăng nhập khi ứng dụng khởi tạo
        const user = authService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        setIsLoading(false); // Đã tải xong trạng thái người dùng
    }, []);

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const user = await authService.login(credentials);
            setCurrentUser(user);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        setIsLoading(true);
        try {
            await authService.register(credentials);
            // Sau khi đăng ký thành công, thường sẽ chuyển hướng đến trang đăng nhập
            // hoặc tự động đăng nhập tùy theo luồng ứng dụng
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        isLoading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};