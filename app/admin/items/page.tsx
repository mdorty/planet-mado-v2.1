"use client";

import { useState, useCallback, useMemo, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button, Input, Textarea, Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { toast } from "@heroui/react";

interface ItemFormState {
  name: string;
  type: string;
  description: string;
  image: string;
  effect: string;
  value: string;
  durability: string;
  stackable: boolean;
  maxStackSize: string;
  usableInBattle: boolean;
  equipmentSlot: string;
  lootChance: string;
}

interface Item {
  id: number;
  name: string;
  type: string;
  description?: string;
  image?: string;
  effect?: string;
  value: number;
  durability: number;
  stackable: boolean;
  maxStackSize: number;
  usableInBattle: boolean;
  equipmentSlot?: string;
  lootChance: number;
}

// Memoized item card component to prevent unnecessary re-renders
const ItemCard = memo(({ item, onEdit, onDelete }: { 
  item: Item, 
  onEdit: (item: Item) => void, 
  onDelete: (id: string | number) => void 
}) => {
  const handleEdit = useCallback(() => {
    onEdit(item);
  }, [item, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(item.id);
  }, [item.id, onDelete]);

  return (
    <Card className="shadow-md rounded-lg overflow-hidden mb-4">
      <CardHeader className="text-white p-3">
        <h3 className="font-anton text-lg">{item.name}</h3>
      </CardHeader>
      <CardBody className="p-4">
        <p className="font-roboto mb-2"><strong>Type:</strong> {item.type}</p>
        <p className="font-roboto mb-2"><strong>Value:</strong> {item.value}</p>
        {item.description && (
          <p className="font-roboto mb-2"><strong>Description:</strong> {item.description}</p>
        )}
      </CardBody>
      <CardFooter className="p-3 flex justify-end gap-2 bg-gray-50">
        <Button 
          variant="solid" 
          className="bg-blue-600 text-white hover:bg-blue-700 font-roboto"
          onClick={handleEdit}
        >
          Edit
        </Button>
        <Button 
          variant="solid" 
          className="bg-red-600 text-white hover:bg-red-700 font-roboto"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
});

// Memoized item list component
const ItemList = memo(({ 
  items, 
  isLoading, 
  onEditItem, 
  onDeleteItem 
}: { 
  items: Item[] | undefined, 
  isLoading: boolean,
  onEditItem: (item: Item) => void,
  onDeleteItem: (id: string | number) => void
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white shadow-md rounded-lg overflow-hidden mb-4 animate-pulse">
            <CardHeader className="bg-gray-300 p-3">
              <div className="h-6 bg-gray-400 rounded w-3/4"></div>
            </CardHeader>
            <CardBody className="p-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </CardBody>
            <CardFooter className="p-3 flex justify-end gap-2 bg-gray-50">
              <div className="h-8 bg-gray-300 rounded w-16"></div>
              <div className="h-8 bg-gray-300 rounded w-16"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return <p className="font-roboto text-center py-4">No items found. Create one to get started!</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <ItemCard 
          key={item.id} 
          item={item} 
          onEdit={onEditItem} 
          onDelete={onDeleteItem} 
        />
      ))}
    </div>
  );
});

const AdminItemsPage = () => {
  const router = useRouter();
  const [newItem, setNewItem] = useState<ItemFormState>({
    name: "",
    type: "",
    description: "",
    image: "",
    effect: "",
    value: "0",
    durability: "100",
    stackable: false,
    maxStackSize: "1",
    usableInBattle: false,
    equipmentSlot: "",
    lootChance: "0.0",
  });
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const { data, refetch, isLoading } = trpc.item.getAll.useQuery(undefined, {
  staleTime: 30 * 1000, // Data remains fresh for 30 seconds
  refetchOnWindowFocus: false,
  retry: 1
});
const items: Item[] | undefined = data?.map((item: any) => ({
  id: item.id,
  name: item.name,
  type: item.type,
  description: item.description,
  image: item.image,
  effect: item.effect,
  value: item.value,
  durability: item.durability,
  stackable: item.stackable,
  maxStackSize: item.maxStackSize,
  usableInBattle: item.usableInBattle,
  equipmentSlot: item.equipmentSlot,
  lootChance: item.lootChance,
})) ?? undefined;

  const createItem = trpc.item.create.useMutation({
    onSuccess: () => {
      refetch();
      resetForm();
      toast({
        variant: 'solid',
        color: 'success'
      });
    },
    onError: (error: any) => {
      handleCreateError(error);
    },
  });

  const updateItem = trpc.item.update.useMutation({
    onSuccess: () => {
      refetch();
      resetForm();
    },
    onError: (error: any) => {
      handleUpdateError(error);
    },
  });

  const deleteItem = trpc.item.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error: any) => {
      handleDeleteError(error);
    },
  });

  const handleCreateError = (error: any) => {
    toast({
      variant: 'solid',
      color: 'danger'
    });
  };

  const handleUpdateError = (error: any) => {
    toast({
      variant: 'solid',
      color: 'danger'
    });
  };

  const handleDeleteError = (error: any) => {
    toast({
      variant: 'solid',
      color: 'danger'
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewItem((prev: ItemFormState) => ({ ...prev, value: isNaN(parseInt(value)) ? "0" : value }));
  };

  const handleMaxStackSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewItem((prev: ItemFormState) => ({ ...prev, maxStackSize: isNaN(parseInt(value)) ? "0" : value }));
  };

  const resetForm = () => {
    setNewItem({
      name: "",
      type: "",
      description: "",
      image: "",
      effect: "",
      value: "0",
      durability: "100",
      stackable: false,
      maxStackSize: "1",
      usableInBattle: false,
      equipmentSlot: "",
      lootChance: "0.0",
    });
    setEditingItem(null);
  };

  // Memoized callbacks to prevent unnecessary re-renders
  const handleEditItem = useCallback((item: Item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      type: item.type,
      description: item.description || '',
      image: item.image || '',
      effect: item.effect || '',
      value: item.value.toString(),
      durability: item.durability.toString(),
      stackable: item.stackable,
      maxStackSize: item.maxStackSize.toString(),
      usableInBattle: item.usableInBattle,
      equipmentSlot: item.equipmentSlot || '',
      lootChance: item.lootChance.toString(),
    });
  }, []);

  const handleDeleteItem = useCallback((id: string | number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem.mutate(id.toString());
    }
  }, [deleteItem]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...newItem,
      value: parseInt(newItem.value) || 0,
      durability: parseInt(newItem.durability) || 100,
      maxStackSize: parseInt(newItem.maxStackSize) || 1,
      lootChance: parseFloat(newItem.lootChance) || 0.0,
    };

    try {
      if (editingItem) {
        const updateData = {
          name: formData.name,
          type: formData.type,
          description: formData.description,
          image: formData.image,
          effect: formData.effect,
          value: formData.value,
          durability: formData.durability,
          stackable: formData.stackable,
          maxStackSize: formData.maxStackSize,
          usableInBattle: formData.usableInBattle,
          equipmentSlot: formData.equipmentSlot,
          lootChance: formData.lootChance,
        };
        await updateItem.mutateAsync({ 
          id: editingItem.id.toString(), 
          ...updateData 
        });
        toast({
          variant: 'solid',
          color: 'success'
        });
      } else {
        const createData = {
          name: formData.name,
          type: formData.type,
          description: formData.description,
          image: formData.image,
          effect: formData.effect,
          value: formData.value,
          durability: formData.durability,
          stackable: formData.stackable,
          maxStackSize: formData.maxStackSize,
          usableInBattle: formData.usableInBattle,
          equipmentSlot: formData.equipmentSlot,
          lootChance: formData.lootChance,
        };
        await createItem.mutateAsync(createData);
        toast({
          variant: 'solid',
          color: 'success'
        });
      }
      resetForm();
    } catch (error) {
      if (editingItem) {
        handleUpdateError(error);
      } else {
        handleCreateError(error);
      }
    }
  };

  const handleEdit = (item: Item) => {
    setNewItem({
      name: item.name,
      type: item.type,
      description: item.description || "",
      image: item.image || "",
      effect: item.effect || "",
      value: item.value.toString(),
      durability: item.durability.toString(),
      stackable: item.stackable,
      maxStackSize: item.maxStackSize.toString(),
      usableInBattle: item.usableInBattle,
      equipmentSlot: item.equipmentSlot || "",
      lootChance: item.lootChance.toString(),
    });
    setEditingItem(item);
  };

  const handleDelete = async (id: number | string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem.mutateAsync(id.toString());
        toast({
          variant: 'solid',
          color: 'success'
        });
      } catch (error) {
        handleDeleteError(error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-anton text-3xl mb-6 text-pm-white">Admin - Manage Items</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-pm-blue p-6 rounded-lg shadow-md text-pm-white">
          <h2 className="text-xl font-anton mb-4">{editingItem ? 'Edit Item' : 'Create New Item'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form fields */}
            <div className="flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1 text-pm-white">Name</label>
              <Input
                value={newItem.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                required
                className="border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1 text-pm-white">Type</label>
              <Input
                value={newItem.type}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
                required
                className="border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1 text-pm-white">Description</label>
              <Textarea
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1 text-pm-white">Image URL</label>
              <Input
                value={newItem.image}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, image: e.target.value }))}
                className="border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1 text-pm-white">Effect</label>
              <Input
                value={newItem.effect}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, effect: e.target.value }))}
                className="border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1 text-pm-white">Value</label>
              <Input
                type="number"
                value={newItem.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, value: isNaN(parseInt(e.target.value)) ? '0' : e.target.value }))}
                className="w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1 text-pm-white">Durability</label>
              <Input
                type="number"
                value={newItem.durability}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, durability: isNaN(parseInt(e.target.value)) ? '100' : e.target.value }))}
                className="w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={newItem.stackable} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, stackable: e.target.checked }))} className="accent-blue-600 w-5 h-5" id="stackable" />
              <label htmlFor="stackable" className="font-roboto font-medium">Stackable</label>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1 text-pm-white">Max Stack Size</label>
              <Input
                type="number"
                value={newItem.maxStackSize}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, maxStackSize: isNaN(parseInt(e.target.value)) ? '1' : e.target.value }))}
                className="w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={newItem.usableInBattle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, usableInBattle: e.target.checked }))} className="accent-blue-600 w-5 h-5" id="usableInBattle" />
              <label htmlFor="usableInBattle" className="font-roboto font-medium">Usable in Battle</label>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1 text-pm-white">Equipment Slot</label>
              <Input
                value={newItem.equipmentSlot}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, equipmentSlot: e.target.value }))}
                className="border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1 text-pm-white">Loot Chance (%)</label>
              <Input
                type="number"
                step="0.1"
                value={newItem.lootChance}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, lootChance: isNaN(parseFloat(e.target.value)) ? "0.0" : e.target.value }))}
                className="border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Button type="submit" variant="solid" color="primary" className="w-full font-roboto font-medium bg-blue-600 text-white hover:bg-blue-700">
                {editingItem ? 'Update Item' : 'Create Item'}
              </Button>
              {editingItem && (
                <Button type="button" variant="bordered" color="default" onClick={resetForm} className="w-full font-roboto font-medium bg-gray-500 text-white hover:bg-gray-600">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
        
        {/* Item List - Using memoized component */}
        <div className="bg-pm-blue p-6 rounded-lg shadow-md text-pm-white">
          <h2 className="font-anton text-xl mb-4 text-pm-white">Item List</h2>
          <ItemList 
            items={items} 
            isLoading={isLoading} 
            onEditItem={handleEditItem} 
            onDeleteItem={handleDeleteItem} 
          />
        </div>
      </div>
    </div>
  );
}

export default AdminItemsPage;
