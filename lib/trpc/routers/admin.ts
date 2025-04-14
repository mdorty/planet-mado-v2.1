import { z } from 'zod';
import { publicProcedure, router } from '../server';
import { db } from '../../prisma';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';

export const adminRouter = router({
  getUsers: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id || ctx.session.user.role !== 'admin') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Admin access required',
      });
    }
    try {
      return await db.user.findMany({
        select: { id: true, username: true, email: true, role: true },
      });
    } catch (error) {
      console.error('[AdminRouter] getUsers error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch users',
      });
    }
  }),

  createUser: publicProcedure
    .input(
      z.object({
        username: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(['user', 'admin']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user?.id || ctx.session.user.role !== 'admin') {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Admin access required',
        });
      }
      try {
        const existingUser = await db.user.findFirst({
          where: { OR: [{ email: input.email }, { username: input.username }] },
        });
        if (existingUser) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Username or email already exists',
          });
        }
        const hashedPassword = await bcrypt.hash(input.password, 10);
        await db.user.create({
          data: {
            username: input.username,
            email: input.email,
            password: hashedPassword,
            role: input.role,
          },
        });
        return { success: true };
      } catch (error) {
        console.error('[AdminRouter] createUser error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        });
      }
    }),

  updateUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        username: z.string().min(3),
        email: z.string().email(),
        password: z.string().optional(),
        role: z.enum(['user', 'admin']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user?.id || ctx.session.user.role !== 'admin') {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Admin access required',
        });
      }
      try {
        const existingUser = await db.user.findFirst({
          where: {
            OR: [{ email: input.email }, { username: input.username }],
            NOT: { id: input.id },
          },
        });
        if (existingUser) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Username or email already in use',
          });
        }
        const data: any = { username: input.username, email: input.email, role: input.role };
        if (input.password) {
          data.password = await bcrypt.hash(input.password, 10);
        }
        await db.user.update({
          where: { id: input.id },
          data,
        });
        return { success: true };
      } catch (error) {
        console.error('[AdminRouter] updateUser error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user',
        });
      }
    }),

  deleteUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user?.id || ctx.session.user.role !== 'admin') {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Admin access required',
        });
      }
      try {
        await db.user.delete({ where: { id: input.id } });
        return { success: true };
      } catch (error) {
        console.error('[AdminRouter] deleteUser error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete user',
        });
      }
    }),

  getCharacters: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id || ctx.session.user.role !== 'admin') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Admin access required',
      });
    }
    try {
      return await db.character.findMany({
        include: { user: { select: { username: true } } },
      });
    } catch (error) {
      console.error('[AdminRouter] getCharacters error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch characters',
      });
    }
  }),

  createCharacter: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string().min(3),
        level: z.number().min(1),
        currentPowerlevel: z.number(),
        basePowerlevel: z.number(),
        hiddenPowerlevel: z.number().nullable(),
        race: z.string(),
        planet: z.string().nullable(),
        alignment: z.number(),
        description: z.string().nullable(),
        equippedItems: z.string().nullable(),
        items: z.string().nullable(),
        peopleYouHaveBeenTo: z.string().nullable(),
        jobs: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user?.id || ctx.session.user.role !== 'admin') {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Admin access required',
        });
      }
      try {
        await db.character.create({
          data: {
            userId: input.userId,
            name: input.name,
            level: input.level,
            currentPowerlevel: input.currentPowerlevel,
            basePowerlevel: input.basePowerlevel,
            hiddenPowerlevel: input.hiddenPowerlevel,
            race: input.race,
            planet: input.planet,
            alignment: input.alignment,
            description: input.description,
            equippedItems: input.equippedItems,
            items: input.items,
            peopleYouHaveBeenTo: input.peopleYouHaveBeenTo,
            jobs: input.jobs,
            health: 100,
            energy: 50,
            strength: 10,
            speed: 10,
          },
        });
        return { success: true };
      } catch (error) {
        console.error('[AdminRouter] createCharacter error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create character',
        });
      }
    }),

  updateCharacter: publicProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        name: z.string().min(3),
        level: z.number().min(1),
        currentPowerlevel: z.number(),
        basePowerlevel: z.number(),
        hiddenPowerlevel: z.number().nullable(),
        race: z.string(),
        planet: z.string().nullable(),
        alignment: z.number(),
        description: z.string().nullable(),
        equippedItems: z.string().nullable(),
        items: z.string().nullable(),
        peopleYouHaveBeenTo: z.string().nullable(),
        jobs: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user?.id || ctx.session.user.role !== 'admin') {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Admin access required',
        });
      }
      try {
        await db.character.update({
          where: { id: input.id },
          data: {
            userId: input.userId,
            name: input.name,
            level: input.level,
            currentPowerlevel: input.currentPowerlevel,
            basePowerlevel: input.basePowerlevel,
            hiddenPowerlevel: input.hiddenPowerlevel,
            race: input.race,
            planet: input.planet,
            alignment: input.alignment,
            description: input.description,
            equippedItems: input.equippedItems,
            items: input.items,
            peopleYouHaveBeenTo: input.peopleYouHaveBeenTo,
            jobs: input.jobs,
          },
        });
        return { success: true };
      } catch (error) {
        console.error('[AdminRouter] updateCharacter error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update character',
        });
      }
    }),

  deleteCharacter: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user?.id || ctx.session.user.role !== 'admin') {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Admin access required',
        });
      }
      try {
        await db.character.delete({ where: { id: input.id } });
        return { success: true };
      } catch (error) {
        console.error('[AdminRouter] deleteCharacter error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete character',
        });
      }
    }),
});