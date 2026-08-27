import { Injectable } from '@nestjs/common';

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  serviceUsed: string;
  avatarUrl?: string;
}

@Injectable()
export class ReviewsService {
  private readonly reviews: Review[] = [
    {
      id: 'rev-1',
      authorName: 'Олександр Коваленко',
      rating: 5,
      comment: 'Чудовий салон! Стригся у майстра на «Під нуль + шейвер». Ідеальна гладкість, все дуже охайно та професійно. Особливо порадувала дружня атмосфера та кава!',
      date: '2026-08-15',
      serviceUsed: '«Під нуль» + шейвер',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'rev-2',
      authorName: 'Марія Мельник',
      rating: 5,
      comment: 'Приходила на стрижку кінчиків та догляд. Майстер врахувала всі побажання, волосся виглядає доглянутим та живим. Лелея — мій новий улюблений салон у Вишневому!',
      date: '2026-08-20',
      serviceUsed: 'Кінчики',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'rev-3',
      authorName: 'Дмитро Шевченко',
      rating: 5,
      comment: 'Робив подовжену стрижку та стрижку бороди. Результат супер! Контури бороди рівні, стрижка ідеальна. Ціни дуже помірні для такої високої якості.',
      date: '2026-08-22',
      serviceUsed: 'Подовжена стрижка + Борода',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'rev-4',
      authorName: 'Олена Бойко',
      rating: 5,
      comment: 'Приводила сина на дитячу модельну стрижку. Майстер швидко знайшла підхід до дитини, дитина в захваті, стрижка стильна. Дякуємо!',
      date: '2026-08-25',
      serviceUsed: 'Дитяча модельна',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    },
  ];

  getAllReviews(): Review[] {
    return this.reviews;
  }
}
