import { router, procedure } from '../trpc';
import { z } from 'zod';
import { db } from '../../lib/prisma';

export const characterRouter = router({
  getUserCharacters: procedure.query(async () => {
    try {
      // In a real implementation, you would get the user ID from the session or context
      // For now, we'll return all characters as a placeholder with a note to implement proper filtering
      const characters = await db.character.findMany({
        select: {
          id: true,
          name: true,
          currentPowerlevel: true,
          race: true,
          level: true
        }
      });
      // TODO: Filter characters by logged-in user ID once session context is available
      return characters;
    } catch (error: unknown) {
      throw new Error(`Failed to fetch user characters: ${(error as Error).message}`);
    }
  }),
  getById: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const character = await db.character.findUnique({
          where: { id: input.id },
          include: {
            moves: true, // Include related moves data
          },
        });
        if (!character) {
          throw new Error(`Character with ID ${input.id} not found in database`);
        }
        // TODO: Implement access control to check if the logged-in user owns this character
        // For now, return the character regardless of ownership for testing purposes
        return character;
      } catch (error: unknown) {
        throw new Error(`Failed to fetch character: ${(error as Error).message}`);
      }
    }),
  create: procedure
    .input(z.object({
      name: z.string(),
      race: z.string().optional(),
      planet: z.string().optional(),
      alignment: z.number().optional(),
      description: z.string().optional(),
      userId: z.string().optional(), // Allow frontend to pass userId if available
      // Add other fields as needed
    }))
    .mutation(async ({ input }) => {
      try {
        let userId = input.userId;
        
        // If no userId provided, try to find or create a default user for testing
        if (!userId) {
          // Check if a default user exists
          let defaultUser = await db.user.findFirst({
            where: { email: 'default@test.com' },
            select: { id: true }
          });
          
          // If no default user, create one for testing purposes
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
        
        // Check if user exists - use select to only get the id
        const userExists = await db.user.findUnique({
          where: { id: userId },
          select: { id: true }
        });
        
        if (!userExists) {
          throw new Error(`User with ID ${userId} not found`);
        }
        
        const newCharacter = await db.character.create({
          data: {
            userId: userId,
            name: input.name,
            race: input.race || 'Unknown',
            planet: input.planet,
            alignment: input.alignment || 0,
            description: input.description,
            // Add other fields as needed with default values if necessary
          },
        });
        return newCharacter;
      } catch (error: unknown) {
        throw new Error(`Failed to create character: ${(error as Error).message}`);
      }
    }),
});
