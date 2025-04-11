"use client";

import type React from "react";
import type { Character, Item } from "../types/game-types";

interface PlayerStatusProps {
  character: Character | null;
  health: number;
  inventory: Item[];
  onOpenInventory: () => void;
}

export const PlayerStatus: React.FC<PlayerStatusProps> = ({
  character,
  health,
  inventory,
  onOpenInventory,
}) => {
  const getInventoryPreview = () => {
    if (inventory.length === 0) {
      return <p className="text-gray-500">Aucun objet</p>;
    }

    // Regrouper les objets similaires et compter leur nombre
    const itemCounts: Record<string, { item: Item; count: number }> = {};
    inventory.forEach((item) => {
      const key = item.id;
      if (!itemCounts[key]) {
        itemCounts[key] = { item, count: 1 };
      } else {
        itemCounts[key].count++;
      }
    });

    return (
      <>
        <div className="flex flex-wrap gap-2 mb-2">
          {Object.values(itemCounts)
            .slice(0, 3)
            .map((entry) => (
              <div
                key={entry.item.id}
                className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm"
              >
                <span>{entry.item.icon}</span>
                <span>{entry.item.name}</span>
                {entry.count > 1 && (
                  <span className="text-xs">({entry.count})</span>
                )}
              </div>
            ))}
        </div>
        {inventory.length > 3 && (
          <p className="text-xs text-gray-500">
            + {inventory.length - 3} autre{inventory.length - 3 > 1 ? "s" : ""}{" "}
            objet
            {inventory.length - 3 > 1 ? "s" : ""}
          </p>
        )}
        <button
          onClick={onOpenInventory}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none"
        >
          Voir tout l'inventaire
        </button>
      </>
    );
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">État du joueur</h2>
        <div className="flex items-center mb-2">
          <div
            className={`w-10 h-10 rounded-full bg-${character?.color}-600 mr-3 flex items-center justify-center text-white font-bold`}
          >
            {character?.type[0]}
          </div>
          <div className="flex-1">
            <p className="font-semibold">{character?.type}</p>
            <div className="flex items-center">
              <div className="bg-gray-200 h-4 w-32 rounded-full mr-2">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${health}%` }}
                ></div>
              </div>
              <span className="text-sm">{health}/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Inventaire</h2>
        {getInventoryPreview()}
      </div>
    </div>
  );
};
