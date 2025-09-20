import React, { createContext, useState, ReactNode } from 'react';

const API_KEY_STORAGE_KEY = 'gemini-api-key';

interface AppContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  error: string | null;
  setError: (message: string | null) => void;
  success: string | null;
  setSuccess: (message: string | null) => void;
}

export const AppContext = createContext<AppContextType>({
  apiKey: null,
  setApiKey: () => {},
  error: null,
  setError: () => {},
  success: null,
  setSuccess: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiKey, setApiKeyState] = useState<string | null>(() => {
    // Read key from localStorage on initial page load
    try {
      return localStorage.getItem(API_KEY_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to read API key from localStorage", e);
      return null;
    }
  });

  const setApiKey = (key: string | null) => {
    try {
      if (key) {
        localStorage.setItem(API_KEY_STORAGE_KEY, key);
      } else {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to save API key to localStorage", e);
    }
    setApiKeyState(key);
  };

  return (
    <AppContext.Provider value={{ apiKey, setApiKey, error, setError, success, setSuccess }}>
      {children}
    </AppContext.Provider>
  );
};
