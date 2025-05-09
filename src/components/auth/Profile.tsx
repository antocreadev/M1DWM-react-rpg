import React, { useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import type { UpdateProfileData } from "../../types/auth-types";

interface ProfileProps {
  onClose: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onClose }) => {
  const { user, updateProfile, logout, error, isLoading, clearError } =
    useAuth();
  const [formData, setFormData] = useState<UpdateProfileData>({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Effacer les erreurs lors de la saisie
    setFormError(null);
    setUpdateSuccess(false);
    if (error) clearError();
  };

  const validateForm = (): boolean => {
    // Validation de base du formulaire
    if (showPasswordFields) {
      if (!formData.currentPassword) {
        setFormError("Le mot de passe actuel est requis");
        return false;
      }

      if (formData.password && formData.password.length < 6) {
        setFormError(
          "Le nouveau mot de passe doit contenir au moins 6 caractères"
        );
        return false;
      }

      if (formData.password !== confirmPassword) {
        setFormError("Les mots de passe ne correspondent pas");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Ne pas envoyer les champs vides ou inutiles
      const dataToUpdate: UpdateProfileData = {};

      if (formData.username !== user?.username) {
        dataToUpdate.username = formData.username;
      }

      if (formData.email !== user?.email) {
        dataToUpdate.email = formData.email;
      }

      if (showPasswordFields && formData.password) {
        dataToUpdate.currentPassword = formData.currentPassword;
        dataToUpdate.password = formData.password;
      }

      // Ne mettre à jour que si des changements ont été effectués
      if (Object.keys(dataToUpdate).length > 0) {
        await updateProfile(dataToUpdate);
        setUpdateSuccess(true);

        // Réinitialiser les champs de mot de passe après la mise à jour
        if (showPasswordFields) {
          setFormData((prev) => ({
            ...prev,
            currentPassword: "",
            password: "",
          }));
          setConfirmPassword("");
          setShowPasswordFields(false);
        }
      }
    } catch (err) {
      // Les erreurs sont gérées par le contexte d'authentification
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mon profil</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

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
            value={formData.username}
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
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {!showPasswordFields ? (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowPasswordFields(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Changer mon mot de passe
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mot de passe actuel
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nouveau mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordFields(false);
                  setFormData((prev) => ({
                    ...prev,
                    currentPassword: "",
                    password: "",
                  }));
                  setConfirmPassword("");
                  setFormError(null);
                }}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Annuler le changement de mot de passe
              </button>
            </div>
          </>
        )}

        {(error || formError) && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {formError || error}
          </div>
        )}

        {updateSuccess && (
          <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
            Profil mis à jour avec succès !
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 px-4 rounded-md text-white font-medium ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Mise à jour..." : "Mettre à jour mon profil"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-md text-gray-700 border border-gray-300 font-medium hover:bg-gray-100"
          >
            Se déconnecter
          </button>
        </div>
      </form>
    </div>
  );
};
