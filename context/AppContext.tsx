import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AppContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  error: string | null;
  setError: (message: string | null) => void;
}

export const AppContext = createContext<AppContextType>({
  apiKey: null,
  setApiKey: () => {},
  error: null,
  setError: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [apiKey, setApiKeyInternal] = useState<string | null>(() => {
    // Get initial API key from localStorage
    try {
      return localStorage.getItem('gemini-api-key');
    } catch (e) { {
      console.error("Could not access localStorage", e);
      return null;
    }}
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Persist API key to localStorage whenever it changes
    try {
        if (apiKey) {
            localStorage.setItem('gemini-api-key', apiKey);
        } else {
            localStorage.removeItem('gemini-api-key');
        }
    } catch (e) {
        console.error("Could not access localStorage", e);
        setError("API Anahtarı tarayıcı deposuna kaydedilemedi.");
    }
  }, [apiKey]);
  
  const setApiKey = (key: string | null) => {
      setApiKeyInternal(key);
  }

  return (
    <AppContext.Provider value={{ apiKey, setApiKey, error, setError }}>
      {children}
    </AppContext.Provider>
  );
};
