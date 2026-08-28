import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Leleya Hair Salon database...');

  // 1. Seed Default Manager User
  const managerPassword = await bcrypt.hash('manager123', 10);
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@leleya.ua' },
    update: {
      password: managerPassword,
      name: 'Адміністратор Лелея',
      role: Role.MANAGER,
    },
    create: {
      email: 'manager@leleya.ua',
      password: managerPassword,
      name: 'Адміністратор Лелея',
      role: Role.MANAGER,
    },
  });

  // 2. Seed Barber Users & Link to Masters
  const barberPassword = await bcrypt.hash('barber123', 10);
  const barbers = [
    { email: 'anastasia@leleya.ua', name: 'Анастасія' },
    { email: 'olena@leleya.ua', name: 'Олена' },
    { email: 'maryna@leleya.ua', name: 'Марина' },
  ];

  for (const b of barbers) {
    const user = await prisma.user.upsert({
      where: { email: b.email },
      update: {
        password: barberPassword,
        name: b.name,
        role: Role.BARBER,
      },
      create: {
        email: b.email,
        password: barberPassword,
        name: b.name,
        role: Role.BARBER,
      },
    });

    const existingMaster = await prisma.master.findFirst({ where: { name: b.name } });
    if (existingMaster) {
      await prisma.master.update({
        where: { id: existingMaster.id },
        data: { userId: user.id },
      });
    } else {
      await prisma.master.create({
        data: {
          name: b.name,
          isActive: true,
          userId: user.id,
        },
      });
    }
  }

  // 3. Seed Services Catalog
  const servicesData = [
    // Men's Haircuts
    { id: 'm1', name: '«Під нуль»', category: 'men', price: '150 грн', priceValue: 150, duration: 30 },
    { id: 'm2', name: '«Під нуль» + шейвер', category: 'men', price: '250 грн', priceValue: 250, duration: 30 },
    { id: 'm3', name: 'Одна насадка', category: 'men', price: '200 грн', priceValue: 200, duration: 30 },
    { id: 'm4', name: 'Декілька насадок', category: 'men', price: '250 грн', priceValue: 250, duration: 45 },
    { id: 'm5', name: 'Насадка + ножиці', category: 'men', price: '300 грн', priceValue: 300, duration: 45 },
    { id: 'm6', name: 'Подовжена стрижка', category: 'men', price: '350 грн', priceValue: 350, duration: 60 },
    { id: 'm7', name: 'Борода', category: 'men', price: '200 грн', priceValue: 200, duration: 30 },

    // Women's Haircuts
    { id: 'w1', name: 'Чубчик', category: 'women', price: '150 грн', priceValue: 150, duration: 30 },
    { id: 'w2', name: 'Кінчики', category: 'women', price: '300 грн', priceValue: 300, duration: 45 },
    { id: 'w3', name: 'Жіноча коротка', category: 'women', price: '350 грн', priceValue: 350, duration: 45 },
    { id: 'w4', name: '2 довжина', category: 'women', price: '350–400 грн', priceValue: 350, duration: 60 },
    { id: 'w5', name: '3, 4 довжина', category: 'women', price: '400–450 грн', priceValue: 400, duration: 60 },

    // Kids' Haircuts
    { id: 'k1', name: 'Дитяча стрижка', category: 'kids', price: '300 грн', priceValue: 300, duration: 30 },
    { id: 'k2', name: 'Дитяча модельна', category: 'kids', price: '350 грн', priceValue: 350, duration: 45 },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }

  // 4. Seed Initial Instagram Posts
  const initialPosts = [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80",
      category: "Чоловічі",
      title: "Fade & Борода",
      description: "Ідеальний плавний перехід (skin fade) та чітке оформлення бороди з шейвером для нашого постійного клієнта. Робота виконана за 45 хвилин.",
      masterName: "Олена",
      likesCount: 48,
      postUrl: "https://www.instagram.com/leleya.hair/",
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&auto=format&fit=crop&q=80",
      category: "Жіночі",
      title: "Каре та догляд",
      description: "Оновлення графічної формы каре, текстурування кінчиків та глибоке зволожувальне відновлення волосся.",
      masterName: "Анастасія",
      likesCount: 65,
      postUrl: "https://www.instagram.com/leleya.hair/",
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
    },
    {
      id: "4",
      imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&auto=format&fit=crop&q=80",
      category: "Жіночі",
      title: "Тонування та укладка",
      description: "Насичений шовковистий відтінок, холодний блиск та об'ємна голлівудська укладка для особливої події ✨",
      masterName: "Марина",
      likesCount: 82,
      postUrl: "https://www.instagram.com/leleya.hair/",
    },
    {
      id: "5",
      imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
      category: "Фарбування",
      title: "Складне фарбування AirTouch",
      description: "Ніжні плавні переливи світлого блонду без пошкодження структури волосся. Тривалість роботи — 3.5 години.",
      masterName: "Анастасія",
      likesCount: 114,
      postUrl: "https://www.instagram.com/leleya.hair/",
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
    },
    {
      id: "7",
      imageUrl: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=600&auto=format&fit=crop&q=80",
      category: "Дитячі",
      title: "Дитяча стрижка для юного джентльмена",
      description: "Акуратна стильна стрижка для нашого наймолодшого гостя. Зручно, швидко та без капризів!",
      masterName: "Марина",
      likesCount: 71,
      postUrl: "https://www.instagram.com/leleya.hair/",
    },
    {
      id: "8",
      imageUrl: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80",
      category: "Фарбування",
      title: "Глибокий шоколад та глянець",
      description: "Тонування без аміаку у багатий шоколадний відтінок з ефектом ламінування та укладкою м'якими хвилями.",
      masterName: "Анастасія",
      likesCount: 96,
      postUrl: "https://www.instagram.com/leleya.hair/",
    }
  ];

  for (const post of initialPosts) {
    await prisma.instagramPost.upsert({
      where: { id: post.id },
      update: post,
      create: post,
    });
  }

  console.log('✅ Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
