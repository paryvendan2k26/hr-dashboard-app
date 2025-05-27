// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean; // To check if auth state is loading
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start loading

  useEffect(() => {
    // Check for a mock token on app load
    const token = localStorage.getItem('authToken');
    if (token === 'my-secret-token') {
      setIsAuthenticated(true);
    }
    setIsLoading(false); // Done loading
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => { // Simulate API call
        if (username === 'user@example.com' && password === 'password123') {
          localStorage.setItem('authToken', 'my-secret-token'); // Store mock token
          setIsAuthenticated(true);
          resolve(true);
        } else {
          resolve(false);
        }
        setIsLoading(false);
      }, 500); // Quick delay
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken'); // Clear mock token
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}