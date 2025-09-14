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