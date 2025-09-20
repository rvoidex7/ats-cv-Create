import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import './index.css';
import './i18n'; // Initialize i18next

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Suspense fallback="Loading...">
        <AppProvider>
          <App />
        </AppProvider>
      </Suspense>
    </React.StrictMode>
  );
}
