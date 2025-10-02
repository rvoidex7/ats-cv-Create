import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { JSDOM } from 'jsdom';
import 'dotenv/config';

interface CvData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    website: string;
  };
  summary: string;
  experience: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
  }[];
  skills: string[];
}

function extractTextFromHtml(htmlContent: string): string {
  console.log('[server] Starting HTML text extraction with JSDOM...');
  const dom = new JSDOM(htmlContent);
  const doc = dom.window.document;

  // Try to find the main content element first, fallback to body
  const mainContent = doc.querySelector('.scaffold-layout__main') || doc.querySelector('body');

  if (mainContent) {
    // Remove script, style, and other irrelevant elements
    const elementsToRemove = mainContent.querySelectorAll('script, style, noscript, svg, header, footer, nav, aside');
    elementsToRemove.forEach(item => item.remove());

    let text = mainContent.textContent || "";
    text = text.replace(/\s+/g, ' ').trim();
    console.log('[server] HTML text extraction complete.');
    return text;
  }

  console.log('[server] No main content or body element found. Returning empty string.');
  return '';
}

async function parseLinkedInHandler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('[server] Gemini API key not found in environment variables.');
    return res.status(500).json({ error: 'Server configuration error: API key is missing.' });
  }

  console.log('[server] Request received for /api/parse-linkedin.');

  try {
    const htmlContent = req.body?.html;
    if (!htmlContent || typeof htmlContent !== 'string') {
      console.error('[server] HTML content not found in request body.');
      return res.status(400).json({ error: 'Request body must contain "html" field.' });
    }

    console.log('[server] HTML content received, starting pre-processing...');
    const cleanedText = extractTextFromHtml(htmlContent);
    console.log('[server] Pre-processing complete. Calling Gemini service...');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Lütfen aşağıdaki LinkedIn profil HTML metnini analiz ederek bilgileri JSON formatında çıkar. JSON formatı şu şekilde olmalı: {"personalInfo": {"name": "", "email": "", "phone": "", "linkedin": "", "github": "", "website": ""}, "summary": "", "experience": [{"title": "", "company": "", "location": "", "startDate": "", "endDate": "", "description": [""]}], "education": [{"institution": "", "degree": "", "fieldOfStudy": "", "startDate": "", "endDate": ""}], "skills": [""]}. İşte metin:\n\n${cleanedText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response to be valid JSON
    const cleanedTextResponse = text.replace(/```json|```/g, '').trim();

    const parsedData: Partial<CvData> = JSON.parse(cleanedTextResponse);

    console.log('[server] Successfully parsed data with Gemini.');
    return res.status(200).json(parsedData);

  } catch (error) {
    console.error('[server] An error occurred during the process.', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return res.status(500).json({
      error: `An error occurred during parsing: ${errorMessage}`,
      details: error
    });
  }
}

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.get('/api', (_req, res) => {
  res.send('API Server is running!');
});

app.post('/api/parse-linkedin', parseLinkedInHandler);

app.listen(port, () => {
  console.log(`[server] API server listening on http://localhost:${port}`);
});