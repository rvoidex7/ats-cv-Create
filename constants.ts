
import { type CvData } from './types';

export const INITIAL_CV_DATA: CvData = {
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
