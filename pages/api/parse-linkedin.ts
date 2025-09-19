import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parseLinkedInHtmlWithGemini } from '../../services/geminiService';
import { type CvData } from '../../types';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const htmlContent = req.body.html as string;
  if (!htmlContent) {
    return res.status(400).json({ error: 'HTML content is missing' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured on the server' });
  }

  try {
    const parsedData = await parseLinkedInHtmlWithGemini(apiKey, htmlContent);
    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error parsing LinkedIn HTML:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: 'Failed to parse LinkedIn profile', details: errorMessage });
  }
}
