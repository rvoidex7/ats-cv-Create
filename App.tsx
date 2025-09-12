
import React from 'react';
import CvForm from './components/CvForm';
import CvPreview from './components/CvPreview';
import { useCvData } from './hooks/useCvData';
import { DownloadIcon, BrandIcon } from './components/IconComponents';

const App: React.FC = () => {
  const { cvData, setCvData, updateField, addEntry, removeEntry, updateEntry } = useCvData();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="no-print bg-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BrandIcon />
            <h1 className="text-2xl font-bold text-gray-900">
              ATS Uyumlu CV Oluşturucu
            </h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">BETA</span>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <DownloadIcon />
            <span>PDF Olarak İndir</span>
          </button>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="no-print">
          <CvForm
            cvData={cvData}
            onUpdateField={updateField}
            onAddEntry={addEntry}
            onRemoveEntry={removeEntry}
            onUpdateEntry={updateEntry}
            setCvData={setCvData}
          />
        </div>
        <div>
          <CvPreview cvData={cvData} />
        </div>
      </main>
    </div>
  );
};

export default App;
