"use client";
import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const getPhaser = () => import("phaser");
const getInventoryScene = () => import("../scenes/InventoryScene");

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  imageKey: string;
  quantity: number;
}

interface InventoryPhaserDisplayProps {
  inventory: InventoryItem[];
  width?: number;
  height?: number;
}

const InventoryPhaserDisplay: React.FC<InventoryPhaserDisplayProps> = ({ inventory, width = 720, height = 480 }) => {
  const gameRef = useRef<any>(null);
  const containerId = "phaser-inventory-scene";

  useEffect(() => {
    let phaserInstance: any;
    let Phaser: any;
    let InventoryScene: any;
    let config: any;
    let sceneInstance: any;

    (async () => {
      Phaser = (await getPhaser()).default;
      InventoryScene = (await getInventoryScene()).default;

      config = {
        type: Phaser.AUTO,
        width,
        height,
        parent: containerId,
        scene: [InventoryScene],
        transparent: true,
        backgroundColor: "rgba(0,0,0,0)",
      };
      // Destroy previous instance if exists
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      phaserInstance = new Phaser.Game(config);
      gameRef.current = phaserInstance;

      // Wait for scene to boot, then pass inventory data
      phaserInstance.events.on("ready", () => {
        const scene = phaserInstance.scene.getScene("InventoryScene");
        scene.scene.restart({ inventory });
      });
      // Or, set data directly if already running
      setTimeout(() => {
        const scene = phaserInstance.scene.getScene("InventoryScene");
        if (scene) {
          scene.scene.restart({ inventory });
        }
      }, 300);
    })();
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
    // Only rerun if inventory changes
  }, [JSON.stringify(inventory), width, height]);

  return <div id={containerId} style={{ width, height }} />;
};

export default InventoryPhaserDisplay;
