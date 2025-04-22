'use client';

import { trpc } from '@/lib/trpc/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardHeader, CardBody, CardFooter, Button } from '@heroui/react';

type Character = {
  id: string;
  name: string;
  currentPowerlevel?: number;
  basePowerlevel?: number;
  race?: string;
  level?: number;
};

export default function CharactersList({ 
  initialCharacters 
}: { 
  initialCharacters: Character[] 
}) {
  // Get the user session
  const { data: session } = useSession();
  const userId = session?.user?.id;
  
  // Use the prefetched data but enable background updates
  const { data: characters = initialCharacters } = trpc.character.getUserCharacters.useQuery(
    { userId },
    {
      // Use type assertion to handle the type mismatch between our Character type and tRPC's expected type
      initialData: initialCharacters as any,
      staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Garbage collection time
      refetchOnWindowFocus: false,
      enabled: !!userId, // Only run the query if we have a userId
    }
  );

  if (characters.length === 0) {
    return <p className="font-roboto text-center col-span-full text-pm-white">You have no characters yet. Create one to get started!</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {characters.map((char) => (
        <Card key={char.id} className="bg-pm-blue shadow-md rounded-lg overflow-hidden transition-all hover:shadow-lg text-pm-white">
          <CardHeader className="border-b pb-2 bg-pm-dark-blue">
            <h3 className="font-anton text-lg truncate text-pm-white">{char.name}</h3>
          </CardHeader>
          <CardBody className="p-4 flex flex-col gap-2">
            <p className="font-roboto text-sm text-pm-cream">Power Level: {char.currentPowerlevel ?? 'N/A'} / {char.basePowerlevel ?? 'N/A'}</p>
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
      ))}
    </div>
  );
}
