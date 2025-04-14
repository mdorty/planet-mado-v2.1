import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@dbz.com' },
      update: {
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
      },
      create: {
        username: 'admin',
        email: 'admin@dbz.com',
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log('Admin user seeded successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();