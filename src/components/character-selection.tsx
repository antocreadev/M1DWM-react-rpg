"use client";

import type React from "react";
import { CHARACTER_TYPES } from "../constants/game-constants";

interface CharacterSelectionProps {
  onSelectCharacter: (type: string, color: string) => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  onSelectCharacter,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">RPG Board Game</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">
          Choisissez votre personnage
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {CHARACTER_TYPES.map((character) => (
            <button
              key={character.id}
              onClick={() => onSelectCharacter(character.name, character.color)}
              className={`flex flex-col items-center p-4 border rounded-lg hover:bg-${character.color}-100`}
            >
              <div
                className={`w-16 h-16 rounded-full bg-${character.color}-500 mb-2 flex items-center justify-center text-white text-2xl`}
              >
                {character.name[0]}
              </div>
              <span>{character.name}</span>
              <span className="text-xs text-gray-500">
                {character.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
