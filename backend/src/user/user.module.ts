import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module'; // <-- Đảm bảo import AuthModule

    @Module({
      imports: [
        TypeOrmModule.forFeature([User]),
        AuthModule, // <-- Cần thiết cho Passport
      ],
      controllers: [UserController], // <-- ĐẢM BẢO CONTROLLER ĐƯỢC ĐĂNG KÝ
      providers: [UserService],
      exports: [UserService],
    })
    export class UserModule {}