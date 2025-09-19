import React from 'react';
import CvForm from '../components/CvForm';
import { CvData, PersonalInfo } from '../types';

interface EditorPageProps {
  cvData: CvData;
  onUpdateField: (field: keyof PersonalInfo, value: string) => void;
  onAddEntry: (section: 'experience' | 'education' | 'skills') => void;
  onRemoveEntry: (section: 'experience' | 'education' | 'skills', id: string) => void;
  onUpdateEntry: (section: 'experience' | 'education' | 'skills', id: string, field: string, value: string) => void;
  setCvData: (data: CvData | ((prev: CvData) => CvData)) => void;
}

const EditorPage: React.FC<EditorPageProps> = (props) => {
  return (
    <div className="animate-fade-in">
      <CvForm {...props} />
    </div>
  );
};

export default EditorPage;
