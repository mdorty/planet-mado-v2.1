'use client';

import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import Link from 'next/link';

export default function CharactersPage() {
  const { data: session, status } = useSession();
  const [characterName, setCharacterName] = useState('');
  const [error, setError] = useState('');

  // Fetch characters for the logged-in user
  const { data: characters = [], refetch } = trpc.character.getUserCharacters.useQuery(
    undefined,
    { enabled: !!session?.user?.id }
  );

  // Mutation for creating a new character
  const createCharacter = trpc.character.create.useMutation({
    onSuccess: () => {
      refetch(); // Refresh character list
      setCharacterName('');
      setError('');
    },
    onError: (err) => {
      setError(err.message || 'Failed to create character');
    },
  });

  const handleCreateCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterName.trim()) {
      setError('Character name is required');
      return;
    }
    if (!session?.user?.id) {
      setError('You must be logged in');
      return;
    }
    createCharacter.mutate({ name: characterName });
  };

  if (status === 'loading') {
    return <div className="text-center">Loading...</div>;
  }

  if (status !== 'authenticated') {
    return (
      <div className="text-center">
        <p>Please sign in to view your characters.</p>
        <Link href="/auth/signin" className="text-dbz-orange hover:underline">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl text-dbz-orange mb-4">Your Characters</h1>

        {/* Character Creation Form */}
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <h2 className="text-xl mb-4">Create a New Character</h2>
          <form onSubmit={handleCreateCharacter} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div>
              <label htmlFor="characterName" className="block text-sm">
                Character Name
              </label>
              <input
                id="characterName"
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="e.g., Goku"
                required
              />
            </div>
            <button
              type="submit"
              disabled={createCharacter.isPending}
              className="bg-dbz-blue text-white px-4 py-2 rounded hover:bg-dbz-blue/80 disabled:opacity-50"
            >
              {createCharacter.isPending ? 'Creating...' : 'Create Character'}
            </button>
          </form>
        </div>

        {/* Character List */}
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl mb-4">Your Characters</h2>
          {characters.length === 0 ? (
            <p className="text-gray-500">No characters yet. Create one above!</p>
          ) : (
            <ul className="space-y-4">
              {characters.map((character) => (
                <li key={character.id} className="border-b pb-2">
                  <Link
                    href={`/characters/${character.id}`}
                    className="text-dbz-orange hover:underline"
                  >
                    {character.name} (Level {character.level})
                  </Link>
                  <p className="text-sm text-gray-600">
                    Health: {character.health}, Energy: {character.energy}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}