import React, { useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import type { SignupCredentials } from "../../types/auth-types";

interface SignupProps {
  onSwitch: () => void; // Pour basculer vers la connexion
}

export const Signup: React.FC<SignupProps> = ({ onSwitch }) => {
  const { signup, error, isLoading, clearError } = useAuth();
  const [credentials, setCredentials] = useState<SignupCredentials>({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setCredentials((prev) => ({ ...prev, [name]: value }));
    }

    // Effacer les erreurs lors de la saisie
    setFormError(null);
    if (error) clearError();
  };

  const validateForm = (): boolean => {
    if (credentials.password.length < 6) {
      setFormError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }

    if (credentials.password !== confirmPassword) {
      setFormError("Les mots de passe ne correspondent pas");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signup(credentials);
    } catch (err) {
      // Les erreurs sont gérées par le contexte d'authentification
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Créer un compte</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nom d'utilisateur
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

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

        <div className="mb-4">
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

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {(error || formError) && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {formError || error}
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
          {isLoading ? "Création en cours..." : "Créer mon compte"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        Déjà inscrit ?{" "}
        <button
          onClick={onSwitch}
          className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
};
