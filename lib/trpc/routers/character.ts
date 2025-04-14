import { z } from 'zod';
import { publicProcedure, router } from '../server';
import { db } from '../../prisma';
import { TRPCError } from '@trpc/server';
import { auth } from '../../auth';

export const characterRouter = router({
  getUserCharacters: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to view characters',
      });
    }

    try {
      const characters = await db.character.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { createdAt: 'desc' },
      });
      return characters;
    } catch (error) {
      console.error('[CharacterRouter] getUserCharacters error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch characters',
      });
    }
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(3).max(50),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to create a character',
        });
      }

      try {
        const character = await db.character.create({
          data: {
            name: input.name,
            userId: ctx.session.user.id,
            level: 1,
            health: 100,
            energy: 50,
            strength: 10,
            speed: 10,
            currentPowerlevel: 1000,
            basePowerlevel: 1000,
          },
        });
        return { success: true, characterId: character.id };
      } catch (error) {
        console.error('[CharacterRouter] create error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create character',
        });
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const character = await db.character.findUnique({
          where: { id: input.id },
          include: { moves: true },
        });

        if (!character) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Character not found',
          });
        }

        return character;
      } catch (error) {
        console.error('[CharacterRouter] getById error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch character',
        });
      }
    }),
});