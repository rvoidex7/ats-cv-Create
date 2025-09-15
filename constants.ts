
import { type CvData } from './types';

export const INITIAL_CV_DATA_TR: CvData = {
  personalInfo: {
    name: "Adınız Soyadınız",
    email: "email@example.com",
    phone: "555-123-4567",
    linkedin: "linkedin.com/in/adiniz",
    github: "github.com/adiniz",
    address: "Şehir, Ülke",
  },
  summary: "Buraya mesleki özetinizi yazın. 2-3 cümle içinde uzmanlığınızı, deneyiminizi ve kariyer hedeflerinizi vurgulayın. Bu bölüm, işe alım uzmanının dikkatini çekmek için en önemli alanlardan biridir.",
  experience: [
    {
      id: "exp1",
      jobTitle: "Pozisyon Adı",
      company: "Şirket Adı",
      startDate: "Ay Yıl",
      endDate: "Ay Yıl veya Halen",
      description: "- Sorumluluklarınızı ve başarılarınızı listeleyin.\n- Ölçülebilir sonuçlar ekleyin (örneğin, 'verimliliği %20 artırdım').\n- Her maddeyi aksiyon fiilleriyle başlatın.",
    },
  ],
  education: [
    {
      id: "edu1",
      school: "Üniversite Adı",
      degree: "Bölüm ve Derece (Örn: Bilgisayar Müh. Lisans)",
      startDate: "Ay Yıl",
      endDate: "Ay Yıl",
    },
  ],
  skills: [
    { id: "skill1", name: "React" },
    { id: "skill2", name: "TypeScript" },
    { id: "skill3", name: "Node.js" },
    { id: "skill4", name: "Proje Yönetimi" },
  ],
};

export const INITIAL_CV_DATA_EN: CvData = {
  personalInfo: {
    name: "Your Name",
    email: "email@example.com",
    phone: "+1 555-123-4567",
    linkedin: "linkedin.com/in/yourname",
    github: "github.com/yourname",
    address: "City, Country",
  },
  summary: "Write your professional summary here. In 2-3 sentences, highlight your expertise, experience, and career goals. This section is one of the most important to capture the recruiter's attention.",
  experience: [
    {
      id: "exp1",
      jobTitle: "Job Title",
      company: "Company Name",
      startDate: "Month Year",
      endDate: "Month Year or Present",
      description: "- List your responsibilities and achievements.\n- Include measurable results (e.g., 'Increased efficiency by 20%').\n- Start each bullet point with an action verb.",
    },
  ],
  education: [
    {
      id: "edu1",
      school: "University Name",
      degree: "Degree & Field (e.g., B.Sc. in Computer Engineering)",
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
};