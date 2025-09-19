
export interface PersonalInfo {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  address: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface CvData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: ProjectItem[];
}

export type CvSection = 'experience' | 'education' | 'skills' | 'projects'; 

export interface ProjectItem {
  id: string;
  title: string;
  context?: string;
  role: string;     
  description: string;
}

export interface AtsAnalysisResult {
  matchScore: number;
  summary: string;
  matchingKeywords: string[];
  missingKeywords: string[];
  actionableFeedback: string[];
}

