import React, { useState, useContext } from 'react';
import { generateWithGemini } from '../services/geminiService';
import { MagicIcon } from './IconComponents';
import { AppContext } from '../context/AppContext';

type PromptType = 'summary' | 'experience';

interface GeminiEnhancerProps {
  promptType: PromptType;
  context: {
    jobTitle?: string;
    company?: string;
  };
  onGeneratedText: (text: string) => void;
}

const GeminiEnhancer: React.FC<GeminiEnhancerProps> = ({ promptType, context, onGeneratedText }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey, setError } = useContext(AppContext);

  const generatePrompt = () => {
    if (promptType === 'summary') {
      return `ATS uyumlu bir CV için, "${context.jobTitle}" pozisyonunda deneyimli bir profesyonel için 2-3 cümlelik etkileyici bir profesyonel özet yaz. Özet, anahtar yetenekleri ve kariyer hedeflerini vurgulamalıdır. Sadece özet metnini döndür.`;
    }
    if (promptType === 'experience') {
      return `ATS uyumlu bir CV için, "${context.company}" şirketinde "${context.jobTitle}" pozisyonu için sorumlulukları ve başarıları anlatan 3-4 maddelik bir liste oluştur. Her madde aksiyon fiili ile başlamalı ve ölçülebilir sonuçlar içermelidir. Sadece liste maddelerini, her biri '-' ile başlayacak şekilde döndür.`;
    }
    return '';
  };

  const handleClick = async () => {
    if (!apiKey) {
      setError('Bu özelliği kullanmak için lütfen API anahtarınızı girin.');
      return;
    }

    setIsLoading(true);
    setError(null);
    const prompt = generatePrompt();
    if (!prompt) {
      setError('Geçersiz istek türü.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateWithGemini(apiKey, prompt);
      onGeneratedText(result);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute bottom-2 right-2">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="flex items-center justify-center p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/60 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        title="Gemini ile Geliştir"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <MagicIcon />
        )}
      </button>
    </div>
  );
};

export default GeminiEnhancer;