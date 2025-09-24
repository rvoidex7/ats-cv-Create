import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { AppContext } from '../context/AppContext';
import { generateWithGemini } from '../services/geminiService';

const GEMINI_API_KEY_STORAGE_KEY = 'gemini_api_key';

const AISettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { setSuccess, setError } = useContext(AppContext);

  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
    if (savedKey) {
      setApiKeyInput('********************' + savedKey.slice(-4));
      setIsKeySaved(true);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!apiKeyInput) return;
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Test the key with a simple prompt
      await generateWithGemini(apiKeyInput, "test");
      localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, apiKeyInput);
      setIsKeySaved(true);
      setSuccess(t('ai_settings.key_saved_success'));
      setApiKeyInput('********************' + apiKeyInput.slice(-4));
    } catch (error) {
      setError(t('ai_settings.key_saved_error'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [apiKeyInput, setSuccess, setError, t]);

  const handleDelete = useCallback(() => {
    localStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
    setIsKeySaved(false);
    setApiKeyInput('');
    setSuccess(t('ai_settings.key_deleted_success'));
  }, [setSuccess, t]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6 dark:bg-gray-800 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('ai_settings.title')}</h1>

      <div className="p-4 border rounded-lg dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">{t('ai_settings.chatgpt_integration_title')}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{t('ai_settings.chatgpt_integration_desc')}</p>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>{t('ai_settings.chatgpt_integration_step1')}</li>
          <li>{t('ai_settings.chatgpt_integration_step2')}</li>
          <li>{t('ai_settings.chatgpt_integration_step3')}</li>
          <li>{t('ai_settings.chatgpt_integration_step4')}</li>
        </ol>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled>
          {t('ai_settings.chatgpt_integration_button')}
        </button>
      </div>

      <div className="p-4 border rounded-lg dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">{t('ai_settings.gemini_api_key_title')}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{t('ai_settings.gemini_api_key_desc')}</p>
        <div className="flex items-center space-x-2">
          <input
            type="password"
            placeholder={t('ai_settings.gemini_api_key_placeholder')}
            className="flex-grow p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-200 dark:disabled:bg-gray-600"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            disabled={isKeySaved || isLoading}
          />
          {isKeySaved ? (
            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              {t('ai_settings.delete')}
            </button>
          ) : (
            <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50" disabled={isLoading || !apiKeyInput}>
              {isLoading ? '...' : t('ai_settings.save')}
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          <Trans i18nKey="ai_settings.api_key_info">
            To learn how to get your API key, you can visit the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google AI Studio</a> page.
          </Trans>
        </p>
      </div>
    </div>
  );
};

export default AISettingsPage;
