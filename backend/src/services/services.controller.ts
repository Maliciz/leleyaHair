import { Controller, Get } from '@nestjs/common';
import { ServicesService, ServiceCategory } from './services.service';

@Controller('api/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  getServices(): ServiceCategory[] {
    return this.servicesService.getAllCategories();
  }
}
