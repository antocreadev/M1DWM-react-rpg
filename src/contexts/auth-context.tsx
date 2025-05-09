import React, { createContext, useContext, useState, useEffect } from "react";
// import type ReactNode
import type { ReactNode } from "react";
import { authService } from "../services/auth-service";
import type {
  AuthState,
  LoginCredentials,
  SignupCredentials,
  UpdateProfileData,
  UserProfile,
} from "../types/auth-types";

// Valeurs par défaut du contexte
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Type des fonctions et données exposées par le contexte
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  clearError: () => void;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
};

// Props pour le fournisseur de contexte
interface AuthProviderProps {
  children: ReactNode;
}

// Fournisseur du contexte d'authentification
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = authService.checkAuth();
        setState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Échec de la vérification d'authentification",
        });
      }
    };

    checkAuth();
  }, []);

  // Méthode de connexion
  const login = async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await authService.login(credentials);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Échec de la connexion",
      }));
      throw error;
    }
  };

  // Méthode d'inscription
  const signup = async (credentials: SignupCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await authService.signup(credentials);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Échec de l'inscription",
      }));
      throw error;
    }
  };

  // Méthode de déconnexion
  const logout = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await authService.logout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Échec de la déconnexion",
      }));
    }
  };

  // Méthode de mise à jour du profil
  const updateProfile = async (data: UpdateProfileData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      if (!state.user) throw new Error("Utilisateur non connecté");

      const updatedUser = await authService.updateProfile(state.user.id, data);
      setState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Échec de la mise à jour du profil",
      }));
      throw error;
    }
  };

  // Effacer les erreurs
  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  // Valeur exposée par le contexte
  const contextValue: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
