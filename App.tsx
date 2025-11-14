import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
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
import { validateCvForExport, validatePersonalInfo } from './utils/validation';

const App: React.FC = () => {
  const { t } = useTranslation();
  const cvDataHook = useCvData();
  const { cvData, exportCvData, importCvData } = cvDataHook;
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState('editor');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


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
    // Validate CV data before export
    const validation = validateCvForExport(cvData);

    if (!validation.isValid) {
      toast.error('Cannot export CV', {
        description: validation.errors.join('\n'),
      });
      return;
    }

    // Validate personal info fields
    const personalInfoErrors = validatePersonalInfo(cvData.personalInfo);
    if (Object.keys(personalInfoErrors).length > 0) {
      const errorMessages = Object.entries(personalInfoErrors)
        .map(([field, error]) => `${field}: ${error}`)
        .join('\n');

      toast.error('Invalid personal information', {
        description: errorMessages,
      });
      return;
    }

    try {
      const { pdf } = await import('@react-pdf/renderer');
      const blob = await pdf(<CvPdf cvData={cvData} t={t} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = `${cvData.personalInfo.name.replace(/\s+/g, '_')}_CV_${new Date().toISOString().split('T')[0]}.pdf`;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('PDF exported successfully!');
    } catch (err) {
      toast.error('Error creating PDF', {
        description: (err as Error).message,
      });
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'editor':
        return <EditorPage
          cvData={cvDataHook.cvData}
          onUpdateField={cvDataHook.updateField}
          onAddEntry={cvDataHook.addEntry}
          onRemoveEntry={cvDataHook.removeEntry}
          onUpdateEntry={cvDataHook.updateEntry}
          onUpdateSummary={(cvDataHook as any).updateSummary}
          setCvData={cvDataHook.setCvData}
        />;
      case 'ai-settings':
        return <AISettingsPage />;
      case 'ai-feed':
        return <AIFeedPage setCvData={cvDataHook.setCvData} onImported={() => setActivePage('editor')} />;
      default:
        return <ComingSoonPage />;
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden">
        <header className="no-print bg-white dark:bg-gray-800 shadow-sm dark:border-b dark:border-gray-700 z-30">
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

            <div className="sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
              </button>
            </div>

            <div className={`
              absolute sm:relative top-16 left-0 right-0 sm:top-auto sm:left-auto sm:right-auto
              bg-white dark:bg-gray-800 sm:bg-transparent dark:sm:bg-transparent
              shadow-lg sm:shadow-none
              p-4 sm:p-0
              ${isMobileMenuOpen ? 'block' : 'hidden'} sm:flex sm:items-center sm:space-x-2
            `}>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                <button onClick={handleImport} className="flex items-center justify-center space-x-2 bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/60 dark:text-green-300 dark:border-green-500 font-medium px-3 py-2 rounded-md text-sm hover:bg-green-200 dark:hover:bg-green-800/60" title="Import CV Data (.json)">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <span className="sm:inline">Import</span>
                </button>
                <button onClick={exportCvData} className="flex items-center justify-center space-x-2 bg-yellow-100 text-yellow-700 border border-yellow-300 dark:bg-yellow-900/60 dark:text-yellow-300 dark:border-yellow-500 font-medium px-3 py-2 rounded-md text-sm hover:bg-yellow-200 dark:hover:bg-yellow-800/60" title="Export CV Data (.json)">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" /></svg>
                  <span className="sm:inline">Export</span>
                </button>
                <button onClick={() => setIsAtsModalOpen(true)} className="flex items-center justify-center space-x-2 bg-white text-blue-600 border border-blue-600 dark:bg-gray-700 dark:text-blue-400 dark:border-blue-400 font-medium px-3 py-2 rounded-md text-sm hover:bg-blue-50 dark:hover:bg-gray-600" title="ATS Analysis">
                  <AnalysisIcon />
                  <span className="sm:inline">Analyze</span>
                </button>
                <button onClick={handleExportPdf} className="flex items-center justify-center space-x-2 bg-indigo-600 text-white font-medium px-3 py-2 rounded-md text-sm hover:bg-indigo-700" title="Download as PDF">
                  <DownloadIcon />
                  <span className="sm:inline">Download PDF</span>
                </button>
                <button onClick={handlePrint} className="flex items-center justify-center space-x-1 bg-gray-600 text-white font-medium px-3 py-2 rounded-md text-sm hover:bg-gray-700" title="Print">
                  <PrintIcon />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-row overflow-y-hidden">
          {/* Mobile navigation buttons */}
          <div className="lg:hidden fixed bottom-10 left-4 z-40">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
            >
              Menu
            </button>
          </div>
          <div className="lg:hidden fixed bottom-10 right-4 z-40">
            <button
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
              className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
            >
              Preview
            </button>
          </div>

          {/* Sol Dikey Navigasyon Menüsü */}
          <div className={`
            ${isSidebarOpen ? 'block' : 'hidden'} 
            lg:flex flex-shrink-0 w-64 bg-white dark:bg-gray-800 shadow-md no-print z-20 overflow-y-auto
            fixed lg:relative inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:transform-none
            transition-transform duration-300 ease-in-out
          `}>
            <AppSidebar activePage={activePage} setActivePage={setActivePage} />
          </div>


          {/* Orta Ana İçerik Alanı */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
            {renderPage()}
          </main>

          {/* Sağ CV Önizleme Sütunu */}
          <div className={`
            ${isPreviewOpen ? 'block' : 'hidden'}
            lg:block w-full lg:w-2/5 bg-gray-200 dark:bg-gray-700 p-4 overflow-y-auto no-print z-10
            fixed lg:relative inset-y-0 right-0 transform ${isPreviewOpen ? 'translate-x-0' : 'translate-x-full'} lg:transform-none
            transition-transform duration-300 ease-in-out
          `}>
            <CvPreview cvData={cvData} />
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
