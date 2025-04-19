import { z } from 'zod';
import { router, procedure } from '../trpc';
import { db } from '../../lib/prisma';

export const itemRouter = router({
  getAll: procedure
    .query(async () => {
      return await db.itemTemplate.findMany({
        orderBy: { name: 'asc' },
        // Select only needed fields to reduce payload size
        select: {
          id: true,
          name: true,
          type: true,
          description: true,
          image: true,
          effect: true,
          value: true,
          durability: true,
          stackable: true,
          maxStackSize: true,
          usableInBattle: true,
          equipmentSlot: true,
          lootChance: true
        }
      });
    }),

  getById: procedure
    .input(z.object({ id: z.number().or(z.string().transform(val => parseInt(val, 10))) }))
    .query(async ({ input }: { input: { id: number } }) => {
      return await db.itemTemplate.findUnique({
        where: { id: input.id },
      });
    }),

  create: procedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        effect: z.string().optional(),
        value: z.number().default(0),
        durability: z.number().default(100),
        stackable: z.boolean().default(false),
        maxStackSize: z.number().default(1),
        usableInBattle: z.boolean().default(false),
        equipmentSlot: z.string().optional(),
        lootChance: z.number().default(0.0),
      })
    )
    .mutation(async ({ input }: { input: any }) => {
      return await db.itemTemplate.create({
        data: input,
        select: {
          id: true,
          name: true,
          type: true
        }
      });
    }),

  update: procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        effect: z.string().optional(),
        value: z.number().default(0),
        durability: z.number().default(100),
        stackable: z.boolean().default(false),
        maxStackSize: z.number().default(1),
        usableInBattle: z.boolean().default(false),
        equipmentSlot: z.string().optional(),
        lootChance: z.number().default(0.0),
      })
    )
    .mutation(async ({ input }: { input: any }) => {
      const { id, ...data } = input;
      return await db.itemTemplate.update({
        where: { id: parseInt(id, 10) },
        data,
        select: {
          id: true,
          name: true,
          type: true,
          value: true
        }
      });
    }),

  delete: procedure
    .input(z.string())
    .mutation(async ({ input }: { input: string }) => {
      return await db.itemTemplate.delete({
        where: { id: parseInt(input, 10) },
        select: { id: true }
      });
    }),
});
