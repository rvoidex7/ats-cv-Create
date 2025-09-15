import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useLocalization } from '@/hooks/useLocalization';

const ErrorToast: React.FC = () => {
  const { error, setError } = useContext(AppContext);
  const { localization } = useLocalization();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  if (!error) return null;

  return (
    <div 
        className="fixed bottom-5 right-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-[100] flex items-center animate-fade-in"
        role="alert"
    >
        <strong className="font-bold mr-2">{localization.Error}</strong>
        <span className="block sm:inline">{error}</span>
        <button onClick={() => setError(null)} className="ml-4 -mr-1 p-1 text-red-700/80 hover:text-red-700">
            <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>{localization.Close}</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
        </button>
    </div>
  );
};

export default ErrorToast;
