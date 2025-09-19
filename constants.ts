import { type CvData } from './types';

export const INITIAL_CV_DATA: CvData = {
  personalInfo: {
    name: "Your Name",
    jobTitle: "Software Developer",
    email: "email@example.com",
    phone: "+90 555 123 4567",
    linkedin: "linkedin.com/in/yourname",
    github: "github.com/yourname",
    address: "City, Country",
  },
  summary:
    "Write your professional summary here. In 2–3 sentences, highlight your expertise, years of experience, and career focus. This section should quickly convey your value to hiring managers.",
  experience: [
    {
      id: "exp1",
      jobTitle: "Job Title",
      company: "Company Name",
      startDate: "Month Year",
      endDate: "Month Year or Present",
      description:
        "- Led key features from design to production, collaborating with cross-functional teams.\n" +
        "- Improved performance by 20% through query optimization and caching.\n" +
        "- Wrote clean, testable code and increased unit test coverage to 85%.",
    },
  ],
  education: [
    {
      id: "edu1",
      school: "University Name",
      degree: "Degree & Program (e.g., BSc in Computer Engineering)",
      startDate: "Month Year",
      endDate: "Month Year",
    },
  ],
  skills: [
    { id: "skill1", name: "React" },
    { id: "skill2", name: "TypeScript" },
    { id: "skill3", name: "Node.js" },
    { id: "skill4", name: "Project Management" },
  ],
  projects: [
    {
      id: "prj1",
      title: "Project Name",
      context: "Technologies Used (e.g., .NET, React, PostgreSQL)",
      role: "Your Role (e.g., Backend Developer)",
      description:
        "- Built RESTful APIs and integrated authentication/authorization.\n" +
        "- Designed database schema and optimized queries for scalability.\n" +
        "- Implemented CI/CD and containerized services with Docker.",
    },
  ],
};
