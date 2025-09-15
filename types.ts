
export interface PersonalInfo {
  name: string;
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
}

export type CvSection = 'experience' | 'education' | 'skills';

export interface AtsAnalysisResult {
  matchScore: number;
  summary: string;
  matchingKeywords: string[];
  missingKeywords: string[];
  actionableFeedback: string[];
}

export interface Localization {
  // CVForm.tsx
  PersonalInfoSection: string;
  Fullname: string;
  Email: string;
  Phone: string;
  Address: string;
  Linkedin: string;
  Github: string;
  ProfessionalSummarySection: string;
  Summary: string;
  Professional: string;
  ExperienceSection: string;
  JobTitle: string;
  Company: string;
  StartDate: string;
  EndDate: string;
  Description: string;
  AddExperience: string;
  EducationSection: string;
  School: string;
  Degree: string;
  AddEducation: string;
  SkillsSection: string;
  AddSkill: string;
  Position: string;

  // App.tsx
  Title: string;
  HiddenTitle: string;
  Beta: string;
  Download: string;
  Save: string;
  Clear: string;
  Analyze: string;
  Print: string;
  PDF: string;
  ImportCVData: string;
  SaveCVData: string;
  ClearAllData: string;
  ATSAnalyze: string;
  DownloadAsPDF: string;
  NoCVPreview: string;
  CVImportSuccess: string;
  ImportFailure: string;
  ClearConfirmMessage: string;

  // ErrorToast.tsx
  Error: string;
  Close: string;

  // AtsAnalysisModal.tsx
  ATSModalTitle: string;
  JobDescriptionLabel: string;
  JobDescriptionPlaceholder: string;
  JobDescriptionHelpText: string;
  GeminiApiKeyMissing: string;
  JobDescriptionMissing: string;
  AnalyzeButton: string;
  AnalyzingButton: string;
  NewAnalysisButton: string;
  OverallMatchScore: string;
  ImprovementSuggestions: string;
  MatchingKeywords: string;
  MissingKeywords: string;

  //LanguageToggleButton.tsx
  ChangeLanguage: string;

  
}
