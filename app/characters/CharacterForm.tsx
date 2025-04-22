'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { Card, CardHeader, CardBody, Button, Input } from '@heroui/react';

export default function CharacterForm() {
  const { data: session } = useSession();
  const [characterName, setCharacterName] = useState('');
  const [error, setError] = useState('');
  const utils = trpc.useContext();

  // Mutation for creating a new character
  const createCharacter = trpc.character.create.useMutation({
    onSuccess: () => {
      // Invalidate the characters query to refresh the list
      utils.character.getUserCharacters.invalidate();
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

  return (
    <Card className="bg-pm-blue shadow-md rounded-lg p-6 mb-8 text-pm-white">
      <CardHeader className="border-b pb-3 mb-6">
        <h2 className="text-xl font-anton text-pm-white">Create New Character</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleCreateCharacter} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-roboto font-medium">Character Name</label>
            <Input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Enter character name"
              required
              className="w-full"
            />
          </div>
          {error && <p className="text-red-500 font-roboto text-sm">{error}</p>}
          <Button
            type="submit"
            variant="solid"
            className="bg-green-600 text-white hover:bg-green-700 font-roboto font-medium w-full sm:w-auto"
            disabled={createCharacter.isPending}
          >
            {createCharacter.isPending ? 'Creating...' : 'Create Character'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
