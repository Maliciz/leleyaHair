export interface InstagramPost {
  id: string;
  imageUrl: string;
  category: 'Чоловічі' | 'Жіночі' | 'Дитячі' | 'Фарбування';
  title: string;
  description: string;
  masterName?: string;
  likesCount: number;
  postUrl: string;
  date: string;
}

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80",
    category: "Чоловічі",
    title: "Fade & Борода",
    description: "Ідеальний плавний перехід (skin fade) та чітке оформлення бороди з шейвером для нашого постійного клієнта. Робота виконана за 45 хвилин.",
    masterName: "Олена",
    likesCount: 48,
    postUrl: "https://www.instagram.com/leleya.hair/",
    date: "2 дні тому"
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&auto=format&fit=crop&q=80",
    category: "Жіночі",
    title: "Каре та догляд",
    description: "Оновлення графічної форми каре, текстурування кінчиків та глибоке зволожувальне відновлення волосся.",
    masterName: "Ірина",
    likesCount: 65,
    postUrl: "https://www.instagram.com/leleya.hair/",
    date: "4 дні тому"
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80",
    category: "Чоловічі",
    title: "Класична подовжена стрижка",
    description: "Стильний повсякденний образ з акцентом на природну текстуру та об'єм. Легка укладка матовою глиною.",
    masterName: "Олена",
    likesCount: 39,
    postUrl: "https://www.instagram.com/leleya.hair/",
    date: "1 тиждень тому"
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&auto=format&fit=crop&q=80",
    category: "Жіночі",
    title: "Тонування та укладка",
    description: "Насичений шовковистий відтінок, холодний блиск та об'ємна голлівудська укладка для особливої події ✨",
    masterName: "Ірина",
    likesCount: 82,
    postUrl: "https://www.instagram.com/leleya.hair/",
    date: "2 тижні тому"
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
    category: "Фарбування",
    title: "Складне фарбування AirTouch",
    description: "Ніжні плавні переливи світлого блонду без пошкодження структури волосся. Тривалість роботи — 3.5 години.",
    masterName: "Ірина",
    likesCount: 114,
    postUrl: "https://www.instagram.com/leleya.hair/",
    date: "2 тижні тому"
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80",
    category: "Чоловічі",
    title: "Кроп з текстурою",
    description: "Сучасний текстурований Crop з рваним чубчиком та акцентними скронями. Дуже зручний у щоденному догляді.",
    masterName: "Олена",
    likesCount: 53,
    postUrl: "https://www.instagram.com/leleya.hair/",
    date: "3 тижні тому"
  },
  {
    id: "7",
    imageUrl: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=600&auto=format&fit=crop&q=80",
    category: "Дитячі",
    title: "Дитяча стрижка для юного джентльмена",
    description: "Акуратна стильна стрижка для нашого наймолодшого гостя. Зручно, швидко та без капризів!",
    masterName: "Олена",
    likesCount: 71,
    postUrl: "https://www.instagram.com/leleya.hair/",
    date: "3 тижні тому"
  },
  {
    id: "8",
    imageUrl: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80",
    category: "Фарбування",
    title: "Глибокий шоколад та глянець",
    description: "Тонування без аміаку у багатий шоколадний відтінок з ефектом ламінування та укладкою м'якими хвилями.",
    masterName: "Ірина",
    likesCount: 96,
    postUrl: "https://www.instagram.com/leleya.hair/",
    date: "1 місяць тому"
  }
];
