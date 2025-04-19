import { z } from 'zod';
import { router, procedure } from '../trpc';
import { db } from '../../lib/prisma';

export const inventoryRouter = router({
  getByCharacterId: procedure
    .input(z.object({ characterId: z.string() }))
    .query(async ({ input }) => {
      // Fetch inventory items for a character, including item template data
      const inventory = await db.inventoryItem.findMany({
        where: { characterId: input.characterId },
        include: {
          item: true,
        },
      });
      // Map to expected frontend format
      return inventory.map(item => ({
        id: String(item.id),
        name: item.item?.name || 'Unknown',
        description: item.item?.description || '',
        imageKey: item.item?.image || 'default-item',
        quantity: item.quantity || 1,
      }));
    }),
});
