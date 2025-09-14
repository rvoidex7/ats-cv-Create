import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey } = useContext(AppContext);
  const [localApiKey, setLocalApiKey] = useState(apiKey || '');

  useEffect(() => {
    setLocalApiKey(apiKey || '');
  }, [apiKey, isOpen]);

  const handleSave = () => {
    setApiKey(localApiKey);
    onClose();
  };
  
  const handleClose = () => {
    setLocalApiKey(apiKey || ''); // Revert changes if closed without saving
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={handleClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Gemini API Anahtarını Ayarla</h2>
          <button onClick={handleClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl font-light">&times;</button>
        </header>
        <main className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Gemini AI özelliklerini kullanmak için lütfen API anahtarınızı girin. Anahtarınız tarayıcınızda yerel olarak saklanacaktır.
          </p>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline mb-4 block">
            API anahtarınızı buradan alabilirsiniz.
          </a>
          <input
            type="password"
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
            placeholder="API anahtarınızı buraya yapıştırın"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            aria-label="API Anahtarı Girişi"
          />
        </main>
        <footer className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 flex justify-end items-center space-x-3">
          <button onClick={handleClose} className="bg-white border border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            İptal
          </button>
          <button onClick={handleSave} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
            Kaydet
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ApiKeyModal;
