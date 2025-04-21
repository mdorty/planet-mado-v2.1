import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { Button, Spinner, Checkbox } from '@heroui/react';

interface Character {
  id: string;
  userId: string;
  name: string;
  level: number;
  currentPowerlevel: number;
  basePowerlevel: number;
  hiddenPowerlevel: number | null;
  race: string;
  planet: string | null;
  alignment: number;
  description: string | null;
  equippedItems: string | null;
  items: string | null;
  peopleYouHaveBeenTo: string | null;
  jobs: string | null;
  xCoord: number;
  yCoord: number;
  createdAt: string;
  updatedAt: string;
  lastDateMeditated: string | null;
  health: number;
  energy: number;
  strength: number;
  speed: number;
  defense?: number;
  dexterity?: number;
  intelligence?: number;
  died: string | null;
  deathCount: number | null;
  lastDateTrained: string | null;
  status: string;
  currentMap: string;
}

interface Item {
  id: number;
  name: string;
  type: string;
  description: string | null;
}

interface InventoryItem {
  id: number;
  itemId: number;
  quantity: number;
  item: Item;
}

interface CharacterInventoryCardProps {
  char: Character;
  onEdit?: (char: Character) => void;
}

export default function CharacterInventoryCard({ char, onEdit }: CharacterInventoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [addError, setAddError] = useState('');

  // Fetch inventory for this character
  const {
    data: characterWithInventory,
    isLoading: inventoryLoading,
    refetch: refetchInventory,
  } = trpc.admin.getCharacterWithInventory.useQuery(
    { characterId: char.id },
    { enabled: expanded }
  );

  // Fetch all items for selection
  const { data: items = [], isLoading: itemsLoading } = trpc.item.getAll.useQuery();

  // Mutations
  const addItemsMutation = trpc.admin.addItemsToInventory.useMutation({
    onSuccess: () => {
      setSelectedItemIds([]);
      setQuantity(1);
      setAddError('');
      refetchInventory();
    },
    onError: (err) => setAddError(err.message),
  });
  const removeItemMutation = trpc.admin.removeItemFromInventory.useMutation({
    onSuccess: () => refetchInventory(),
  });

  const handleAddItems = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    if (selectedItemIds.length === 0) {
      setAddError('Please select at least one item.');
      return;
    }
    addItemsMutation.mutate({
      characterId: char.id,
      items: selectedItemIds.map((itemId) => ({ itemId, quantity })),
    });
  };

  const handleCheckboxChange = (itemId: number) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="border border-pm-navy rounded bg-pm-dark-blue text-pm-white mb-2">
      <div className="flex justify-between items-center p-2 cursor-pointer" onClick={() => setExpanded((e) => !e)}>
        <div>
          <p className="font-anton text-lg">{char.name}</p>
          <p className="text-sm font-roboto">User ID: {char.userId} - Power Level: {char.currentPowerlevel}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-pm-blue text-white font-roboto" onClick={(e) => { e.stopPropagation(); setExpanded((exp) => !exp); }}>
            {expanded ? 'Hide Inventory' : 'Show Inventory'}
          </Button>
          {onEdit && (
            <Button
              size="sm"
              className="bg-pm-orange text-white font-roboto"
              onClick={(e) => { e.stopPropagation(); onEdit(char); }}
              aria-label={`Edit ${char.name}`}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
      {expanded && (
        <div className="p-4 bg-pm-navy rounded-b">
          <h4 className="font-anton text-md mb-2">Inventory</h4>
          {inventoryLoading ? (
            <Spinner />
          ) : characterWithInventory ? (
            <>
              <ul className="mb-4">
                {characterWithInventory.inventory.length === 0 && (
                  <li className="text-pm-white font-roboto italic">No items in inventory.</li>
                )}
                {characterWithInventory.inventory.map((inv: InventoryItem) => (
                  <li key={inv.id} className="flex justify-between items-center border-b border-pm-navy py-1">
                    <div>
                      <span className="font-roboto font-medium mr-2">{inv.item.name}</span>
                      <span className="text-xs text-pm-white/70">x{inv.quantity}</span>
                      <span className="ml-2 text-xs text-pm-white/60">({inv.item.type})</span>
                      {inv.item.description && <span className="ml-2 text-xs italic">{inv.item.description}</span>}
                    </div>
                    <Button
                      size="sm"
                      className="bg-pm-red text-white font-roboto"
                      onClick={() => removeItemMutation.mutate({ inventoryItemId: inv.id })}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
              <form onSubmit={handleAddItems} className="mb-2">
                <h5 className="font-anton text-md mb-1">Add Items</h5>
                {itemsLoading ? (
                  <Spinner />
                ) : (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {items.map((item: Item) => (
                      <label key={item.id} className="flex items-center gap-1 text-pm-white font-roboto">
                        <Checkbox
                          checked={selectedItemIds.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                          size="sm"
                        />
                        <span>{item.name}</span>
                      </label>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <label className="font-roboto text-pm-white">Quantity:</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-16 p-1 rounded bg-pm-cream text-pm-dark-blue border"
                  />
                </div>
                {addError && <div className="text-red-500 font-roboto mb-2">{addError}</div>}
                <Button
                  type="submit"
                  size="sm"
                  className="bg-pm-orange text-white font-roboto"
                  isLoading={addItemsMutation.status === 'pending'}
                >
                  Add Selected Items
                </Button>
              </form>
            </>
          ) : (
            <div className="text-pm-white">Failed to load inventory.</div>
          )}
        </div>
      )}
    </div>
  );
}
