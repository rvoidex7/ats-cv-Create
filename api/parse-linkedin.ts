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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Gemini API key not found in environment variables.');
    return res.status(500).json({ error: 'Sunucu yapılandırma hatası: API anahtarı eksik.' });
  }

  try {
    const htmlContent = req.body.html;
    if (!htmlContent || typeof htmlContent !== 'string') {
      return res.status(400).json({ error: 'İstek gövdesinde "html" alanı bulunmalıdır.' });
    }

    const parsedData: Partial<CvData> = await parseLinkedInHtmlWithGemini(apiKey, htmlContent);

    return res.status(200).json(parsedData);

  } catch (error) {
    console.error('Error parsing LinkedIn HTML:', error);
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.';
    return res.status(500).json({ error: `Ayrıştırma sırasında bir hata oluştu: ${errorMessage}` });
  }
}
