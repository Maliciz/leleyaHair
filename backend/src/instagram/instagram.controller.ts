import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { InstagramService } from './instagram.service';
import { CreateInstagramPostDto } from './dto/create-instagram-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramService) {}

  // GET /api/instagram - Public endpoint
  @Get()
  async getAllPosts() {
    return this.instagramService.getAllPosts();
  }

  // POST /api/instagram - Protected
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() dto: CreateInstagramPostDto) {
    return this.instagramService.createPost(dto);
  }

  // DELETE /api/instagram/:id - Protected
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.instagramService.deletePost(id);
  }
}
