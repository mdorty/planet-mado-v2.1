"use client";
import React, { useCallback, useEffect, useRef } from "react";
import InventoryPhaserDisplay from "./InventoryPhaserDisplay";
import { trpc } from "../utils/trpc";
import { Spinner, Tooltip } from "@heroui/react";


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
        {data && (
          <InventoryPhaserDisplay inventory={data} width={720} height={480} onClose={onClose} />
        )}
        
      </div>
    </div>
  );
}
