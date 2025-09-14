
import { useState, useEffect } from 'react';
import { type CvData, type CvSection, type PersonalInfo, type Experience, type Education, type Skill } from '../types';
import { INITIAL_CV_DATA } from '../constants';

const CV_DATA_STORAGE_KEY = 'cv-data';

const loadCvDataFromStorage = (): CvData => {
  try {
    const savedData = localStorage.getItem(CV_DATA_STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Veri yapısının doğruluğunu kontrol et
      if (parsedData && typeof parsedData === 'object' && parsedData.personalInfo) {
        return parsedData as CvData;
      }
    }
  } catch (error) {
    console.error('CV verileri localStorage\'dan yüklenirken hata oluştu:', error);
  }
  return INITIAL_CV_DATA;
};

const saveCvDataToStorage = (cvData: CvData) => {
  try {
    localStorage.setItem(CV_DATA_STORAGE_KEY, JSON.stringify(cvData));
  } catch (error) {
    console.error('CV verileri localStorage\'a kaydedilirken hata oluştu:', error);
  }
};

export const useCvData = () => {
  const [cvData, setCvDataInternal] = useState<CvData>(() => loadCvDataFromStorage());

  // CV verileri her değiştiğinde localStorage'a kaydet
  useEffect(() => {
    saveCvDataToStorage(cvData);
  }, [cvData]);

  const setCvData = (newData: CvData | ((prev: CvData) => CvData)) => {
    setCvDataInternal(newData);
  };

  const updateField = <K extends keyof PersonalInfo>(
    section: 'personalInfo',
    field: K,
    value: PersonalInfo[K]
  ) => {
    setCvData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addEntry = (section: CvSection) => {
    const newId = `${section}-${Date.now()}`;
    setCvData((prev) => {
      const newEntry =
        section === 'experience'
          ? { id: newId, jobTitle: '', company: '', startDate: '', endDate: '', description: '' }
          : section === 'education'
            ? { id: newId, school: '', degree: '', startDate: '', endDate: '' }
            : { id: newId, name: '' };

      return {
        ...prev,
        [section]: [...prev[section], newEntry],
      };
    });
  };

  const removeEntry = (section: CvSection, id: string) => {
    setCvData((prev) => ({
      ...prev,
      [section]: prev[section].filter((entry) => (entry as { id: string }).id !== id),
    }));
  };

  const updateEntry = <T extends Experience | Education | Skill>(section: CvSection, id: string, field: keyof T, value: T[keyof T]) => {
    setCvData((prev) => ({
      ...prev,
      [section]: prev[section].map((entry) =>
        (entry as { id: string }).id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const clearCvData = () => {
    setCvDataInternal(INITIAL_CV_DATA);
    try {
      localStorage.removeItem(CV_DATA_STORAGE_KEY);
    } catch (error) {
      console.error('CV verileri localStorage\'dan silinirken hata oluştu:', error);
    }
  };

  const exportCvData = () => {
    try {
      const dataStr = JSON.stringify(cvData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cv-verileri-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CV verileri dışa aktarılırken hata oluştu:', error);
    }
  };

  const importCvData = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const importedData = JSON.parse(result);
            // Veri yapısının doğruluğunu kontrol et
            if (importedData && typeof importedData === 'object' && importedData.personalInfo) {
              setCvDataInternal(importedData as CvData);
              resolve();
            } else {
              reject(new Error('Geçersiz dosya formatı'));
            }
          } else {
            reject(new Error('Dosya okunamadı'));
          }
        } catch (error) {
          reject(new Error('JSON dosyası ayrıştırılamadı'));
        }
      };
      reader.onerror = () => reject(new Error('Dosya okuma hatası'));
      reader.readAsText(file);
    });
  };

  return { cvData, setCvData, updateField, addEntry, removeEntry, updateEntry, clearCvData, exportCvData, importCvData };
};
