import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMasterDto {
  @IsNotEmpty({ message: 'Ім’я є обов’язковим' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Email є обов’язковим' })
  @IsEmail({}, { message: 'Некоректний формат email' })
  email: string;

  @IsNotEmpty({ message: 'Пароль є обов’язковим' })
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  telegramChatId?: string;

  @IsOptional()
  @IsString()
  notificationUserId?: string;
}
