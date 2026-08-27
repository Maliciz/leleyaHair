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
