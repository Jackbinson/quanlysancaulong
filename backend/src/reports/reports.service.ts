import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  // Tính năng 15: Báo cáo Doanh thu
  async getRevenueSummary() {
    // Sử dụng QueryBuilder để tính tổng doanh thu và tổng số giao dịch
    const result = await this.paymentsRepository.createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'totalRevenue')
      .addSelect('COUNT(payment.id)', 'totalTransactions')
      .where('payment.payment_status = :status', { status: 'completed' })
      .getRawOne(); // Lấy kết quả thô

    // Chuyển đổi kết quả (TypeORM trả về string cho SUM)
    const totalRevenue = parseFloat(result.totalRevenue) || 0;
    const totalTransactions = parseInt(result.totalTransactions, 10) || 0;

    return {
      totalRevenue: totalRevenue,
      totalTransactions: totalTransactions,
      reportGeneratedAt: new Date().toISOString(),
    };
  }
}