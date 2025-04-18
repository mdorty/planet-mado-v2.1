import { router, procedure } from '../trpc';
import { z } from 'zod';
import { db } from '../../lib/prisma';

export const adminRouter = router({
  getCharacters: procedure.query(async () => {
    try {
      const characters = await db.character.findMany({
        select: {
          id: true,
          name: true,
          currentPowerlevel: true,
          race: true,
          level: true,
          userId: true
        }
      });
      return characters;
    } catch (error: unknown) {
      throw new Error(`Failed to fetch characters: ${(error as Error).message}`);
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
        const updatedCharacter = await db.character.update({
          where: { id: input.id },
          data: {
            name: input.name,
            currentPowerlevel: input.currentPowerlevel,
            // Add other fields as needed
          },
          select: {
            id: true,
            name: true,
            currentPowerlevel: true
          }
        });
        return updatedCharacter;
      } catch (error: unknown) {
        throw new Error(`Failed to update character: ${(error as Error).message}`);
      }
    }),
  getUsers: procedure.query(async () => {
    try {
      const users = await db.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true
        }
      });
      return users;
    } catch (error: unknown) {
      throw new Error(`Failed to fetch users: ${(error as Error).message}`);
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
        const updatedUser = await db.user.update({
          where: { id: input.id },
          data: {
            username: input.username,
            email: input.email,
            role: input.role,
            // Add other fields as needed
          },
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        });
        return updatedUser;
      } catch (error: unknown) {
        throw new Error(`Failed to update user: ${(error as Error).message}`);
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
        const newUser = await db.user.create({
          data: {
            username: input.username,
            email: input.email,
            password: input.password,
            role: input.role || 'user',
            // Add other fields as needed
          },
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        });
        return newUser;
      } catch (error: unknown) {
        throw new Error(`Failed to create user: ${(error as Error).message}`);
      }
    }),

  // Admin-only: create character
  createCharacter: procedure
    .input(z.object({
      name: z.string(),
      race: z.string().optional(),
      planet: z.string().optional(),
      alignment: z.number().optional(),
      description: z.string().optional(),
      userId: z.string().optional(),
      level: z.number().optional(),
      currentPowerlevel: z.number().optional(),
      basePowerlevel: z.number().optional(),
      hiddenPowerlevel: z.number().optional(),
      equippedItems: z.string().optional(),
      items: z.string().optional(),
      peopleYouHaveBeenTo: z.string().optional(),
      jobs: z.string().optional(),
      // Add other fields as needed
    }))
    .mutation(async ({ input }) => {
      try {
        let userId = input.userId;
        if (!userId) {
          let defaultUser = await db.user.findFirst({
            where: { email: 'default@test.com' },
            select: { id: true }
          });
          if (!defaultUser) {
            defaultUser = await db.user.create({
              data: {
                username: 'default-test-user',
                email: 'default@test.com',
                password: 'testpassword',
                role: 'user'
              },
              select: { id: true }
            });
          }
          userId = defaultUser.id;
        }
        const userExists = await db.user.findUnique({
          where: { id: userId },
          select: { id: true }
        });
        if (!userExists) {
          throw new Error(`User with ID ${userId} not found`);
        }
        const newCharacter = await db.character.create({
          data: {
            name: input.name,
            race: input.race,
            planet: input.planet,
            alignment: input.alignment,
            description: input.description,
            userId,
            level: input.level,
            currentPowerlevel: input.currentPowerlevel,
            basePowerlevel: input.basePowerlevel,
            hiddenPowerlevel: input.hiddenPowerlevel,
            equippedItems: input.equippedItems,
            items: input.items,
            peopleYouHaveBeenTo: input.peopleYouHaveBeenTo,
            jobs: input.jobs,
            // Add other fields as needed
          },
          select: {
            id: true,
            name: true,
            race: true,
            planet: true,
            alignment: true,
            description: true,
            userId: true,
            level: true,
            currentPowerlevel: true,
            basePowerlevel: true,
            hiddenPowerlevel: true,
            equippedItems: true,
            items: true,
            peopleYouHaveBeenTo: true,
            jobs: true,
          }
        });
        return newCharacter;
      } catch (error: unknown) {
        throw new Error(`Failed to create character: ${(error as Error).message}`);
      }
    }),
});
