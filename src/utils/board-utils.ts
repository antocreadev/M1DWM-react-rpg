import {
  TILE_TYPES,
  ITEM_TYPES,
  ENEMY_TYPES,
  TILE_DESCRIPTIONS,
} from "../constants/game-constants";
import type { Tile } from "../types/game-types";

// Création du plateau de jeu
export const createBoard = (): Tile[] => {
  // Créer un plateau carré de 7x7
  const size = 7;
  const boardTiles: Tile[] = [];
  const totalTiles = (size - 1) * 4; // Nombre total de cases sur le bord du plateau

  // Créer les cases dans l'ordre du parcours (sens horaire à partir du coin supérieur gauche)
  for (let i = 0; i < totalTiles; i++) {
    let row = 0;
    let col = 0;

    // Déterminer les coordonnées (row, col) en fonction de l'indice i
    if (i < size) {
      // Bord supérieur (de gauche à droite)
      row = 0;
      col = i;
    } else if (i < size * 2 - 1) {
      // Bord droit (de haut en bas)
      row = i - size + 1;
      col = size - 1;
    } else if (i < size * 3 - 2) {
      // Bord inférieur (de droite à gauche)
      row = size - 1;
      col = size - 1 - (i - (size * 2 - 1));
    } else {
      // Bord gauche (de bas en haut)
      row = size - 1 - (i - (size * 3 - 2));
      col = 0;
    }

    // Déterminer le type de case aléatoirement
    let tileType = TILE_TYPES.EMPTY;
    const randomValue = Math.random();

    if (i === 0) {
      tileType = TILE_TYPES.START;
    } else if (randomValue < 0.25) {
      tileType = TILE_TYPES.ITEM;
    } else if (randomValue < 0.5) {
      tileType = TILE_TYPES.ENEMY;
    } else if (randomValue < 0.65) {
      tileType = TILE_TYPES.HEAL;
    } else if (randomValue < 0.8) {
      tileType = TILE_TYPES.TRAP;
    } else if (randomValue < 0.95) {
      tileType = TILE_TYPES.TELEPORT;
    } else {
      tileType = TILE_TYPES.EMPTY;
    }

    // Créer l'objet représentant la case
    boardTiles.push({
      id: i,
      type: tileType,
      row,
      col,
      isActive: i === 0, // La première case est active au début
      data: {
        itemType:
          tileType === TILE_TYPES.ITEM
            ? ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)]
            : undefined,
        enemyType:
          tileType === TILE_TYPES.ENEMY
            ? ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)]
            : undefined,
        destination:
          tileType === TILE_TYPES.TELEPORT
            ? Math.floor(Math.random() * totalTiles)
            : undefined,
        description: TILE_DESCRIPTIONS[tileType],
      },
    });
  }

  return boardTiles;
};
