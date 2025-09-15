import React, { useState } from 'react';
import CvForm from './components/CvForm';
import CvPreview from './components/CvPreview';
import { useCvData } from './hooks/useCvData';
// Fix: Removed KeyIcon as it's no longer used.
import { DownloadIcon, BrandIcon, AnalysisIcon, PrintIcon } from './components/IconComponents';
import AtsAnalysisModal from './components/AtsAnalysisModal';
// Fix: Removed ApiKeyModal import as it's no longer used.
import ErrorToast from './components/ErrorToast';
import { useLocalization } from './hooks/useLocalization';
import LanguageToggleButton from './components/LanguageToggleButton';


declare global {
  interface Window {
    html2pdf: any;
  }
}

const App: React.FC = () => {
  const { cvData, setCvData, updateField, addEntry, removeEntry, updateEntry, clearCvData, exportCvData, importCvData } = useCvData();
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const { localization } = useLocalization();
  // Fix: Removed state for ApiKeyModal as it's no longer used.

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.getElementById('cv-preview');
    if (!element) {
      console.error(localization.NoCVPreview);
      return;
    }

    // Türkçe karakterleri düzelt ve dosya adını temizle
    const turkishToEnglish = (str: string) => {
      const charMap: { [key: string]: string } = {
        'ç': 'c', 'Ç': 'C',
        'ğ': 'g', 'Ğ': 'G',
        'ı': 'i', 'I': 'I',
        'İ': 'I', 'i': 'i',
        'ö': 'o', 'Ö': 'O',
        'ş': 's', 'Ş': 'S',
        'ü': 'u', 'Ü': 'U'
      };

      return str.split('').map(char => charMap[char] || char).join('');
    };

    const sanitizedName = turkishToEnglish(cvData.personalInfo.name)
      .replace(/[^a-zA-Z0-9\s]/g, '') // Özel karakterleri kaldır
      .trim()
      .replace(/\s+/g, '_') // Boşlukları alt çizgi ile değiştir
      .toLowerCase() || 'cv';

    const fileName = `CV_${sanitizedName}.pdf`;

    const clone = element.cloneNode(true) as HTMLElement;

    const container = document.createElement('div');
    container.classList.add('cv-pdf-render-container');
    container.appendChild(clone);
    document.body.appendChild(container);

    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    window.html2pdf().from(clone).set(opt).save().finally(() => {
      document.body.removeChild(container);
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          await importCvData(file);
          alert(localization.CVImportSuccess);
        } catch (error) {
          alert(`${localization.ImportFailure}: ${(error as Error).message}`);
        }
      }
    };
    input.click();
  };


  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <header className="no-print bg-white dark:bg-gray-800 shadow-sm dark:border-b dark:border-gray-700 sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <BrandIcon />
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  <span className="hidden sm:inline">{localization.Title}</span>
                  <span className="sm:hidden">{localization.HiddenTitle}</span>
                </h1>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">BETA</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={handleImport}
                className="flex items-center space-x-1 sm:space-x-2 bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/60 dark:text-green-300 dark:border-green-500 font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm hover:bg-green-200 dark:hover:bg-green-800/60 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
                title={localization.ImportCVData}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="hidden sm:inline">{localization.Download}</span>
              </button>
              <button
                onClick={exportCvData}
                className="flex items-center space-x-1 sm:space-x-2 bg-yellow-100 text-yellow-700 border border-yellow-300 dark:bg-yellow-900/60 dark:text-yellow-300 dark:border-yellow-500 font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm hover:bg-yellow-200 dark:hover:bg-yellow-800/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors"
                title={localization.SaveCVData}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" />
                </svg>
                <span className="hidden sm:inline">{localization.Save}</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm(localization.ClearConfirmMessage)) {
                    clearCvData();
                  }
                }}
                className="flex items-center space-x-1 sm:space-x-2 bg-red-100 text-red-700 border border-red-300 dark:bg-red-900/60 dark:text-red-300 dark:border-red-500 font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm hover:bg-red-200 dark:hover:bg-red-800/60 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
                title={localization.ClearAllData}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline">{localization.Clear}</span>
              </button>
              {/* Fix: Removed API Key button as per guidelines. */}
              <button
                onClick={() => setIsAtsModalOpen(true)}
                className="flex items-center space-x-1 sm:space-x-2 bg-white text-blue-600 border border-blue-600 dark:bg-gray-700 dark:text-blue-400 dark:border-blue-400 font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm hover:bg-blue-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                title={localization.ATSAnalyze}
              >
                <AnalysisIcon />
                <span className="hidden sm:inline">{localization.Analyze}</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                title={localization.Print}
              >
                <PrintIcon />
                <span className="hidden sm:inline">{localization.Print}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-1 sm:space-x-2 bg-blue-600 text-white font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                title={localization.DownloadAsPDF}
              >
                <DownloadIcon />
                <span className="hidden sm:inline">{localization.PDF}</span>
              </button>
              <LanguageToggleButton></LanguageToggleButton>
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="no-print lg:col-span-3 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-4 -mr-4">
              <CvForm
                cvData={cvData}
                onUpdateField={updateField}
                onAddEntry={addEntry}
                onRemoveEntry={removeEntry}
                onUpdateEntry={updateEntry}
                setCvData={setCvData}
              />
            </div>
            <div className="lg:col-span-2 hidden lg:block">
              <div className="lg:sticky lg:top-24">
                <CvPreview cvData={cvData} />
              </div>
            </div>
            <div className="lg:hidden">
              <CvPreview cvData={cvData} />
            </div>
          </div>
        </main>
      </div>
      <AtsAnalysisModal
        isOpen={isAtsModalOpen}
        onClose={() => setIsAtsModalOpen(false)}
        cvData={cvData}
      />
      {/* Fix: Removed ApiKeyModal as per guidelines. */}
      <ErrorToast />
    </>
  );
};

export default App;
