import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class RescheduleBookingDto {
  @IsNotEmpty({ message: 'Дата є обов’язковою' })
  @IsString()
  date: string;

  @IsNotEmpty({ message: 'Слот часу є обов’язковим' })
  @IsString()
  timeSlot: string;

  @IsOptional()
  @IsString()
  masterId?: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
