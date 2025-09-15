import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import { LocalizationProvider } from './context/LocalizationContext';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <AppProvider>
        <LocalizationProvider>
          <App />
        </LocalizationProvider>
      </AppProvider>
    </React.StrictMode>
  );
}
