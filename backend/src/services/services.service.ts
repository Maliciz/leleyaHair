import { Injectable } from '@nestjs/common';

export interface ServiceItem {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  durationMinutes: number;
  description?: string;
  category: 'men' | 'women' | 'kids';
}

export interface ServiceCategory {
  id: 'men' | 'women' | 'kids';
  title: string;
  description: string;
  items: ServiceItem[];
}

@Injectable()
export class ServicesService {
  private readonly categories: ServiceCategory[] = [
    {
      id: 'men',
      title: 'Чоловічі стрижки',
      description: 'Професійні чоловічі стрижки, моделювання бороди та догляд',
      items: [
        {
          id: 'm1',
          name: '«Під нуль»',
          price: '150 грн',
          priceValue: 150,
          durationMinutes: 30,
          description: 'Стрижка машинкою без насадок по всій голові',
          category: 'men',
        },
        {
          id: 'm2',
          name: '«Під нуль» + шейвер',
          price: '250 грн',
          priceValue: 250,
          durationMinutes: 30,
          description: 'Ідеально гладенька стрижка з обробкою електробритвою (шейвером)',
          category: 'men',
        },
        {
          id: 'm3',
          name: 'Одна насадка',
          price: '200 грн',
          priceValue: 200,
          durationMinutes: 30,
          description: 'Рівномірна стрижка однією обраною довжиною',
          category: 'men',
        },
        {
          id: 'm4',
          name: 'Декілька насадок',
          price: '250 грн',
          priceValue: 250,
          durationMinutes: 45,
          description: 'Класична стрижка з плавним переходом (Fade/Fade taper)',
          category: 'men',
        },
        {
          id: 'm5',
          name: 'Насадка + ножиці',
          price: '300 грн',
          priceValue: 300,
          durationMinutes: 45,
          description: 'Комбінована стрижка з індивідуальною опрацюванням форми ножицями',
          category: 'men',
        },
        {
          id: 'm6',
          name: 'Подовжена стрижка',
          price: '350 грн',
          priceValue: 350,
          durationMinutes: 60,
          description: 'Стрижка середнього та довгого волосся модельної форми',
          category: 'men',
        },
        {
          id: 'm7',
          name: 'Борода',
          price: '200 грн',
          priceValue: 200,
          durationMinutes: 30,
          description: 'Оформлення та контуринг бороди (з шейвером +50 грн)',
          category: 'men',
        },
      ],
    },
    {
      id: 'women',
      title: 'Жіночі стрижки',
      description: 'Елегантні жіночі стрижки будь-якої складності та довжини',
      items: [
        {
          id: 'w1',
          name: 'Чубчик',
          price: '150 грн',
          priceValue: 150,
          durationMinutes: 30,
          description: 'Стрижка або корекція формоутворення чубчика',
          category: 'women',
        },
        {
          id: 'w2',
          name: 'Кінчики',
          price: '300 грн',
          priceValue: 300,
          durationMinutes: 45,
          description: 'Оновлення зрізу волосся та видалення посічених кінчиків',
          category: 'women',
        },
        {
          id: 'w3',
          name: 'Жіноча коротка',
          price: '350 грн',
          priceValue: 350,
          durationMinutes: 45,
          description: 'Модельна стрижка на коротке волосся (Піксі, Боб)',
          category: 'women',
        },
        {
          id: 'w4',
          name: '2 довжина',
          price: '350–400 грн',
          priceValue: 350,
          durationMinutes: 60,
          description: 'Стрижка волосся до плечей з укладанням',
          category: 'women',
        },
        {
          id: 'w5',
          name: '3, 4 довжина',
          price: '400–450 грн',
          priceValue: 400,
          durationMinutes: 60,
          description: 'Стрижка довгого та дуже довгого волосся',
          category: 'women',
        },
      ],
    },
    {
      id: 'kids',
      title: 'Дитячі стрижки',
      description: 'Дбайливі стрижки для найменших відвідувачів у комфортній атмосфері',
      items: [
        {
          id: 'k1',
          name: 'Дитяча стрижка',
          price: '300 грн',
          priceValue: 300,
          durationMinutes: 30,
          description: 'Класична стрижка для дітей до 12 років',
          category: 'kids',
        },
        {
          id: 'k2',
          name: 'Дитяча модельна',
          price: '350 грн',
          priceValue: 350,
          durationMinutes: 45,
          description: 'Стильна модельна стрижка з візерунками або складним фасоном',
          category: 'kids',
        },
      ],
    },
  ];

  getAllCategories(): ServiceCategory[] {
    return this.categories;
  }

  getServiceById(id: string): ServiceItem | undefined {
    for (const cat of this.categories) {
      const item = cat.items.find((i) => i.id === id);
      if (item) return item;
    }
    return undefined;
  }
}
