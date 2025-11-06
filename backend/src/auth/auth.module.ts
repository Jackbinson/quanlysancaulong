import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; 
import { User } from '../entities/user.entity'; 
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { IAuthService, AUTH_SERVICE_TOKEN } from './auth.service.interface'; // <-- SỬ DỤNG TOKEN

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    JwtModule.register({
      secret: 'DAY_LA_KHOA_BI_MAT_CUA_BAN', 
      signOptions: { expiresIn: '60m' }, 
    }),
  ],
  providers: [
    {
      provide: AUTH_SERVICE_TOKEN, // <-- Token (Provider)
      useClass: AuthService, 
    },
    AuthService // <-- Đăng ký AuthService như một provider thường (NestJS sẽ tự nhận ra nó là useClass của token)
  ],
  controllers: [AuthController],
  exports: [
      AUTH_SERVICE_TOKEN, // <-- EXPORT TOKEN để các module khác có thể @Inject
      AuthService,          // <-- EXPORT SERVICE để dùng trong @Module({ imports: [...]})
      JwtModule
  ], 
})
export class AuthModule {}