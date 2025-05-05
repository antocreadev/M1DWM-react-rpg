import { useGameLogic } from "../hooks/use-game-logic";
import { CharacterSelection } from "./character-selection";
import { GameBoard } from "./game-board";
import { PlayerStatus } from "./player-status";
import { CombatScreen } from "./combat-screen";
import { GameOver } from "./game-over";
import { Dice } from "./dice";
import { useState, useEffect } from "react";
import { InventoryModal } from "./inventory-modal";
import { Modal } from "./modal";

export default function RPGBoardGame() {
  const {
    gameState,
    character,
    board,
    diceResult,
    message,
    enemy,
    inventory,
    health,
    isRolling,
    animationState,
    modalState,
    selectCharacter,
    rollDice,
    attackEnemy,
    restartGame,
    useItem,
    closeModal,
  } = useGameLogic();

  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [previousGameState, setPreviousGameState] = useState<string | null>(
    null
  );

  // Effet pour fermer le modal d'inventaire et suivre les transitions d'état
  useEffect(() => {
    // Fermer le modal d'inventaire lorsqu'on quitte les états de combat
    if (
      gameState !== "combat" &&
      gameState !== "playerAttack" &&
      gameState !== "enemyAttack" &&
      gameState !== "playerUseItem"
    ) {
      setIsInventoryOpen(false);
    }

    // Suivre la transition d'état pour gérer le modal de combat
    if (previousGameState === "combat" && gameState === "playing") {
      // Force la fermeture du modal si on passe de combat à playing
      closeModal();
    }

    // Mettre à jour l'état précédent pour le prochain cycle
    setPreviousGameState(gameState);
  }, [gameState, closeModal]);

  // Écran de sélection du personnage
  if (gameState === "characterSelection") {
    return <CharacterSelection onSelectCharacter={selectCharacter} />;
  }

  // Écran de combat - seulement si un ennemi existe
  if (
    enemy && // Ajout de cette vérification pour ne jamais afficher l'écran de combat sans ennemi
    (gameState === "combat" ||
      gameState === "playerAttack" ||
      gameState === "enemyAttack" ||
      gameState === "playerUseItem")
  ) {
    return (
      <CombatScreen
        character={character}
        enemy={enemy}
        health={health}
        message={message}
        inventory={inventory}
        onAttack={attackEnemy}
        onUseItem={useItem}
        isPlayerAttacking={animationState.isPlayerAttacking}
        isEnemyAttacking={animationState.isEnemyAttacking}
      />
    );
  }

  // Écran de fin de jeu
  if (gameState === "gameOver") {
    return (
      <GameOver
        health={health}
        character={character}
        inventory={inventory.map((item) => item.name)}
        onRestart={restartGame}
      />
    );
  }

  // Écran principal du jeu (inclut les états "playing", "moving", "tileEffect", "tileModal")
  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">RPG Board Game</h1>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
        <div className="md:w-2/3">
          <GameBoard board={board} character={character} />
        </div>

        <div className="md:w-1/3 bg-white p-4 rounded-lg shadow-lg">
          <PlayerStatus
            character={character}
            health={health}
            inventory={inventory}
            onOpenInventory={() => setIsInventoryOpen(true)}
          />

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Message</h2>
            <div className="bg-gray-100 p-3 rounded mb-4 min-h-[80px]">
              <p>{message}</p>
              {(animationState.isMoving ||
                animationState.isTileEffectProcessing) && (
                <div className="flex items-center mt-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce mr-1"></div>
                  <div
                    className="w-4 h-4 bg-blue-500 rounded-full animate-bounce mr-1"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Lancer de dés</h2>
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <Dice value={diceResult} />
              </div>
              <button
                onClick={rollDice}
                disabled={
                  isRolling ||
                  animationState.isMoving ||
                  animationState.isTileEffectProcessing ||
                  gameState !== "playing"
                }
                className={`px-4 py-2 ${
                  isRolling ||
                  animationState.isMoving ||
                  animationState.isTileEffectProcessing ||
                  gameState !== "playing"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-lg font-semibold transition-colors`}
              >
                {isRolling
                  ? "Lancement..."
                  : animationState.isMoving
                  ? "Déplacement en cours..."
                  : animationState.isTileEffectProcessing
                  ? "Action en cours..."
                  : "Lancer les dés"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour les effets de case */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        actionLabel="Continuer"
        onAction={modalState.onConfirm}
      >
        <p>{modalState.message}</p>
      </Modal>

      {/* Modal pour l'inventaire */}
      {gameState === "playing" && (
        <InventoryModal
          isOpen={isInventoryOpen}
          onClose={() => setIsInventoryOpen(false)}
          inventory={inventory}
          onUseItem={useItem}
        />
      )}
    </div>
  );
}
