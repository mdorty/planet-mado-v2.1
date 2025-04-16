'use client';

import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import Link from 'next/link';
import { HeroUIProvider, Button, Input, Card, CardHeader, CardBody, CardFooter } from '@heroui/react';

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
      <div className="text-center p-8">
        <p className="font-roboto text-pm-text-dark">You must be logged in to view or create characters.</p>
        <Link href="/auth/signin" className="font-roboto font-medium text-blue-600 hover:underline">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <HeroUIProvider>
      <div className="container mx-auto p-8 max-w-6xl">
        <h1 className="text-3xl font-anton text-pm-text-dark mb-6">My Characters</h1>

        {/* Form to create a new character */}
        <Card className="bg-pm-white shadow-md rounded-lg p-6 mb-8">
          <CardHeader className="border-b pb-3 mb-6">
            <h2 className="text-xl font-anton text-pm-text-dark">Create New Character</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleCreateCharacter} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-roboto font-medium text-pm-text-dark">Character Name</label>
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

        {/* List of user's characters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {characters.length === 0 ? (
            <p className="font-roboto text-pm-text-dark text-center col-span-full">You have no characters yet. Create one to get started!</p>
          ) : (
            characters.map((char: any) => (
              <Card key={char.id} className="bg-pm-white shadow-md rounded-lg overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className="border-b pb-2 bg-gray-50">
                  <h3 className="font-anton text-lg text-pm-text-dark truncate">{char.name}</h3>
                </CardHeader>
                <CardBody className="p-4 flex flex-col gap-2">
                  <p className="font-roboto text-sm text-gray-600">Power Level: {char.powerLevel || 'N/A'}</p>
                </CardBody>
                <CardFooter className="p-4 pt-0">
                  <Link href={`/characters/${char.id}`}>
                    <Button variant="solid" className="bg-blue-600 text-white hover:bg-blue-700 font-roboto font-medium w-full">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </HeroUIProvider>
  );
}