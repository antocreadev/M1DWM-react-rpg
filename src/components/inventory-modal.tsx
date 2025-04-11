import type React from "react";

import { useState } from "react";
import { Modal } from "./modal";
import type { Item } from "../types/game-types";
import {
  Shield,
  Sword,
  FlaskRoundIcon as Flask,
  Scroll,
  Gem,
} from "lucide-react";

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Item[];
  onUseItem: (item: Item) => void;
  inCombat?: boolean;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onUseItem,
  inCombat = false,
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleUseItem = () => {
    if (selectedItem) {
      onUseItem(selectedItem);
      setSelectedItem(null);
      onClose();
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case "potion":
        return <Flask className="text-blue-500" size={20} />;
      case "sword":
        return <Sword className="text-red-500" size={20} />;
      case "shield":
        return <Shield className="text-green-500" size={20} />;
      case "amulet":
        return <Gem className="text-purple-500" size={20} />;
      case "scroll":
        return <Scroll className="text-amber-500" size={20} />;
      default:
        return null;
    }
  };

  // Filtrer les objets utilisables en combat si nécessaire
  const filteredInventory = inCombat
    ? inventory.filter((item) => item.usableInCombat)
    : inventory;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inventaire"
      actionLabel={selectedItem ? "Utiliser" : "Fermer"}
      onAction={selectedItem ? handleUseItem : onClose}
    >
      {filteredInventory.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          {inCombat
            ? "Aucun objet utilisable en combat"
            : "Votre inventaire est vide"}
        </p>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          {filteredInventory.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedItem === item
                  ? "bg-blue-50 border-blue-300"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1">{renderIcon(item.type)}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  {item.effect.uses && item.effect.currentUses && (
                    <p className="text-xs text-gray-500 mt-1">
                      Utilisations restantes: {item.effect.currentUses}/
                      {item.effect.uses}
                    </p>
                  )}
                </div>
                <div className="text-2xl">{item.icon}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};
