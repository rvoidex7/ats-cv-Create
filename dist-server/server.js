import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { JSDOM } from 'jsdom';
import * as pdfParse from 'pdf-parse';
import { parseLinkedInHtmlWithGemini } from './services/geminiService.js';
function extractTextFromHtml(htmlContent) {
    console.log('[server] Starting HTML text extraction with JSDOM...');
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;
    // Try multiple selectors for LinkedIn profile content
    const selectors = [
        '.scaffold-layout__main', // LinkedIn main content area
        '.pv-profile-section', // Profile sections
        '#profile-content', // Profile content ID
        'main', // HTML5 main element
        '[role="main"]', // ARIA main role
        '.core-rail', // LinkedIn core content
        '.application-outlet', // LinkedIn app outlet
        'body', // Fallback to body
    ];
    let mainContent = null;
    for (const selector of selectors) {
        mainContent = doc.querySelector(selector);
        if (mainContent) {
            console.log(`[server] Found content using selector: ${selector}`);
            break;
        }
    }
    if (!mainContent) {
        console.log('[server] No main content found. Using document body.');
        mainContent = doc.body;
    }
    if (mainContent) {
        // Remove unnecessary elements more comprehensively
        const elementsToRemove = mainContent.querySelectorAll('script, style, noscript, svg, header, footer, nav, aside, ' +
            '.msg-overlay-container, .msg-overlay, .artdeco-modal, .nav-item, ' +
            '.global-nav, .application-navbar, [data-ad-type], .ad-banner, ' +
            'button, .icon, .visually-hidden, [aria-hidden="true"]');
        elementsToRemove.forEach(item => item.remove());
        // Extract text content
        let text = mainContent.textContent || "";
        // Clean up the text
        text = text
            .replace(/\s+/g, ' ') // Normalize whitespace
            .replace(/[\n\r]+/g, '\n') // Normalize line breaks
            .replace(/\n\s+\n/g, '\n\n') // Remove empty lines with spaces
            .trim();
        console.log('[server] HTML text extraction complete. Text length:', text.length);
        return text;
    }
    console.log('[server] No content found. Returning empty string.');
    return '';
}
async function extractTextFromPDF(pdfBuffer) {
    console.log('[server] Starting PDF text extraction...');
    try {
        const data = await pdfParse.default(pdfBuffer);
        console.log('[server] PDF text extraction complete. Pages:', data.numpages);
        return data.text;
    }
    catch (error) {
        console.error('[server] PDF text extraction failed:', error);
        throw new Error('Failed to extract text from PDF');
    }
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
const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
// Configure CORS with proper security
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'https://yourdomain.com'
        : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.get('/api', (_req, res) => {
    res.send('API Server is running!');
});
app.post('/api/parse-linkedin', parseLinkedInHandler);
// New endpoint for parsing PDF files
app.post('/api/parse-linkedin-pdf', async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).send('Method Not Allowed');
    }
    console.log('[server] Request received for /api/parse-linkedin-pdf.');
    try {
        const pdfBase64 = req.body?.pdf;
        const apiKey = req.body?.apiKey;
        const modelName = typeof req.body?.model === 'string' ? req.body.model : undefined;
        if (!pdfBase64 || typeof pdfBase64 !== 'string') {
            console.error('[server] PDF content not found in request body.');
            return res.status(400).json({ error: 'Request body must contain "pdf" field (base64 encoded).' });
        }
        if (!apiKey || typeof apiKey !== 'string') {
            console.error('[server] API key not found in request body.');
            return res.status(400).json({ error: 'API key is required. Please set it in Settings.' });
        }
        console.log('[server] PDF content received, extracting text...');
        // Decode base64 to buffer
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');
        const extractedText = await extractTextFromPDF(pdfBuffer);
        console.log('[server] Text extraction complete. Text length:', extractedText.length, 'characters');
        if (extractedText.length < 50) {
            console.error('[server] Extracted text is too short, might be invalid PDF');
            return res.status(400).json({ error: 'PDF appears to be invalid or empty.' });
        }
        console.log('[server] Calling Gemini service with extracted text...');
        const parsedData = await parseLinkedInHtmlWithGemini(apiKey, extractedText, modelName);
        const preview = JSON.stringify(parsedData, null, 2);
        console.log('[server] Successfully parsed data with Gemini. Preview:', preview.slice(0, 1000));
        return res.status(200).json(parsedData);
    }
    catch (error) {
        console.error('[server] An error occurred during PDF parsing:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return res.status(500).json({
            error: `An error occurred during PDF parsing: ${errorMessage}`,
        });
    }
});
app.listen(port, () => {
    console.log(`[server] API server listening on http://localhost:${port}`);
});
