import type React from "react";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

interface DiceProps {
  value: number | null;
  size?: number;
}

export const Dice: React.FC<DiceProps> = ({ value, size = 48 }) => {
  if (!value) return null;

  switch (value) {
    case 1:
      return <Dice1 size={size} />;
    case 2:
      return <Dice2 size={size} />;
    case 3:
      return <Dice3 size={size} />;
    case 4:
      return <Dice4 size={size} />;
    case 5:
      return <Dice5 size={size} />;
    case 6:
      return <Dice6 size={size} />;
    default:
      return null;
  }
};
