import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // <-- Đã thêm PassportModule
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { IAuthService, AUTH_SERVICE_TOKEN } from './auth.service.interface';
import { JwtStrategy } from '../shared/strategies/jwt.strategy'; // <-- Import Strategy

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule.register({ defaultStrategy: 'jwt' }), // <-- Cấu hình Passport
        JwtModule.register({
            secret: 'DAY_LA_KHOA_BI_MAT_CUA_BAN',
            signOptions: { expiresIn: '60m' },
        }),
    ],
    providers: [
        {
            provide: AUTH_SERVICE_TOKEN,
            useClass: AuthService,
        },
        AuthService,
        JwtStrategy, // <-- Đăng ký JwtStrategy
    ],
    controllers: [AuthController],
    exports: [
        AUTH_SERVICE_TOKEN,
        AuthService,
        JwtModule,
        PassportModule,
        JwtStrategy
    ],
})
export class AuthModule {}