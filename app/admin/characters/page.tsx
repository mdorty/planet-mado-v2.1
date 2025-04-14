'use client';

import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import Link from 'next/link';
import { Accordion } from '@/components/ui/Accordion';

export default function AdminCharactersPage() {
  const { data: session, status } = useSession();

  // State for character form
  const [charForm, setCharForm] = useState({
    id: '',
    userId: '',
    name: '',
    level: 1,
    currentPowerlevel: 1000,
    basePowerlevel: 1000,
    hiddenPowerlevel: 0,
    race: 'Unknown',
    planet: '',
    alignment: 0,
    description: '',
    equippedItems: 'None',
    items: 'None',
    peopleYouHaveBeenTo: 'None',
    jobs: '',
  });
  const [charError, setCharError] = useState('');

  // Fetch characters
  const { data: characters = [], refetch: refetchCharacters } = trpc.admin.getCharacters.useQuery(
    undefined,
    { enabled: status === 'authenticated' && session?.user?.role === 'admin' }
  );

  // Mutations
  const createCharacter = trpc.admin.createCharacter.useMutation({
    onSuccess: () => {
      refetchCharacters();
      setCharForm({
        id: '',
        userId: '',
        name: '',
        level: 1,
        currentPowerlevel: 1000,
        basePowerlevel: 1000,
        hiddenPowerlevel: 0,
        race: 'Unknown',
        planet: '',
        alignment: 0,
        description: '',
        equippedItems: 'None',
        items: 'None',
        peopleYouHaveBeenTo: 'None',
        jobs: '',
      });
      setCharError('');
    },
    onError: (err) => setCharError(err.message),
  });

  const updateCharacter = trpc.admin.updateCharacter.useMutation({
    onSuccess: () => {
      refetchCharacters();
      setCharForm({
        id: '',
        userId: '',
        name: '',
        level: 1,
        currentPowerlevel: 1000,
        basePowerlevel: 1000,
        hiddenPowerlevel: 0,
        race: 'Unknown',
        planet: '',
        alignment: 0,
        description: '',
        equippedItems: 'None',
        items: 'None',
        peopleYouHaveBeenTo: 'None',
        jobs: '',
      });
      setCharError('');
    },
    onError: (err) => setCharError(err.message),
  });

  const deleteCharacter = trpc.admin.deleteCharacter.useMutation({
    onSuccess: () => refetchCharacters(),
    onError: (err) => setCharError(err.message),
  });

  if (status === 'loading') {
    return <div className="text-center">Loading...</div>;
  }

  if (status !== 'authenticated' || session?.user?.role !== 'admin') {
    return (
      <div className="text-center">
        <p>Access denied. Admins only.</p>
        <Link href="/" className="text-dbz-orange hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const handleCharacterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCharError('');
    if (charForm.id) {
      updateCharacter.mutate(charForm);
    } else {
      createCharacter.mutate(charForm);
    }
  };

  const editCharacter = (char: typeof characters[0]) => {
    setCharForm({
      id: char.id,
      userId: char.userId,
      name: char.name,
      level: char.level,
      currentPowerlevel: char.currentPowerlevel,
      basePowerlevel: char.basePowerlevel,
      hiddenPowerlevel: char.hiddenPowerlevel || 0,
      race: char.race,
      planet: char.planet || '',
      alignment: char.alignment,
      description: char.description || '',
      equippedItems: char.equippedItems || 'None',
      items: char.items || 'None',
      peopleYouHaveBeenTo: char.peopleYouHaveBeenTo || 'None',
      jobs: char.jobs || '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-anton text-pm-nav-orange mb-6">Character Management</h1>
        <Link href="/admin" className="inline-block mb-4 text-pm-nav-orange hover:underline font-roboto">
          Back to Admin Dashboard
        </Link>

        {/* Characters Section */}
        <div className="bg-white p-6 rounded shadow-md mb-8">
          <h2 className="text-xl font-anton mb-4">Manage Characters</h2>
          {charError && <p className="text-red-500 mb-4 font-roboto">{charError}</p>}
          
          <Accordion 
            title={charForm.id ? "Edit Character" : "Create New Character"} 
            defaultOpen={false}
            className="mb-6"
          >
            <form onSubmit={handleCharacterSubmit} className="space-y-4 font-roboto">
              <div>
                <label className="block text-sm font-medium">User ID</label>
                <input
                  type="text"
                  value={charForm.userId}
                  onChange={(e) => setCharForm({ ...charForm, userId: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={charForm.name}
                  onChange={(e) => setCharForm({ ...charForm, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Level</label>
                <input
                  type="number"
                  value={charForm.level}
                  onChange={(e) => setCharForm({ ...charForm, level: Number(e.target.value) })}
                  className="w-full p-2 border rounded"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Current Power Level</label>
                <input
                  type="number"
                  value={charForm.currentPowerlevel}
                  onChange={(e) => setCharForm({ ...charForm, currentPowerlevel: Number(e.target.value) })}
                  className="w-full p-2 border rounded"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Base Power Level</label>
                <input
                  type="number"
                  value={charForm.basePowerlevel}
                  onChange={(e) => setCharForm({ ...charForm, basePowerlevel: Number(e.target.value) })}
                  className="w-full p-2 border rounded"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Hidden Power Level</label>
                <input
                  type="number"
                  value={charForm.hiddenPowerlevel}
                  onChange={(e) => setCharForm({ ...charForm, hiddenPowerlevel: Number(e.target.value) })}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Race</label>
                <input
                  type="text"
                  value={charForm.race}
                  onChange={(e) => setCharForm({ ...charForm, race: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Planet</label>
                <input
                  type="text"
                  value={charForm.planet}
                  onChange={(e) => setCharForm({ ...charForm, planet: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Alignment (-100 to 100)</label>
                <input
                  type="number"
                  value={charForm.alignment}
                  onChange={(e) => setCharForm({ ...charForm, alignment: Number(e.target.value) })}
                  className="w-full p-2 border rounded"
                  min="-100"
                  max="100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={charForm.description}
                  onChange={(e) => setCharForm({ ...charForm, description: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Equipped Items</label>
                <input
                  type="text"
                  value={charForm.equippedItems}
                  onChange={(e) => setCharForm({ ...charForm, equippedItems: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Items</label>
                <input
                  type="text"
                  value={charForm.items}
                  onChange={(e) => setCharForm({ ...charForm, items: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">People You Have Been To</label>
                <input
                  type="text"
                  value={charForm.peopleYouHaveBeenTo}
                  onChange={(e) => setCharForm({ ...charForm, peopleYouHaveBeenTo: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Jobs</label>
                <input
                  type="text"
                  value={charForm.jobs}
                  onChange={(e) => setCharForm({ ...charForm, jobs: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button type="submit" className="bg-pm-nav-orange text-white p-2 rounded hover:opacity-90 transition-opacity">
                {charForm.id ? 'Update Character' : 'Create Character'}
              </button>
              {charForm.id && (
                <button
                  type="button"
                  onClick={() =>
                    setCharForm({
                      id: '',
                      userId: '',
                      name: '',
                      level: 1,
                      currentPowerlevel: 1000,
                      basePowerlevel: 1000,
                      hiddenPowerlevel: 0,
                      race: 'Unknown',
                      planet: '',
                      alignment: 0,
                      description: '',
                      equippedItems: 'None',
                      items: 'None',
                      peopleYouHaveBeenTo: 'None',
                      jobs: '',
                    })
                  }
                  className="ml-2 bg-gray-300 text-black p-2 rounded hover:opacity-90 transition-opacity"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </Accordion>

          <h3 className="text-lg font-anton mt-6 mb-2">Current Characters</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto font-roboto">
            {characters.map((char) => (
              <div key={char.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <p>{char.name}</p>
                  <p className="text-sm text-gray-500">User ID: {char.userId} - Power Level: {char.currentPowerlevel}</p>
                </div>
                <div>
                  <button
                    onClick={() => editCharacter(char)}
                    className="bg-blue-500 text-white p-1 rounded hover:opacity-90 transition-opacity mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCharacter.mutate({ id: char.id })}
                    className="bg-red-500 text-white p-1 rounded hover:opacity-90 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}