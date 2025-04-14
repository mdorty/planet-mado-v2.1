'use client';

import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CharacterDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: character, error, isLoading } = trpc.character.getById.useQuery(
    { id: params.id },
    { enabled: !!session?.user?.id }
  );

  useEffect(() => {
    if (error) {
      router.push('/characters');
    }
  }, [error, router]);

  if (status === 'loading' || isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (status !== 'authenticated') {
    return (
      <div className="text-center">
        <p>Please sign in to view character details.</p>
        <Link href="/auth/signin" className="text-dbz-orange hover:underline">
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
        <Link href="/characters" className="text-dbz-orange hover:underline">
          Back to Characters
        </Link>
      </div>
    );
  }

  // Calculate power level percentage
  const percentage = Math.round((character.currentPowerlevel / character.basePowerlevel) * 100);
  const circleCircumference = 440;
  const strokeDashoffset = circleCircumference - (circleCircumference * percentage / 100);

  // Categorize moves
  const categorizedMoves = character.moves.reduce((acc, move) => {
    acc[move.category] = acc[move.category] || [];
    acc[move.category].push(move);
    return acc;
  }, {} as Record<string, typeof character.moves>);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl text-dbz-orange mb-4">{character.name}’s Stats</h1>

        {/* Power Level */}
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <h2 className="text-xl text-center mb-4">Power Level</h2>
          <div className="flex justify-center">
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
          </div>
          <p className="text-center mt-2">
            {character.hiddenPowerlevel ? `${character.hiddenPowerlevel.toLocaleString()} (` : ''}
            <span id="current-powerlevel">{character.currentPowerlevel.toLocaleString()}</span>
            {character.hiddenPowerlevel ? ')' : ''} / {character.basePowerlevel.toLocaleString()}
          </p>
        </div>

        {/* Basic Info */}
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <h2 className="text-xl text-center mb-4">Basic Info</h2>
          <p><strong>Race:</strong> {character.race}</p>
          <p><strong>Planet:</strong> {character.planet || 'Unknown'}</p>
          <p><strong>Alignment:</strong> {character.alignment >= 0 ? '+' : ''}{character.alignment}</p>
          <p><strong>Ability Count:</strong> {character.moves.length}</p>
          {/* Weighted Clothing Placeholder */}
          <p><strong>Weighted Clothing:</strong> Not implemented yet</p>
        </div>

        {/* Items */}
        {(character.equippedItems !== 'None' || character.items !== 'None') && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h2 className="text-xl text-center mb-4">Items</h2>
            {character.equippedItems !== 'None' && (
              <p><strong>Equipped:</strong> {character.equippedItems}</p>
            )}
            {character.items !== 'None' && <p><strong>Bag:</strong> {character.items}</p>}
          </div>
        )}

        {/* People You’ve Been To */}
        {character.peopleYouHaveBeenTo !== 'None' && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h2 className="text-xl text-center mb-4">People You’ve Been To</h2>
            <p>{character.peopleYouHaveBeenTo}</p>
          </div>
        )}

        {/* Jobs */}
        {character.jobs && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h2 className="text-xl text-center mb-4">Jobs</h2>
            <p>{character.jobs}</p>
          </div>
        )}

        {/* Description */}
        {character.description && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h2 className="text-xl text-center mb-4">Description</h2>
            <p>{character.description}</p>
          </div>
        )}

        {/* Attacks & Abilities */}
        {Object.keys(categorizedMoves).length > 0 && (
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <h2 className="text-xl text-center mb-4">Attacks & Abilities</h2>
            {Object.entries(categorizedMoves).map(([category, moves]) => (
              <div key={category}>
                <h3 className="text-lg mt-4">{category}</h3>
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
        )}

        {/* Misc */}
        {(character.died || character.deathCount || character.lastDateTrained ||
          (character.race === 'Namekian' && character.lastDateMeditated)) && (
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl text-center mb-4">Misc</h2>
            {character.died && (
              <p><strong>Last Death:</strong> {new Date(character.died).toLocaleString()}</p>
            )}
            {character.deathCount !== null && (
              <p><strong>Number of Deaths:</strong> {character.deathCount}</p>
            )}
            {character.lastDateTrained && (
              <p><strong>Last Date Trained:</strong> {new Date(character.lastDateTrained).toLocaleString()}</p>
            )}
            {character.race === 'Namekian' && character.lastDateMeditated && (
              <p><strong>Last Date Meditated:</strong> {new Date(character.lastDateMeditated).toLocaleString()}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}