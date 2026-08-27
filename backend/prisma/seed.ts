import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Leleya Hair Salon database...');

  // 1. Seed Masters
  const mastersData = [
    { name: 'Анастасія', isActive: true },
    { name: 'Олена', isActive: true },
    { name: 'Марина', isActive: true },
  ];

  for (const master of mastersData) {
    const existing = await prisma.master.findFirst({ where: { name: master.name } });
    if (!existing) {
      await prisma.master.create({ data: master });
    }
  }

  // 2. Seed Services Catalog
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

  // 3. Seed Default Manager User
  const managerPassword = await bcrypt.hash('manager123', 10);
  await prisma.user.upsert({
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
