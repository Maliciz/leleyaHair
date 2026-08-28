export class CreateInstagramPostDto {
  title: string;
  description?: string;
  category: string; // 'Чоловічі' | 'Жіночі' | 'Дитячі' | 'Фарбування'
  imageUrl: string;
  postUrl: string;
  masterName?: string;
  likesCount?: number;
}
