import React, { useState, useContext } from 'react';
import { analyzeCvWithGemini } from '../services/geminiService';
import { type CvData, type AtsAnalysisResult } from '../types';
import { MagicIcon } from './IconComponents';
import { AppContext } from '../context/AppContext';

interface AtsAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CvData;
}

const AtsAnalysisModal: React.FC<AtsAnalysisModalProps> = ({ isOpen, onClose, cvData }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AtsAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { apiKey, error, setError } = useContext(AppContext);

  const handleAnalyze = async () => {
    if (!apiKey) {
      setError('Bu özelliği kullanmak için lütfen API anahtarınızı girin.');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Lütfen analiz için bir iş ilanı yapıştırın.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeCvWithGemini(apiKey, cvData, jobDescription);
      setAnalysisResult(result);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state on close
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300" aria-modal="true" role="dialog" onClick={handleClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">ATS Uyumluluk Analizi</h2>
          <button onClick={handleClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl font-light">&times;</button>
        </header>
        
        <main className="p-6 overflow-y-auto">
          {!analysisResult ? (
            <div>
              <label htmlFor="job-desc" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">İş İlanı</label>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">CV'nizin başvurduğunuz pozisyona ne kadar uygun olduğunu görmek için aşağıdaki alana iş ilanını yapıştırın ve analizi başlatın.</p>
              <textarea
                id="job-desc"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="İş ilanını buraya yapıştırın..."
                rows={10}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                disabled={isLoading}
                aria-label="İş İlanı Metin Alanı"
              />
              {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>}
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-gray-600">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="text-gray-200 dark:text-gray-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                    <path className="text-blue-600 dark:text-blue-400 transition-all duration-1000 ease-out"
                      strokeDasharray={`${analysisResult.matchScore}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" transform="rotate(-90 18 18)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-blue-800 dark:text-blue-300">
                    %{analysisResult.matchScore}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 text-center sm:text-left">Genel Uyumluluk Skoru</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-center sm:text-left">{analysisResult.summary}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-2">İyileştirme Önerileri</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md border dark:border-gray-700">
                  {analysisResult.actionableFeedback.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-green-700 dark:text-green-400 mb-2">Eşleşen Anahtar Kelimeler</h4>
                  <div className="flex flex-wrap gap-2 p-3 bg-green-50 dark:bg-green-900/50 rounded-md border border-green-200 dark:border-green-800">
                    {analysisResult.matchingKeywords.map((keyword) => (
                      <span key={keyword} className="bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{keyword}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-red-700 dark:text-red-400 mb-2">Eksik Anahtar Kelimeler</h4>
                  <div className="flex flex-wrap gap-2 p-3 bg-red-50 dark:bg-red-900/50 rounded-md border border-red-200 dark:border-red-800">
                    {analysisResult.missingKeywords.map((keyword) => (
                      <span key={keyword} className="bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{keyword}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        
        <footer className="p-4 border-t dark:border-gray-700 flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-4 sticky bottom-0 bg-white dark:bg-gray-800 z-10">
          {analysisResult ? (
             <button
                onClick={() => { setAnalysisResult(null); setError(null); }}
                className="w-full sm:w-auto bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
                Yeni Analiz Yap
            </button>
          ) : (
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !jobDescription}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <MagicIcon />
              )}
              <span>{isLoading ? 'Analiz Ediliyor...' : 'Analizi Başlat'}</span>
            </button>
          )}
           <button onClick={handleClose} className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Kapat</button>
        </footer>
      </div>
    </div>
  );
};

export default AtsAnalysisModal;