'use client';

import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import Link from 'next/link';
import { Accordion, AccordionItem, Form, Input, Textarea, Select, Button } from '@heroui/react';

import CharacterInventoryCard from './CharacterInventoryCard';

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

  // Fetch users
  const { data: users = [] } = trpc.admin.getUsers.useQuery(
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
    return <div className="text-center text-pm-white">Loading...</div>;
  }

  if (status !== 'authenticated' || session?.user?.role !== 'admin') {
    return (
      <div className="text-center">
        <p className="text-pm-white">Access denied. Admins only.</p>
        <Link href="/" className="hover:underline text-pm-red">
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
    <div className="min-h-screen p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-anton mb-6 text-pm-white">Character Management</h1>
        <Link href="/admin" className="inline-block mb-4 hover:underline font-roboto text-pm-white">
          Back to Admin Dashboard
        </Link>

        {/* Characters Section */}
        <div className="p-6 rounded shadow-md mb-8 bg-pm-blue">
          <h2 className="text-xl font-anton mb-4 text-pm-white">Manage Characters</h2>
          {charError && <p className="text-red-500 mb-4 font-roboto">{charError}</p>}
          
          <Accordion className="mb-6" variant="splitted">
  <AccordionItem
    key="character-form"
    aria-label={charForm.id ? "Edit Character" : "Create New Character"}
    title={charForm.id ? "Edit Character" : "Create New Character"}
  >
    <Form onSubmit={handleCharacterSubmit} className="space-y-4 font-roboto">
              <div>
                <label htmlFor="userId" className="block font-roboto font-medium mb-1 text-pm-white">User</label>
                <select
                  id="userId"
                  value={charForm.userId}
                  onChange={(e) => setCharForm({ ...charForm, userId: e.target.value })}
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username || user.email || user.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-pm-white">Name</label>
                <input
                  type="text"
                  value={charForm.name}
                  onChange={(e) => setCharForm({ ...charForm, name: e.target.value })}
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pm-white">Level</label>
                <input
                  type="number"
                  value={charForm.level}
                  onChange={(e) => setCharForm({ ...charForm, level: Number(e.target.value) })}
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
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
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
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
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
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
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Race</label>
                <input
                  type="text"
                  value={charForm.race}
                  onChange={(e) => setCharForm({ ...charForm, race: e.target.value })}
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Planet</label>
                <input
                  type="text"
                  value={charForm.planet}
                  onChange={(e) => setCharForm({ ...charForm, planet: e.target.value })}
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Alignment (-100 to 100)</label>
                <input
                  type="number"
                  value={charForm.alignment}
                  onChange={(e) => setCharForm({ ...charForm, alignment: Number(e.target.value) })}
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
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
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Equipped Items</label>
                <input
                  type="text"
                  value={charForm.equippedItems}
                  onChange={(e) => setCharForm({ ...charForm, equippedItems: e.target.value })}
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Items</label>
                <input
                  type="text"
                  value={charForm.items}
                  onChange={(e) => setCharForm({ ...charForm, items: e.target.value })}
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">People You Have Been To</label>
                <input
                  type="text"
                  value={charForm.peopleYouHaveBeenTo}
                  onChange={(e) => setCharForm({ ...charForm, peopleYouHaveBeenTo: e.target.value })}
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pm-white">Jobs</label>
                <input
                  type="text"
                  value={charForm.jobs}
                  onChange={(e) => setCharForm({ ...charForm, jobs: e.target.value })}
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-pm-red text-white px-4 py-2 rounded hover:bg-red-700 font-roboto font-medium">
                  {charForm.id ? 'Update Character' : 'Create Character'}
                </button>
                {charForm.id && (
                  <button
                    type="button"
                    className="border border-pm-navy text-pm-white px-4 py-2 rounded hover:bg-pm-dark-blue font-roboto font-medium"
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
                  >
                    Cancel Edit
                  </button>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium text-pm-white">Name</label>
            <input
              type="text"
              value={charForm.name}
              onChange={(e) => setCharForm({ ...charForm, name: e.target.value })}
              className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pm-white">Level</label>
            <input
              type="number"
              value={charForm.level}
              onChange={(e) => setCharForm({ ...charForm, level: Number(e.target.value) })}
              className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
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
              className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
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
              className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
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
              className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Race</label>
            <input
              type="text"
              value={charForm.race}
              onChange={(e) => setCharForm({ ...charForm, race: e.target.value })}
              className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Planet</label>
            <input
              type="text"
              value={charForm.planet}
              onChange={(e) => setCharForm({ ...charForm, planet: e.target.value })}
              className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Alignment (-100 to 100)</label>
            <input
              type="number"
              value={charForm.alignment}
              onChange={(e) => setCharForm({ ...charForm, alignment: Number(e.target.value) })}
              className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
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
              className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Equipped Items</label>
            <input
              type="text"
              value={charForm.equippedItems}
              onChange={(e) => setCharForm({ ...charForm, equippedItems: e.target.value })}
              className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Items</label>
            <input
              type="text"
              value={charForm.items}
              onChange={(e) => setCharForm({ ...charForm, items: e.target.value })}
              className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">People You Have Been To</label>
            <input
              type="text"
              value={charForm.peopleYouHaveBeenTo}
              onChange={(e) => setCharForm({ ...charForm, peopleYouHaveBeenTo: e.target.value })}
              className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pm-white">Jobs</label>
            <input
              type="text"
              value={charForm.jobs}
              onChange={(e) => setCharForm({ ...charForm, jobs: e.target.value })}
              className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-pm-red text-white px-4 py-2 rounded hover:bg-red-700 font-roboto font-medium">
              {charForm.id ? 'Update Character' : 'Create Character'}
            </button>
            {charForm.id && (
              <button
                type="button"
                className="border border-pm-navy text-pm-white px-4 py-2 rounded hover:bg-pm-dark-blue font-roboto font-medium"
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
              >
                Cancel Edit
              </button>
            )}
          </div>
        </Form>
      </AccordionItem>
    </Accordion>

    <h3 className="text-lg font-anton mt-6 mb-2 text-pm-white">Current Characters</h3>
    <div className="space-y-2 max-h-96 overflow-y-auto font-roboto">
      {characters.map((char) => (
        <CharacterInventoryCard key={char.id} char={char} onEdit={editCharacter} />
      ))}
    </div>
  </div>
</div>
</div>
    );
}