import { GoogleGenAI, Type } from "@google/genai";
import { type CvData, type AtsAnalysisResult } from '../types';

// GoogleGenAI instance'larını cache'le
const geminiInstances = new Map<string, GoogleGenAI>();

const getGeminiInstance = (apiKey: string): GoogleGenAI => {
    if (!geminiInstances.has(apiKey)) {
        geminiInstances.set(apiKey, new GoogleGenAI({ apiKey }));
    }
    return geminiInstances.get(apiKey)!;
};

const handleApiError = (error: any): string => {
    console.error("Gemini API Error:", error);
    if (error.toString().includes('API key not valid')) {
        return "Sağlanan API Anahtarı geçersiz. Lütfen kontrol edin.";
    }
    return "Gemini API ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyin.";
};

export const generateWithGemini = async (apiKey: string, prompt: string): Promise<string> => {
    if (!apiKey) {
        throw new Error("API Anahtarı bulunamadı.");
    }
    
    try {
        const ai = getGeminiInstance(apiKey);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text;

        if (!text) {
          throw new Error("API'den boş yanıt alındı.");
        }
        
        return text.trim();

    } catch (error) {
       throw new Error(handleApiError(error));
    }
};

const cvDataSchema = {
    type: Type.OBJECT,
    properties: {
        personalInfo: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                linkedin: { type: Type.STRING },
            },
            required: ['name']
        },
        summary: { type: Type.STRING, description: 'Kişinin profesyonel özeti.' },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    jobTitle: { type: Type.STRING },
                    company: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ['id', 'jobTitle', 'company']
            }
        },
        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    school: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING }
                },
                required: ['id', 'school', 'degree']
            }
        },
        skills: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING }
                },
                required: ['id', 'name']
            }
        },
        projects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    context: { type: Type.STRING },
                    role: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ['id', 'title']
            }
        },
    },
    required: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects']
};


export const parseLinkedInHtmlWithGemini = async (apiKey: string, htmlContent: string): Promise<Partial<CvData>> => {
    if (!apiKey) {
        throw new Error("API Anahtarı bulunamadı.");
    }

    const prompt = `
SENARYO:
Sen, yapısal olmayan HTML verilerini ayıklama konusunda uzman bir veri dönüştürme aracısın. Görevin, sana verilen karmaşık bir LinkedIn profil HTML dosyasının içeriğini analiz etmek ve içindeki temel CV bilgilerini (Kişisel Bilgiler, İş Deneyimi, Eğitim, Projeler vb.) temiz, yapılandırılmış bir JSON formatına dönüştürmektir.

KURALLAR:
- Çıktın SADECE ve SADECE valid bir JSON nesnesi olmalıdır. Başka hiçbir metin ekleme.
- JSON yapısı, projenin \`CvData\` tipine uygun olmalıdır.
- **ÖNEMLİ:** Her bir iş deneyimi, eğitim, yetenek ve proje girdisi için \`id\` alanına \`experience-1\`, \`education-123\` gibi benzersiz bir string ata.
- HTML içinde aradığın bir bölümü bulamazsan, o alanı JSON çıktısına boş bir dizi \`[]\` veya boş metin \`""\` olarak ekle ama asla JSON formatını bozma.
- Tarihleri ve unvanları mümkün olduğunca temiz bir şekilde ayıkla.

İşte ayıklaman gereken HTML içeriği:
"""
${htmlContent}
"""
    `;

    try {
        const ai = getGeminiInstance(apiKey);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: cvDataSchema,
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result as Partial<CvData>;

    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: { type: Type.INTEGER, description: 'CV ve iş ilanı arasındaki eşleşme yüzdesi (0-100).' },
        summary: { type: Type.STRING, description: 'Analizin kısa bir özeti.' },
        matchingKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Hem CV\'de hem de iş ilanında bulunan anahtar kelimeler.'
        },
        missingKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'İş ilanında olup CV\'de eksik olan önemli anahtar kelimeler.'
        },
        actionableFeedback: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'CV\'yi bu iş ilanı için iyileştirmeye yönelik somut öneriler.'
        }
    },
    required: ['matchScore', 'summary', 'matchingKeywords', 'missingKeywords', 'actionableFeedback']
};


export const analyzeCvWithGemini = async (apiKey: string, cvData: CvData, jobDescription: string): Promise<AtsAnalysisResult> => {
    if (!apiKey) {
        throw new Error("API Anahtarı bulunamadı.");
    }

    const cvDataString = JSON.stringify({
        özet: cvData.summary,
        deneyim: cvData.experience.map(e => ({ pozisyon: e.jobTitle, sirket: e.company, aciklama: e.description })),
        eğitim: cvData.education.map(e => `${e.degree}, ${e.school}`),
        yetenekler: cvData.skills.map(s => s.name)
    }, null, 2);

    const prompt = `
        Sen bir Başvuru Takip Sistemi (ATS) uzmanısın. Görevin, sağlanan CV'yi bir iş ilanına göre analiz etmek ve Türkçe olarak yapılandırılmış bir JSON formatında ayrıntılı bir rapor sunmaktır.

        İşte CV verileri:
        \`\`\`json
        ${cvDataString}
        \`\`\`

        İşte iş ilanı:
        """
        ${jobDescription}
        """

        Lütfen aşağıdaki analizi yap ve sonucu belirtilen JSON şemasına uygun olarak döndür:
        1.  **Eşleşme Skoru**: CV'nin iş ilanına ne kadar uygun olduğunu yüzde olarak belirt (%0-100).
        2.  **Özet**: Analizin kısa bir özetini yaz.
        3.  **Eşleşen Anahtar Kelimeler**: Hem CV'de hem de ilanda bulunan anahtar kelimeleri listele.
        4.  **Eksik Anahtar Kelimeler**: İlanda olan ama CV'de olmayan önemli anahtar kelimeleri listele.
        5.  **Eyleme Geçirilebilir Geri Bildirim**: Adayın CV'sini bu pozisyon için nasıl daha iyi hale getirebileceğine dair somut, eyleme geçirilebilir öneriler sun.

        Tüm yanıtın sadece JSON nesnesi olmalıdır. Başka hiçbir metin ekleme.
    `;

    try {
        const ai = getGeminiInstance(apiKey);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result as AtsAnalysisResult;
    } catch (error) {
       throw new Error(handleApiError(error));
    }
};