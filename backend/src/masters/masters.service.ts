import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MastersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMasters() {
    return this.prisma.master.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }
}
