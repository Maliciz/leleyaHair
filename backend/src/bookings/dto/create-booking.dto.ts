import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateBookingDto {
  @IsString({ message: 'Імʼя має бути строкою' })
  @IsNotEmpty({ message: 'Введіть імʼя клієнта' })
  clientName: string;

  @IsString({ message: 'Номер телефону має бути строкою' })
  @IsNotEmpty({ message: 'Введіть номер телефону' })
  @Matches(/^\+380\d{9}$/, {
    message: 'Номер телефону має відповідати формату +380XXXXXXXXX',
  })
  clientPhone: string;

  @IsString()
  @IsNotEmpty({ message: 'Оберіть послугу' })
  serviceId: string;

  @IsString()
  @IsNotEmpty({ message: 'Оберіть дату прийому' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Дата має бути в форматі YYYY-MM-DD' })
  date: string;

  @IsString()
  @IsNotEmpty({ message: 'Оберіть час прийому' })
  @Matches(/^\d{2}:\d{2}$/, { message: 'Час має бути в форматі HH:MM' })
  timeSlot: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  masterId?: string;
}
