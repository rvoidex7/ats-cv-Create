import React from 'react';
import { useTranslation } from 'react-i18next';
import { type CvData } from '../types';

interface CvPreviewProps {
  cvData: CvData;
}

const toHref = (url?: string) => !url ? "" : url.startsWith("http") ? url : `https://${url}`;
const pretty = (url?: string) => !url ? "" : url.replace(/^https?:\/\//, "");

const CvPreview: React.FC<CvPreviewProps> = ({ cvData }) => {
  const { t, i18n } = useTranslation();
  const { personalInfo, summary, experience, education, skills, projects } = cvData;

  const formatSummary = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];

    const listMarkers = /^[-*•◦▪▫]\s+(.+)$/;
    const numberedList = /^\d+[.)]\s+(.+)$/;

    const flush = () => {
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={`p-${elements.length}`} className="text-[11px] text-gray-700 mb-[6px] leading-normal">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }
    };

    lines.forEach((raw) => {
      const line = raw.trim();
      if (line === '') { flush(); return; }
      if (listMarkers.test(line) || numberedList.test(line)) {
        flush();
        const content = line.replace(listMarkers, '$1').replace(numberedList, '$1');
        elements.push(
          <div key={`li-${elements.length}`} className="flex items-start mb-[4px]">
            <span className="text-blue-600 mr-2 text-[11px] leading-snug">•</span>
            <span className="flex-1 text-[11px] text-gray-700 leading-normal">{content}</span>
          </div>
        );
      } else {
        currentParagraph.push(line);
      }
    });

    flush();
    return elements.length ? elements : <p className="text-[11px] text-gray-700">{text}</p>;
  };

  const projectHeader = (p: {title:string; context?:string; role:string}) =>
    `${p.title}${p.context ? ` (${p.context})` : ''} | ${p.role}`;

  return (
    <div id="cv-preview" lang={i18n.language} className="bg-white shadow-lg border border-gray-200 aspect-[210/297] w-full text-gray-700 text-[11px] p-[32px_36px]">
      <div className="cv-content">
        <header className="text-center mb-[16px] border-b border-gray-300 pb-[12px]">
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">
            {personalInfo.name} | {personalInfo.jobTitle}
          </h1>
          <div className="flex justify-center items-center space-x-2 text-[10px] text-gray-600 mt-[6px]">
            {personalInfo.address && <span>{personalInfo.address}</span>}
            {personalInfo.address && (personalInfo.phone || personalInfo.email) && <span>&bull;</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.phone && personalInfo.email && <span>&bull;</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
          </div>
          <div className="flex justify-center items-center flex-wrap gap-x-2 text-[10px] text-blue-600 mt-1">
            {personalInfo.linkedin && (
              <a href={toHref(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:underline break-words">
                {pretty(personalInfo.linkedin)}
              </a>
            )}
            {personalInfo.linkedin && personalInfo.github && <span className="text-gray-400 select-none">•</span>}
            {personalInfo.github && (
              <a href={toHref(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="hover:underline break-words">
                {pretty(personalInfo.github)}
              </a>
            )}
          </div>
        </header>

        <section className="mb-[14px]">
          <h2 className="text-[13px] font-bold text-blue-800 uppercase tracking-wider mb-2 border-b-2 border-blue-200 pb-1">{t('preview.summary_title')}</h2>
          <div className="summary-content">{formatSummary(summary)}</div>
        </section>

        <section className="mb-[14px]">
          <h2 className="text-[13px] font-bold text-blue-800 uppercase tracking-wider mb-2 border-b-2 border-blue-200 pb-1">{t('preview.experience_title')}</h2>
          {experience.map(exp => (
            <div key={exp.id} className="mb-[10px]">
              <div className="flex justify-between items-baseline">
                <h3 className="text-[12px] font-bold text-gray-800">{exp.jobTitle}</h3>
                <p className="text-[10px] font-medium text-gray-600">{exp.startDate} - {exp.endDate}</p>
              </div>
              <p className="text-[11px] font-medium text-gray-600 italic mt-[2px]">{exp.company}</p>
              <div className="mt-1">{formatSummary(exp.description)}</div>
            </div>
          ))}
        </section>

        {projects.length > 0 && (
          <section className="mb-[14px]">
            <h2 className="text-[13px] font-bold text-blue-800 uppercase tracking-wider mb-2 border-b-2 border-blue-200 pb-1">{t('preview.projects_title')}</h2>
            {projects.map(p => (
              <div key={p.id} className="mb-2">
                <h3 className="text-[12px] font-bold text-blue-800 mb-[2px]">{projectHeader(p)}</h3>
                <div className="mt-1">{formatSummary(p.description)}</div>
              </div>
            ))}
          </section>
        )}

        <section className="mb-[14px]">
          <h2 className="text-[13px] font-bold text-blue-800 uppercase tracking-wider mb-2 border-b-2 border-blue-200 pb-1">{t('preview.education_title')}</h2>
          {education.map(edu => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="text-[12px] font-bold text-gray-800">{edu.school}</h3>
                <p className="text-[10px] font-medium text-gray-600">{edu.startDate} - {edu.endDate}</p>
              </div>
              <p className="text-[11px] font-medium text-gray-600 italic">{edu.degree}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-[13px] font-bold text-blue-800 uppercase tracking-wider mb-2 border-b-2 border-blue-200 pb-1">{t('preview.skills_title')}</h2>
          <div className="flex flex-wrap">
            {skills.map((skill, i) => (
              <span key={skill.id} className="text-[11px] text-gray-700">
                {skill.name}{i < skills.length - 1 && ', \u00A0'}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CvPreview;
