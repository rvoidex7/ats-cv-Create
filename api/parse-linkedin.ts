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

  // AGENT_NOTE: The user will provide the API key from the client.
  // We will pass it to the geminiService. For now, let's assume it comes in the body.
  // This part needs to be revisited to get the key from the user's context.
  // For now, let's prioritize debugging the Gemini call.
  const apiKey = process.env.GEMINI_API_KEY; // Still using server key for now.

  if (!apiKey) {
    console.error('[API /parse-linkedin] Gemini API key not found in environment variables.');
    return res.status(500).json({ error: 'Server configuration error: API key is missing.' });
  }

  console.log('[API /parse-linkedin] Request received.');

  try {
    const htmlContent = req.body.html;
    if (!htmlContent || typeof htmlContent !== 'string') {
      console.error('[API /parse-linkedin] HTML content not found in request body.');
      return res.status(400).json({ error: 'Request body must contain "html" field.' });
    }

    console.log('[API /parse-linkedin] HTML content received, calling Gemini service...');

    const parsedData: Partial<CvData> = await parseLinkedInHtmlWithGemini(apiKey, htmlContent);

    console.log('[API /parse-linkedin] Successfully parsed data with Gemini.');
    return res.status(200).json(parsedData);

  } catch (error) {
    console.error('[API /parse-linkedin] An error occurred during the process.', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    // Send a more specific error message to the client
    return res.status(500).json({
      error: `An error occurred during parsing: ${errorMessage}`,
      details: error
    });
  }
}
