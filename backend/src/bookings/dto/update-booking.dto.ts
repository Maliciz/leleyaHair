import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus, { message: 'Некоректний статус запису' })
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  masterId?: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
