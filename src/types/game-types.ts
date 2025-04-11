import type { TILE_TYPES } from "../constants/game-constants";

export type TileType = (typeof TILE_TYPES)[keyof typeof TILE_TYPES];
export type ItemType = "potion" | "sword" | "shield" | "amulet" | "scroll";
export type EnemyType = "goblin" | "skeleton" | "ghost" | "dragon" | "witch";
export type GameState =
  | "characterSelection"
  | "playing"
  | "moving"
  | "tileEffect"
  | "tileModal"
  | "combat"
  | "playerAttack"
  | "playerUseItem"
  | "enemyAttack"
  | "gameOver";

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  effect: {
    type: "heal" | "damage" | "defense" | "special";
    value: number;
    uses?: number;
    currentUses?: number;
  };
  usableInCombat: boolean;
  icon: string;
}

export interface Tile {
  id: number;
  type: TileType;
  row: number;
  col: number;
  isActive: boolean;
  isHighlighted?: boolean;
  data: {
    itemType?: ItemType;
    enemyType?: EnemyType;
    destination?: number;
    description?: string;
  };
}

export interface Character {
  type: string;
  color: string;
  power: "magic" | "strength" | "lifesteal";
  baseDamage: number;
}

export interface Enemy {
  type: EnemyType;
  health: number;
  maxHealth: number;
  power: number;
  isAttacking?: boolean;
  weakness?: "magic" | "physical" | "none";
}

export interface AnimationState {
  isMoving: boolean;
  movePath: number[];
  currentMoveIndex: number;
  isTileEffectProcessing: boolean;
  isPlayerAttacking: boolean;
  isEnemyAttacking: boolean;
}

export interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  tileType?: TileType;
  onConfirm: () => void;
}
