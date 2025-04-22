import { Suspense } from 'react';
import { HeroUIProvider } from '@heroui/react';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { getServerSideHelpers } from '@/lib/trpc/server-helpers';
import CharacterDetails from './CharacterDetails';
import CharacterLoading from './CharacterLoading';

// Define the Move type
interface Move {
  id: string;
  name: string;
  description: string;
  category: string;
  percentDamage?: number | null;
  percentCost?: number | null;
  chargeable?: boolean | null;
  stunTurns?: number | null;
  stunChancePercent?: number | null;
  powerlevelMultiplier?: number | null;
}

// Define the Character type
interface CharacterWithMoves {
  id: string;
  name: string;
  currentMap: string;
  currentPowerlevel: number;
  basePowerlevel: number;
  race: string;
  planet?: string | null;
  alignment: number;
  moves: Move[];
  [key: string]: any;
}

// Define the MapData type
interface MapData {
  id: number;
  name: string;
  description: string;
  xCoord: number;
  yCoord: number;
  tileImage: string;
  createdAt: Date;
}

// This is a Server Component
export default async function CharacterDetailPage({ params }: { params: { id: string } }) {
  // Get the user session on the server
  const session = await auth();
  const userId = session?.user?.id;
  
  // Initialize default data
  let initialCharacter: CharacterWithMoves | null = null;
  let initialMapData: MapData | null = null;
  
  // Prefetch character data if user is logged in
  if (userId) {
    try {
      // Create server-side helpers
      const helpers = await getServerSideHelpers(userId);
      
      // Prefetch the character data
      await helpers.character.getCharacterWithMapById.prefetch({ id: params.id });
      
      // Get the prefetched data directly from the database
      const character = await db.character.findUnique({
        where: { id: params.id },
        include: {
          moves: true, // Include related moves data
        },
      });
      
      if (character) {
        initialCharacter = character as unknown as CharacterWithMoves;
        
        // Determine which map to use
        const currentMapName = character.currentMap && character.currentMap !== "Unknown" ? character.currentMap : null;
        if (currentMapName) {
          const mapData = await db.map.findFirst({ where: { name: currentMapName } });
          if (mapData) {
            initialMapData = mapData as unknown as MapData;
          }
        }
        
        // If no map found, use default map
        if (!initialMapData) {
          initialMapData = {
            id: 0,
            name: "Default",
            description: "Default hardcoded map",
            xCoord: 0,
            yCoord: 0,
            tileImage: "/assets/tiles.jpg",
            createdAt: new Date(),
          };
        }
      }
    } catch (error) {
      console.error('Error prefetching character:', error);
      // Continue with null initialCharacter
    }
  }

  // If user is not authenticated, show sign-in message
  if (!session) {
    return (
      <div className="text-center p-8">
        <p className="font-roboto">You must be logged in to view character details.</p>
        <Link href="/auth/signin" className="font-roboto font-medium text-blue-600 hover:underline">
          Sign In
        </Link>
      </div>
    );
  }
  
  // If character not found, show error message
  if (!initialCharacter) {
    return (
      <div className="text-center p-8">
        <p className="font-roboto">Character not found or you don't have access.</p>
        <Link href="/characters" className="font-roboto font-medium text-blue-600 hover:underline">
          Back to Characters
        </Link>
      </div>
    );
  }

  return (
    <HeroUIProvider>
      <div className="min-h-screen p-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-anton text-pm-white mb-6">Character Details</h1>
          <Link href="/characters" className="inline-block mb-4 hover:underline font-roboto text-pm-white">
            Back to Characters
          </Link>
          
          {/* Character details with loading fallback */}
          <Suspense fallback={<CharacterLoading />}>
            <CharacterDetails 
              initialCharacter={{
                ...initialCharacter,
                xCoord: initialCharacter.xCoord || 0,
                yCoord: initialCharacter.yCoord || 0,
                level: initialCharacter.level || 1,
                health: initialCharacter.health || 100,
                energy: initialCharacter.energy || 100
              }} 
              initialMapData={initialMapData!} 
            />
          </Suspense>
        </div>
      </div>
    </HeroUIProvider>
  );
}