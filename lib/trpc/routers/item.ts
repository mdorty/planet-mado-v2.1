import { z } from 'zod';
import { publicProcedure, router } from '../server';
import { db } from '../../prisma';

export const itemRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.item.findMany();
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        effect: z.string().optional(),
        value: z.number().optional(),
        durability: z.number().optional(),
        stackable: z.boolean().optional(),
        maxStackSize: z.number().optional(),
        usableInBattle: z.boolean().optional(),
        equipmentSlot: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.item.create({
        data: {
          name: input.name,
          type: input.type,
          character: { connect: { id: '1' } } // Placeholder character ID, adjust as needed
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        type: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        effect: z.string().optional(),
        value: z.number().optional(),
        durability: z.number().optional(),
        stackable: z.boolean().optional(),
        maxStackSize: z.number().optional(),
        usableInBattle: z.boolean().optional(),
        equipmentSlot: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.item.update({
        where: { id: input.id },
        data: {
          name: input.name,
          type: input.type
        },
      });
    }),
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.item.delete({
        where: { id: input },
      });
    }),
});
