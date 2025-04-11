"use client";

import type React from "react";
import type { Character } from "../types/game-types";

interface GameOverProps {
  health: number;
  character: Character | null;
  inventory: string[];
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  health,
  character,
  inventory,
  onRestart,
}) => {
  const hasWon = health > 0;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">
        {hasWon ? "Félicitations !" : "Game Over"}
      </h1>
      <p className="text-xl mb-8">
        {hasWon
          ? "Vous avez terminé le tour du plateau !"
          : "Vous avez été vaincu..."}
      </p>

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mb-6">
        <h2 className="text-xl font-semibold mb-4">Résumé</h2>
        <p>Personnage : {character?.type}</p>
        <p>Points de vie restants : {health}</p>
        <p>Objets collectés : {inventory.length}</p>
      </div>

      <button
        onClick={onRestart}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
      >
        Rejouer
      </button>
    </div>
  );
};
