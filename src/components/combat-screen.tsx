"use client";

import type React from "react";

import { useEffect, useState } from "react";
import type { Character, Enemy, Item } from "../types/game-types";
import { InventoryModal } from "../components/inventory-modal";
import { ENEMY_DESCRIPTIONS } from "../constants/game-constants";

interface CombatScreenProps {
  character: Character | null;
  enemy: Enemy | null;
  health: number;
  message: string;
  inventory: Item[];
  onAttack: () => void;
  onUseItem: (item: Item) => void;
  isPlayerAttacking: boolean;
  isEnemyAttacking: boolean;
}

export const CombatScreen: React.FC<CombatScreenProps> = ({
  character,
  enemy,
  health,
  message,
  inventory,
  onAttack,
  onUseItem,
  isPlayerAttacking,
  isEnemyAttacking,
}) => {
  const [combatLog, setCombatLog] = useState<string[]>([message]);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  useEffect(() => {
    setCombatLog((prev) => [...prev, message]);
    // Limiter le nombre de messages dans le log
    if (combatLog.length > 5) {
      setCombatLog((prev) => prev.slice(prev.length - 5));
    }
  }, [message]);

  const getEnemyDescription = (enemyType: string) => {
    return (
      ENEMY_DESCRIPTIONS[enemyType as keyof typeof ENEMY_DESCRIPTIONS]
        ?.description || "Un adversaire redoutable."
    );
  };

  const getWeaknessText = (weakness?: string) => {
    if (!weakness || weakness === "none") return "Aucune faiblesse connue.";
    if (weakness === "magic") return "Faiblesse contre la magie.";
    if (weakness === "physical")
      return "Faiblesse contre les attaques physiques.";
    return "Faiblesse inconnue.";
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-800 p-6">
      <h1 className="mb-8 text-3xl font-bold text-white">Combat !</h1>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-white md:col-span-2">
          <div className="flex justify-between mb-8">
            <div className="text-center">
              <div
                className={`w-24 h-24 rounded-full bg-${
                  character?.color
                }-600 mx-auto mb-2 flex items-center justify-center text-white text-3xl ${
                  isPlayerAttacking ? "animate-pulse scale-110" : ""
                }`}
              >
                {character?.type[0]}
              </div>
              <h3 className="text-lg font-semibold">{character?.type}</h3>
              <div className="mt-2">
                <div className="bg-gray-600 h-4 w-32 rounded-full">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${health}%` }}
                  ></div>
                </div>
                <span className="text-sm">{health}/100 PV</span>
              </div>
            </div>

            <div className="text-center">
              <div
                className={`w-24 h-24 rounded-full bg-red-700 mx-auto mb-2 flex items-center justify-center text-white text-3xl ${
                  isEnemyAttacking ? "animate-pulse scale-110" : ""
                }`}
              >
                {enemy?.type[0]}
              </div>
              <h3 className="text-lg font-semibold capitalize">
                {enemy?.type}
              </h3>
              <div className="mt-2">
                <div className="bg-gray-600 h-4 w-32 rounded-full">
                  <div
                    className="bg-red-500 h-4 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        enemy ? (enemy.health / enemy.maxHealth) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm">
                  {enemy?.health}/{enemy?.maxHealth} PV
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded mb-6 h-40 overflow-y-auto">
            {combatLog.map((log, index) => (
              <p
                key={index}
                className={`mb-2 ${
                  index === combatLog.length - 1
                    ? "text-white"
                    : "text-gray-400"
                }`}
              >
                {log}
              </p>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onAttack}
              disabled={isPlayerAttacking || isEnemyAttacking}
              className={`px-6 py-3 ${
                isPlayerAttacking || isEnemyAttacking
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              } text-white rounded-lg font-semibold transition-colors`}
            >
              {isPlayerAttacking
                ? "Attaque en cours..."
                : isEnemyAttacking
                ? "Ennemi attaque..."
                : "Attaquer"}
            </button>
            <button
              onClick={() => setIsInventoryOpen(true)}
              disabled={
                isPlayerAttacking ||
                isEnemyAttacking ||
                inventory.filter((i) => i.usableInCombat).length === 0
              }
              className={`px-6 py-3 ${
                isPlayerAttacking ||
                isEnemyAttacking ||
                inventory.filter((i) => i.usableInCombat).length === 0
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700"
              } text-white rounded-lg font-semibold transition-colors`}
            >
              Utiliser un objet
            </button>
          </div>
        </div>

        <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">
            Informations
          </h2>

          {enemy && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg capitalize">{enemy.type}</h3>
              <p className="text-sm mb-2">{getEnemyDescription(enemy.type)}</p>
              <p className="text-sm text-yellow-300">
                {getWeaknessText(enemy.weakness)}
              </p>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg">Inventaire</h3>
            {inventory.filter((i) => i.usableInCombat).length === 0 ? (
              <p className="text-sm text-gray-400">
                Pas d'objets utilisables en combat
              </p>
            ) : (
              <div className="mt-2 flex flex-wrap gap-2">
                {inventory
                  .filter((i) => i.usableInCombat)
                  .map((item) => (
                    <div
                      key={`${item.id}-${Math.random()}`}
                      className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded"
                    >
                      <span>{item.icon}</span>
                      <span className="text-xs">{item.name}</span>
                      {item.effect.currentUses && (
                        <span className="text-xs text-gray-400">
                          ({item.effect.currentUses})
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            )}
            <button
              onClick={() => setIsInventoryOpen(true)}
              className="mt-3 text-sm bg-gray-800 hover:bg-gray-900 rounded px-3 py-1.5 w-full"
            >
              Voir l'inventaire
            </button>
          </div>
        </div>
      </div>

      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        inventory={inventory}
        onUseItem={onUseItem}
        inCombat={true}
      />
    </div>
  );
};
