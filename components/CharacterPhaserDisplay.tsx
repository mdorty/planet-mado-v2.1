"use client";

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const CharacterPhaserDisplay = ({ characterData }: { characterData: { powerLevel: number; inventory: string[] } }) => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) {
      const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'phaser-game',
        scene: {
          preload: () => {
            // Load assets here if needed
          },
          create: () => {
            // Create game objects, display power level and inventory
            const scene = gameRef.current?.scene.scenes[0];
            if (scene) {
              scene.add.text(100, 100, `Power Level: ${characterData.powerLevel}`, { fontSize: '32px', color: '#fff' });
              scene.add.text(100, 150, `Inventory: ${characterData.inventory.join(', ')}`, { fontSize: '24px', color: '#fff' });
              
              // Create grid-based map
              const gridSize = 50;
              for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 10; x++) {
                  const tile = scene.add.rectangle(x * gridSize + 25, y * gridSize + 25, gridSize - 2, gridSize - 2, 0x333333);
                  tile.setStrokeStyle(1, 0x555555);
                }
              }
            }
          },
          update: () => {
            // Update game logic if needed
          }
        },
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
          }
        }
      };

      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [characterData]);

  return <div id="phaser-game" style={{ width: '800px', height: '600px' }} />;
};

export default CharacterPhaserDisplay;