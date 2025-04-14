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
      return ctx.db.battle.create({
        data: {
          characterId: input.characterId,
          opponentId: input.opponentId,
          moves: [],
        },
      });
    }),
});