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
    const handleStorageChange = (event) => {
      // Check for changes specifically to 'userToken'
      if (event.key === "userToken") {
        const token = localStorage.getItem("userToken");
        // If token is falsy (null, undefined, empty string), set current user to null
        if (!token) {
          setCurrentUser(null);
        } else {
          setCurrentUser({ token });
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const value = { currentUser, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
