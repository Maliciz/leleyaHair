import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/admin/finance')
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('summary')
  async getFinanceSummary(
    @Query('period') period?: 'today' | 'week' | 'month' | 'custom',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.financeService.getFinanceSummary({ period, startDate, endDate });
  }

  @Get('masters-breakdown')
  async getMastersBreakdown(
    @Query('period') period?: 'today' | 'week' | 'month' | 'custom',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.financeService.getMastersBreakdown({ period, startDate, endDate });
  }

  @Get('period-details')
  async getAllPeriodBookingsDetails(
    @Query('period') period?: 'today' | 'week' | 'month' | 'custom',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.financeService.getAllPeriodBookingsDetails({ period, startDate, endDate });
  }

  @Get('master-details/:masterId')
  async getMasterBookingsDetails(
    @Param('masterId') masterId: string,
    @Query('period') period?: 'today' | 'week' | 'month' | 'custom',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.financeService.getMasterBookingsDetails(masterId, { period, startDate, endDate });
  }
}
