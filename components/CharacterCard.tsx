import { Character } from '@prisma/client';

type Props = {
  character: Character;
};

export function CharacterCard({ character }: Props) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl">{character.name}</h2>
      <p>Level: {character.level}</p>
      <p>Health: {character.health}</p>
      <p>Energy: {character.energy}</p>
      <p>Strength: {character.strength}</p>
      <p>Speed: {character.speed}</p>
    </div>
  );
}