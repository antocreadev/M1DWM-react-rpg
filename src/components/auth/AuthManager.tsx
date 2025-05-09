import React, { useState } from "react";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { Profile } from "./Profile";
import { useAuth } from "../../contexts/auth-context";
import { Modal } from "../modal";

interface AuthManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthView = "login" | "signup" | "profile";

export const AuthManager: React.FC<AuthManagerProps> = ({
  isOpen,
  onClose,
}) => {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState<AuthView>(
    isAuthenticated ? "profile" : "login"
  );

  // Détermine le contenu à afficher en fonction de l'état d'authentification et de la vue
  const renderContent = () => {
    if (isAuthenticated) {
      return <Profile onClose={onClose} />;
    } else {
      switch (view) {
        case "login":
          return <Login onSwitch={() => setView("signup")} />;
        case "signup":
          return <Signup onSwitch={() => setView("login")} />;
        default:
          return <Login onSwitch={() => setView("signup")} />;
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      {renderContent()}
    </Modal>
  );
};
