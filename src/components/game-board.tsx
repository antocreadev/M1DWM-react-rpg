import type React from "react";
import { TileIcon } from "../components/tile-icon";
import { TILE_COLORS } from "../constants/game-constants";
import type { Tile, Character } from "../types/game-types";

interface GameBoardProps {
  board: Tile[];
  character: Character | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({ board, character }) => {
  const size = 7;
  const cells = [];

  // Créer une grille vide
  const grid = Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));

  // Placer les cases du plateau dans la grille
  board.forEach((tile) => {
    grid[tile.row][tile.col] = tile;
  });

  // Générer les cellules de la grille
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const tile = grid[i][j];
      const isEdge = i === 0 || j === 0 || i === size - 1 || j === size - 1;

      if (isEdge) {
        cells.push(
          <div
            key={`${i}-${j}`}
            className={`w-16 h-16 border border-gray-400 flex items-center justify-center ${
              tile ? TILE_COLORS[tile.type] : "bg-gray-200"
            } ${
              tile?.isHighlighted
                ? "ring-4 ring-yellow-400 ring-opacity-75"
                : ""
            }`}
          >
            {tile && tile.isActive && (
              <div
                className={`w-8 h-8 rounded-full bg-${character?.color}-600 flex items-center justify-center text-white font-bold animate-bounce`}
              >
                P
              </div>
            )}
            {!tile?.isActive && tile && <TileIcon type={tile.type} />}
            {!tile && (
              <span className="text-xs text-gray-400">
                {i},{j}
              </span>
            )}
          </div>
        );
      } else {
        cells.push(
          <div
            key={`${i}-${j}`}
            className="w-16 h-16 border border-gray-200 bg-white"
          >
            <span className="text-xs text-gray-300">
              {i},{j}
            </span>
          </div>
        );
      }
    }
  }

  return (
    <div className="grid grid-cols-7 gap-1 p-4 bg-gray-100 rounded-lg">
      {cells}
    </div>
  );
};
