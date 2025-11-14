import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { type CvData, type CvSection, type PersonalInfo, type Experience, type Education, type Skill, type ProjectItem } from '../types';
import { INITIAL_CV_DATA_EN, INITIAL_CV_DATA_TR } from '../constants';
import { useDebounce } from './useDebounce';

const CV_DATA_STORAGE_KEY = 'cv-data';

const getInitialDataForLang = (lang: string) => {
  return lang === 'tr' ? INITIAL_CV_DATA_TR : INITIAL_CV_DATA_EN;
};

const loadCvDataFromStorage = (lang: string): CvData => {
  try {
    const savedData = localStorage.getItem(CV_DATA_STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData && typeof parsedData === 'object' && parsedData.personalInfo) {
        return {
          ...getInitialDataForLang(lang),
          ...parsedData,
          projects: parsedData.projects ?? [],
          experience: parsedData.experience ?? [],
          education: parsedData.education ?? [],
          skills: parsedData.skills ?? [],
        };
      }
    }
  } catch (error) {
    console.error('Error loading CV data from localStorage:', error);
  }
  return getInitialDataForLang(lang);
};

export const useCvData = () => {
  const { i18n } = useTranslation();
  const [cvData, setCvDataInternal] = useState<CvData>(() => loadCvDataFromStorage(i18n.language));
  const previousLangRef = useRef(i18n.language);

  // Debounce CV data to avoid excessive localStorage writes
  const debouncedCvData = useDebounce(cvData, 300);

  // Update CV data with new initial values on language change
  useEffect(() => {
    const currentLang = i18n.language;
    const previousLang = previousLangRef.current;

    if (currentLang !== previousLang) {
      const oldInitialData = getInitialDataForLang(previousLang);
      const newInitialData = getInitialDataForLang(currentLang);

      setCvDataInternal(currentCvData => {
        const newCvData = { ...currentCvData };

        // Compare and update summary
        if (currentCvData.summary === oldInitialData.summary) {
            newCvData.summary = newInitialData.summary;
        }

        // Compare and update personal info
        (Object.keys(newCvData.personalInfo) as Array<keyof PersonalInfo>).forEach(key => {
            if (currentCvData.personalInfo[key] === oldInitialData.personalInfo[key]) {
                newCvData.personalInfo[key] = newInitialData.personalInfo[key];
            }
        });

        // This is a simplified example. A full implementation would need to handle
        // arrays of objects (experience, education, etc.) more robustly, potentially
        // by comparing item by item if IDs match. For this task, we'll focus on summary and personalInfo.
        // A more complex implementation could be added later if needed.

        return newCvData;
      });

      previousLangRef.current = currentLang;
    }
  }, [i18n.language]);


  // Save CV data to localStorage whenever it changes (debounced to avoid excessive writes)
  useEffect(() => {
    try {
      localStorage.setItem(CV_DATA_STORAGE_KEY, JSON.stringify(debouncedCvData));
    } catch (error) {
      console.error('Error saving CV data to localStorage:', error);
    }
  }, [debouncedCvData]);

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
    let newEntry: Experience | Education | Skill | ProjectItem;
    if (section === 'experience') {
      newEntry = { id: newId, jobTitle: '', company: '', startDate: '', endDate: '', description: '' };
    } else if (section === 'education') {
      newEntry = { id: newId, school: '', degree: '', startDate: '', endDate: '' };
    } else if (section === 'projects') {
      newEntry = { id: newId, title: '', context: '', role: '', description: '' };
    } else { // skills
      newEntry = { id: newId, name: '' };
    }
    setCvData((prev) => ({
      ...prev,
      [section]: [...prev[section], newEntry],
    }));
  };

  const removeEntry = (section: CvSection, id: string) => {
    setCvData((prev) => ({
      ...prev,
      [section]: prev[section].filter((entry) => (entry as { id: string }).id !== id),
    }));
  };

  const updateEntry = (section: CvSection, id: string, field: string, value: any) => {
    setCvData((prev) => ({
      ...prev,
      [section]: prev[section].map((entry) =>
        (entry as { id: string }).id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const updateSummary = (value: string) => {
    setCvData((prev) => ({ ...prev, summary: value }));
  };

  const clearCvData = () => {
    const initialData = getInitialDataForLang(i18n.language);
    setCvDataInternal(initialData);
  };

  const exportCvData = () => {
    try {
      const dataStr = JSON.stringify(cvData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cv-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CV data:', error);
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
            if (importedData && typeof importedData === 'object' && importedData.personalInfo) {
              setCvDataInternal(importedData as CvData);
              resolve();
            } else {
              reject(new Error('Invalid file format.'));
            }
          } else {
            reject(new Error('Could not read file.'));
          }
        } catch (error) {
          reject(new Error('Could not parse JSON file.'));
        }
      };
      reader.onerror = () => reject(new Error('File reading error.'));
      reader.readAsText(file);
    });
  };

  return { cvData, setCvData, updateField, addEntry, removeEntry, updateEntry, updateSummary, clearCvData, exportCvData, importCvData };
};
