import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { MastersModule } from './masters/masters.module';
import { BarberModule } from './barber/barber.module';
import { FinanceModule } from './finance/finance.module';
import { ReviewsModule } from './reviews/reviews.module';
import { InstagramModule } from './instagram/instagram.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ServicesModule,
    BookingsModule,
    MastersModule,
    BarberModule,
    FinanceModule,
    ReviewsModule,
    InstagramModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
