import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { JSDOM } from 'jsdom';
import { parseLinkedInHtmlWithGemini } from './services/geminiService.js';
function extractTextFromHtml(htmlContent) {
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
async function parseLinkedInHandler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).send('Method Not Allowed');
    }
    console.log('[server] Request received for /api/parse-linkedin.');
    try {
        const htmlContent = req.body?.html;
        const apiKey = req.body?.apiKey;
        const modelName = typeof req.body?.model === 'string' ? req.body.model : undefined;
        if (!htmlContent || typeof htmlContent !== 'string') {
            console.error('[server] HTML content not found in request body.');
            return res.status(400).json({ error: 'Request body must contain "html" field.' });
        }
        if (!apiKey || typeof apiKey !== 'string') {
            console.error('[server] API key not found in request body.');
            return res.status(400).json({ error: 'API key is required. Please set it in Settings.' });
        }
        console.log('[server] HTML content received, starting pre-processing...');
        console.log('[server] HTML content length:', htmlContent.length, 'characters');
        const cleanedText = extractTextFromHtml(htmlContent);
        console.log('[server] Pre-processing complete. Cleaned text length:', cleanedText.length, 'characters');
        if (cleanedText.length < 50) {
            console.error('[server] Cleaned text is too short, might be invalid HTML');
            return res.status(400).json({ error: 'HTML content appears to be invalid or empty.' });
        }
        console.log('[server] Calling Gemini service with provided API key...');
        const parsedData = await parseLinkedInHtmlWithGemini(apiKey, cleanedText, modelName);
        const preview = JSON.stringify(parsedData, null, 2);
        console.log('[server] Successfully parsed data with Gemini. Preview of response:', preview.slice(0, 1000));
        return res.status(200).json(parsedData);
    }
    catch (error) {
        console.error('[server] An error occurred during the process:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return res.status(500).json({
            error: `An error occurred during parsing: ${errorMessage}`,
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
