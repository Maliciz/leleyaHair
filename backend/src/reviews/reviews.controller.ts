import { Controller, Get } from '@nestjs/common';
import { ReviewsService, Review } from './reviews.service';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  getReviews(): Review[] {
    return this.reviewsService.getAllReviews();
  }
}
