import { router, procedure } from '../trpc';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export const adminRouter = router({
  getCharacters: procedure.query(async () => {
    try {
      const characters = await prisma.character.findMany();
      return characters;
    } catch (error: unknown) {
      throw new Error(`Failed to fetch characters: ${(error as Error).message}`);
    } finally {
      await prisma.$disconnect();
    }
  }),
  updateCharacter: procedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      currentPowerlevel: z.number().optional(),
      // Add other fields as needed
    }))
    .mutation(async ({ input }) => {
      try {
        const updatedCharacter = await prisma.character.update({
          where: { id: input.id },
          data: {
            name: input.name,
            currentPowerlevel: input.currentPowerlevel,
            // Add other fields as needed
          },
        });
        return updatedCharacter;
      } catch (error: unknown) {
        throw new Error(`Failed to update character: ${(error as Error).message}`);
      } finally {
        await prisma.$disconnect();
      }
    }),
  getUsers: procedure.query(async () => {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error: unknown) {
      throw new Error(`Failed to fetch users: ${(error as Error).message}`);
    } finally {
      await prisma.$disconnect();
    }
  }),
  updateUser: procedure
    .input(z.object({
      id: z.string(),
      username: z.string().optional(),
      email: z.string().optional(),
      role: z.string().optional(),
      // Add other fields as needed
    }))
    .mutation(async ({ input }) => {
      try {
        const updatedUser = await prisma.user.update({
          where: { id: input.id },
          data: {
            username: input.username,
            email: input.email,
            role: input.role,
            // Add other fields as needed
          },
        });
        return updatedUser;
      } catch (error: unknown) {
        throw new Error(`Failed to update user: ${(error as Error).message}`);
      } finally {
        await prisma.$disconnect();
      }
    }),
  createUser: procedure
    .input(z.object({
      username: z.string(),
      email: z.string(),
      password: z.string(),
      role: z.string().optional(),
      // Add other fields as needed
    }))
    .mutation(async ({ input }) => {
      try {
        const newUser = await prisma.user.create({
          data: {
            username: input.username,
            email: input.email,
            password: input.password,
            role: input.role || 'user',
            // Add other fields as needed
          },
        });
        return newUser;
      } catch (error: unknown) {
        throw new Error(`Failed to create user: ${(error as Error).message}`);
      } finally {
        await prisma.$disconnect();
      }
    }),
});
