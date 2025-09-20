import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { useCvData } from '../hooks/useCvData';
import { Icons } from '../components/IconComponents';
import { type CvData } from '../types';

async function parseLinkedInProfile(file: File, setCvData: (data: CvData | ((prev: CvData) => CvData)) => void): Promise<CvData> {
  try {
    const fileContent = await file.text();

    const response = await fetch('/api/parse-linkedin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: fileContent }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Server responded with status ${response.status}`,
      );
    }

    const parsedData = (await response.json()) as Partial<CvData>;

    // Merge the new data with existing CV data
    setCvData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        ...parsedData.personalInfo,
      },
      summary: parsedData.summary || prevData.summary,
      experience: parsedData.experience && parsedData.experience.length > 0
        ? parsedData.experience
        : prevData.experience,
      education: parsedData.education && parsedData.education.length > 0
        ? parsedData.education
        : prevData.education,
      skills: parsedData.skills && parsedData.skills.length > 0
        ? parsedData.skills
        : prevData.skills,
      projects: parsedData.projects && parsedData.projects.length > 0
        ? parsedData.projects
        : prevData.projects,
    }));

    return parsedData as CvData;
  } catch (err) {
    console.error('Failed to parse LinkedIn HTML:', err);
    // Re-throw the error to be caught by toast.promise
    throw err;
  }
}


export default function AIFeedPage() {
  const { setCvData } = useCvData();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsLoading(true);

      const promise = parseLinkedInProfile(file, setCvData);

      toast.promise(promise, {
        loading: t('ai_feed.parsing_linkedin'),
        success: t('ai_feed.import_success'),
        error: (err: Error) => `${t('ai_feed.import_error')}: ${err.message || t('ai_feed.unknown_error')}`,
        finally: () => {
          setIsLoading(false);
          // Reset file input so the same file can be selected again
          event.target.value = '';
        },
      });
    },
    [setCvData, t],
  );

  return (
    <div className="border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('ai_feed.title')}</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {t('ai_feed.description')}
        </p>
      </div>
      <div className="p-6 pt-0 space-y-6">
        <div className="flex items-center gap-4 rounded-lg border p-4 dark:border-gray-700">
          <Icons.linkedin className="h-8 w-8 text-[#0A66C2]" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">{t('ai_feed.import_linkedin_title')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('ai_feed.import_linkedin_desc')}
            </p>
          </div>
          <label 
            htmlFor="linkedin-upload"
            className={`inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.upload className="mr-2 h-4 w-4" />
            )}
            {t('ai_feed.upload_html')}
            <input
              id="linkedin-upload"
              type="file"
              className="sr-only"
              accept=".html"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </label>
        </div>
        {/* Other platforms can be added here as "Coming Soon" */}
      </div>
    </div>
  );
}
