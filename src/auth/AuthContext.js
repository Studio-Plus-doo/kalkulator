import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const token = localStorage.getItem("userToken");
    return token ? { token } : null;
  });

  const login = (token) => {
    localStorage.setItem("userToken", token);
    setCurrentUser({ token });
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    setCurrentUser(null);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("userToken");
      if (token) {
        setCurrentUser({ token });
      } else {
        setCurrentUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const value = { currentUser, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
