import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Некоректний email' })
  @IsNotEmpty({ message: 'Введіть email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Введіть пароль' })
  @MinLength(6, { message: 'Пароль має містити мінімум 6 символів' })
  password: string;
}
