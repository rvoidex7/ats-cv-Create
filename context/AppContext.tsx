import React, { createContext, useState, ReactNode } from 'react';

interface AppContextType {
  apiKey: string | null;
  error: string | null;
  setError: (message: string | null) => void;
}

export const AppContext = createContext<AppContextType>({
  apiKey: process.env.API_KEY || null,
  error: null,
  setError: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);

  // Fix: API key is now sourced exclusively from environment variables.
  // The ability to set it from the UI or localStorage has been removed.
  return (
    <AppContext.Provider value={{ apiKey: process.env.API_KEY || null, error, setError }}>
      {children}
    </AppContext.Provider>
  );
};
