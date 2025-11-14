import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parseLinkedInHtmlWithGemini } from '../services/geminiService';
import { CvData } from '../types';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  console.log('[API /parse-linkedin] Request received.');

  try {
    const htmlContent = req.body.html;
    const apiKey = req.body.apiKey || process.env.GEMINI_API_KEY;
    const modelName = typeof req.body.model === 'string' ? req.body.model : undefined;

    if (!htmlContent || typeof htmlContent !== 'string') {
      console.error('[API /parse-linkedin] HTML content not found in request body.');
      return res.status(400).json({ error: 'Request body must contain "html" field.' });
    }

    if (!apiKey || typeof apiKey !== 'string') {
      console.error('[API /parse-linkedin] API key not found.');
      return res.status(400).json({ error: 'API key is required. Please set it in Settings.' });
    }

    console.log('[API /parse-linkedin] HTML content received, calling Gemini service...');
    console.log('[API /parse-linkedin] HTML content length:', htmlContent.length, 'characters');

    const parsedData: Partial<CvData> = await parseLinkedInHtmlWithGemini(apiKey, htmlContent, modelName);

    const preview = JSON.stringify(parsedData, null, 2);
    console.log('[API /parse-linkedin] Successfully parsed data with Gemini. Preview:', preview.slice(0, 1000));
    return res.status(200).json(parsedData);

  } catch (error) {
    console.error('[API /parse-linkedin] An error occurred during the process.', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return res.status(500).json({
      error: `An error occurred during parsing: ${errorMessage}`,
    });
  }
}
