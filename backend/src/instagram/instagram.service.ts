import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstagramPostDto } from './dto/create-instagram-post.dto';

@Injectable()
export class InstagramService {
  constructor(private readonly prisma: PrismaService) {}

  // GET /api/instagram - Public endpoint
  async getAllPosts() {
    return this.prisma.instagramPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // POST /api/instagram - Protected (Manager/Admin)
  async createPost(dto: CreateInstagramPostDto) {
    return this.prisma.instagramPost.create({
      data: {
        title: dto.title,
        description: dto.description || '',
        category: dto.category,
        imageUrl: dto.imageUrl,
        postUrl: dto.postUrl || 'https://www.instagram.com/leleya.hair/',
        masterName: dto.masterName || '',
        likesCount: dto.likesCount ? Number(dto.likesCount) : 0,
      },
    });
  }

  // DELETE /api/instagram/:id - Protected (Manager/Admin)
  async deletePost(id: string) {
    const existing = await this.prisma.instagramPost.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Публікацію Instagram не знайдено');
    }

    await this.prisma.instagramPost.delete({
      where: { id },
    });

    return { success: true, message: 'Публікацію успішно видалено' };
  }
}
