import React from 'react';
import { type CvData } from '../types';

interface CvPreviewProps {
  cvData: CvData;
}

const toHref = (url?: string) => !url ? "" : url.startsWith("http") ? url : `https://${url}`;
const pretty = (url?: string) => !url ? "" : url.replace(/^https?:\/\//, "");

const CvPreview: React.FC<CvPreviewProps> = ({ cvData }) => {
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
          <p key={`p-${elements.length}`} className="text-sm text-gray-700 mb-3">
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
          <div key={`li-${elements.length}`} className="flex items-start mb-1">
            <span className="text-blue-600 mr-2 mt-0.5 text-sm">•</span>
            <span className="text-sm text-gray-700">{content}</span>
          </div>
        );
      } else {
        currentParagraph.push(line);
      }
    });

    flush();
    return elements.length ? elements : <p className="text-sm text-gray-700">{text}</p>;
  };

  const projectHeader = (p: {title:string; context?:string; role:string}) =>
    `${p.title}${p.context ? ` (${p.context})` : ''} | ${p.role}`;

  return (
    <div id="cv-preview" lang="en" className="bg-white p-8 md:p-12 shadow-lg border border-gray-200 aspect-[210/297] w-full">
      <div className="cv-content">
        <header className="text-center mb-8 border-b pb-4 border-gray-300">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {personalInfo.name} | {personalInfo.jobTitle}
          </h1>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-600 mt-2">
            {personalInfo.address && <span>{personalInfo.address}</span>}
            {personalInfo.address && (personalInfo.phone || personalInfo.email) && <span>&bull;</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.phone && personalInfo.email && <span>&bull;</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
          </div>

          <div className="flex justify-center items-center flex-wrap gap-4 text-sm text-blue-600 mt-1">
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

        {/* Özet */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-blue-800 uppercase tracking-wider mb-2 border-b-2 border-blue-200 pb-1">Professional Summary</h2>
          <div className="summary-content">{formatSummary(summary)}</div>
        </section>

        {/* İş Deneyimi */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-blue-800 uppercase tracking-wider mb-2 border-b-2 border-blue-200 pb-1">Work Experience</h2>
          {experience.map(exp => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-md font-semibold text-gray-800">{exp.jobTitle}</h3>
                <p className="text-sm font-medium text-gray-600">{exp.startDate} - {exp.endDate}</p>
              </div>
              <p className="text-md font-medium text-gray-600 italic">{exp.company}</p>
              <div className="mt-1">{formatSummary(exp.description)}</div>
            </div>
          ))}
        </section>

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 uppercase tracking-wider mb-2 border-b-2 border-blue-200 pb-1">Projects</h2>
            {projects.map(p => (
              <div key={p.id} className="mb-4">
                <h3 className="text-md font-semibold text-blue-800">{projectHeader(p)}</h3>
                <div className="mt-1">{formatSummary(p.description)}</div>
              </div>
            ))}
          </section>
        )}

        {/* Eğitim */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-blue-800 uppercase tracking-wider mb-2 border-b-2 border-blue-200 pb-1">Education</h2>
          {education.map(edu => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-md font-semibold text-gray-800">{edu.school}</h3>
                <p className="text-sm font-medium text-gray-600">{edu.startDate} - {edu.endDate}</p>
              </div>
              <p className="text-md font-medium text-gray-600 italic">{edu.degree}</p>
            </div>
          ))}
        </section>

        {/* Yetenekler */}
        <section>
          <h2 className="text-lg font-bold text-blue-800 uppercase tracking-wider mb-2 border-b-2 border-blue-200 pb-1">Technical Skills</h2>
          <div className="flex flex-wrap">
            {skills.map((skill, i) => (
              <span key={skill.id} className="text-sm text-gray-700">
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
