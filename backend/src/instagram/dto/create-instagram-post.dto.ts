import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInstagramPostDto {
  @IsString({ message: 'Заголовок має бути строкою' })
  @IsNotEmpty({ message: 'Введіть заголовок публікації' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'Оберіть категорію' })
  category: string;

  @IsString()
  @IsNotEmpty({ message: 'Введіть URL зображення' })
  imageUrl: string;

  @IsOptional()
  @IsString()
  postUrl?: string;

  @IsOptional()
  @IsString()
  masterName?: string;

  @IsOptional()
  @IsNumber()
  likesCount?: number;
}
