import React from 'react';
import { useTranslation } from 'react-i18next';
import { type CvData, type CvSection } from '../types';
import { AddIcon, DeleteIcon } from './IconComponents';
import GeminiEnhancer from './GeminiEnhancer';

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
  const { t } = useTranslation();

  const handleSummaryUpdate = (newSummary: string) => {
    setCvData(prev => ({ ...prev, summary: newSummary }));
  };

  const handleExperienceDescriptionUpdate = (id: string, newDescription: string) => {
    onUpdateEntry('experience', id, 'description', newDescription);
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Section title={t('form.personal_info_title')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('form.full_name')} value={cvData.personalInfo.name} onChange={(e) => onUpdateField('personalInfo', 'name', e.target.value)} autoComplete="name" />
          <Input label={t('form.job_title')} value={cvData.personalInfo.jobTitle} onChange={(e) => onUpdateField('personalInfo', 'jobTitle', e.target.value)} autoComplete="organization-title" />
          <Input label={t('form.email')} type="email" value={cvData.personalInfo.email} onChange={(e) => onUpdateField('personalInfo', 'email', e.target.value)} autoComplete="email" />
          <Input label={t('form.phone')} value={cvData.personalInfo.phone} onChange={(e) => onUpdateField('personalInfo', 'phone', e.target.value)} autoComplete="tel" />
          <Input label={t('form.address')} value={cvData.personalInfo.address} onChange={(e) => onUpdateField('personalInfo', 'address', e.target.value)} autoComplete="street-address" />
          <Input label={t('form.linkedin')} value={cvData.personalInfo.linkedin} onChange={(e) => onUpdateField('personalInfo', 'linkedin', e.target.value)} autoComplete="url" />
          <Input label={t('form.github')} value={cvData.personalInfo.github} onChange={(e) => onUpdateField('personalInfo', 'github', e.target.value)} autoComplete="url" />
        </div>
      </Section>

      {/* Professional Summary */}
      <Section title={t('form.summary_title')}>
        <div className="relative">
          <Textarea label={t('form.summary_label')} value={cvData.summary} onChange={(e) => setCvData({ ...cvData, summary: e.target.value })} />
          <GeminiEnhancer
            promptType="summary"
            context={{ jobTitle: cvData.experience[0]?.jobTitle || 'professional' }}
            currentText={cvData.summary}
            onGeneratedText={handleSummaryUpdate}
          />
        </div>
      </Section>

      {/* Work Experience */}
      <Section title={t('form.experience_title')}>
        {cvData.experience.map((exp) => (
          <div key={exp.id} className="p-4 border dark:border-gray-700 rounded-md mb-4 relative bg-gray-50 dark:bg-gray-800/50">
            <button
              onClick={() => onRemoveEntry('experience', exp.id)}
              className="absolute top-2 right-2 text-gray-400 dark:text-gray-500 hover:text-red-500"
              aria-label={t('form.delete_experience')}
              title={t('form.delete_experience')}
            >
              <DeleteIcon />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label={t('form.position')} value={exp.jobTitle} onChange={(e) => onUpdateEntry('experience', exp.id, 'jobTitle', e.target.value)} autoComplete="organization-title" />
              <Input label={t('form.company')} value={exp.company} onChange={(e) => onUpdateEntry('experience', exp.id, 'company', e.target.value)} autoComplete="organization" />
              <Input label={t('form.start_date')} value={exp.startDate} onChange={(e) => onUpdateEntry('experience', exp.id, 'startDate', e.target.value)} />
              <Input label={t('form.end_date')} value={exp.endDate} onChange={(e) => onUpdateEntry('experience', exp.id, 'endDate', e.target.value)} />
            </div>
            <div className="relative mt-4">
              <Textarea label={t('form.description')} value={exp.description} onChange={(e) => onUpdateEntry('experience', exp.id, 'description', e.target.value)} />
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
          <span>{t('form.add_experience')}</span>
        </button>
      </Section>

      {/* Projects */}
      <Section title={t('form.projects_title')}>
        {cvData.projects.map((prj) => (
          <div key={prj.id} className="p-4 border dark:border-gray-700 rounded-md mb-4 relative bg-gray-50 dark:bg-gray-800/50">
            <button
              onClick={() => onRemoveEntry('projects', prj.id)}
              className="absolute top-2 right-2 text-gray-400 dark:text-gray-500 hover:text-red-500"
              aria-label={t('form.delete_project')}
              title={t('form.delete_project')}
            >
              <DeleteIcon />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label={t('form.project_title')}
                placeholder={t('form.project_title_placeholder')}
                value={prj.title}
                onChange={(e) => onUpdateEntry('projects', prj.id, 'title', e.target.value)}
                autoComplete="organization"
              />
              <Input
                label={t('form.role')}
                placeholder={t('form.role_placeholder')}
                value={prj.role}
                onChange={(e) => onUpdateEntry('projects', prj.id, 'role', e.target.value)}
                autoComplete="organization-title"
              />
              <Input
                label={t('form.tech_context')}
                placeholder={t('form.tech_context_placeholder')}
                value={prj.context ?? ''}
                onChange={(e) => onUpdateEntry('projects', prj.id, 'context', e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="relative mt-4">
              <Textarea
                label={t('form.description')}
                placeholder={t('form.project_desc_placeholder')}
                value={prj.description}
                onChange={(e) => onUpdateEntry('projects', prj.id, 'description', e.target.value)}
              />
            </div>
          </div>
        ))}
        <button onClick={() => onAddEntry('projects')} className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300">
          <AddIcon />
          <span>{t('form.add_project')}</span>
        </button>
      </Section>

      {/* Education */}
      <Section title={t('form.education_title')}>
        {cvData.education.map((edu) => (
          <div key={edu.id} className="p-4 border dark:border-gray-700 rounded-md mb-4 relative bg-gray-50 dark:bg-gray-800/50">
            <button
              onClick={() => onRemoveEntry('education', edu.id)}
              className="absolute top-2 right-2 text-gray-400 dark:text-gray-500 hover:text-red-500"
              aria-label={t('form.delete_education')}
              title={t('form.delete_education')}
            >
              <DeleteIcon />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('form.school')}
                value={edu.school}
                placeholder={t('form.school_placeholder')}
                onChange={(e) => onUpdateEntry('education', edu.id, 'school', e.target.value)}
                autoComplete="organization"
              />
              <Input
                label={t('form.degree_program')}
                value={edu.degree}
                placeholder={t('form.degree_program_placeholder')}
                onChange={(e) => onUpdateEntry('education', edu.id, 'degree', e.target.value)}
              />
              <Input
                label={t('form.start_date')}
                value={edu.startDate}
                placeholder={t('form.date_placeholder')}
                onChange={(e) => onUpdateEntry('education', edu.id, 'startDate', e.target.value)}
              />
              <Input
                label={t('form.end_date')}
                value={edu.endDate}
                placeholder={t('form.date_placeholder')}
                onChange={(e) => onUpdateEntry('education', edu.id, 'endDate', e.target.value)}
              />
            </div>
          </div>
        ))}
        <button onClick={() => onAddEntry('education')} className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300">
          <AddIcon />
          <span>{t('form.add_education')}</span>
        </button>
      </Section>

      {/* Skills */}
      <Section title={t('form.skills_title')}>
        <div className="flex flex-wrap gap-2">
          {cvData.skills.map(skill => (
            <div key={skill.id} className="flex items-center bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm font-medium px-3 py-1 rounded-full">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => onUpdateEntry('skills', skill.id, 'name', e.target.value)}
                className="bg-transparent focus:outline-none w-auto"
                style={{ minWidth: `${skill.name.length + 2}ch` }}
                aria-label={t('form.skill_name_label')}
              />
              <button
                onClick={() => onRemoveEntry('skills', skill.id)}
                className="ml-2 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                aria-label={t('form.delete_skill')}
                title={t('form.delete_skill')}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => onAddEntry('skills')} className="mt-4 flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300">
          <AddIcon />
          <span>{t('form.add_skill')}</span>
        </button>
      </Section>
    </div>
  );
};

export default CvForm;
