

import React from 'react';
import { type CvData, type CvSection } from '../types';
import { AddIcon, DeleteIcon } from './IconComponents';
import GeminiEnhancer from './GeminiEnhancer';
import { useLocalization } from '@/hooks/useLocalization';

interface CvFormProps {
  cvData: CvData;
  onUpdateField: (section: 'personalInfo', field: keyof CvData['personalInfo'], value: string) => void;
  onAddEntry: (section: CvSection) => void;
  onRemoveEntry: (section: CvSection, id: string) => void;
  onUpdateEntry: (section: CvSection, id: string, field: string, value: string) => void;
  setCvData: React.Dispatch<React.SetStateAction<CvData>>;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b dark:border-gray-600 pb-2">{title}</h2>
    {children}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
    />
  </div>
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
    <textarea
      {...props}
      rows={5}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
    />
  </div>
);

const CvForm: React.FC<CvFormProps> = ({ cvData, onUpdateField, onAddEntry, onRemoveEntry, onUpdateEntry, setCvData }) => {
  const { localization } = useLocalization();

  const handleSummaryUpdate = (newSummary: string) => {
    setCvData(prev => ({ ...prev, summary: newSummary }));
  };

  const handleExperienceDescriptionUpdate = (id: string, newDescription: string) => {
     onUpdateEntry('experience', id, 'description', newDescription);
  }

  return (
    <div className="space-y-6">
      <Section title={localization.PersonalInfoSection}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={localization.Fullname} value={cvData.personalInfo.name} onChange={(e) => onUpdateField('personalInfo', 'name', e.target.value)} autoComplete="name" />
          <Input label={localization.Email} type="email" value={cvData.personalInfo.email} onChange={(e) => onUpdateField('personalInfo', 'email', e.target.value)} autoComplete="email" />
          <Input label={localization.Phone} value={cvData.personalInfo.phone} onChange={(e) => onUpdateField('personalInfo', 'phone', e.target.value)} autoComplete="tel" />
          <Input label={localization.Address} value={cvData.personalInfo.address} onChange={(e) => onUpdateField('personalInfo', 'address', e.target.value)} autoComplete="street-address" />
          <Input label={localization.Linkedin} value={cvData.personalInfo.linkedin} onChange={(e) => onUpdateField('personalInfo', 'linkedin', e.target.value)} autoComplete="url" />
          <Input label={localization.Github} value={cvData.personalInfo.github} onChange={(e) => onUpdateField('personalInfo', 'github', e.target.value)} autoComplete="url" />
        </div>
      </Section>

      <Section title={localization.ProfessionalSummarySection}>
        <div className="relative">
          <Textarea label={localization.Summary} value={cvData.summary} onChange={(e) => setCvData({ ...cvData, summary: e.target.value })} />
           <GeminiEnhancer
              promptType="summary"
              context={{ jobTitle: cvData.experience[0]?.jobTitle || localization.Professional }}
              currentText={cvData.summary}
              onGeneratedText={handleSummaryUpdate}
            />
        </div>
      </Section>

      <Section title={localization.ExperienceSection}>
        {cvData.experience.map((exp, index) => (
          <div key={exp.id} className="p-4 border dark:border-gray-700 rounded-md mb-4 relative bg-gray-50 dark:bg-gray-800/50">
            <button onClick={() => onRemoveEntry('experience', exp.id)} className="absolute top-2 right-2 text-gray-400 dark:text-gray-500 hover:text-red-500">
              <DeleteIcon />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label={localization.Position} value={exp.jobTitle} onChange={(e) => onUpdateEntry('experience', exp.id, 'jobTitle', e.target.value)} autoComplete="organization-title" />
              <Input label={localization.Company} value={exp.company} onChange={(e) => onUpdateEntry('experience', exp.id, 'company', e.target.value)} autoComplete="organization" />
              <Input label={localization.StartDate} value={exp.startDate} onChange={(e) => onUpdateEntry('experience', exp.id, 'startDate', e.target.value)} />
              <Input label={localization.EndDate} value={exp.endDate} onChange={(e) => onUpdateEntry('experience', exp.id, 'endDate', e.target.value)} />
            </div>
            <div className="relative mt-4">
              <Textarea label={localization.Description} value={exp.description} onChange={(e) => onUpdateEntry('experience', exp.id, 'description', e.target.value)} />
              <GeminiEnhancer
                promptType="experience"
                context={{ jobTitle: exp.jobTitle, company: exp.company }}
                currentText={exp.description}
                onGeneratedText={(text) => handleExperienceDescriptionUpdate(exp.id, text)}
            />
            </div>
          </div>
        ))}
        <button onClick={() => onAddEntry('experience')} className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300">
          <AddIcon />
          <span>{localization.AddExperience}</span>
        </button>
      </Section>

      <Section title={localization.EducationSection}>
        {cvData.education.map((edu, index) => (
          <div key={edu.id} className="p-4 border dark:border-gray-700 rounded-md mb-4 relative bg-gray-50 dark:bg-gray-800/50">
            <button onClick={() => onRemoveEntry('education', edu.id)} className="absolute top-2 right-2 text-gray-400 dark:text-gray-500 hover:text-red-500">
              <DeleteIcon />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label={localization.School} value={edu.school} onChange={(e) => onUpdateEntry('education', edu.id, 'school', e.target.value)} autoComplete="organization" />
              <Input label={localization.Degree} value={edu.degree} onChange={(e) => onUpdateEntry('education', edu.id, 'degree', e.target.value)} />
              <Input label={localization.StartDate} value={edu.startDate} onChange={(e) => onUpdateEntry('education', edu.id, 'startDate', e.target.value)} />
              <Input label={localization.EndDate} value={edu.endDate} onChange={(e) => onUpdateEntry('education', edu.id, 'endDate', e.target.value)} />
            </div>
          </div>
        ))}
        <button onClick={() => onAddEntry('education')} className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300">
          <AddIcon />
          <span>{localization.AddEducation}</span>
        </button>
      </Section>
      
      <Section title={localization.SkillsSection}>
        <div className="flex flex-wrap gap-2">
            {cvData.skills.map(skill => (
                <div key={skill.id} className="flex items-center bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm font-medium px-3 py-1 rounded-full">
                    <input 
                        type="text" 
                        value={skill.name} 
                        onChange={(e) => onUpdateEntry('skills', skill.id, 'name', e.target.value)}
                        className="bg-transparent focus:outline-none w-auto"
                        style={{minWidth: `${skill.name.length + 2}ch`}}
                    />
                    <button onClick={() => onRemoveEntry('skills', skill.id)} className="ml-2 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                        &times;
                    </button>
                </div>
            ))}
        </div>
        <button onClick={() => onAddEntry('skills')} className="mt-4 flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300">
          <AddIcon />
          <span>{localization.AddSkill}</span>
        </button>
      </Section>
    </div>
  );
};

export default CvForm;
