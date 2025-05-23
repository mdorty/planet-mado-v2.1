"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import Link from "next/link";
import Image from "next/image";
import { Button, Card, CardHeader, CardBody, Tooltip, Accordion, AccordionItem } from '@heroui/react';

// Define types for our map-related data
type MapTileTemplate = {
  id: number;
  name: string;
  image: string;
  description?: string;
  isWalkable: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Admin Maps Management Page
 * Allows admin users to create, edit, and delete game maps
 */
export default function MapsAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState(10);
  const [columns, setColumns] = useState(10);
  const [editingMap, setEditingMap] = useState<number | null>(null);
  const [selectedMap, setSelectedMap] = useState<number | null>(null);
  const [selectedTile, setSelectedTile] = useState<any | null>(null);
  const [tileImage, setTileImage] = useState("");
  const [tileDescription, setTileDescription] = useState("");
  const [isWalkable, setIsWalkable] = useState(true);
  
  // Map tile template states
  const [templateName, setTemplateName] = useState("");
  const [templateImage, setTemplateImage] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateIsWalkable, setTemplateIsWalkable] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  
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
  const deleteMutation = trpc.map.deleteMap.useMutation({ 
    onSuccess: () => {
      refetch();
      setSelectedMap(null);
    } 
  });
  
  // Fetch map tile templates
  const { data: tileTemplates, refetch: refetchTileTemplates } = trpc.map.getMapTileTemplates.useQuery();
  const createTemplateMutation = trpc.map.createMapTileTemplate.useMutation({
    onSuccess: () => {
      refetchTileTemplates();
      setTemplateName("");
      setTemplateImage("");
      setTemplateDescription("");
      setTemplateIsWalkable(true);
    }
  });
  const deleteTemplateMutation = trpc.map.deleteMapTileTemplate.useMutation({
    onSuccess: () => refetchTileTemplates()
  });
  
  // Fetch map details when a map is selected
  const { data: selectedMapData, refetch: refetchSelectedMap } = 
    trpc.map.getMapById.useQuery(
      { id: selectedMap || 0 }, // Use a fallback value
      { enabled: selectedMap !== null }
    );
    
  // Reset selected tile when map data changes
  useEffect(() => {
    if (selectedMapData) {
      setSelectedTile(null);
    }
  }, [selectedMapData]);
    
  // Update map tile mutation
  const updateTileMutation = trpc.map.updateMapTile.useMutation({
    onSuccess: () => {
      refetchSelectedMap();
      setSelectedTile(null);
      setTileImage("");
      setTileDescription("");
    }
  });

  // Handle form submission for create/update map
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMap) {
      await updateMutation.mutateAsync({ id: editingMap, name, description, rows, columns });
      setEditingMap(null);
    } else {
      await createMutation.mutateAsync({ name, description, rows, columns });
    }
    setName("");
    setDescription("");
    setRows(10);
    setColumns(10);
  };

  // Handle edit button click for map
  const handleEdit = (map: any) => {
    setEditingMap(map.id);
    setSelectedMap(map.id); // Also select the map to show the grid
    setName(map.name);
    setDescription(map.description || "");
    setRows(map.rows || 10);
    setColumns(map.columns || 10);
  };
  
  // Generate tiles for a map that doesn't have any
  const generateTilesMutation = trpc.map.createMapTiles.useMutation({
    onSuccess: () => {
      refetchSelectedMap();
    }
  });

  // Handle map selection
  const handleSelectMap = (mapId: number) => {
    setSelectedMap(mapId);
    setEditingMap(null);
  };
  
  // Check if selected map has tiles and generate them if not
  useEffect(() => {
    if (selectedMapData && (!selectedMapData.tiles || selectedMapData.tiles.length === 0)) {
      // Map exists but has no tiles - we need to generate default tiles
      console.log('Generating default tiles for map:', selectedMapData.id);
      
      // Create default tiles for the entire map
      const tilesData = [];
      for (let y = 0; y < (selectedMapData.rows || 10); y++) {
        for (let x = 0; x < (selectedMapData.columns || 10); x++) {
          tilesData.push({
            x,
            y,
            image: '/images/tiles/grass.png', // Default tile image
            description: 'Empty tile',
            isWalkable: true
          });
        }
      }
      
      // Use tRPC mutation to create tiles
      generateTilesMutation.mutate({
        mapId: selectedMapData.id,
        tiles: tilesData
      });
    }
  }, [selectedMapData, generateTilesMutation]);
  
  // Handle tile selection
  const handleSelectTile = (tile: any) => {
    setSelectedTile(tile);
    setTileImage(tile.image || "");
    setTileDescription(tile.description || "");
    setIsWalkable(tile.isWalkable);
    setSelectedTemplate(null);
  };
  
  // Handle template selection for a tile
  const handleSelectTemplateForTile = (template: MapTileTemplate) => {
    setSelectedTemplate(template);
    setTileImage(template.image);
    setTileDescription(template.description || "");
    setIsWalkable(template.isWalkable);
  };
  
  // Handle tile template form submission
  const handleTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTemplateMutation.mutateAsync({
      name: templateName,
      image: templateImage,
      description: templateDescription,
      isWalkable: templateIsWalkable
    });
  };
  
  // Handle tile update
  const handleUpdateTile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTile) {
      await updateTileMutation.mutateAsync({
        id: selectedTile.id,
        image: tileImage,
        description: tileDescription,
        isWalkable
      });
    }
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
                  <label className="block font-roboto font-medium mb-1 text-pm-white">Rows</label>
                  <input
                    type="number"
                    value={rows}
                    onChange={(e) => setRows(parseInt(e.target.value))}
                    min={1}
                    max={50}
                    className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-roboto font-medium mb-1 text-pm-white">Columns</label>
                  <input
                    type="number"
                    value={columns}
                    onChange={(e) => setColumns(parseInt(e.target.value))}
                    min={1}
                    max={50}
                    className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                    required
                  />
                </div>
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
        
        {/* Map Tile Templates Accordion */}
        <Accordion className="mb-8">
          <AccordionItem key="map-tiles" title="Map Tiles">
            <Card className="p-6 rounded shadow-md bg-pm-blue">
              <CardHeader className="border-b pb-2 mb-4">
                <h2 className="text-2xl font-anton text-pm-white">Manage Map Tiles</h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Form to add new tile template */}
                  <div>
                    <h3 className="text-xl font-anton mb-4 text-pm-white">Add New Tile</h3>
                    <form onSubmit={handleTemplateSubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="block font-roboto font-medium mb-1 text-pm-white">Tile Name</label>
                        <input
                          type="text"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                          className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-roboto font-medium mb-1 text-pm-white">Image URL</label>
                        <input
                          type="text"
                          value={templateImage}
                          onChange={(e) => setTemplateImage(e.target.value)}
                          className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                          required
                          placeholder="https://example.com/image.png"
                        />
                      </div>
                      <div>
                        <label className="block font-roboto font-medium mb-1 text-pm-white">Description</label>
                        <textarea
                          value={templateDescription}
                          onChange={(e) => setTemplateDescription(e.target.value)}
                          className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="templateIsWalkable"
                          checked={templateIsWalkable}
                          onChange={(e) => setTemplateIsWalkable(e.target.checked)}
                          className="h-4 w-4"
                        />
                        <label htmlFor="templateIsWalkable" className="font-roboto font-medium text-pm-white">Is Walkable</label>
                      </div>
                      <button
                        type="submit"
                        className="bg-pm-red text-white px-4 py-2 rounded hover:bg-red-700 font-roboto font-medium"
                      >
                        Add Tile
                      </button>
                    </form>
                  </div>
                  
                  {/* Display existing tile templates */}
                  <div>
                    <h3 className="text-xl font-anton mb-4 text-pm-white">Available Tiles</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto p-2">
                      {tileTemplates && tileTemplates.length > 0 ? (
                        tileTemplates.map((template: MapTileTemplate) => (
                          <Tooltip key={template.id} content={template.description || template.name}>
                            <div className="relative bg-pm-dark-blue rounded p-2 flex flex-col items-center hover:bg-pm-navy transition-colors cursor-pointer">
                              <div className="text-sm font-roboto text-center mb-1 text-pm-white truncate w-full">
                                {template.name}
                              </div>
                              <div 
                                className="w-16 h-16 bg-center bg-cover rounded"
                                style={{ backgroundImage: `url(${template.image})` }}
                              />
                              <div className="mt-1 flex justify-between w-full">
                                <span className="text-xs text-pm-white">
                                  {template.isWalkable ? "Walkable" : "Blocked"}
                                </span>
                                <Button
                                  size="sm"
                                  color="danger"
                                  variant="light"
                                  onClick={() => deleteTemplateMutation.mutate({ id: template.id })}
                                  className="p-0 h-5 min-w-0 text-xs"
                                >
                                  ×
                                </Button>
                              </div>
                            </div>
                          </Tooltip>
                        ))
                      ) : (
                        <p className="text-pm-white col-span-full text-center">No tile templates available. Add some!</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </AccordionItem>
        </Accordion>

        <div className="flex gap-6 flex-col md:flex-row">
          {/* Left side - List of maps */}
          <Card className="p-6 rounded shadow-md mb-8 bg-pm-blue w-full md:w-1/3">
            <CardHeader className="border-b pb-2 mb-4">
              <h2 className="text-2xl font-anton text-pm-white">Existing Maps</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-4">
                {maps && maps.length > 0 ? (
                  maps.map((map: any) => (
                    <Card 
                      key={map.id} 
                      className={`p-4 rounded shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer ${selectedMap === map.id ? 'bg-pm-navy border-2 border-white' : 'bg-pm-dark-blue'}`}
                      onClick={() => handleSelectMap(map.id)}
                    >
                      <CardHeader className="border-b pb-2 mb-3 border-pm-navy">
                        <h3 className="text-xl font-anton text-pm-white">{map.name}</h3>
                      </CardHeader>
                      <CardBody className="flex flex-col gap-2 font-roboto text-sm text-pm-white">
                        <p>{map.description || "No description provided."}</p>
                        <p>Size: {map.rows || 10} x {map.columns || 10}</p>
                        <p>Tiles: {map._count?.tiles || 0}</p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(map);
                            }}
                            className="bg-pm-blue text-white font-roboto font-medium hover:bg-pm-navy"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(map.id);
                            }}
                            className="bg-pm-red text-white font-roboto font-medium hover:bg-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                ) : (
                  <p className="font-roboto text-center text-pm-white">No maps found. Create a new map to get started.</p>
                )}
              </div>
            </CardBody>
          </Card>
          
          {/* Right side - Map grid or tile editor */}
          <div className="w-full md:w-2/3">
            {selectedMap && selectedMapData ? (
              <div className="flex flex-col gap-4">
                <Card className="p-6 rounded shadow-md mb-4 bg-pm-blue">
                  <CardHeader className="border-b pb-2 mb-4">
                    <h2 className="text-2xl font-anton text-pm-white">{selectedMapData.name} - Map Editor</h2>
                  </CardHeader>
                  <CardBody>
                    <div className="mb-4 overflow-auto" style={{ maxHeight: '500px' }}>
                      <div 
                        className="grid gap-1 bg-pm-dark-blue p-2 rounded"
                        style={{ 
                          gridTemplateColumns: `repeat(${selectedMapData.columns}, minmax(40px, 1fr))`,
                          gridTemplateRows: `repeat(${selectedMapData.rows}, minmax(40px, 1fr))`,
                          width: 'fit-content'
                        }}
                      >
                        {/* Sort tiles by y then x to ensure proper grid layout */}
                        {[...selectedMapData.tiles]
                          .sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y)
                          .map((tile: any) => (
                          <Tooltip key={tile.id} content={tile.description || 'Empty tile'}>
                            <div 
                              className={`w-10 h-10 flex items-center justify-center rounded cursor-pointer border ${selectedTile?.id === tile.id ? 'border-2 border-white' : 'border-gray-700'}`}
                              style={{ 
                                backgroundImage: tile.image ? `url(${tile.image})` : 'none',
                                backgroundColor: tile.image ? 'transparent' : (tile.isWalkable ? '#4a5568' : '#991b1b'),
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                gridColumn: tile.x + 1,
                                gridRow: tile.y + 1
                              }}
                              onClick={() => handleSelectTile(tile)}
                            >
                              <span className="text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                                {tile.x},{tile.y}
                              </span>
                            </div>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  </CardBody>
                </Card>
                
                {selectedTile && (
                  <Card className="p-6 rounded shadow-md bg-pm-blue">
                    <CardHeader className="border-b pb-2 mb-4">
                      <h2 className="text-xl font-anton text-pm-white">Edit Tile ({selectedTile.x}, {selectedTile.y})</h2>
                    </CardHeader>
                    <CardBody>
                      <form onSubmit={handleUpdateTile} className="flex flex-col gap-4">
                        {/* Tile selection grid */}
                        <div>
                          <label className="block font-roboto font-medium mb-2 text-pm-white">Select Tile Image</label>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-60 overflow-y-auto p-2 bg-pm-dark-blue rounded">
                            {tileTemplates && tileTemplates.length > 0 ? (
                              tileTemplates.map((template: MapTileTemplate) => (
                                <div 
                                  key={template.id} 
                                  className={`flex flex-col items-center p-1 rounded cursor-pointer ${selectedTemplate?.id === template.id ? 'bg-pm-navy border border-white' : 'hover:bg-pm-navy'}`}
                                  onClick={() => handleSelectTemplateForTile(template)}
                                >
                                  <div className="text-xs font-roboto text-center mb-1 text-pm-white truncate w-full">
                                    {template.name}
                                  </div>
                                  <div 
                                    className="w-12 h-12 bg-center bg-cover rounded"
                                    style={{ backgroundImage: `url(${template.image})` }}
                                  />
                                </div>
                              ))
                            ) : (
                              <p className="text-pm-white col-span-full text-center text-sm">No tile templates available. Add some in the Map Tiles section above!</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Current selected image display */}
                        {tileImage && (
                          <div className="flex items-center gap-4 bg-pm-dark-blue p-2 rounded">
                            <div className="text-pm-white font-roboto">Selected:</div>
                            <div 
                              className="w-12 h-12 bg-center bg-cover rounded"
                              style={{ backgroundImage: `url(${tileImage})` }}
                            />
                            <div className="text-xs text-pm-white">{selectedTemplate?.name || 'Custom image'}</div>
                          </div>
                        )}
                        
                        {/* Manual URL input as fallback */}
                        <div>
                          <label className="block font-roboto font-medium mb-1 text-pm-white">Or enter image URL manually</label>
                          <input
                            type="text"
                            value={tileImage}
                            onChange={(e) => {
                              setTileImage(e.target.value);
                              setSelectedTemplate(null);
                            }}
                            className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                            placeholder="Enter image URL for this tile"
                          />
                        </div>
                        
                        <div>
                          <label className="block font-roboto font-medium mb-1 text-pm-white">Description</label>
                          <textarea
                            value={tileDescription}
                            onChange={(e) => setTileDescription(e.target.value)}
                            className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                            rows={2}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="isWalkable"
                            checked={isWalkable}
                            onChange={(e) => setIsWalkable(e.target.checked)}
                            className="h-4 w-4"
                          />
                          <label htmlFor="isWalkable" className="font-roboto font-medium text-pm-white">Is Walkable</label>
                        </div>
                        <button
                          type="submit"
                          className="bg-pm-red text-white px-4 py-2 rounded hover:bg-red-700 font-roboto font-medium"
                        >
                          Update Tile
                        </button>
                      </form>
                    </CardBody>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="p-6 rounded shadow-md bg-pm-blue h-64 flex items-center justify-center">
                <p className="font-roboto text-center text-pm-white text-lg">Select a map from the list to edit its tiles</p>
              </Card>
            )}
          </div>
        </div>

        {editingMap && (
          <Card className="p-6 rounded shadow-md mb-8">
            <CardHeader className="border-b pb-2 mb-4">
              <h2 className="text-2xl font-anton">Editing Map</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
                <div>
                  <label className="block font-roboto font-medium mb-1">Map Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-roboto font-medium mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block font-roboto font-medium mb-1">Rows</label>
                    <input
                      type="number"
                      value={rows}
                      onChange={(e) => setRows(parseInt(e.target.value))}
                      min={1}
                      max={50}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-roboto font-medium mb-1">Columns</label>
                    <input
                      type="number"
                      value={columns}
                      onChange={(e) => setColumns(parseInt(e.target.value))}
                      min={1}
                      max={50}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-roboto font-medium"
                  >
                    Update Map
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMap(null);
                      setName("");
                      setDescription("");
                      setRows(10);
                      setColumns(10);
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 font-roboto font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
