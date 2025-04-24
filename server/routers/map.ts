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
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { tiles: true }
          }
        }
      });
      return maps;
    } catch (error: unknown) {
      console.error('Error fetching maps:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch maps';
      throw new Error(errorMessage);
    }
  }),
  
  getMapById: procedure
    .input(z.object({
      id: z.number()
    }))
    .query(async ({ input }) => {
      try {
        const map = await prisma.map.findUnique({
          where: { id: input.id },
          include: { tiles: true }
        });
        return map;
      } catch (error: unknown) {
        console.error('Error fetching map:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch map';
        throw new Error(errorMessage);
      }
    }),
  createMap: procedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      rows: z.number().min(1).max(50).default(10),
      columns: z.number().min(1).max(50).default(10)
    }))
    .mutation(async ({ input }) => {
      try {
        if (!prisma.map) {
          throw new Error('Unable to create map: Database client needs to be updated. Please contact the administrator or run "npx prisma generate" to update the client.');
        }
        
        // Create the map first
        const map = await prisma.map.create({
          data: {
            name: input.name,
            description: input.description,
            rows: input.rows,
            columns: input.columns
          }
        });
        
        // Create default tiles for the entire map
        const tilesData = [];
        for (let y = 0; y < input.rows; y++) {
          for (let x = 0; x < input.columns; x++) {
            tilesData.push({
              mapId: map.id,
              x,
              y,
              image: '/images/tiles/grass.png', // Default tile image
              description: 'Empty tile',
              isWalkable: true
            });
          }
        }
        
        await prisma.mapTile.createMany({
          data: tilesData
        });
        
        return map;
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
      rows: z.number().min(1).max(50).optional(),
      columns: z.number().min(1).max(50).optional()
    }))
    .mutation(async ({ input }) => {
      try {
        if (!prisma.map) {
          throw new Error('Unable to update map: Database client needs to be updated. Please contact the administrator or run "npx prisma generate" to update the client.');
        }
        return await prisma.map.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description,
            rows: input.rows,
            columns: input.columns
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
    .mutation(async ({ input }) => {
      try {
        if (!prisma.map) {
          throw new Error('Unable to delete map: Database client needs to be updated. Please contact the administrator or run "npx prisma generate" to update the client.');
        }
        // MapTiles will be automatically deleted due to the onDelete: Cascade relation
        return await prisma.map.delete({
          where: { id: input.id }
        });
      } catch (error: unknown) {
        console.error('Error deleting map:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete map';
        throw new Error(errorMessage);
      }
    }),
    
  // Map Tile operations
  getMapTiles: procedure
    .input(z.object({
      mapId: z.number()
    }))
    .query(async ({ input }) => {
      try {
        const tiles = await prisma.mapTile.findMany({
          where: { mapId: input.mapId },
          orderBy: [{ y: 'asc' }, { x: 'asc' }]
        });
        return tiles;
      } catch (error: unknown) {
        console.error('Error fetching map tiles:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch map tiles';
        throw new Error(errorMessage);
      }
    }),
    
  updateMapTile: procedure
    .input(z.object({
      id: z.number(),
      image: z.string().optional(),
      description: z.string().optional(),
      isWalkable: z.boolean().optional()
    }))
    .mutation(async ({ input }) => {
      try {
        return await prisma.mapTile.update({
          where: { id: input.id },
          data: {
            image: input.image,
            description: input.description,
            isWalkable: input.isWalkable
          }
        });
      } catch (error: unknown) {
        console.error('Error updating map tile:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to update map tile';
        throw new Error(errorMessage);
      }
    }),
    
  // Map Tile Template operations
  getMapTileTemplates: procedure.query(async () => {
    try {
      const templates = await prisma.mapTileTemplate.findMany({
        orderBy: { name: 'asc' }
      });
      return templates;
    } catch (error: unknown) {
      console.error('Error fetching map tile templates:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch map tile templates';
      throw new Error(errorMessage);
    }
  }),
  
  createMapTileTemplate: procedure
    .input(z.object({
      name: z.string(),
      image: z.string(),
      description: z.string().optional(),
      isWalkable: z.boolean().optional()
    }))
    .mutation(async ({ input }) => {
      try {
        return await prisma.mapTileTemplate.create({
          data: {
            name: input.name,
            image: input.image,
            description: input.description,
            isWalkable: input.isWalkable !== undefined ? input.isWalkable : true
          }
        });
      } catch (error: unknown) {
        console.error('Error creating map tile template:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create map tile template';
        throw new Error(errorMessage);
      }
    }),
    
  deleteMapTileTemplate: procedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async ({ input }) => {
      try {
        return await prisma.mapTileTemplate.delete({
          where: { id: input.id }
        });
      } catch (error: unknown) {
        console.error('Error deleting map tile template:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete map tile template';
        throw new Error(errorMessage);
      }
    }),
  
  createMapTiles: procedure
    .input(z.object({
      mapId: z.number(),
      tiles: z.array(z.object({
        x: z.number(),
        y: z.number(),
        image: z.string().optional(),
        description: z.string().optional(),
        isWalkable: z.boolean().optional()
      }))
    }))
    .mutation(async ({ input }) => {
      try {
        // First check if the map exists
        const map = await prisma.map.findUnique({
          where: { id: input.mapId }
        });
        
        if (!map) {
          throw new Error(`Map with ID ${input.mapId} not found`);
        }
        
        // Prepare the tile data with the mapId
        const tilesData = input.tiles.map(tile => ({
          mapId: input.mapId,
          x: tile.x,
          y: tile.y,
          image: tile.image || '/images/tiles/grass.png',
          description: tile.description || 'Empty tile',
          isWalkable: tile.isWalkable !== undefined ? tile.isWalkable : true
        }));
        
        // Create the tiles
        await prisma.mapTile.createMany({
          data: tilesData,
          skipDuplicates: true // Skip any tiles that might already exist
        });
        
        // Return the updated map with tiles
        return await prisma.map.findUnique({
          where: { id: input.mapId },
          include: { tiles: true }
        });
      } catch (error: unknown) {
        console.error('Error creating map tiles:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create map tiles';
        throw new Error(errorMessage);
      }
    })
});
