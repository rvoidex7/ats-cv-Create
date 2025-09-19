import React, { useState, useContext } from 'react';
import { generateWithGemini } from '../services/geminiService';
import { MagicIcon } from './IconComponents';
import { AppContext } from '../context/AppContext';

type PromptType = 'summary' | 'experience';

interface GeminiEnhancerProps {
  promptType: PromptType;
  context: {
    jobTitle?: string;
    company?: string;
  };
  currentText?: string;
  onGeneratedText: (text: string) => void;
}

const GeminiEnhancer: React.FC<GeminiEnhancerProps> = ({ promptType, context, currentText, onGeneratedText }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey, setError } = useContext(AppContext);

  const generatePrompt = () => {
    if (promptType === 'summary') {
      if (currentText && currentText.trim()) {
        return `Make the following CV summary more professional, ATS-friendly, and impressive. Improve grammar, fluency, and professionalism while preserving the existing content.

IMPORTANT FORMATTING RULES:
- Respond only in plain text format.
- Do not use any markdown characters (**, *, _, etc.).
- Leave a blank line between paragraphs.
- Use the "-" character for list items.
- Write each list item on a new line.
- Write subheadings in separate paragraphs.
- Maintain the original structure and format.

Current summary:
"${currentText}"

Return only the improved summary text, preserving paragraph spacing and list format.`;
      } else {
        return `For an ATS-friendly CV, write a professional summary for an experienced professional in the "${context.jobTitle}" position. The summary should highlight key skills and career goals.

IMPORTANT: Respond only in plain text format. Do not use any markdown characters. Leave a blank line between paragraphs.

Return only the summary text.`;
      }
    }
    if (promptType === 'experience') {
      if (currentText && currentText.trim()) {
        return `Make the following job experience description more professional, ATS-friendly, and impressive. Use action verbs, add measurable results, and highlight achievements.

IMPORTANT FORMATTING RULES:
- Respond only in plain text format.
- Do not use any markdown characters.
- Keep it SHORT AND CONCISE (maximum 3-4 bullet points).
- Each bullet point should be on a single line, not too long.
- Use the "-" character for list items.
- Write each list item on a new line.
- Maintain the original list format but make it shorter.

Current description:
"${currentText}"

Return only the improved and CONCISE description text, keeping each bullet point on a single line.`;
      } else {
        return `For an ATS-friendly CV, create a SHORT AND CONCISE list of responsibilities and achievements for the "${context.jobTitle}" position at "${context.company}".

IMPORTANT RULES:
- Respond only in plain text format.
- Write a maximum of 3-4 bullet points.
- Each bullet point should be on a single line, short and concise.
- Start each bullet point with "-".
- Start with an action verb.
- Include measurable results.

Return only the short list items.`;
      }
    }
    return '';
  };

  const handleClick = async () => {
    if (!apiKey) {
      // Error message that directs the user to the correct page
      setError("API key not found. Please add it from the 'AI Settings' page.");
      // Clear the error message after a few seconds
      setTimeout(() => setError(null), 3500);
      return;
    }

    setIsLoading(true);
    setError(null);
    const prompt = generatePrompt();
    if (!prompt) {
      setError('Invalid request type.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateWithGemini(apiKey, prompt);
      // Clean up markdown characters
      const cleanedResult = result
        .replace(/\*\*(.*?)\*\*/g, '$1') // **bold** -> bold
        .replace(/\*(.*?)\*/g, '$1')     // *italic* -> italic
        .replace(/_(.*?)_/g, '$1')       // _underline_ -> underline
        .replace(/`(.*?)`/g, '$1')       // `code` -> code
        .replace(/#{1,6}\s/g, '')        // # remove headers
        .trim();
      
      onGeneratedText(cleanedResult);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute bottom-2 right-2">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="flex items-center justify-center p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/60 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        title="Enhance with Gemini"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <MagicIcon />
        )}
      </button>
    </div>
  );
};

export default GeminiEnhancer;