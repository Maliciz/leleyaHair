import { Module } from '@nestjs/common';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [ServicesModule, BookingsModule, ReviewsModule],
})
export class AppModule {}
