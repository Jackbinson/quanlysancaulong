import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Court } from '../entities/court.entity';

@Injectable()
export class CourtService {
  constructor(
    @InjectRepository(Court)
    private courtsRepository: Repository<Court>,
  ) {}

  // 1. API: Lấy tất cả sân (Public)
  async findAll(): Promise<Court[]> {
    return this.courtsRepository.find();
  }

  // 2. API: Tạo sân mới (Chỉ Admin/Staff)
  async create(courtData: Partial<Court>): Promise<Court> {
    const newCourt = this.courtsRepository.create(courtData);
    return this.courtsRepository.save(newCourt);
  }

  // 3. API MỚI: Cập nhật trạng thái sân (Chỉ Admin)
  async updateStatus(id: number, newStatus: string): Promise<Court> {
    const court = await this.courtsRepository.findOne({ where: { id } });

    if (!court) {
      throw new NotFoundException(`Court ID ${id} not found.`);
    }

    // Kiểm tra tính hợp lệ của trạng thái mới (Chỉ chấp nhận các giá trị này)
    const validStatuses = ['available', 'occupied', 'maintenance'];
    if (!validStatuses.includes(newStatus)) {
        throw new BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Cập nhật và lưu vào Database
    court.status = newStatus;
    return this.courtsRepository.save(court);
  }
}