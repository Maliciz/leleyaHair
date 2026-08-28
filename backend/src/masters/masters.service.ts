import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDto } from './dto/create-master.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MastersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMasters() {
    return this.prisma.master.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createMaster(dto: CreateMasterDto) {
    if (!dto.name || !dto.email || !dto.password) {
      throw new BadRequestException('Ім\'я, email та пароль є обов\'язковими');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException('Користувач з такою email-адресою вже існує в системі');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.trim().toLowerCase(),
        password: hashedPassword,
        name: dto.name.trim(),
        role: Role.BARBER,
      },
    });

    const master = await this.prisma.master.create({
      data: {
        name: dto.name.trim(),
        isActive: true,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return master;
  }

  async toggleMasterStatus(id: string) {
    const master = await this.prisma.master.findUnique({
      where: { id },
    });

    if (!master) {
      throw new NotFoundException('Перукаря / майстра не знайдено');
    }

    return this.prisma.master.update({
      where: { id },
      data: { isActive: !master.isActive },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }
}
