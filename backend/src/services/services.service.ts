import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ServiceCategoryResponse {
  id: string;
  title: string;
  description: string;
  items: Array<{
    id: string;
    name: string;
    price: string;
    priceValue: number;
    durationMinutes: number;
    description?: string;
    category: string;
  }>;
}

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories(): Promise<ServiceCategoryResponse[]> {
    const services = await this.prisma.service.findMany({
      orderBy: { id: 'asc' },
    });

    const categoryTitles: Record<string, { title: string; description: string }> = {
      men: {
        title: 'Чоловічі стрижки',
        description: 'Професійні чоловічі стрижки, моделювання бороди та догляд',
      },
      women: {
        title: 'Жіночі стрижки',
        description: 'Елегантні жіночі стрижки будь-якої складності та довжини',
      },
      kids: {
        title: 'Дитячі стрижки',
        description: 'Дбайливі стрижки для найменших відвідувачів у комфортній атмосфері',
      },
    };

    const grouped: Record<string, any[]> = {
      men: [],
      women: [],
      kids: [],
    };

    for (const item of services) {
      const cat = item.category || 'men';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({
        id: item.id,
        name: item.name,
        price: item.price,
        priceValue: item.priceValue,
        durationMinutes: item.duration,
        category: item.category,
      });
    }

    return Object.keys(grouped).map((catId) => ({
      id: catId,
      title: categoryTitles[catId]?.title || catId,
      description: categoryTitles[catId]?.description || '',
      items: grouped[catId],
    }));
  }

  async getServiceById(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
    });
  }
}
