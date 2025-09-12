
import React from 'react';
import { type CvData } from '../types';

interface CvPreviewProps {
  cvData: CvData;
}

const CvPreview: React.FC<CvPreviewProps> = ({ cvData }) => {
  const { personalInfo, summary, experience, education, skills } = cvData;

  const formatDescription = (text: string) => {
    return text.split('\n').map((line, index) => (
      <p key={index} className="text-sm text-gray-700">{line}</p>
    ));
  };

  return (
    <div id="cv-preview" className="bg-white p-8 md:p-12 shadow-lg border border-gray-200 aspect-[210/297] max-w-2xl mx-auto transition-transform duration-300 transform lg:scale-100">
      <div className="cv-content">
        <header className="text-center mb-8 border-b pb-4 border-gray-300">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{personalInfo.name}</h1>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-600 mt-2">
            <span>{personalInfo.address}</span>
            <span>&bull;</span>
            <span>{personalInfo.phone}</span>
            <span>&bull;</span>
            <span>{personalInfo.email}</span>
          </div>
          <div className="flex justify-center items-center space-x-4 text-sm text-blue-600 mt-1">
            <span>{personalInfo.linkedin}</span>
            {personalInfo.github && (
              <>
                <span>&bull;</span>
                <span>{personalInfo.github}</span>
              </>
            )}
          </div>
        </header>

        <section className="mb-6">
          <h2 className="text-lg font-bold text-blue-800 uppercase tracking-wider mb-2 border-b-2 border-blue-200 pb-1">Özet</h2>
          <p className="text-sm text-gray-700">{summary}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold text-blue-800 uppercase tracking-wider mb-2 border-b-2 border-blue-200 pb-1">İş Deneyimi</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-md font-semibold text-gray-800">{exp.jobTitle}</h3>
                <p className="text-sm font-medium text-gray-600">{exp.startDate} - {exp.endDate}</p>
              </div>
              <p className="text-md font-medium text-gray-600 italic">{exp.company}</p>
              <div className="mt-1 list-disc list-inside space-y-1">
                {formatDescription(exp.description)}
              </div>
            </div>
          ))}
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold text-blue-800 uppercase tracking-wider mb-2 border-b-2 border-blue-200 pb-1">Eğitim</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-md font-semibold text-gray-800">{edu.school}</h3>
                <p className="text-sm font-medium text-gray-600">{edu.startDate} - {edu.endDate}</p>
              </div>
              <p className="text-md font-medium text-gray-600 italic">{edu.degree}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-lg font-bold text-blue-800 uppercase tracking-wider mb-2 border-b-2 border-blue-200 pb-1">Yetenekler</h2>
          <div className="flex flex-wrap">
            {skills.map((skill, index) => (
              <span key={skill.id} className="text-sm text-gray-700">
                {skill.name}{index < skills.length - 1 && ', \u00A0'}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CvPreview;
