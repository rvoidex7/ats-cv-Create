import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

const AISettingsPage: React.FC = () => {
  const { apiKey, setApiKey, setSuccess, setError } = useContext(AppContext);
  const [localApiKey, setLocalApiKey] = useState(apiKey || '');

  useEffect(() => {
    setLocalApiKey(apiKey || '');
  }, [apiKey]);

  const handleSave = () => {
    if (localApiKey.trim()) {
      setApiKey(localApiKey.trim());
      setSuccess('API anahtarı başarıyla kaydedildi!');
    } else {
      setError('Lütfen geçerli bir API anahtarı girin.');
    }
  };

  const handleRemove = () => {
    setApiKey(null);
    setLocalApiKey('');
    setSuccess('API anahtarı başarıyla kaldırıldı.');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6 dark:bg-gray-800 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Settings</h1>

      <div className="p-4 border rounded-lg dark:border-gray-700">

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">ChatGPT Integration</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Follow the steps below to create your CV using your own ChatGPT account:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>Go to the "CV Expert GPT" page (Link will be added soon).</li>
          <li>Create the raw content of your CV by chatting with the GPT.</li>
          <li>The GPT will generate a special "magic link" for you.</li>
          <li>Paste this link into your browser to instantly see your CV preview.</li>
        </ol>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled>
          Go to CV Expert GPT (Coming Soon)
        </button>
      </div>

      <div className="p-4 border rounded-lg dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Google Gemini API Key</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You can enter your own Gemini API key here to use the in-app AI features (e.g., filling with LinkedIn profile, ATS Analysis). This key is stored only in your browser.

        </p>
        <div className="flex items-center space-x-2">
          <input
            type="password"
            placeholder="Enter Your Gemini API Key Here"
            className="flex-grow p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
          />

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save

          </button>
          {apiKey && (
            <button
              onClick={handleRemove}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Kaldır
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          To learn how to get your API key, you can visit the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google AI Studio</a> page.
        </p>
      </div>

      <div className="p-4 border rounded-lg dark:border-gray-700 mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">ChatGPT Entegrasyonu (Yakında)</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Kendi ChatGPT hesabınızı kullanarak CV'nizi doğrudan bizim arayüzümüzden oluşturun. Bu özellik, "CV Uzmanı GPT" action'ımızı kullanarak içeriği anında senkronize etmenizi sağlayacak.
        </p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled>
          Daha Fazla Bilgi (Yakında)
        </button>
      </div>
    </div>
  );
};

export default AISettingsPage;
