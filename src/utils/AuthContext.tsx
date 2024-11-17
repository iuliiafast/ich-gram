"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";

interface AuthContextType {
  token: string | null;
  profile: object | null;
  login: (newToken: string, newProfile: object) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<object | null>(null);

  const login = (newToken: string, newProfile: object) => {
    setToken(newToken);
    setProfile(newProfile);
  };

  const logout = () => {
    setToken(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ token, profile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для удобного использования контекста
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth должен быть использован внутри AuthProvider");
  }
  return context;
};
