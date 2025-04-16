"use client";

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MapScene from '../scenes/MapScene';

const CharacterPhaserDisplay = ({ characterData }: { characterData: { powerLevel: number; inventory: string[] } }) => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) {
      const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'phaser-game',
        scene: [MapScene],
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