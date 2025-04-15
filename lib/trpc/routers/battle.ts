import { z } from 'zod';
import { publicProcedure, router } from '../server';

export const battleRouter = router({
  start: publicProcedure
    .input(
      z.object({
        characterId: z.string(),
        opponentId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.battle.create({
        data: {
          characterId: input.characterId,
          opponentId: input.opponentId,
          // Removed moves field as it may not be in the Prisma schema
          // If moves is a relation or a field in your schema, ensure it's correctly typed
        },
      });
    }),
});