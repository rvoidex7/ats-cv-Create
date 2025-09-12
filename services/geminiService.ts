
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available. In a real app, this should be handled securely.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: apiKey! });

export const generateWithGemini = async (prompt: string): Promise<string> => {
    if (!apiKey) {
        return "API Anahtarı bulunamadı. Lütfen ortam değişkenlerini kontrol edin.";
    }

    try {
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
        console.error("Gemini API Error:", error);
        throw new Error("Gemini API ile iletişim kurulamadı.");
    }
};
