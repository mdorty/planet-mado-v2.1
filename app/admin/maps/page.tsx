"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import Link from "next/link";

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
    <div className="container mx-auto max-w-6xl px-4 py-8 bg-pm-white text-pm-text-dark min-h-screen">
      <h1 className="text-3xl font-anton mb-6">Manage Game Maps</h1>

      {/* Map Creation/Edit Form */}
      <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-anton mb-4">{editingMap ? "Edit Map" : "Create New Map"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            className="bg-pm-nav-orange text-white font-roboto font-medium py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
          >
            {editingMap ? "Update Map" : "Create Map"}
          </button>
          {editingMap && (
            <button
              type="button"
              onClick={() => {
                setEditingMap(null);
                setName("");
                setDescription("");
              }}
              className="ml-2 bg-gray-200 text-gray-700 font-roboto font-medium py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Maps Table */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm overflow-x-auto">
        <h2 className="text-2xl font-anton mb-4">Existing Maps</h2>
        {maps && maps.length > 0 ? (
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-pm-nav-orange text-white">
                <th className="font-roboto p-3 text-left">ID</th>
                <th className="font-roboto p-3 text-left">Name</th>
                <th className="font-roboto p-3 text-left">Description</th>
                <th className="font-roboto p-3 text-left">Created</th>
                <th className="font-roboto p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {maps.map((map: any) => (
                <tr key={map.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="font-roboto p-3">{map.id}</td>
                  <td className="font-roboto p-3">{map.name}</td>
                  <td className="font-roboto p-3">{map.description || "-"}</td>
                  <td className="font-roboto p-3">{new Date(map.createdAt).toLocaleDateString()}</td>
                  <td className="font-roboto p-3">
                    <button
                      onClick={() => handleEdit(map)}
                      className="bg-gray-200 text-gray-700 font-roboto font-medium py-1 px-2 rounded-md hover:opacity-90 transition-opacity mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(map.id)}
                      className="bg-pm-nav-orange text-white font-roboto font-medium py-1 px-2 rounded-md hover:opacity-90 transition-opacity"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="font-roboto text-gray-500">No maps found. Create your first map above.</p>
        )}
      </div>
    </div>
  );
}
