import React, { useState } from 'react';
import CvForm from './components/CvForm';
import CvPreview from './components/CvPreview';
import { useCvData } from './hooks/useCvData';
import { DownloadIcon, BrandIcon, AnalysisIcon, PrintIcon, KeyIcon } from './components/IconComponents';
import AtsAnalysisModal from './components/AtsAnalysisModal';
import ApiKeyModal from './components/ApiKeyModal';
import ErrorToast from './components/ErrorToast';


declare global {
  interface Window {
    html2pdf: any;
  }
}

const App: React.FC = () => {
  const { cvData, setCvData, updateField, addEntry, removeEntry, updateEntry } = useCvData();
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.getElementById('cv-preview');
    if (!element) {
        console.error("CV önizleme öğesi bulunamadı.");
        return;
    }

    const sanitizedName = cvData.personalInfo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'cv';
    const fileName = `CV_${sanitizedName}.pdf`;

    const clone = element.cloneNode(true) as HTMLElement;

    const container = document.createElement('div');
    container.classList.add('cv-pdf-render-container');
    container.appendChild(clone);
    document.body.appendChild(container);

    const opt = {
      margin:       0,
      filename:     fileName,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    window.html2pdf().from(clone).set(opt).save().finally(() => {
        document.body.removeChild(container);
    });
  };


  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <header className="no-print bg-white dark:bg-gray-800 shadow-md dark:border-b dark:border-gray-700 sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <BrandIcon />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ATS Uyumlu CV Oluşturucu
              </h1>
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">BETA</span>
            </div>
            <div className="flex items-center space-x-2">
               <button
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="flex items-center space-x-2 bg-gray-100 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200"
                  title="API Anahtarını Ayarla"
                >
                  <KeyIcon />
                  <span className="hidden sm:inline">API Anahtarı</span>
                </button>
               <button
                  onClick={() => setIsAtsModalOpen(true)}
                  className="flex items-center space-x-2 bg-white text-blue-600 border border-blue-600 dark:bg-gray-700 dark:text-blue-400 dark:border-blue-400 font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                  <AnalysisIcon />
                  <span>ATS Analizi</span>
              </button>
               <button
                onClick={handlePrint}
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200"
              >
                <PrintIcon />
                <span>Yazdır</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <DownloadIcon />
                <span>PDF Olarak İndir</span>
              </button>
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
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
      <ErrorToast />
    </>
  );
};

export default App;