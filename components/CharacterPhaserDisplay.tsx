"use client";

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const CharacterPhaserDisplay = ({ characterData }: { characterData: { powerLevel: number; inventory: string[] } }) => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (!gameRef.current) {
      const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'phaser-game',
        scene: {
          preload: preload,
          create: create,
          update: update
        },
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 },
            debug: false
          }
        }
      };

      gameRef.current = new Phaser.Game(config);
    }

    function preload() {
      // Load assets here if needed
    }

    function create() {
      // Create game objects, display power level and inventory
      this.add.text(100, 100, `Power Level: ${characterData.powerLevel}`, { fontSize: '32px', fill: '#fff' });
      this.add.text(100, 150, `Inventory: ${characterData.inventory.join(', ')}`, { fontSize: '24px', fill: '#fff' });
      
      // Create grid-based map
      const gridSize = 50;
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          const tile = this.add.rectangle(x * gridSize + 25, y * gridSize + 25, gridSize - 2, gridSize - 2, 0x333333);
          tile.setStrokeStyle(1, 0x555555);
        }
      }
    }

    function update() {
      // Update game logic if needed
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