import type {
  LoginCredentials,
  SignupCredentials,
  UpdateProfileData,
  UserProfile,
} from "../types/auth-types";

// Clé de stockage local
const AUTH_TOKEN_KEY = "rpg_auth_token";
const USERS_STORAGE_KEY = "rpg_users";

// Simuler un délai d'appel API pour plus de réalisme
const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 500));

// Classe du service d'authentification
class AuthService {
  // Utilisateurs stockés en mémoire
  private users: UserProfile[] = [];

  constructor() {
    this.loadUsers();
  }

  // Charger les utilisateurs depuis le localStorage
  private loadUsers() {
    try {
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      this.users = usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      this.users = [];
    }
  }

  // Sauvegarder les utilisateurs dans le localStorage
  private saveUsers() {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des utilisateurs:", error);
    }
  }

  // Vérifier si l'utilisateur est connecté
  checkAuth(): UserProfile | null {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) return null;

      const userData = JSON.parse(atob(token.split(".")[1]));
      const user = this.users.find((u) => u.id === userData.id);

      if (!user) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        return null;
      }

      return user;
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'authentification:",
        error
      );
      localStorage.removeItem(AUTH_TOKEN_KEY);
      return null;
    }
  }

  // Connexion
  async login(credentials: LoginCredentials): Promise<UserProfile> {
    await simulateDelay();

    const { email, password } = credentials;

    // Simulation d'une vérification de mot de passe en utilisant un stockage temporaire
    // Dans une vraie application, ceci utiliserait une API sécurisée et les mots de passe seraient hachés
    const userIndex = this.users.findIndex((u) => u.email === email);

    if (userIndex === -1) {
      throw new Error("Utilisateur non trouvé");
    }

    // Dans cette simulation, nous stockons le mot de passe dans un attribut non-typé (dangereux dans un vrai app)
    if ((this.users[userIndex] as any).password !== password) {
      throw new Error("Mot de passe incorrect");
    }

    const user = this.users[userIndex];

    // Création d'un token JWT simplifié
    const token = this.generateToken(user);
    localStorage.setItem(AUTH_TOKEN_KEY, token);

    return user;
  }

  // Inscription
  async signup(credentials: SignupCredentials): Promise<UserProfile> {
    await simulateDelay();

    const { username, email, password } = credentials;

    // Vérifier si l'email existe déjà
    if (this.users.some((u) => u.email === email)) {
      throw new Error("Cet email est déjà utilisé");
    }

    // Créer un nouvel utilisateur
    const newUser: UserProfile & { password?: string } = {
      id: crypto.randomUUID(),
      username,
      email,
      createdAt: new Date().toISOString(),
      password, // Stocké uniquement pour la simulation
    };

    // Dans une vraie application, le mot de passe serait haché et non stocké directement
    this.users.push(newUser as UserProfile);
    this.saveUsers();

    // Générer un token pour l'utilisateur
    const token = this.generateToken(newUser);
    localStorage.setItem(AUTH_TOKEN_KEY, token);

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Déconnexion
  async logout(): Promise<void> {
    await simulateDelay();
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  // Mise à jour du profil
  async updateProfile(
    userId: string,
    data: UpdateProfileData
  ): Promise<UserProfile> {
    await simulateDelay();

    const userIndex = this.users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new Error("Utilisateur non trouvé");
    }

    const user = this.users[userIndex] as UserProfile & { password?: string };

    // Vérifier le mot de passe actuel si fourni
    if (data.currentPassword && data.password) {
      if (user.password !== data.currentPassword) {
        throw new Error("Le mot de passe actuel est incorrect");
      }
      user.password = data.password;
    }

    // Mettre à jour les champs
    if (data.username) {
      user.username = data.username;
    }

    if (data.email) {
      // Vérifier que le nouvel email n'est pas déjà utilisé
      if (
        this.users.some((u, idx) => u.email === data.email && idx !== userIndex)
      ) {
        throw new Error("Cet email est déjà utilisé");
      }
      user.email = data.email;
    }

    this.users[userIndex] = user;
    this.saveUsers();

    // Mettre à jour le token
    const token = this.generateToken(user);
    localStorage.setItem(AUTH_TOKEN_KEY, token);

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Générer un token JWT simplifié
  private generateToken(user: UserProfile): string {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
      })
    );
    const signature = btoa(`${header}.${payload}`); // Dans une vraie application, ceci utiliserait une signature cryptographique

    return `${header}.${payload}.${signature}`;
  }
}

// Exporter une instance unique du service
export const authService = new AuthService();
