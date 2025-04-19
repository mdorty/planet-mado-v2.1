"use client";
import React, { useState } from "react";
import CharacterPhaserDisplay from "./CharacterPhaserDisplay";
import PlayerPresenceSocket from "./PlayerPresenceSocket";
import InventoryOverlay from "./InventoryOverlay";
import { Button } from "@heroui/react";

interface CharacterPhaserDisplayWithInventoryProps {
  characterData: any;
  mapData: any;
}

const CharacterPhaserDisplayWithInventory: React.FC<CharacterPhaserDisplayWithInventoryProps> = ({ characterData, mapData }) => {
  const [showInventory, setShowInventory] = useState(false);
  const [playersAtLocation, setPlayersAtLocation] = useState<any[]>([]);

  return (
    <div className="relative w-[800px] h-[600px] mx-auto">
      {/* Real-time player presence socket connection */}
      <PlayerPresenceSocket
        characterId={characterData.id}
        planet={characterData.planet}
        currentMap={characterData.currentMap}
        xCoord={characterData.xCoord}
        yCoord={characterData.yCoord}
        onPlayersUpdate={setPlayersAtLocation}
      />
      <CharacterPhaserDisplay
        characterData={characterData}
        mapData={mapData}
        playersAtLocation={playersAtLocation}
      />
      {/* Inventory Button - placed absolutely under power level area */}
      <Button
        className="absolute left-4 top-52 z-20 bg-orange-600 hover:bg-orange-700 text-white font-roboto font-medium px-6 py-2 rounded shadow-lg"
        onClick={() => setShowInventory(true)}
        aria-label="Open Inventory"
      >
        Inventory
      </Button>
      {showInventory && (
        <InventoryOverlay characterId={characterData.id} onClose={() => setShowInventory(false)} />
      )}
    </div>
  );
};

export default CharacterPhaserDisplayWithInventory;
