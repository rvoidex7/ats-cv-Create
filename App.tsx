import React, { useState } from 'react';
import CvPreview from './components/CvPreview';
import { useCvData } from './hooks/useCvData';
import { BrandIcon, AnalysisIcon, PrintIcon, DownloadIcon } from './components/IconComponents';
import AtsAnalysisModal from './components/AtsAnalysisModal';
import Toast from './components/Toast';
import AppSidebar from './components/AppSidebar';
import EditorPage from './pages/EditorPage';
import AISettingsPage from './pages/AISettingsPage';
import AIFeedPage from './pages/AIFeedPage';
import ComingSoonPage from './pages/ComingSoonPage';
import CvPdf from './components/CvPdf';

const App: React.FC = () => {
  const cvDataHook = useCvData();
  const { cvData, exportCvData, importCvData } = cvDataHook;
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState('editor');

  const handlePrint = () => {
    window.print();
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
          alert('CV data loaded successfully!');
        } catch (error) {
          alert(`Error loading file: ${(error as Error).message}`);
        }
      }
    };
    input.click();
  };

  const handleExportPdf = async () => {
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const blob = await pdf(<CvPdf cvData={cvData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cv-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Error creating PDF: ${(err as Error).message}`);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'editor':
        return <EditorPage
          cvData={cvDataHook.cvData}
          updateField={cvDataHook.updateField}
          addEntry={cvDataHook.addEntry}
          removeEntry={cvDataHook.removeEntry}
          updateEntry={cvDataHook.updateEntry}
          setCvData={cvDataHook.setCvData}
        />;
      case 'ai-settings':
        return <AISettingsPage />;
      case 'ai-feed':
        return <AIFeedPage />;
      default:
        return <ComingSoonPage />;
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <header className="no-print bg-white dark:bg-gray-800 shadow-sm dark:border-b dark:border-gray-700 sticky top-0 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <BrandIcon />

              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  <span className="hidden sm:inline">ATS Compatible CV Creator</span>
                  <span className="sm:hidden">ATS CV</span>
                </h1>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">BETA</span>
              </div>

            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button onClick={handleImport} className="flex items-center space-x-1 sm:space-x-2 bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/60 dark:text-green-300 dark:border-green-500 font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm hover:bg-green-200 dark:hover:bg-green-800/60" title="Import CV Data (.json)">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <span className="hidden sm:inline">Import</span>
              </button>
              <button onClick={exportCvData} className="flex items-center space-x-1 sm:space-x-2 bg-yellow-100 text-yellow-700 border border-yellow-300 dark:bg-yellow-900/60 dark:text-yellow-300 dark:border-yellow-500 font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm hover:bg-yellow-200 dark:hover:bg-yellow-800/60" title="Export CV Data (.json)">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" /></svg>
                <span className="hidden sm:inline">Export</span>
              </button>
              <button onClick={() => setIsAtsModalOpen(true)} className="flex items-center space-x-1 sm:space-x-2 bg-white text-blue-600 border border-blue-600 dark:bg-gray-700 dark:text-blue-400 dark:border-blue-400 font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm hover:bg-blue-50 dark:hover:bg-gray-600" title="ATS Analysis">
                <AnalysisIcon />
                <span className="hidden sm:inline">Analyze</span>
              </button>
              <button onClick={handleExportPdf} className="flex items-center space-x-1 sm:space-x-2 bg-indigo-600 text-white font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm hover:bg-indigo-700" title="Download as PDF">
                <DownloadIcon />
                <span className="hidden sm:inline">Download PDF</span>
              </button>
              <button onClick={handlePrint} className="flex items-center space-x-1 sm:space-x-2 bg-gray-600 text-white font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm hover:bg-gray-700" title="Print">
                <PrintIcon />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-row overflow-hidden">
          <div className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 shadow-md no-print z-20">
             <AppSidebar activePage={activePage} setActivePage={setActivePage} />
          </div>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {renderPage()}
          </main>

          <div className="w-full lg:w-2/5 bg-gray-200 dark:bg-gray-700 p-4 overflow-y-auto no-print z-10">
            <div className="lg:sticky lg:top-4">
              <CvPreview cvData={cvData} />
            </div>
          </div>
        </div>
      </div>

      <AtsAnalysisModal
        isOpen={isAtsModalOpen}
        onClose={() => setIsAtsModalOpen(false)}
        cvData={cvData}
      />
      <Toast />
    </>
  );
};

export default App;
