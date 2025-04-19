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

  // Fetch characters for the logged-in user with optimized caching
  const { data: characters = [], refetch, isLoading } = trpc.character.getUserCharacters.useQuery(
    undefined,
    { 
      enabled: !!session?.user?.id,
      staleTime: 30 * 1000, // Data remains fresh for 30 seconds
      refetchOnWindowFocus: false,
      retry: 1
    }
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
    return (
      <div className="container mx-auto p-8 max-w-6xl">
        <h1 className="text-3xl font-anton text-pm-white mb-6">My Characters</h1>
        <div className="bg-pm-blue shadow-md rounded-lg p-6 mb-8 animate-pulse">
          <div className="h-8 w-48 bg-gray-600 rounded mb-4"></div>
          <div className="h-10 w-full bg-gray-600 rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-pm-blue shadow-md rounded-lg overflow-hidden h-40 animate-pulse">
              <div className="h-10 bg-gray-600 w-full"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-600 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-gray-600 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="text-center p-8">
        <p className="font-roboto">You must be logged in to view or create characters.</p>
        <Link href="/auth/signin" className="font-roboto font-medium text-blue-600 hover:underline">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <HeroUIProvider>
      <div className="container mx-auto p-8 max-w-6xl">
        <h1 className="text-3xl font-anton text-pm-white mb-6">My Characters</h1>

        {/* Form to create a new character */}
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

        {/* List of user's characters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton loading state for characters
            [...Array(6)].map((_, i) => (
              <Card key={i} className="bg-pm-blue shadow-md rounded-lg overflow-hidden animate-pulse text-pm-white">
                <CardHeader className="border-b pb-2 bg-pm-dark-blue">
                  <div className="h-6 bg-gray-600 rounded w-3/4"></div>
                </CardHeader>
                <CardBody className="p-4 flex flex-col gap-2">
                  <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                </CardBody>
                <CardFooter className="p-4 pt-0">
                  <div className="h-10 bg-gray-600 rounded w-full"></div>
                </CardFooter>
              </Card>
            ))
          ) : characters.length === 0 ? (
            <p className="font-roboto text-center col-span-full text-pm-white">You have no characters yet. Create one to get started!</p>
          ) : (
            characters.map((char: any) => (
              <Card key={char.id} className="bg-pm-blue shadow-md rounded-lg overflow-hidden transition-all hover:shadow-lg text-pm-white">
                <CardHeader className="border-b pb-2 bg-pm-dark-blue">
                  <h3 className="font-anton text-lg truncate text-pm-white">{char.name}</h3>
                </CardHeader>
                <CardBody className="p-4 flex flex-col gap-2">
                  <p className="font-roboto text-sm text-pm-cream">Power Level: {char.currentPowerlevel || 'N/A'}</p>
                  <p className="font-roboto text-sm text-pm-cream">Race: {char.race || 'Unknown'}</p>
                  <p className="font-roboto text-sm text-pm-cream">Level: {char.level || '1'}</p>
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