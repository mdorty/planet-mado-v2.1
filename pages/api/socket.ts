import { Server as IOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from './types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

let io: IOServer | null = null;

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    io = new IOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      // Client joins a room based on planet/currentMap/x/y
      socket.on('join-location', async ({ characterId, planet, currentMap, xCoord, yCoord }) => {
        const room = `${planet}:${currentMap}:${xCoord}:${yCoord}`;
        socket.join(room);
        // Mark character as active
        await prisma.character.update({
          where: { id: characterId },
          data: { status: 'active', updatedAt: new Date() },
        });
        // Broadcast updated players at this location
        if (io) {
          broadcastPlayersAtLocation(io, room, planet, currentMap, xCoord, yCoord);
        }
      });

      // On activity (movement, action, etc)
      socket.on('player-active', async ({ characterId }) => {
        await prisma.character.update({
          where: { id: characterId },
          data: { status: 'active', updatedAt: new Date() },
        });
      });

      // On leaving location
      socket.on('leave-location', ({ planet, currentMap, xCoord, yCoord }) => {
        const room = `${planet}:${currentMap}:${xCoord}:${yCoord}`;
        socket.leave(room);
      });

      // Handle disconnect
      socket.on('disconnect', async () => {
        // Optionally handle immediate sleeping, or rely on inactivity timer
      });
    });
  }
  res.end();
}

async function broadcastPlayersAtLocation(io: IOServer, room: string, planet: string, currentMap: string, xCoord: number, yCoord: number) {
  // ...implementation from your original code...
}
