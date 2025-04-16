"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import Link from "next/link";
import { Button, Card, CardHeader, CardBody } from '@heroui/react';

/**
 * Admin Maps Management Page
 * Allows admin users to create, edit, and delete game maps
 */
export default function MapsAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingMap, setEditingMap] = useState<number | null>(null);
  
  // Redirect non-admin users
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  // Fetch maps data
  const { data: maps, refetch } = trpc.map.getMaps.useQuery();
  const createMutation = trpc.map.createMap.useMutation({ onSuccess: () => refetch() });
  const updateMutation = trpc.map.updateMap.useMutation({ onSuccess: () => refetch() });
  const deleteMutation = trpc.map.deleteMap.useMutation({ onSuccess: () => refetch() });

  // Handle form submission for create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMap) {
      await updateMutation.mutateAsync({ id: editingMap, name, description });
      setEditingMap(null);
    } else {
      await createMutation.mutateAsync({ name, description });
    }
    setName("");
    setDescription("");
  };

  // Handle edit button click
  const handleEdit = (map: any) => {
    setEditingMap(map.id);
    setName(map.name);
    setDescription(map.description || "");
  };

  // Handle delete with confirmation
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this map?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  if (status === "loading") {
    return <div className="container mx-auto max-w-6xl px-4 py-8">Loading...</div>;
  }

  if (status === "authenticated" && session?.user?.role !== "admin") {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8 text-pm-text-dark">
        <h1 className="text-3xl font-anton mb-4">Access Denied</h1>
        <p className="font-roboto">You do not have permission to access this page.</p>
        <Link href="/" className="text-pm-nav-orange font-roboto font-medium hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-anton mb-6">Map Management</h1>
        <Link href="/admin" className="inline-block mb-4 hover:underline font-roboto">
          Back to Admin Dashboard
        </Link>

        <Card className="p-6 rounded shadow-md mb-8">
          <CardHeader className="border-b pb-2 mb-4">
            <h2 className="text-2xl font-anton">Create New Map</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
              <div>
                <label className="block font-roboto font-medium mb-1">Map Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full font-roboto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pm-nav-orange"
                  required
                />
              </div>
              <div>
                <label className="block font-roboto font-medium mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full font-roboto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pm-nav-orange"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="solid" className="bg-blue-600 text-white hover:bg-blue-700 font-roboto font-medium">
                  Create Map
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card className="p-6 rounded shadow-md mb-8">
          <CardHeader className="border-b pb-2 mb-4">
            <h2 className="text-2xl font-anton">Existing Maps</h2>
          </CardHeader>
          <CardBody>
            {maps && maps.length > 0 ? (
              <div className="space-y-4">
                {maps.map((map: any) => (
                  <div key={map.id} className="flex justify-between items-center mb-4">
                    <span className="font-roboto">{map.name}</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" className="border-gray-300 text-gray-700 hover:bg-gray-100 font-roboto font-medium" onClick={() => handleEdit(map)}>
                        Edit
                      </Button>
                      <Button variant="solid" className="bg-red-600 text-white hover:bg-red-700 font-roboto font-medium" onClick={() => handleDelete(map.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-roboto text-gray-500">No maps found. Create your first map above.</p>
            )}
          </CardBody>
        </Card>

        {editingMap && (
          <Card className="p-6 rounded shadow-md mb-8">
            <CardHeader className="border-b pb-2 mb-4">
              <h2 className="text-2xl font-anton">Edit Map</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
                <div>
                  <label className="block font-roboto font-medium mb-1">Map Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full font-roboto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pm-nav-orange"
                    required
                  />
                </div>
                <div>
                  <label className="block font-roboto font-medium mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full font-roboto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pm-nav-orange"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="solid" className="bg-blue-600 text-white hover:bg-blue-700 font-roboto font-medium">
                    Save
                  </Button>
                  <Button type="button" variant="ghost" className="border-gray-300 text-gray-700 hover:bg-gray-100 font-roboto font-medium" onClick={() => setEditingMap(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
