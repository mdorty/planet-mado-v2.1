"use client";

import React, { useEffect, useRef, useState } from 'react';

interface CharacterPhaserDisplayProps {
  characterData: any;
  mapData: any;
  playersAtLocation?: any[];
}

export default function CharacterPhaserDisplay({ characterData, mapData, playersAtLocation = [] }: CharacterPhaserDisplayProps) {
  const [isClient, setIsClient] = useState(false);
  const gameRef = useRef<Phaser.Game | null>(null);

  console.log('CharacterPhaserDisplay received mapData:', mapData);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Only proceed if on client-side
    
    // Dynamically import Phaser and MapScene only when on client-side
    Promise.all([
      import('phaser'),
      import('../scenes/MapScene')
    ]).then(([Phaser, MapScene]) => {
      if (!gameRef.current) {
        const config = {
          type: Phaser.AUTO,
          width: 800,
          height: 600,
          parent: 'phaser-game',
          scene: [MapScene.default],
          physics: {
            default: 'arcade',
            arcade: {
              gravity: { x: 0, y: 0 },
              debug: false
            }
          },
          render: {
            preserveDrawingBuffer: true,
            premultipliedAlpha: false
          }
        };
        gameRef.current = new Phaser.Game(config);
        // Set data in registry after game is created
        gameRef.current.registry.set('characterData', characterData);
        gameRef.current.registry.set('mapData', mapData);
        gameRef.current.registry.set('playersAtLocation', playersAtLocation);
      } else {
        // Update playersAtLocation in registry if already running
        gameRef.current.registry.set('playersAtLocation', playersAtLocation);
      }
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [characterData, mapData, playersAtLocation, isClient]);

  return <div id="phaser-game" style={{ width: '800px', height: '600px' }} />;
};