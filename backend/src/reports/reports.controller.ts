import { Controller, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // API 1: Báo cáo Doanh thu (Tính năng 15)
  // Route: GET /api/reports/revenue
  @Roles('admin') // <-- CHỈ ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('revenue')
  @HttpCode(HttpStatus.OK)
  async getRevenueReport() {
    return this.reportsService.getRevenueSummary();
  }
}