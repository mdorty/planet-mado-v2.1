import { z } from 'zod';
import { publicProcedure, router } from '../server';
import { db } from '../../prisma';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';

export const authRouter = router({
  signUp: publicProcedure
    .input(
      z.object({
        username: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
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
        const user = await db.user.create({
          data: {
            username: input.username,
            email: input.email,
            password: hashedPassword,
          },
        });
        return { success: true, userId: user.id };
      } catch (error) {
        console.error('[AuthRouter] signUp error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        });
      }
    }),

  changePassword: publicProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to change your password',
        });
      }

      try {
        const user = await db.user.findUnique({
          where: { id: ctx.session.user.id },
        });

        if (!user || !user.password) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        const isValid = await bcrypt.compare(input.currentPassword, user.password);
        if (!isValid) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Current password is incorrect',
          });
        }

        const hashedPassword = await bcrypt.hash(input.newPassword, 10);
        await db.user.update({
          where: { id: ctx.session.user.id },
          data: { password: hashedPassword },
        });

        return { success: true };
      } catch (error) {
        console.error('[AuthRouter] changePassword error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to change password',
        });
      }
    }),
});