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
  const [xCoord, setXCoord] = useState(0);
  const [yCoord, setYCoord] = useState(0);
  const [tileImage, setTileImage] = useState("");
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
      await updateMutation.mutateAsync({ id: editingMap, name, description, xCoord, yCoord, tileImage });
      setEditingMap(null);
    } else {
      await createMutation.mutateAsync({ name, description, xCoord, yCoord, tileImage });
    }
    setName("");
    setDescription("");
    setXCoord(0);
    setYCoord(0);
    setTileImage("");
  };

  // Handle edit button click
  const handleEdit = (map: any) => {
    setEditingMap(map.id);
    setName(map.name);
    setDescription(map.description || "");
    setXCoord(map.xCoord || 0);
    setYCoord(map.yCoord || 0);
    setTileImage(map.tileImage || "");
  };

  // Handle delete with confirmation
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this map?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  if (status === "loading") {
    return <div className="container mx-auto max-w-6xl px-4 py-8 text-pm-white">Loading...</div>;
  }

  if (status === "authenticated" && session?.user?.role !== "admin") {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-anton mb-4 text-pm-white">Access Denied</h1>
        <p className="font-roboto text-pm-white">You do not have permission to access this page.</p>
        <Link href="/" className="text-pm-red font-roboto font-medium hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-anton mb-6 text-pm-white">Map Management</h1>
        <Link href="/admin" className="inline-block mb-4 hover:underline font-roboto text-pm-white">
          Back to Admin Dashboard
        </Link>

        <Card className="p-6 rounded shadow-md mb-8 bg-pm-blue">
          <CardHeader className="border-b pb-2 mb-4">
            <h2 className="text-2xl font-anton text-pm-white">Create New Map</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
              <div>
                <label className="block font-roboto font-medium mb-1 text-pm-white">Map Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                  required
                />
              </div>
              <div>
                <label className="block font-roboto font-medium mb-1 text-pm-white">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                  rows={3}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-roboto font-medium mb-1 text-pm-white">X Coordinate</label>
                  <input
                    type="number"
                    value={xCoord}
                    onChange={(e) => setXCoord(parseInt(e.target.value))}
                    className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-roboto font-medium mb-1 text-pm-white">Y Coordinate</label>
                  <input
                    type="number"
                    value={yCoord}
                    onChange={(e) => setYCoord(parseInt(e.target.value))}
                    className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-roboto font-medium mb-1 text-pm-white">Tile Image URL</label>
                <input
                  type="text"
                  value={tileImage}
                  onChange={(e) => setTileImage(e.target.value)}
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                  placeholder="Enter image URL for map tiles"
                />
              </div>
              <button
                type="submit"
                className="bg-pm-red text-white px-4 py-2 rounded hover:bg-red-700 font-roboto font-medium"
              >
                {editingMap ? "Update Map" : "Create Map"}
              </button>
            </form>
          </CardBody>
        </Card>

        <Card className="p-6 rounded shadow-md mb-8 bg-pm-blue">
          <CardHeader className="border-b pb-2 mb-4">
            <h2 className="text-2xl font-anton text-pm-white">Existing Maps</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {maps && maps.length > 0 ? (
                maps.map((map: any) => (
                  <Card key={map.id} className="p-4 rounded shadow-md hover:shadow-lg transition-shadow duration-200 bg-pm-dark-blue">
                    <CardHeader className="border-b pb-2 mb-3 border-pm-navy">
                      <h3 className="text-xl font-anton text-pm-white">{map.name}</h3>
                    </CardHeader>
                    <CardBody className="flex flex-col gap-2 font-roboto text-sm text-pm-white">
                      <p>{map.description || "No description provided."}</p>
                      <p>X: {map.xCoord || 0}, Y: {map.yCoord || 0}</p>
                      {map.tileImage && <p>Tile Image: <span className="truncate">{map.tileImage}</span></p>}
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={() => handleEdit(map)}
                          className="bg-pm-blue text-white font-roboto font-medium hover:bg-pm-navy"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(map.id)}
                          className="bg-pm-red text-white font-roboto font-medium hover:bg-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <p className="font-roboto col-span-full text-center text-pm-white">No maps found. Create a new map to get started.</p>
              )}
            </div>
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
                  <label className="block font-roboto font-medium mb-1 text-pm-white">Map Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full font-roboto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pm-nav-orange"
                    required
                  />
                </div>
                <div>
                  <label className="block font-roboto font-medium mb-1 text-pm-white">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full font-roboto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pm-nav-orange"
                    rows={3}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block font-roboto font-medium mb-1 text-pm-white">X Coordinate</label>
                    <input
                      type="number"
                      value={xCoord}
                      onChange={(e) => setXCoord(Number(e.target.value))}
                      className="w-full font-roboto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pm-nav-orange"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-roboto font-medium mb-1 text-pm-white">Y Coordinate</label>
                    <input
                      type="number"
                      value={yCoord}
                      onChange={(e) => setYCoord(Number(e.target.value))}
                      className="w-full font-roboto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pm-nav-orange"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-roboto font-medium mb-1 text-pm-white">Tile Image URL</label>
                  <input
                    type="text"
                    value={tileImage}
                    onChange={(e) => setTileImage(e.target.value)}
                    className="w-full font-roboto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pm-nav-orange"
                    placeholder="Enter image URL for map tiles"
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
