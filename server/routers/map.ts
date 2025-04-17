import { router, procedure } from '../trpc';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// Ensure PrismaClient is initialized only once
const prisma = (global as any).prisma || new PrismaClient();

if (typeof window === 'undefined' && !(global as any).prisma) {
  (global as any).prisma = prisma;
}

export const mapRouter = router({
  getMaps: procedure.query(async () => {
    try {
      // Check if map model exists on prisma client
      if (!prisma.map) {
        console.error('Map model not found on Prisma client. Please run "npx prisma generate" to update the client.');
        return [];
      }
      const maps = await prisma.map.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return maps;
    } catch (error: unknown) {
      console.error('Error fetching maps:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch maps';
      throw new Error(errorMessage);
    }
  }),
  createMap: procedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      xCoord: z.number().optional(),
      yCoord: z.number().optional(),
      tileImage: z.string().optional()
    }))
    .mutation(async ({ input }: { input: { name: string; description?: string; xCoord?: number; yCoord?: number; tileImage?: string } }) => {
      try {
        if (!prisma.map) {
          throw new Error('Unable to create map: Database client needs to be updated. Please contact the administrator or run "npx prisma generate" to update the client.');
        }
        return await prisma.map.create({
          data: {
            name: input.name,
            description: input.description,
            xCoord: input.xCoord,
            yCoord: input.yCoord,
            tileImage: input.tileImage
          }
        });
      } catch (error: unknown) {
        console.error('Error creating map:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create map';
        throw new Error(errorMessage);
      }
    }),
  updateMap: procedure
    .input(z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().optional(),
      xCoord: z.number().optional(),
      yCoord: z.number().optional(),
      tileImage: z.string().optional()
    }))
    .mutation(async ({ input }: { input: { id: number; name: string; description?: string; xCoord?: number; yCoord?: number; tileImage?: string } }) => {
      try {
        if (!prisma.map) {
          throw new Error('Unable to update map: Database client needs to be updated. Please contact the administrator or run "npx prisma generate" to update the client.');
        }
        return await prisma.map.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description,
            xCoord: input.xCoord,
            yCoord: input.yCoord,
            tileImage: input.tileImage
          }
        });
      } catch (error: unknown) {
        console.error('Error updating map:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to update map';
        throw new Error(errorMessage);
      }
    }),
  deleteMap: procedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async ({ input }: { input: { id: number } }) => {
      try {
        if (!prisma.map) {
          throw new Error('Unable to delete map: Database client needs to be updated. Please contact the administrator or run "npx prisma generate" to update the client.');
        }
        return await prisma.map.delete({
          where: { id: input.id }
        });
      } catch (error: unknown) {
        console.error('Error deleting map:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete map';
        throw new Error(errorMessage);
      }
    })
});
