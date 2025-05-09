// Types pour l'utilisateur
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

// Types pour les données de connexion
export interface LoginCredentials {
  email: string;
  password: string;
}

// Types pour les données d'inscription
export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

// Types pour la mise à jour du profil
export interface UpdateProfileData {
  username?: string;
  email?: string;
  currentPassword?: string;
  password?: string;
}

// État global d'authentification
export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
