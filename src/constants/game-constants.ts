// Types de cases
export const TILE_TYPES = {
  START: "start",
  ITEM: "item",
  ENEMY: "enemy",
  HEAL: "heal",
  TRAP: "trap",
  TELEPORT: "teleport",
  EMPTY: "empty",
};

// Types d'objets à gagner
export const ITEM_TYPES = ["potion", "sword", "shield", "amulet", "scroll"];

// Descriptions des cases
export const TILE_DESCRIPTIONS = {
  [TILE_TYPES.START]:
    "Case de départ et d'arrivée. Terminez le tour complet pour gagner !",
  [TILE_TYPES.ITEM]:
    "Case d'objet. Vous y trouverez un équipement qui pourra vous aider.",
  [TILE_TYPES.ENEMY]: "Case d'ennemi. Préparez-vous au combat !",
  [TILE_TYPES.HEAL]: "Case de soin. Vous récupérez des points de vie.",
  [TILE_TYPES.TRAP]: "Case piège. Attention aux dégâts !",
  [TILE_TYPES.TELEPORT]:
    "Case de téléportation. Vous serez transporté à un autre endroit du plateau.",
  [TILE_TYPES.EMPTY]: "Case vide. Il ne se passe rien ici.",
};

// Types d'ennemis
export const ENEMY_TYPES = ["goblin", "skeleton", "ghost", "dragon", "witch"];

// Descriptions des ennemis
export const ENEMY_DESCRIPTIONS = {
  goblin: {
    name: "Gobelin",
    description: "Un petit monstre vicieux qui attaque en groupe.",
    weakness: "physical",
  },
  skeleton: {
    name: "Squelette",
    description: "Un mort-vivant résistant aux attaques physiques.",
    weakness: "magic",
  },
  ghost: {
    name: "Fantôme",
    description:
      "Un esprit qui peut traverser les murs et est quasi-invulnérable aux attaques physiques.",
    weakness: "magic",
  },
  dragon: {
    name: "Dragon",
    description: "Une créature gigantesque, crachant du feu et très puissante.",
    weakness: "physical",
  },
  witch: {
    name: "Sorcière",
    description: "Une magicienne qui lance des sortilèges dangereux.",
    weakness: "physical",
  },
};

// Couleurs pour les différentes cases
export const TILE_COLORS = {
  [TILE_TYPES.START]: "bg-green-500",
  [TILE_TYPES.ITEM]: "bg-amber-400",
  [TILE_TYPES.ENEMY]: "bg-red-500",
  [TILE_TYPES.HEAL]: "bg-blue-400",
  [TILE_TYPES.TRAP]: "bg-purple-500",
  [TILE_TYPES.TELEPORT]: "bg-indigo-500",
  [TILE_TYPES.EMPTY]: "bg-gray-300",
};

// Types de personnages
export const CHARACTER_TYPES = [
  {
    id: "magician",
    name: "Magicien",
    color: "blue",
    power: "magic",
    description: "Attaques magiques puissantes",
    damage: 20,
    baseDamage: 15,
  },
  {
    id: "warrior",
    name: "Guerrier",
    color: "red",
    power: "strength",
    description: "Force physique supérieure",
    damage: 25,
    baseDamage: 20,
  },
  {
    id: "vampire",
    name: "Vampire",
    color: "purple",
    power: "lifesteal",
    description: "Vol de vie",
    damage: 15,
    baseDamage: 12,
    lifeStealRatio: 0.3,
  },
];

// Définition des objets du jeu
export const GAME_ITEMS = {
  healingPotion: {
    id: "healingPotion",
    name: "Potion de soin",
    type: "potion",
    description: "Restaure 30 points de vie.",
    effect: {
      type: "heal",
      value: 30,
      uses: 1,
    },
    usableInCombat: true,
    icon: "❤️",
  },
  greaterHealingPotion: {
    id: "greaterHealingPotion",
    name: "Grande potion de soin",
    type: "potion",
    description: "Restaure 50 points de vie.",
    effect: {
      type: "heal",
      value: 50,
      uses: 1,
    },
    usableInCombat: true,
    icon: "💖",
  },
  rustyDagger: {
    id: "rustyDagger",
    name: "Dague rouillée",
    type: "sword",
    description:
      "Une dague qui inflige +10 de dégâts. Peut être utilisée 3 fois.",
    effect: {
      type: "damage",
      value: 10,
      uses: 3,
    },
    usableInCombat: true,
    icon: "🗡️",
  },
  enchantedSword: {
    id: "enchantedSword",
    name: "Épée enchantée",
    type: "sword",
    description:
      "Une épée qui inflige +15 de dégâts. Peut être utilisée 5 fois.",
    effect: {
      type: "damage",
      value: 15,
      uses: 5,
    },
    usableInCombat: true,
    icon: "⚔️",
  },
  woodenShield: {
    id: "woodenShield",
    name: "Bouclier en bois",
    type: "shield",
    description: "Réduit les dégâts reçus de 5 points. A 4 utilisations.",
    effect: {
      type: "defense",
      value: 5,
      uses: 4,
    },
    usableInCombat: true,
    icon: "🛡️",
  },
  luckyAmulet: {
    id: "luckyAmulet",
    name: "Amulette de chance",
    type: "amulet",
    description:
      "Augmente vos chances de trouver des objets rares. Effet passif.",
    effect: {
      type: "special",
      value: 0,
    },
    usableInCombat: false,
    icon: "🔮",
  },
  fireScroll: {
    id: "fireScroll",
    name: "Parchemin de feu",
    type: "scroll",
    description:
      "Lance une boule de feu qui inflige 25 points de dégâts. Usage unique.",
    effect: {
      type: "damage",
      value: 25,
      uses: 1,
    },
    usableInCombat: true,
    icon: "📜",
  },
};

// Fonction pour obtenir un objet aléatoire
export const getRandomItem = () => {
  const items = Object.values(GAME_ITEMS);
  const randomIndex = Math.floor(Math.random() * items.length);
  const item = { ...items[randomIndex] };

  // Initialiser le nombre d'utilisations actuelles
  if (item.effect.uses) {
    item.effect.currentUses = item.effect.uses;
  }

  return item;
};
