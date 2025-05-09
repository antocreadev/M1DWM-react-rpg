import React, { useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import type { LoginCredentials } from "../../types/auth-types";

interface LoginProps {
  onSwitch: () => void; // Pour basculer vers l'inscription
}

export const Login: React.FC<LoginProps> = ({ onSwitch }) => {
  const { login, error, isLoading, clearError } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    // Efface les erreurs précédentes lors de la saisie
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(credentials);
    } catch (err) {
      // Les erreurs sont gérées par le contexte d'authentification
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2.5 px-4 rounded-md text-white font-medium ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        Pas encore de compte ?{" "}
        <button
          onClick={onSwitch}
          className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
        >
          Créer un compte
        </button>
      </div>
    </div>
  );
};
