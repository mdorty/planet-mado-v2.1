"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function CharacterPhaserDisplay({ characterData }: { characterData: any }) {
  const gameRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

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
      }
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [characterData, isClient]);

  return <div id="phaser-game" style={{ width: '800px', height: '600px' }} />;
};