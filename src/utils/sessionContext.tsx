"use client";
import React, { createContext, useContext, useState } from 'react';

// Создаём контекст с дефолтными значениями
const SessionContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => { console.log(value); },
});

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <SessionContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </SessionContext.Provider>
  );
};
