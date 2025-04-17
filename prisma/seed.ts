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

    // Seed map entries for a 10x10 grid
    const mapEntries = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        mapEntries.push({
          name: `Map Tile (${x}, ${y})`,
          description: `Tile at position (${x}, ${y})`,
          xCoord: x,
          yCoord: y,
          tileImage: 'https://game.planetmado.com/assets/tiles.jpg',
        });
      }
    }
    await prisma.map.createMany({
      data: mapEntries,
      skipDuplicates: true,
    });
    console.log('10x10 grid of map tiles seeded successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();