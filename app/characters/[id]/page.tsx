'use client';

import { useSession } from 'next-auth/react';

// --- Types ---
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

import { trpc } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Button, Card, CardHeader, CardBody } from '@heroui/react';
import CharacterPhaserDisplayWithInventory from '../../../components/CharacterPhaserDisplayWithInventory';

export default function CharacterDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  // Use the new endpoint to fetch both character and map
  const { data, isLoading: characterLoading, error: characterError } = trpc.character.getCharacterWithMapById.useQuery(
    { id: params.id },
    { 
      enabled: !!session?.user?.id,
      staleTime: 60 * 1000, // Data remains fresh for 1 minute
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1
    }
  );
  const character = data?.character as CharacterWithMoves | undefined;
  const mapData = data?.map;

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (characterError) {
      console.error('Error fetching character:', characterError);
      router.push('/characters');
    }
  }, [characterError, router]);

  if (status === 'loading' || characterLoading) {
    return (
      <div className="min-h-screen p-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-anton text-pm-white mb-6">Character Details</h1>
          <Link href="/characters" className="inline-block mb-4 hover:underline font-roboto text-pm-white">
            Back to Characters
          </Link>
          
          {/* Skeleton loading state */}
          <Card className="bg-pm-blue p-6 rounded shadow-md mb-8 text-pm-white">
            <CardHeader className="border-b pb-2 mb-4">
              <div className="h-8 w-48 bg-gray-600 animate-pulse rounded"></div>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-6 bg-gray-600 animate-pulse rounded w-3/4"></div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-6 bg-gray-600 animate-pulse rounded w-3/4"></div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="h-8 w-48 bg-gray-600 animate-pulse rounded mb-4"></div>
                <div className="flex justify-center">
                  <div className="w-[150px] h-[150px] rounded-full bg-gray-600 animate-pulse"></div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="text-center">
        <p>Please sign in to view character details.</p>
        <Link href="/auth/signin" className="hover:underline">
          Sign In
        </Link>
      </div>
    );
  }

  // Temporarily bypass ownership check for testing purposes
  // TODO: Reinstate this check once proper user session handling is implemented
  // if (!character || character.userId !== session.user.id) {
  if (!character) {
    return (
      <div className="text-center">
        <p>Character not found or you don’t have access.</p>
        <Link href="/characters" className="hover:underline">
          Back to Characters
        </Link>
      </div>
    );
  }

  // Calculate power level percentage
  const percentage = Math.round((character.currentPowerlevel / character.basePowerlevel) * 100);
  const circleCircumference = 440;
  const strokeDashoffset = circleCircumference - (circleCircumference * percentage / 100);

  // Group moves by category
  const movesByCategory = character.moves.reduce<Record<string, Move[]>>((acc: Record<string, Move[]>, move: Move) => {
    if (!acc[move.category]) {
      acc[move.category] = [];
    }
    acc[move.category].push(move);
    return acc;
  }, {});


  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-anton text-pm-white mb-6">Character Details</h1>
        <Link href="/characters" className="inline-block mb-4 hover:underline font-roboto text-pm-white">
          Back to Characters
        </Link>
        {character ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Basic Info Card */}
              <Card className="bg-pm-blue rounded shadow-md text-pm-white">
                <CardHeader className="border-b pb-2">
                  <h2 className="text-2xl font-anton text-pm-white">Basic Info</h2>
                </CardHeader>
                <CardBody className="space-y-2">
                  <p className="font-roboto"><strong>Race:</strong> {character.race}</p>
                  <p className="font-roboto"><strong>Planet:</strong> {character.planet || 'Unknown'}</p>
                  <p className="font-roboto"><strong>Alignment:</strong> {character.alignment >= 0 ? '+' : ''}{character.alignment}</p>
                  <p className="font-roboto"><strong>Ability Count:</strong> {character.moves.length}</p>
                  <p className="font-roboto"><strong>Weighted Clothing:</strong> Not implemented yet</p>
                </CardBody>
              </Card>
              {/* Power Level Card */}
              <Card className="bg-pm-blue rounded shadow-md text-pm-white">
                <CardHeader className="border-b pb-2">
                  <h2 className="text-2xl font-anton text-pm-white">Power Level</h2>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-col items-center">
                    <div className="relative max-w-[150px] max-h-[150px]">
                      <svg className="rotate-[-90deg] w-full h-full" viewBox="0 0 150 150">
                        <circle className="stroke-gray-200" cx="75" cy="75" r="70" fill="none" strokeWidth="8" />
                        <circle
                          className="stroke-green-500 stroke-linecap-round"
                          cx="75"
                          cy="75"
                          r="70"
                          fill="none"
                          strokeWidth="8"
                          strokeDasharray="440"
                          strokeDashoffset={strokeDashoffset}
                        />
                      </svg>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl">
                        {percentage}%
                      </div>
                    </div>
                    <p className="text-center mt-2">
                      {character.hiddenPowerlevel ? `${character.hiddenPowerlevel.toLocaleString()} (` : ''}
                      <span id="current-powerlevel">{character.currentPowerlevel.toLocaleString()}</span>
                      {character.hiddenPowerlevel ? ')' : ''} / {character.basePowerlevel.toLocaleString()}
                    </p>
                  </div>
                </CardBody>
              </Card>
              {/* Items Card */}
              <Card className="bg-pm-blue rounded shadow-md text-pm-white">
                <CardHeader className="border-b pb-2">
                  <h2 className="text-2xl font-anton text-pm-white">Items</h2>
                </CardHeader>
                <CardBody>
                  {(character.equippedItems !== 'None' || character.items !== 'None') ? (
                    <div>
                      {character.equippedItems !== 'None' && (
                        <p className="font-roboto"><strong>Equipped:</strong> {character.equippedItems}</p>
                      )}
                      {character.items !== 'None' && <p className="font-roboto"><strong>Bag:</strong> {character.items}</p>}
                    </div>
                  ) : <p className="font-roboto italic">No items.</p>}
                </CardBody>
              </Card>
              {/* People You've Been To Card */}
              <Card className="bg-pm-blue rounded shadow-md text-pm-white">
                <CardHeader className="border-b pb-2">
                  <h2 className="text-2xl font-anton text-pm-white">People You’ve Been To</h2>
                </CardHeader>
                <CardBody>
                  {character.peopleYouHaveBeenTo !== 'None' ? (
                    <p className="font-roboto">{character.peopleYouHaveBeenTo}</p>
                  ) : <p className="font-roboto italic">None</p>}
                </CardBody>
              </Card>
              {/* Jobs Card */}
              <Card className="bg-pm-blue rounded shadow-md text-pm-white">
                <CardHeader className="border-b pb-2">
                  <h2 className="text-2xl font-anton text-pm-white">Jobs</h2>
                </CardHeader>
                <CardBody>
                  {character.jobs ? (
                    <p className="font-roboto">{character.jobs}</p>
                  ) : <p className="font-roboto italic">None</p>}
                </CardBody>
              </Card>
              {/* Attacks & Abilities Card */}
              <Card className="bg-pm-blue rounded shadow-md text-pm-white md:col-span-2">
                <CardHeader className="border-b pb-2">
                  <h2 className="text-2xl font-anton text-pm-white">Attacks & Abilities</h2>
                </CardHeader>
                <CardBody>
                  {Object.keys(movesByCategory).length > 0 ? (
                    <div>
                      {Object.entries(movesByCategory).map(([category, moves]) => (
                        <div key={category}>
                          <h4 className="text-lg mt-4 font-roboto font-semibold">{category}</h4>
                          {moves.length > 3 ? (
                            <div className="flex flex-wrap -mx-2">
                              <div className="w-1/2 px-2">
                                {moves.slice(0, Math.ceil(moves.length / 2)).map((move) => (
                                  <div key={move.id} className="mb-4">
                                    <p className="font-bold">{move.name}</p>
                                    <p className="text-sm italic">{move.description}</p>
                                    {move.percentDamage && (
                                      <p><strong>Damage:</strong> {move.percentDamage}%</p>
                                    )}
                                    {move.percentCost && (
                                      <p><strong>Cost:</strong> {move.percentCost}%</p>
                                    )}
                                    {move.chargeable && <p><strong>Chargeable</strong></p>}
                                    {move.stunTurns && (
                                      <>
                                        <p><strong>Stun Turns:</strong> {move.stunTurns}</p>
                                        <p><strong>Stun Chance:</strong> {move.stunChancePercent}%</p>
                                      </>
                                    )}
                                    {move.powerlevelMultiplier && (
                                      <p><strong>Powerlevel Multiplier:</strong> x{move.powerlevelMultiplier}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="w-1/2 px-2">
                                {moves.slice(Math.ceil(moves.length / 2)).map((move) => (
                                  <div key={move.id} className="mb-4">
                                    <p className="font-bold">{move.name}</p>
                                    <p className="text-sm italic">{move.description}</p>
                                    {move.percentDamage && (
                                      <p><strong>Damage:</strong> {move.percentDamage}%</p>
                                    )}
                                    {move.percentCost && (
                                      <p><strong>Cost:</strong> {move.percentCost}%</p>
                                    )}
                                    {move.chargeable && <p><strong>Chargeable</strong></p>}
                                    {move.stunTurns && (
                                      <>
                                        <p><strong>Stun Turns:</strong> {move.stunTurns}</p>
                                        <p><strong>Stun Chance:</strong> {move.stunChancePercent}%</p>
                                      </>
                                    )}
                                    {move.powerlevelMultiplier && (
                                      <p><strong>Powerlevel Multiplier:</strong> x{move.powerlevelMultiplier}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            moves.map((move) => (
                              <div key={move.id} className="mb-4">
                                <p className="font-bold">{move.name}</p>
                                <p className="text-sm italic">{move.description}</p>
                                {move.percentDamage && (
                                  <p><strong>Damage:</strong> {move.percentDamage}%</p>
                                )}
                                {move.percentCost && (
                                  <p><strong>Cost:</strong> {move.percentCost}%</p>
                                )}
                                {move.chargeable && <p><strong>Chargeable</strong></p>}
                                {move.stunTurns && (
                                  <>
                                    <p><strong>Stun Turns:</strong> {move.stunTurns}</p>
                                    <p><strong>Stun Chance:</strong> {move.stunChancePercent}%</p>
                                  </>
                                )}
                                {move.powerlevelMultiplier && (
                                  <p><strong>Powerlevel Multiplier:</strong> x{move.powerlevelMultiplier}</p>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      ))}
                    </div>
                  ) : <p className="font-roboto italic">No attacks or abilities.</p>}
                </CardBody>
              </Card>
              {/* Misc Card */}
              <Card className="bg-pm-blue rounded shadow-md text-pm-white">
                <CardHeader className="border-b pb-2">
                  <h2 className="text-2xl font-anton text-pm-white">Misc</h2>
                </CardHeader>
                <CardBody>
                  {(character.died || character.deathCount || character.lastDateTrained ||
                    (character.race === 'Namekian' && character.lastDateMeditated)) ? (
                    <div>
                      {character.died && (
                        <p className="font-roboto"><strong>Last Death:</strong> {new Date(character.died).toLocaleString()}</p>
                      )}
                      {character.deathCount !== null && (
                        <p className="font-roboto"><strong>Number of Deaths:</strong> {character.deathCount}</p>
                      )}
                      {character.lastDateTrained && (
                        <p className="font-roboto"><strong>Last Date Trained:</strong> {new Date(character.lastDateTrained).toLocaleString()}</p>
                      )}
                      {character.race === 'Namekian' && character.lastDateMeditated && (
                        <p className="font-roboto"><strong>Last Date Meditated:</strong> {new Date(character.lastDateMeditated).toLocaleString()}</p>
                      )}
                    </div>
                  ) : <p className="font-roboto italic">No misc info.</p>}
                </CardBody>
              </Card>
            </div>
            {/* Modal and Admin button remain below the grid */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-roboto font-medium py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 mt-4"
            >
              View Power & Inventory
            </button>
            {isModalOpen && (
              <div className="modal fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="relative w-full h-full flex items-center justify-center">
                  <CharacterPhaserDisplayWithInventory characterData={character} mapData={mapData} />
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white font-roboto font-medium py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            {session?.user?.role === 'admin' && (
              <div className="mt-6">
                <Link href={`/admin/characters`}>
                  <Button variant="bordered" className="bg-orange-500 hover:bg-orange-600 text-white font-roboto">
                    Edit Character
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}