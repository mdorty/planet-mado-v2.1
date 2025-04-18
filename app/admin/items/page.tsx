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
  value: number;
  durability: number;
  stackable: boolean;
  maxStackSize: number;
  usableInBattle: boolean;
  equipmentSlot: string;
  lootChance: number;
}

interface Item {
  id: number;
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
    value: 0,
    durability: 100,
    stackable: false,
    maxStackSize: 1,
    usableInBattle: false,
    equipmentSlot: "",
    lootChance: 0.0,
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
      title: 'Error',
      description: `Failed to create item: ${error.message || 'Unknown error'}`,
      variant: 'solid',
    });
  };

  const handleUpdateError = (error: any) => {
    toast({
      title: 'Error',
      description: `Failed to update item: ${error.message || 'Unknown error'}`,
      variant: 'solid',
    });
  };

  const handleDeleteError = (error: any) => {
    toast({
      title: 'Error',
      description: `Failed to delete item: ${error.message || 'Unknown error'}`,
      variant: 'solid',
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewItem((prev: ItemFormState) => ({ ...prev, value: value ? parseInt(value) : 0 }));
  };

  const handleMaxStackSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewItem((prev: ItemFormState) => ({ ...prev, maxStackSize: value ? parseInt(value) : 0 }));
  };

  const handleEditNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditingItem((prev: Item | null) => prev ? { ...prev, value: value ? parseInt(value) : 0 } : null);
  };

  const handleEditMaxStackSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditingItem((prev: Item | null) => prev ? { ...prev, maxStackSize: value ? parseInt(value) : 0 } : null);
  };

  const resetForm = () => {
    setNewItem({
      name: "",
      type: "",
      description: "",
      image: "",
      effect: "",
      value: 0,
      durability: 100,
      stackable: false,
      maxStackSize: 1,
      usableInBattle: false,
      equipmentSlot: "",
      lootChance: 0.0,
    });
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = {
      ...newItem,
    };

    try {
      if (editingItem) {
        await updateItem.mutateAsync({ id: editingItem.id, ...formData });
        toast({
          title: 'Success',
          description: 'Item updated successfully',
          variant: 'solid',
        });
      } else {
        await createItem.mutateAsync(formData);
        toast({
          title: 'Success',
          description: 'Item created successfully',
          variant: 'solid',
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
      value: item.value,
      durability: item.durability,
      stackable: item.stackable,
      maxStackSize: item.maxStackSize,
      usableInBattle: item.usableInBattle,
      equipmentSlot: item.equipmentSlot || "",
      lootChance: item.lootChance,
    });
    setEditingItem(item);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem.mutateAsync(id);
        toast({
          title: 'Success',
          description: 'Item deleted successfully',
          variant: 'solid',
        });
      } catch (error) {
        handleDeleteError(error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-anton text-3xl mb-6">Admin - Manage Items</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="font-anton text-xl mb-4">{editingItem ? "Edit Item" : "Add New Item"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-roboto font-medium">Name</label>
            <Input value={newItem.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, name: e.target.value }))} required />
          </div>
          <div>
            <label className="font-roboto font-medium">Type</label>
            <Input value={newItem.type} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, type: e.target.value }))} required />
          </div>
          <div className="md:col-span-2">
            <label className="font-roboto font-medium">Description</label>
            <Textarea value={newItem.description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewItem(prev => ({ ...prev, description: e.target.value }))} />
          </div>
          <div>
            <label className="font-roboto font-medium">Image URL</label>
            <Input value={newItem.image} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, image: e.target.value }))} />
          </div>
          <div>
            <label className="font-roboto font-medium">Effect</label>
            <Input value={newItem.effect} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, effect: e.target.value }))} />
          </div>
          <div>
            <label className="font-roboto font-medium">Value</label>
            <Input type="number" value={newItem.value ? newItem.value.toString() : '0'} onChange={handleNumberChange} />
          </div>
          <div>
            <label className="font-roboto font-medium">Durability</label>
            <Input type="number" value={newItem.durability} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, durability: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="font-roboto font-medium">Stackable</label>
            <input type="checkbox" checked={newItem.stackable} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, stackable: e.target.checked }))} className="ml-2" />
          </div>
          <div>
            <label className="font-roboto font-medium">Max Stack Size</label>
            <Input type="number" value={newItem.maxStackSize ? newItem.maxStackSize.toString() : '0'} onChange={handleMaxStackSizeChange} />
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
            <label className="font-roboto font-medium">Loot Chance (%)</label>
            <Input type="number" step="0.1" value={newItem.lootChance} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(prev => ({ ...prev, lootChance: Number(e.target.value) }))} />
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
            {items.map((item: Item) => (
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
  );
};

export default AdminItemsPage;
