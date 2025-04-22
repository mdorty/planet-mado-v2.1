import { router, procedure } from '../trpc';
import { z } from 'zod';
import { db } from '../../lib/prisma';

export const characterRouter = router({
  getUserCharacters: procedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ input }) => {
      try {
        // Get user ID from input
        const userId = input.userId;
        
        if (!userId) {
          // If no user ID is available, return empty array
          return [];
        }
        
        // Fetch only characters belonging to the current user
        const characters = await db.character.findMany({
          where: {
            userId: userId
          },
          select: {
            id: true,
            name: true,
            currentPowerlevel: true,
            basePowerlevel: true,
            race: true,
            level: true
          },
          // Add ordering to make results consistent
          orderBy: {
            name: 'asc'
          }
        });
        
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
  /**
   * Fetch character and corresponding map data by character ID.
   * If character.currentMap is set and matches a map, return that map.
   * Otherwise, return a default/hardcoded map object.
   */
  getCharacterWithMapById: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        // Fetch character
        const character = await db.character.findUnique({
          where: { id: input.id },
          select: {
            id: true,
            name: true,
            currentMap: true,
            currentPowerlevel: true,
            basePowerlevel: true,
            race: true,
            level: true,
            health: true,
            energy: true,
            xCoord: true,
            yCoord: true,
            moves: true,
            // Add other fields you need here
          },
        });
        if (!character) {
          throw new Error(`Character with ID ${input.id} not found in database`);
        }

        // Determine which map to use
        let mapData = null;
        const currentMapName = character.currentMap && character.currentMap !== "Unknown" ? character.currentMap : null;
        if (currentMapName) {
          mapData = await db.map.findFirst({ where: { name: currentMapName } });
        }

        // If not found, use default map
        if (!mapData) {
          mapData = {
            id: 0,
            name: "Default",
            description: "Default hardcoded map",
            xCoord: 0,
            yCoord: 0,
            tileImage: "/assets/tiles.jpg",
            createdAt: new Date(),
          };
        }

        return {
          character,
          map: mapData,
        };
      } catch (error: unknown) {
        throw new Error(`Failed to fetch character/map: ${(error as Error).message}`);
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
