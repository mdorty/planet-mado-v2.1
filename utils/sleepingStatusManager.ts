// Utility to manage sleeping status for characters after inactivity
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const INACTIVITY_MS = 15 * 60 * 1000; // 15 minutes

/**
 * This function should be called periodically (e.g. every 1-5 minutes)
 * to set characters to 'Sleeping' if they have not been active for 15 minutes.
 */
export async function updateSleepingStatus() {
  const now = new Date();
  const threshold = new Date(now.getTime() - INACTIVITY_MS);
  await prisma.character.updateMany({
    where: {
      status: 'active',
      updatedAt: { lt: threshold },
    },
    data: { status: 'Sleeping' },
  });
}
