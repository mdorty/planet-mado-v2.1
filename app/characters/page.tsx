import { Suspense } from 'react';
import { HeroUIProvider } from '@heroui/react';
import Link from 'next/link';
import CharactersList from './CharactersList';
import CharactersLoading from './CharactersLoading';
import CharacterForm from './CharacterForm';
import { getServerSideHelpers } from '@/lib/trpc/server-helpers';
import { db } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Define the Character type for proper typing
type Character = {
  id: string;
  name: string;
  currentPowerlevel?: number;
  basePowerlevel?: number;
  race?: string;
  level?: number;
};

// This is a Server Component
export default async function CharactersPage() {
  // Get the user session on the server
  const session = await auth();
  const userId = session?.user?.id;
  
  // Prefetch character data if user is logged in
  let initialCharacters: Character[] = [];
  if (userId) {
    try {
      // Create server-side helpers
      const helpers = await getServerSideHelpers(userId);
      
      // Prefetch the characters data
      await helpers.character.getUserCharacters.prefetch({ userId });
      
      // Get the prefetched data
      initialCharacters = await db.character.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          currentPowerlevel: true,
          basePowerlevel: true,
          race: true,
          level: true
        },
        orderBy: { name: 'asc' }
      });
    } catch (error) {
      console.error('Error prefetching characters:', error);
      // Continue with empty initialCharacters
    }
  }

  // If user is not authenticated, show sign-in message
  if (!session) {
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
        <CharacterForm />

        {/* List of user's characters */}
        <Suspense fallback={<CharactersLoading />}>
          <CharactersList initialCharacters={initialCharacters} />
        </Suspense>
      </div>
    </HeroUIProvider>
  );
}