import { Localization } from '../types';

const en_US: Localization = {
    // CVForm
    PersonalInfoSection: "Personal Info",
    Fullname: "Full Name",
    Email: "Email",
    Phone: "Phone",
    Address: "Address",
    Linkedin: "LinkedIn Profile",
    Github: "GitHub Profile",
    ProfessionalSummarySection: "Professional Summary",
    Summary: "Summary",
    Professional: "Professional",
    ExperienceSection: "Work Experience",
    JobTitle: "Job Title",
    Company: "Company",
    StartDate: "Start Date",
    EndDate: "End Date",
    Description: "Description",
    AddExperience: "Add Experience",
    EducationSection: "Education",
    School: "School",
    Degree: "Degree & Field",
    AddEducation: "Add Education",
    SkillsSection: "Skills",
    AddSkill: "Add Skill",
    Position: "Position",

    // App.tsx
    Title: "ATS Compatible CV Builder",
    HiddenTitle: "ATS CV",
    Beta: "Beta",
    Download: "Download",
    Save: "Save",
    Clear: "Clear",
    Analyze: "Analyze",
    Print: "Print",
    PDF: "PDF",
    ImportCVData: 'Import CV Data',
    SaveCVData: 'Save CV Data',
    ClearAllData: 'Clear All Data',
    ATSAnalyze: 'ATS Analyze',
    DownloadAsPDF: 'Download as PDF',
    NoCVPreview: 'CV Preview object not found.',
    CVImportSuccess: 'CV data imported successfully!',
    ImportFailure: 'Error while importing file',
    ClearConfirmMessage: "Are you sure you want to delete all CV data? This action cannot be undone.",

    // ErrorToast.tsx
    Error: "Error!",
    Close: "Close",

    // AtsAnalysisModal.tsx
    ATSModalTitle: "ATS Compliance Analysis",
    JobDescriptionLabel: "Job Description",
    JobDescriptionPlaceholder: "Paste the job description here...",
    JobDescriptionHelpText: "Paste the job description below to see how well your CV matches the position.",
    GeminiApiKeyMissing: "Gemini API key is not set. Please check your environment variables.",
    JobDescriptionMissing: "Please paste a job description to analyze.",
    AnalyzeButton: "Start Analysis",
    AnalyzingButton: "Analyzing...",
    NewAnalysisButton: "New Analysis",
    OverallMatchScore: "Overall Match Score",
    ImprovementSuggestions: "Improvement Suggestions",
    MatchingKeywords: "Matching Keywords",
    MissingKeywords: "Missing Keywords",

    //LanguageToggleButton.tsx
    ChangeLanguage: "Change Language",
};

export default en_US;
