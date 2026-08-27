import { Controller, Get, UseGuards } from '@nestjs/common';
import { MastersService } from './masters.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/admin/masters')
export class MastersController {
  constructor(private readonly mastersService: MastersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMasters() {
    return this.mastersService.getAllMasters();
  }
}
