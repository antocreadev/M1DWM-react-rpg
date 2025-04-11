import type React from "react";
import {
  Heart,
  Skull,
  Gift,
  Sparkles,
  ArrowRight,
  Crosshair,
} from "lucide-react";
import { TILE_TYPES } from "../constants/game-constants";
import type { TileType } from "../types/game-types";

interface TileIconProps {
  type: TileType | undefined;
}

export const TileIcon: React.FC<TileIconProps> = ({ type }) => {
  switch (type) {
    case TILE_TYPES.START:
      return <ArrowRight className="text-white" />;
    case TILE_TYPES.ITEM:
      return <Gift className="text-white" />;
    case TILE_TYPES.ENEMY:
      return <Skull className="text-white" />;
    case TILE_TYPES.HEAL:
      return <Heart className="text-white" />;
    case TILE_TYPES.TRAP:
      return <Crosshair className="text-white" />;
    case TILE_TYPES.TELEPORT:
      return <Sparkles className="text-white" />;
    default:
      return null;
  }
};
