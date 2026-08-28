import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { MastersService } from './masters.service';
import { CreateMasterDto } from './dto/create-master.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/admin/masters')
export class MastersController {
  constructor(private readonly mastersService: MastersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMasters() {
    return this.mastersService.getAllMasters();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createMaster(@Body() dto: CreateMasterDto) {
    return this.mastersService.createMaster(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle-status')
  async toggleMasterStatus(@Param('id') id: string) {
    return this.mastersService.toggleMasterStatus(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateMaster(
    @Param('id') id: string,
    @Body() body: { name?: string; telegramChatId?: string; notificationUserId?: string }
  ) {
    return this.mastersService.updateMaster(id, body);
  }
}
