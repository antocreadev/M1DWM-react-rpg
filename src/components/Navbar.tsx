import React, { useState } from "react";
import { useAuth } from "../contexts/auth-context";
import { AuthManager } from "./auth/AuthManager";

export const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-white font-bold text-xl">RPG Board Game</span>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center">
                <span className="text-white mr-4">
                  Bonjour, {user?.username}
                </span>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 bg-white text-blue-600 rounded-md shadow-sm font-medium hover:bg-gray-100"
                >
                  Mon Profil
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 bg-white text-blue-600 rounded-md shadow-sm font-medium hover:bg-gray-100"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthManager
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
};
