import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from '../entities/membership.entity';
import { User } from '../entities/user.entity';

// DTO cho Admin tạo gói
interface CreateMembershipDto {
  name: string;
  discount_percent: number;
  price: number;
  duration_days: number;
  description?: string;
}

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 1. API ADMIN: Tạo gói thành viên mới
  async create(dto: CreateMembershipDto): Promise<Membership> {
    const newPackage = this.membershipRepository.create(dto);
    return this.membershipRepository.save(newPackage);
  }

  // 2. API PUBLIC: Xem tất cả các gói
  async findAll(): Promise<Membership[]> {
    return this.membershipRepository.find();
  }

  // 3. API USER: Đăng ký gói thành viên (Mua gói)
  async subscribe(userId: number, packageId: number): Promise<User> {
    // a. Kiểm tra gói tồn tại
    const membershipPackage = await this.membershipRepository.findOne({ where: { id: packageId } });

    if (!membershipPackage) {
      throw new NotFoundException(`Gói thành viên ID ${packageId} không tồn tại.`);
    }
    
    // b. Kiểm tra User tồn tại
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
        throw new NotFoundException('Người dùng không tồn tại.');
    }

    // c. Xử lý logic thanh toán (Giả định thanh toán thành công)
    // Thực tế: Cần gọi PaymentService để ghi nhận giao dịch tại đây

    // d. Cập nhật User
    user.membership_id = packageId;
    // Tùy chọn: Thêm membership_expiry_date (cần thêm cột này vào User Entity)
    
    await this.userRepository.save(user);
    return user;
  }
}