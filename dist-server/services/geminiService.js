import { GoogleGenAI, Type } from "@google/genai";
// Cache GoogleGenAI instances
const geminiInstances = new Map();
const getGeminiInstance = (apiKey) => {
    if (!geminiInstances.has(apiKey)) {
        geminiInstances.set(apiKey, new GoogleGenAI({ apiKey }));
    }
    return geminiInstances.get(apiKey);
};
const isQuotaError = (error) => {
    const code = error?.status ?? error?.error?.code;
    const status = error?.error?.status;
    return code === 429 || status === 'RESOURCE_EXHAUSTED';
};
const extractRetryDelaySeconds = (error) => {
    const details = error?.error?.details;
    if (!Array.isArray(details)) {
        return null;
    }
    for (const detail of details) {
        if (detail?.['@type'] === 'type.googleapis.com/google.rpc.RetryInfo') {
            const retryDelay = detail.retryDelay;
            if (typeof retryDelay === 'string') {
                const match = retryDelay.match(/(\d+(?:\.\d+)?)s/);
                if (match) {
                    return parseFloat(match[1]);
                }
            }
            else if (typeof retryDelay === 'object' && retryDelay !== null) {
                const seconds = Number(retryDelay.seconds ?? 0);
                const nanos = Number(retryDelay.nanos ?? 0);
                if (!Number.isNaN(seconds) || !Number.isNaN(nanos)) {
                    return seconds + nanos / 1e9;
                }
            }
        }
    }
    return null;
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const handleApiError = (error) => {
    console.error("Gemini API Error:", error);
    const message = error?.error?.message ?? error?.message ?? String(error);
    const code = error?.status ?? error?.error?.code;
    const status = error?.error?.status;
    if (typeof message === 'string' && message.includes('API key not valid')) {
        return "The provided API Key appears to be invalid. Please double-check it in Settings.";
    }
    if (code === 401 || status === 'UNAUTHENTICATED') {
        return "Gemini rejected the request due to authentication. Please verify your API Key.";
    }
    if (isQuotaError(error)) {
        const retrySeconds = extractRetryDelaySeconds(error);
        if (retrySeconds) {
            const rounded = Math.max(5, Math.ceil(retrySeconds));
            return `Gemini API quota limit reached. Wait about ${rounded} seconds and try again, or upgrade your plan.`;
        }
        return "Gemini API quota limit reached. Please try again in a few seconds or upgrade your plan.";
    }
    return `Could not connect to Gemini API. Details: ${message}`;
};
export const generateWithGemini = async (apiKey, prompt) => {
    if (!apiKey) {
        throw new Error("API Key not found.");
    }
    try {
        const ai = getGeminiInstance(apiKey);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const text = typeof response.text === 'function' ? response.text() : response.text;
        if (!text) {
            throw new Error("Received an empty response from the API.");
        }
        return text.trim();
    }
    catch (error) {
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
export const parseLinkedInHtmlWithGemini = async (apiKey, htmlContent, modelName = 'gemini-2.5-flash', attempt = 0) => {
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
            model: modelName,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: cvDataSchema,
            }
        });
        const rawText = typeof response.text === 'function' ? response.text() : response.text;
        const jsonString = rawText?.trim();
        if (!jsonString) {
            throw new Error("Gemini returned an empty response.");
        }
        const result = JSON.parse(jsonString);
        return result;
    }
    catch (error) {
        if (isQuotaError(error) && attempt < 2) {
            const retrySeconds = extractRetryDelaySeconds(error) ?? 12;
            const waitMs = Math.max(5, Math.ceil(retrySeconds)) * 1000;
            console.warn(`[Gemini] Quota hit. Retrying in ${waitMs}ms (attempt ${attempt + 1}).`);
            await delay(waitMs);
            return parseLinkedInHtmlWithGemini(apiKey, htmlContent, modelName, attempt + 1);
        }
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
export const analyzeCvWithGemini = async (apiKey, cvData, jobDescription) => {
    if (!apiKey) {
        throw new Error("API Key not found.");
    }
    const cvDataString = JSON.stringify({
        summary: cvData.summary,
        experience: cvData.experience.map((e) => ({ position: e.jobTitle, company: e.company, description: e.description })),
        education: cvData.education.map((e) => `${e.degree}, ${e.school}`),
        skills: cvData.skills.map((s) => s.name)
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
        const rawText = typeof response.text === 'function' ? response.text() : response.text;
        const jsonString = rawText?.trim();
        if (!jsonString) {
            throw new Error("Gemini returned an empty response.");
        }
        const result = JSON.parse(jsonString);
        return result;
    }
    catch (error) {
        throw new Error(handleApiError(error));
    }
};
