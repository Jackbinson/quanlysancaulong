// src/services/AuthService.ts
import { LoginCredentials, RegisterCredentials, User } from '../types/User.types'; // Sửa User.types (U viết hoa)

class AuthService {
    private baseUrl = 'http://localhost:3001/api/auth'; // Giả định API endpoint

    async login(credentials: LoginCredentials): Promise<User> {
        console.log('Attempting to log in with:', credentials);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (credentials.email === 'test@example.com' && credentials.password === 'password') {
                    const user: User = {
                        id: 'user123',
                        email: credentials.email,
                        role: 'user',
                        token: 'mock_jwt_token',
                    };
                    localStorage.setItem('user', JSON.stringify(user));
                    resolve(user);
                } else {
                    reject(new Error('Email hoặc mật khẩu không đúng.'));
                }
            }, 1000);
        });
    }

    async register(credentials: RegisterCredentials): Promise<void> {
        console.log('Attempting to register with:', credentials);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 1500);
        });
    }

    logout(): void {
        console.log('Logging out...');
        localStorage.removeItem('user');
    }

    getCurrentUser(): User | null {
        const userJson = localStorage.getItem('user');
        return userJson ? JSON.parse(userJson) : null;
    }
}

export const authService = new AuthService();