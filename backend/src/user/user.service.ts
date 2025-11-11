import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Hàm tìm TẤT CẢ User (Dùng cho API Quản lý)
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
        // Chỉ chọn các cột an toàn (tránh password_hash)
        select: ['id', 'email', 'full_name', 'phone_number', 'role']
    });
  }

  // Hàm tìm User theo ID (Dùng cho API Profile)
  async findOneById(id: number): Promise<User> {
    return this.usersRepository.findOne({ 
        where: { id },
        select: ['id', 'email', 'full_name', 'role'] 
    });
  }
}