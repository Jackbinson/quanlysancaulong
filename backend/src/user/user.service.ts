import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../shared/decorators/roles.decorator'; // Import Role type

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // ... (Hàm findAll và findOneById giữ nguyên) ...
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
        select: ['id', 'email', 'full_name', 'phone_number', 'role']
    });
  }
  async findOneById(id: number): Promise<User> {
    return this.usersRepository.findOne({ 
        where: { id },
        select: ['id', 'email', 'full_name', 'role'] 
    });
  }
  // ----------------------------------------------

  // API MỚI (Tính năng 19): Cập nhật Role
  async updateRole(id: number, newRole: Role): Promise<User> {
    // Tìm user bằng ID (dùng lại hàm đã có)
    const user = await this.usersRepository.findOne({ where: { id }});
    if (!user) {
        throw new NotFoundException(`User ID ${id} không tồn tại.`);
    }

    // Kiểm tra tính hợp lệ của Role
    const validRoles: Role[] = ['user', 'staff', 'admin'];
    if (!validRoles.includes(newRole)) {
        throw new BadRequestException(`Vai trò '${newRole}' không hợp lệ.`);
    }

    // Cập nhật và lưu
    user.role = newRole;
    return this.usersRepository.save(user);
  }
}