"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button, Input, Textarea } from "@heroui/react";
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
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  effect: string;
  value: number;
  durability: number;
  stackable: boolean;
  maxStackSize: number;
  usableInBattle: boolean;
  equipmentSlot: string;
  lootChance: number;
}

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

  const { data: items, refetch } = trpc.item.getAll.useQuery();

  const createItem = trpc.item.create.useMutation({
    onSuccess: () => {
      refetch();
      resetForm();
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
        await updateItem.mutateAsync({ id: editingItem.id, ...updateData });
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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem.mutateAsync(id);
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
    <>
      <div className="container mx-auto p-4">
        <h1 className="font-anton text-3xl mb-6">Admin - Manage Items</h1>
        <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-md mb-6 bg-neutral-50">
          <h2 className="font-anton text-xl mb-4">{editingItem ? "Edit Item" : "Add New Item"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1">Name</label>
              <Input
                value={newItem.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                required
                className="border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1">Type</label>
              <Input
                value={newItem.type}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
                required
                className="border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1">Description</label>
              <Textarea
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1">Image URL</label>
              <Input
                value={newItem.image}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, image: e.target.value }))}
                className="border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1">Effect</label>
              <Input
                value={newItem.effect}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, effect: e.target.value }))}
                className="border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1">Value</label>
              <Input
                type="number"
                value={newItem.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, value: isNaN(parseInt(e.target.value)) ? '0' : e.target.value }))}
                className="w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-roboto font-medium mb-1">Durability</label>
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
              <label className="font-roboto font-medium mb-1">Max Stack Size</label>
              <Input
                type="number"
                value={newItem.maxStackSize}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, maxStackSize: isNaN(parseInt(e.target.value)) ? '1' : e.target.value }))}
                className="w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
              />
            </div>
            <div>
              <label className="font-roboto font-medium">Usable in Battle</label>
              <input type="checkbox" checked={newItem.usableInBattle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, usableInBattle: e.target.checked }))} className="ml-2" />
            </div>
            <div>
              <label className="font-roboto font-medium">Equipment Slot</label>
              <Input value={newItem.equipmentSlot} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, equipmentSlot: e.target.value }))} />
            </div>
            <div>
              <Input
                label="Loot Chance (%)"
                type="number"
                step="0.1"
                value={newItem.lootChance}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, lootChance: isNaN(parseFloat(e.target.value)) ? "0.0" : e.target.value }))}
                className="w-full"
              />
            </div>
          </div>
          <Button type="submit" variant="solid" color="primary" className="w-full font-roboto font-medium bg-blue-600 text-white hover:bg-blue-700">
            {editingItem ? 'Update Item' : 'Create Item'}
          </Button>
          {editingItem && (
            <Button type="button" variant="bordered" color="default" onClick={resetForm} className="w-full font-roboto font-medium bg-gray-500 text-white hover:bg-gray-600">
              Cancel
            </Button>
          )}
        </form>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-anton text-xl mb-4">Existing Items</h2>
          {items && items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item: any) => (
                <div key={item.id} className="border rounded-md p-4 relative group hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600">Type: {item.type}</p>
                  <p className="text-sm">Value: {item.value}</p>
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button variant="solid" color="primary" onClick={() => handleEdit(item)} className="font-roboto font-medium bg-blue-500 text-white hover:bg-blue-600">Edit</Button>
                    <Button variant="bordered" color="default" onClick={() => handleDelete(item.id)} className="font-roboto font-medium bg-red-600 text-white hover:bg-red-700">Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No items found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminItemsPage;
