import { z } from 'zod';
import { router, procedure } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const itemRouter = router({
  getAll: procedure
    .query(async () => {
      return await prisma.itemTemplate.findMany({
        orderBy: { name: 'asc' },
      });
    }),

  getById: procedure
    .input(z.object({ id: z.number().or(z.string().transform(val => parseInt(val, 10))) }))
    .query(async ({ input }: { input: { id: number } }) => {
      return await prisma.itemTemplate.findUnique({
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
      return await prisma.itemTemplate.create({
        data: input,
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
      return await prisma.itemTemplate.update({
        where: { id: parseInt(id, 10) },
        data,
      });
    }),

  delete: procedure
    .input(z.string())
    .mutation(async ({ input }: { input: string }) => {
      return await prisma.itemTemplate.delete({
        where: { id: parseInt(input, 10) },
      });
    }),
});
