"use client";
import { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

interface PlayerPresenceSocketProps {
  characterId: string;
  planet: string;
  currentMap: string;
  xCoord: number;
  yCoord: number;
  onPlayersUpdate: (players: any[]) => void;
}

export default function PlayerPresenceSocket({
  characterId,
  planet,
  currentMap,
  xCoord,
  yCoord,
  onPlayersUpdate,
}: PlayerPresenceSocketProps) {
  const socketRef = useRef<Socket | null>(null);
  const locationKey = `${planet}:${currentMap}:${xCoord}:${yCoord}`;

  useEffect(() => {
    // Connect to socket.io server
    const socket = io({
      path: "/api/socket",
      transports: ["websocket"],
    });
    socketRef.current = socket;

    // Join location room
    socket.emit("join-location", { characterId, planet, currentMap, xCoord, yCoord });

    // Listen for updates
    socket.on("players-at-location", (players) => {
      onPlayersUpdate(players);
    });

    // Heartbeat/activity ping every 30s
    const interval = setInterval(() => {
      socket.emit("player-active", { characterId });
    }, 30000);

    return () => {
      socket.emit("leave-location", { planet, currentMap, xCoord, yCoord });
      socket.disconnect();
      clearInterval(interval);
    };
    // Only rerun if location or character changes
  }, [characterId, planet, currentMap, xCoord, yCoord]);

  return null;
}
