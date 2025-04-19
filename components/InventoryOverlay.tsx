"use client";
import React, { useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { trpc } from "../utils/trpc";
import { Spinner, Tooltip } from "@heroui/react";

// Dynamically import Phaser to avoid SSR issues
const PhaserGame = dynamic(() => import("./CharacterPhaserDisplay"), { ssr: false });

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  imageKey: string;
  quantity: number;
}

interface InventoryOverlayProps {
  characterId: string;
  onClose: () => void;
}

export default function InventoryOverlay({ characterId, onClose }: InventoryOverlayProps) {
  const { data, isLoading, error } = trpc.inventory.getByCharacterId.useQuery({ characterId });
  const phaserRef = useRef<any>(null);

  // Pass inventory data to Phaser InventoryScene
  useEffect(() => {
    if (data && phaserRef.current) {
      phaserRef.current.scene.getScene("InventoryScene")?.scene.restart({ inventory: data });
    }
  }, [data]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (isLoading) return <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"><Spinner /></div>;
  if (error) return <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 text-red-500">Error loading inventory</div>;

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
      <div className="relative w-[720px] h-[480px] rounded-xl overflow-hidden shadow-2xl">
        {/* Phaser InventoryScene overlay */}
        <PhaserGame
          ref={phaserRef}
          sceneKey="InventoryScene"
          width={720}
          height={480}
          sceneConfig={{ inventory: data }}
        />
        <button
          className="absolute top-4 right-4 bg-orange-600 hover:bg-orange-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow-lg focus:outline-none"
          onClick={onClose}
          aria-label="Close inventory"
        >
          ×
        </button>
      </div>
    </div>
  );
}
