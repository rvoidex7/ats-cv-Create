
import React from 'react';
import { type CvData } from '../types';

interface CvPreviewProps {
  cvData: CvData;
}

const CvPreview: React.FC<CvPreviewProps> = ({ cvData }) => {
  const { personalInfo, summary, experience, education, skills } = cvData;

  const formatSummary = (text: string) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Boş satır - paragraf sonu
      if (trimmedLine === '') {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${elements.length}`} className="text-sm text-gray-700 mb-3">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        return;
      }
      
      // Liste işaretleri (-, *, •, ◦, ▪, ▫)
      const listMarkers = /^[\-\*\•\◦\▪\▫]\s+(.+)$/;
      const numberedList = /^\d+[\.\)]\s+(.+)$/;
      
      if (listMarkers.test(trimmedLine) || numberedList.test(trimmedLine)) {
        // Önceki paragrafı bitir
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${elements.length}`} className="text-sm text-gray-700 mb-3">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        
        // Liste öğesi ekle
        const content = trimmedLine.replace(listMarkers, '$1').replace(numberedList, '$1');
        elements.push(
          <div key={`li-${elements.length}`} className="flex items-start mb-1">
            <span className="text-blue-600 mr-2 mt-0.5 text-sm">•</span>
            <span className="text-sm text-gray-700">{content}</span>
          </div>
        );
      } else {
        // Normal metin - paragrafın devamı
        currentParagraph.push(trimmedLine);
      }
    });
    
    // Son paragrafı ekle
    if (currentParagraph.length > 0) {
      elements.push(
        <p key={`p-${elements.length}`} className="text-sm text-gray-700 mb-3">
          {currentParagraph.join(' ')}
        </p>
      );
    }
    
    return elements.length > 0 ? elements : <p className="text-sm text-gray-700">{text}</p>;
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
          <div className="summary-content">
            {formatSummary(summary)}
          </div>
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
              <div className="mt-1 experience-description">
                {formatSummary(exp.description)}
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
