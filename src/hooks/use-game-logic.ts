"use client";

import { useState, useEffect, useCallback } from "react";
import { createBoard } from "../utils/board-utils";
import {
  TILE_TYPES,
  CHARACTER_TYPES,
  ENEMY_DESCRIPTIONS,
  TILE_DESCRIPTIONS,
  GAME_ITEMS,
} from "../constants/game-constants";
import type {
  Tile,
  Character,
  Enemy,
  GameState,
  AnimationState,
  ModalState,
  Item,
} from "../types/game-types";

// Délais pour les animations (en ms)
const DICE_ROLL_DELAY = 100;
const MOVE_DELAY = 500;
const TILE_EFFECT_DELAY = 1000;
const COMBAT_ATTACK_DELAY = 1500;

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>("characterSelection");
  const [character, setCharacter] = useState<Character | null>(null);
  const [board, setBoard] = useState<Tile[]>([]);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [health, setHealth] = useState(100);
  const [isRolling, setIsRolling] = useState(false);
  const [currentTile, setCurrentTile] = useState<Tile | null>(null);
  const [hasCompletedOneTurn, setHasCompletedOneTurn] = useState(false);

  // État du modal
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // État des animations
  const [animationState, setAnimationState] = useState<AnimationState>({
    isMoving: false,
    movePath: [],
    currentMoveIndex: 0,
    isTileEffectProcessing: false,
    isPlayerAttacking: false,
    isEnemyAttacking: false,
  });

  // Initialiser le plateau
  useEffect(() => {
    const newBoard = createBoard();
    setBoard(newBoard);

    // Activer la première case
    if (newBoard.length > 0) {
      const updatedBoard = [...newBoard];
      updatedBoard[0].isActive = true;
      setBoard(updatedBoard);
    }
  }, []);

  // Fonction pour sélectionner un personnage
  const selectCharacter = (type: string, color: string) => {
    const characterType = CHARACTER_TYPES.find((c) => c.name === type);
    if (characterType) {
      setCharacter({
        type,
        color,
        power: characterType.power as "magic" | "strength" | "lifesteal",
        baseDamage: characterType.baseDamage,
      });
      setGameState("playing");
      setMessage("Bienvenue sur le plateau ! Lancez les dés pour commencer.");
    }
  };

  // Fonction pour lancer les dés
  const rollDice = () => {
    if (
      isRolling ||
      animationState.isMoving ||
      animationState.isTileEffectProcessing ||
      gameState !== "playing"
    )
      return;

    setIsRolling(true);
    setMessage("Lancement des dés...");

    // Animation de lancement de dés
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 6) + 1);
      rollCount++;

      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const finalResult = Math.floor(Math.random() * 6) + 1;
        setDiceResult(finalResult);
        setIsRolling(false);

        // Préparer le chemin de déplacement
        prepareMovePath(finalResult);
      }
    }, DICE_ROLL_DELAY);
  };

  // Préparer le chemin de déplacement
  const prepareMovePath = (steps: number) => {
    const path = [];

    // Calculer les positions pour chaque étape du déplacement
    for (let i = 1; i <= steps; i++) {
      const nextPosition = (playerPosition + i) % board.length;
      path.push(nextPosition);

      // Si on passe par la case départ (mais pas au début du jeu)
      if (nextPosition === 0 && playerPosition > 0) {
        setHasCompletedOneTurn(true);
      }
    }

    setAnimationState({
      ...animationState,
      isMoving: true,
      movePath: path,
      currentMoveIndex: 0,
    });

    setGameState("moving");
    setMessage(`Vous avancez de ${steps} cases...`);
  };

  // Effet pour gérer le déplacement progressif
  useEffect(() => {
    if (gameState !== "moving" || !animationState.isMoving) return;

    const moveInterval = setInterval(() => {
      const { movePath, currentMoveIndex } = animationState;

      if (currentMoveIndex < movePath.length) {
        // Mettre à jour la position du joueur
        const newPosition = movePath[currentMoveIndex];
        setPlayerPosition(newPosition);

        // Mettre à jour l'état du plateau
        const newBoard = [...board];
        newBoard.forEach((tile) => (tile.isActive = false));
        newBoard[newPosition].isActive = true;

        // Mettre en évidence la case actuelle
        newBoard.forEach((tile) => (tile.isHighlighted = false));
        newBoard[newPosition].isHighlighted = true;

        setBoard(newBoard);

        // Passer à la prochaine étape
        setAnimationState({
          ...animationState,
          currentMoveIndex: currentMoveIndex + 1,
        });

        // Si c'est la dernière étape, préparer l'effet de la case
        if (currentMoveIndex === movePath.length - 1) {
          setAnimationState({
            ...animationState,
            isMoving: false,
            isTileEffectProcessing: true,
          });

          setTimeout(() => {
            const tileAtPosition = newBoard[newPosition];
            setCurrentTile(tileAtPosition);

            // On passe à l'état modal pour afficher l'info sur la case
            showTileModal(tileAtPosition, newPosition);
          }, MOVE_DELAY);
        }
      }
    }, MOVE_DELAY);

    return () => clearInterval(moveInterval);
  }, [gameState, animationState, board, playerPosition]);

  // Afficher un modal pour expliquer l'effet de la case
  const showTileModal = (tile: Tile, position: number) => {
    const tileDescription =
      tile.data.description || TILE_DESCRIPTIONS[tile.type];

    // Si on est sur la case départ après avoir fait un tour complet
    if (
      tile.type === TILE_TYPES.START &&
      position === 0 &&
      hasCompletedOneTurn
    ) {
      setModalState({
        isOpen: true,
        title: "Victoire !",
        message: "Félicitations ! Vous avez terminé le tour du plateau !",
        onConfirm: () => {
          closeModal();
          setGameState("gameOver");
        },
      });
      return;
    }

    let modalTitle = "";
    switch (tile.type) {
      case TILE_TYPES.START:
        modalTitle = "Case de départ";
        break;
      case TILE_TYPES.ITEM:
        modalTitle = "Case d'objet";
        break;
      case TILE_TYPES.ENEMY:
        modalTitle = "Case d'ennemi";
        break;
      case TILE_TYPES.HEAL:
        modalTitle = "Case de soin";
        break;
      case TILE_TYPES.TRAP:
        modalTitle = "Case piège";
        break;
      case TILE_TYPES.TELEPORT:
        modalTitle = "Case de téléportation";
        break;
      default:
        modalTitle = "Case";
    }

    setModalState({
      isOpen: true,
      title: modalTitle,
      message: tileDescription,
      tileType: tile.type,
      onConfirm: () => {
        // Après confirmation, traiter l'effet de la case
        closeModal();
        setGameState("tileEffect");
        processTileEffect(tile);
      },
    });
  };

  // Fonction pour fermer le modal
  const closeModal = () => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  // Fonction pour traiter l'effet d'une case
  const processTileEffect = useCallback(
    (tile: Tile) => {
      // Désactiver la mise en évidence
      const newBoard = [...board];
      newBoard.forEach((t) => (t.isHighlighted = false));
      setBoard(newBoard);

      switch (tile.type) {
        case TILE_TYPES.START:
          if (playerPosition === 0 && hasCompletedOneTurn) {
            setMessage(
              "Félicitations ! Vous avez terminé le tour du plateau !"
            );
            setTimeout(() => {
              setAnimationState((prev) => ({
                ...prev,
                isTileEffectProcessing: false,
              }));
              setGameState("gameOver");
            }, TILE_EFFECT_DELAY);
          } else {
            setMessage("Vous êtes sur la case départ.");
            setTimeout(() => {
              setAnimationState((prev) => ({
                ...prev,
                isTileEffectProcessing: false,
              }));
              setGameState("playing");
            }, TILE_EFFECT_DELAY);
          }
          break;

        case TILE_TYPES.ITEM:
          // Sélectionner un objet aléatoire parmi les objets disponibles
          const itemKeys = Object.keys(GAME_ITEMS);
          const randomItemKey =
            itemKeys[Math.floor(Math.random() * itemKeys.length)];
          const randomItem = {
            ...GAME_ITEMS[randomItemKey as keyof typeof GAME_ITEMS],
          };

          // Initialiser le nombre d'utilisations si nécessaire
          if (randomItem.effect.uses) {
            randomItem.effect.currentUses = randomItem.effect.uses;
          }

          setInventory((prev) => [...prev, randomItem]);
          setMessage(`Vous avez trouvé un(e) ${randomItem.name} !`);
          setTimeout(() => {
            setAnimationState((prev) => ({
              ...prev,
              isTileEffectProcessing: false,
            }));
            setGameState("playing");
          }, TILE_EFFECT_DELAY);
          break;

        case TILE_TYPES.ENEMY:
          if (tile.data.enemyType) {
            const enemyInfo =
              ENEMY_DESCRIPTIONS[
                tile.data.enemyType as keyof typeof ENEMY_DESCRIPTIONS
              ];
            const enemyHealth = 50 + Math.floor(Math.random() * 50);
            setMessage(
              `Vous rencontrez un ${tile.data.enemyType} ! Préparez-vous au combat !`
            );
            setEnemy({
              type: tile.data.enemyType,
              health: enemyHealth,
              maxHealth: enemyHealth,
              power: 10 + Math.floor(Math.random() * 10),
              weakness: enemyInfo
                ? (enemyInfo.weakness as "magic" | "physical" | "none")
                : "none",
            });
            setTimeout(() => {
              setAnimationState((prev) => ({
                ...prev,
                isTileEffectProcessing: false,
              }));
              setGameState("combat");
            }, TILE_EFFECT_DELAY);
          }
          break;

        case TILE_TYPES.HEAL:
          const healAmount = 20 + Math.floor(Math.random() * 20);
          setHealth((prev) => {
            const newHealth = Math.min(100, prev + healAmount);
            return newHealth;
          });
          setMessage(`Vous vous soignez de ${healAmount} points de vie !`);
          setTimeout(() => {
            setAnimationState((prev) => ({
              ...prev,
              isTileEffectProcessing: false,
            }));
            setGameState("playing");
          }, TILE_EFFECT_DELAY);
          break;

        case TILE_TYPES.TRAP:
          const damage = 10 + Math.floor(Math.random() * 15);
          setHealth((prev) => {
            const newHealth = Math.max(0, prev - damage);
            if (newHealth <= 0) {
              setTimeout(() => {
                setAnimationState((prev) => ({
                  ...prev,
                  isTileEffectProcessing: false,
                }));
                setGameState("gameOver");
              }, TILE_EFFECT_DELAY);
            } else {
              setTimeout(() => {
                setAnimationState((prev) => ({
                  ...prev,
                  isTileEffectProcessing: false,
                }));
                setGameState("playing");
              }, TILE_EFFECT_DELAY);
            }
            return newHealth;
          });
          setMessage(
            `Vous tombez dans un piège ! Vous perdez ${damage} points de vie.`
          );
          break;

        case TILE_TYPES.TELEPORT:
          if (typeof tile.data.destination === "number") {
            const destination = tile.data.destination;
            setMessage(`Vous êtes téléporté à une autre position du plateau !`);

            setTimeout(() => {
              setPlayerPosition(destination);

              // Mettre à jour l'état du plateau après téléportation
              const teleportBoard = [...board];
              teleportBoard.forEach((t) => (t.isActive = false));
              teleportBoard[destination].isActive = true;
              setBoard(teleportBoard);

              setAnimationState((prev) => ({
                ...prev,
                isTileEffectProcessing: false,
              }));
              setGameState("playing");
            }, TILE_EFFECT_DELAY);
          }
          break;

        default:
          setMessage("Vous êtes sur une case vide.");
          setTimeout(() => {
            setAnimationState((prev) => ({
              ...prev,
              isTileEffectProcessing: false,
            }));
            setGameState("playing");
          }, TILE_EFFECT_DELAY);
      }
    },
    [board, health, playerPosition, hasCompletedOneTurn]
  );

  // Fonction pour utiliser un objet
  const useItem = (item: Item) => {
    if (!item) return;

    // Si on est en combat
    if (gameState === "combat") {
      setGameState("playerUseItem");
      setAnimationState({
        ...animationState,
        isPlayerAttacking: true,
      });

      // Traiter l'effet de l'objet
      switch (item.effect.type) {
        case "heal":
          setHealth((prev) => Math.min(100, prev + item.effect.value));
          setMessage(
            `Vous utilisez ${item.name} et récupérez ${item.effect.value} points de vie.`
          );
          break;

        case "damage":
          if (enemy) {
            // Vérifier si l'ennemi a une faiblesse qui peut être exploitée
            let damageMultiplier = 1;
            if (enemy.weakness === "magic" && character?.power === "magic") {
              damageMultiplier = 1.5;
              setMessage(
                `${item.name} est super efficace contre ${enemy.type} !`
              );
            } else if (
              enemy.weakness === "physical" &&
              character?.power === "strength"
            ) {
              damageMultiplier = 1.5;
              setMessage(
                `${item.name} est super efficace contre ${enemy.type} !`
              );
            }

            const damage = Math.round(item.effect.value * damageMultiplier);
            const newEnemyHealth = Math.max(0, enemy.health - damage);
            setEnemy({ ...enemy, health: newEnemyHealth });
            setMessage(
              `Vous utilisez ${item.name} et infligez ${damage} points de dégâts à l'ennemi.`
            );

            // Vérifier si l'ennemi est vaincu
            if (newEnemyHealth <= 0) {
              setTimeout(() => {
                setAnimationState({
                  ...animationState,
                  isPlayerAttacking: false,
                });
                setMessage(`Vous avez vaincu le ${enemy.type} !`);
                setGameState("playing");
                return;
              }, COMBAT_ATTACK_DELAY);
            } else {
              // Passer à l'attaque de l'ennemi
              setTimeout(() => {
                setAnimationState({
                  ...animationState,
                  isPlayerAttacking: false,
                  isEnemyAttacking: true,
                });
                setGameState("enemyAttack");
                enemyAttack();
              }, COMBAT_ATTACK_DELAY);
            }
          }
          break;

        case "defense":
          setMessage(
            `Vous utilisez ${item.name} et vous êtes protégé contre la prochaine attaque.`
          );
          setTimeout(() => {
            setAnimationState({
              ...animationState,
              isPlayerAttacking: false,
            });
            setGameState("combat");
          }, COMBAT_ATTACK_DELAY);
          break;

        default:
          setMessage(`Vous utilisez ${item.name}.`);
          setTimeout(() => {
            setAnimationState({
              ...animationState,
              isPlayerAttacking: false,
            });
            setGameState("combat");
          }, COMBAT_ATTACK_DELAY);
      }

      // Mettre à jour l'inventaire - décrémenter le nombre d'utilisations
      updateInventoryAfterUse(item);
    } else {
      // Si on n'est pas en combat
      switch (item.effect.type) {
        case "heal":
          setHealth((prev) => Math.min(100, prev + item.effect.value));
          setMessage(
            `Vous utilisez ${item.name} et récupérez ${item.effect.value} points de vie.`
          );
          break;
        default:
          setMessage(
            `Vous utilisez ${item.name}, mais cela n'a aucun effet pour le moment.`
          );
      }

      // Mettre à jour l'inventaire
      updateInventoryAfterUse(item);
    }
  };

  // Mettre à jour l'inventaire après utilisation d'un objet
  const updateInventoryAfterUse = (usedItem: Item) => {
    const updatedInventory = [...inventory];
    const itemIndex = updatedInventory.findIndex(
      (item) =>
        item.id === usedItem.id &&
        item.effect.currentUses === usedItem.effect.currentUses
    );

    if (itemIndex !== -1) {
      // Si l'objet a un nombre d'utilisations limité
      if (usedItem.effect.uses && usedItem.effect.currentUses !== undefined) {
        const newUses = usedItem.effect.currentUses - 1;
        if (newUses <= 0) {
          // L'objet est épuisé, le retirer de l'inventaire
          updatedInventory.splice(itemIndex, 1);
        } else {
          // Décrémenter le nombre d'utilisations
          updatedInventory[itemIndex] = {
            ...usedItem,
            effect: {
              ...usedItem.effect,
              currentUses: newUses,
            },
          };
        }
      } else if (usedItem.effect.uses === 1) {
        // Si l'objet est à usage unique
        updatedInventory.splice(itemIndex, 1);
      }
    }

    setInventory(updatedInventory);
  };

  // Attaque de l'ennemi
  const enemyAttack = () => {
    if (!enemy) return;

    setTimeout(() => {
      const enemyDamage = enemy.power;
      setMessage(`Le ${enemy.type} vous attaque !`);

      setTimeout(() => {
        // Appliquer les dégâts
        if (character?.type === "Vampire") {
          const healAmount = Math.floor(character.baseDamage * 0.3);
          const newHealth = Math.max(0, health - enemyDamage);
          setHealth(Math.min(100, newHealth + healAmount));
          setMessage(
            `Le ${enemy.type} vous inflige ${enemyDamage} points de dégâts mais vous regagnez ${healAmount} points de vie grâce à votre vol de vie.`
          );
        } else {
          const newHealth = Math.max(0, health - enemyDamage);
          setHealth(newHealth);
          setMessage(
            `Le ${enemy.type} vous inflige ${enemyDamage} points de dégâts.`
          );

          if (newHealth <= 0) {
            setTimeout(() => {
              setGameState("gameOver");
            }, COMBAT_ATTACK_DELAY / 2);
            return;
          }
        }

        setTimeout(() => {
          setAnimationState({
            ...animationState,
            isEnemyAttacking: false,
          });
          setGameState("combat");
        }, COMBAT_ATTACK_DELAY / 2);
      }, COMBAT_ATTACK_DELAY);
    }, COMBAT_ATTACK_DELAY / 2);
  };

  // Fonction pour attaquer l'ennemi
  const attackEnemy = () => {
    if (
      !enemy ||
      !character ||
      animationState.isPlayerAttacking ||
      animationState.isEnemyAttacking
    )
      return;

    // Passer à l'état d'attaque du joueur
    setGameState("playerAttack");
    setAnimationState({
      ...animationState,
      isPlayerAttacking: true,
    });

    // Trouver le personnage dans la liste des types
    const characterConfig = CHARACTER_TYPES.find(
      (c) => c.name === character.type
    );
    if (!characterConfig) return;

    // Calculer les dégâts en fonction du type de personnage
    const damage = characterConfig.damage;

    // Vérifier si l'ennemi a une faiblesse qui peut être exploitée
    let damageMultiplier = 1;
    if (enemy.weakness === "magic" && character.power === "magic") {
      damageMultiplier = 1.5;
      setMessage(
        `Votre attaque magique est super efficace contre ${enemy.type} !`
      );
    } else if (
      enemy.weakness === "physical" &&
      character.power === "strength"
    ) {
      damageMultiplier = 1.5;
      setMessage(
        `Votre attaque physique est super efficace contre ${enemy.type} !`
      );
    } else {
      setMessage(`Vous attaquez le ${enemy.type} !`);
    }

    const finalDamage = Math.round(damage * damageMultiplier);

    // Attendre que l'animation d'attaque se termine
    setTimeout(() => {
      const newEnemyHealth = Math.max(0, enemy.health - finalDamage);
      setEnemy({ ...enemy, health: newEnemyHealth });
      setMessage(`Vous infligez ${finalDamage} points de dégâts à l'ennemi !`);

      setAnimationState({
        ...animationState,
        isPlayerAttacking: false,
      });

      if (newEnemyHealth <= 0) {
        setTimeout(() => {
          setMessage(`Vous avez vaincu le ${enemy.type} !`);
          setGameState("playing");
        }, COMBAT_ATTACK_DELAY / 2);
        return;
      }

      // Passer à l'attaque de l'ennemi
      setTimeout(() => {
        setGameState("enemyAttack");
        setAnimationState({
          ...animationState,
          isEnemyAttacking: true,
        });
        enemyAttack();
      }, COMBAT_ATTACK_DELAY);
    }, COMBAT_ATTACK_DELAY);
  };

  // Fonction pour recommencer le jeu
  const restartGame = () => {
    setGameState("characterSelection");
    setBoard(createBoard());
    setPlayerPosition(0);
    setDiceResult(null);
    setMessage("");
    setEnemy(null);
    setInventory([]);
    setHealth(100);
    setHasCompletedOneTurn(false);
    setAnimationState({
      isMoving: false,
      movePath: [],
      currentMoveIndex: 0,
      isTileEffectProcessing: false,
      isPlayerAttacking: false,
      isEnemyAttacking: false,
    });
  };

  return {
    gameState,
    character,
    board,
    playerPosition,
    diceResult,
    message,
    enemy,
    inventory,
    health,
    isRolling,
    animationState,
    modalState,
    currentTile,
    selectCharacter,
    rollDice,
    attackEnemy,
    useItem,
    restartGame,
    closeModal,
  };
};
