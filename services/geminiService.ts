import { GoogleGenAI, Type } from "@google/genai";
import { type CvData, type AtsAnalysisResult } from '../types';

// Cache GoogleGenAI instances
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
        return "The provided API Key is not valid. Please check it.";
    }
    return "Could not connect to Gemini API. Please try again later.";
};

export const generateWithGemini = async (apiKey: string, prompt: string): Promise<string> => {
    if (!apiKey) {
        throw new Error("API Key not found.");
    }
    
    try {
        const ai = getGeminiInstance(apiKey);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text;

        if (!text) {
          throw new Error("Received an empty response from the API.");
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
        summary: { type: Type.STRING, description: "The person's professional summary." },
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
        throw new Error("API Key not found.");
    }

    const prompt = `
SCENARIO:
You are an expert data conversion agent specializing in extracting structured data from unstructured HTML. Your task is to analyze the content of a complex LinkedIn profile HTML file and convert the essential CV information (Personal Info, Work Experience, Education, Projects, etc.) into a clean, structured JSON format.

RULES:
- Your output MUST be ONLY a valid JSON object. Do not add any other text.
- The JSON structure must conform to the project's 'CvData' type.
- **IMPORTANT:** For each work experience, education, skill, and project entry, assign a unique string to the 'id' field, such as 'experience-1', 'education-123'.
- If you cannot find a section you are looking for in the HTML, add that field to the JSON output as an empty array '[]' or an empty string "" but never break the JSON format.
- Extract dates and titles as cleanly as possible.

Here is the HTML content to parse:
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
        matchScore: { type: Type.INTEGER, description: 'The match percentage between the CV and the job description (0-100).' },
        summary: { type: Type.STRING, description: 'A brief summary of the analysis.' },
        matchingKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Keywords found in both the CV and the job description.'
        },
        missingKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Important keywords from the job description that are missing from the CV.'
        },
        actionableFeedback: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Concrete suggestions for improving the CV for this job application.'
        }
    },
    required: ['matchScore', 'summary', 'matchingKeywords', 'missingKeywords', 'actionableFeedback']
};


export const analyzeCvWithGemini = async (apiKey: string, cvData: CvData, jobDescription: string): Promise<AtsAnalysisResult> => {
    if (!apiKey) {
        throw new Error("API Key not found.");
    }

    const cvDataString = JSON.stringify({
        summary: cvData.summary,
        experience: cvData.experience.map(e => ({ position: e.jobTitle, company: e.company, description: e.description })),
        education: cvData.education.map(e => `${e.degree}, ${e.school}`),
        skills: cvData.skills.map(s => s.name)
    }, null, 2);

    const prompt = `
        You are an Application Tracking System (ATS) expert. Your task is to analyze a provided CV against a job description and provide a detailed report in a structured JSON format.

        Here is the CV data:
        \`\`\`json
        ${cvDataString}
        \`\`\`

        Here is the job description:
        """
        ${jobDescription}
        """

        Please perform the following analysis and return the result according to the specified JSON schema:
        1.  **Match Score**: Indicate how well the CV matches the job description as a percentage (0-100%).
        2.  **Summary**: Write a brief summary of the analysis.
        3.  **Matching Keywords**: List the keywords found in both the CV and the job description.
        4.  **Missing Keywords**: List the important keywords that are in the job description but not in the CV.
        5.  **Actionable Feedback**: Provide concrete, actionable suggestions on how the candidate can improve their CV for this position.

        Your entire response must be only the JSON object. Do not add any other text.
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