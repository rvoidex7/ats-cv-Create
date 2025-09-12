
import { useState } from 'react';
import { type CvData, type CvSection, type PersonalInfo, type Experience, type Education, type Skill } from '../types';
import { INITIAL_CV_DATA } from '../constants';

export const useCvData = () => {
  const [cvData, setCvData] = useState<CvData>(INITIAL_CV_DATA);

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
      [section]: prev[section].filter((entry) => (entry as {id: string}).id !== id),
    }));
  };

  const updateEntry = <T extends Experience | Education | Skill>(section: CvSection, id: string, field: keyof T, value: T[keyof T]) => {
     setCvData((prev) => ({
        ...prev,
        [section]: prev[section].map((entry) =>
          (entry as {id: string}).id === id ? { ...entry, [field]: value } : entry
        ),
      }));
  };

  return { cvData, setCvData, updateField, addEntry, removeEntry, updateEntry };
};
