import { useCallback, useState, useContext } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../context/AppContext';
import { Icons } from '../components/IconComponents';
import { type CvData } from '../types';
import { parseLinkedInCSV, parseLinkedInZIP, mergeCvData } from '../services/linkedInImportService';

type AIFeedPageProps = {
  setCvData: (data: CvData | ((prev: CvData) => CvData)) => void;
  onImported?: () => void;
};

// Helper function to normalize partial CV data to full CvData
function normalizePartialCvData(parsedData: Partial<CvData>): CvData {
  return {
    personalInfo: {
      name: parsedData.personalInfo?.name ?? '',
      jobTitle: parsedData.personalInfo?.jobTitle ?? '',
      email: parsedData.personalInfo?.email ?? '',
      phone: parsedData.personalInfo?.phone ?? '',
      linkedin: parsedData.personalInfo?.linkedin ?? '',
      github: parsedData.personalInfo?.github ?? '',
      address: parsedData.personalInfo?.address ?? '',
    },
    summary: parsedData.summary ?? '',
    experience: Array.isArray(parsedData.experience)
      ? parsedData.experience.map((exp, idx) => ({
          id: exp?.id ?? `experience-${idx + 1}`,
          jobTitle: exp?.jobTitle ?? '',
          company: exp?.company ?? '',
          startDate: exp?.startDate ?? '',
          endDate: exp?.endDate ?? '',
          description: exp?.description ?? '',
        }))
      : [],
    education: Array.isArray(parsedData.education)
      ? parsedData.education.map((edu, idx) => ({
          id: edu?.id ?? `education-${idx + 1}`,
          school: edu?.school ?? '',
          degree: edu?.degree ?? '',
          startDate: edu?.startDate ?? '',
          endDate: edu?.endDate ?? '',
        }))
      : [],
    skills: Array.isArray(parsedData.skills)
      ? parsedData.skills.map((skill, idx) => ({
          id: (skill as any)?.id ?? `skill-${idx + 1}`,
          name: typeof skill === 'string' ? skill : (skill as any)?.name ?? '',
        })).filter((skill) => skill.name)
      : [],
    projects: Array.isArray(parsedData.projects)
      ? parsedData.projects.map((project, idx) => ({
          id: project?.id ?? `project-${idx + 1}`,
          title: project?.title ?? '',
          context: project?.context ?? '',
          role: project?.role ?? '',
          description: project?.description ?? '',
        }))
      : [],
  };
}

async function parseLinkedInProfile(
  apiKey: string,
  file: File,
  setCvData: (data: CvData | ((prev: CvData) => CvData)) => void,
  onImported?: () => void,
): Promise<CvData> {
  try {
    const fileContent = await file.text();

    const response = await fetch('/api/parse-linkedin', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        html: fileContent,
        apiKey: apiKey,
        model: 'gemini-2.5-flash'
      }),
    });

    if (!response.ok) {
      // Handle cases where the server fails without sending a JSON error body (e.g., timeout)
      const errorText = await response.text();
      console.error('[parseLinkedInProfile] Server error response:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      } catch (e) {
        // If the response is not JSON, it might be an unhandled server error or timeout
        throw new Error(`Server error (${response.status}): ${errorText.substring(0, 200)}`);
      }
    }

    const parsedData = (await response.json()) as Partial<CvData>;
    console.debug('[parseLinkedInProfile] Parsed data received:', parsedData);

    const nextCvData = normalizePartialCvData(parsedData);
    setCvData(nextCvData);

  if (typeof onImported === 'function') {
    try {
      onImported();
    } catch (e) {
      console.warn('onImported callback threw', e);
    }
  }

  return nextCvData;
  } catch (err) {
    console.error('Failed to parse LinkedIn HTML:', err);
    // Re-throw the error to be caught by toast.promise
    throw err;
  }
}

async function parseLinkedInPDF(
  apiKey: string,
  file: File,
  setCvData: (data: CvData | ((prev: CvData) => CvData)) => void,
  onImported?: () => void,
): Promise<CvData> {
  try {
    // Read file as ArrayBuffer and convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    const response = await fetch('/api/parse-linkedin-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pdf: base64,
        apiKey: apiKey,
        model: 'gemini-2.5-flash'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[parseLinkedInPDF] Server error response:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      } catch (e) {
        throw new Error(`Server error (${response.status}): ${errorText.substring(0, 200)}`);
      }
    }

    const parsedData = (await response.json()) as Partial<CvData>;
    console.debug('[parseLinkedInPDF] Parsed data received:', parsedData);

    const nextCvData: CvData = normalizePartialCvData(parsedData);
    setCvData(nextCvData);

    if (typeof onImported === 'function') {
      try {
        onImported();
      } catch (e) {
        console.warn('onImported callback threw', e);
      }
    }

    return nextCvData;
  } catch (err) {
    console.error('Failed to parse LinkedIn PDF:', err);
    throw err;
  }
}

async function parseLinkedInCSVFile(
  file: File,
  setCvData: (data: CvData | ((prev: CvData) => CvData)) => void,
  onImported?: () => void,
): Promise<CvData> {
  try {
    const csvContent = await file.text();
    const parsedData = await parseLinkedInCSV(csvContent, file.name);

    console.debug('[parseLinkedInCSV] Parsed data received:', parsedData);

    // Merge with existing CV data instead of replacing
    setCvData((prev) => {
      const merged = mergeCvData(prev, parsedData);
      return normalizePartialCvData(merged);
    });

    if (typeof onImported === 'function') {
      try {
        onImported();
      } catch (e) {
        console.warn('onImported callback threw', e);
      }
    }

    const normalized = normalizePartialCvData(parsedData);
    return normalized;
  } catch (err) {
    console.error('Failed to parse LinkedIn CSV:', err);
    throw err;
  }
}

async function parseLinkedInZIPFile(
  file: File,
  setCvData: (data: CvData | ((prev: CvData) => CvData)) => void,
  onImported?: () => void,
): Promise<CvData> {
  try {
    const parsedData = await parseLinkedInZIP(file);
    console.debug('[parseLinkedInZIP] Parsed data received:', parsedData);

    const nextCvData = normalizePartialCvData(parsedData);
    setCvData(nextCvData);

    if (typeof onImported === 'function') {
      try {
        onImported();
      } catch (e) {
        console.warn('onImported callback threw', e);
      }
    }

    return nextCvData;
  } catch (err) {
    console.error('Failed to parse LinkedIn ZIP:', err);
    throw err;
  }
}

export default function AIFeedPage({ setCvData, onImported }: AIFeedPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { apiKey } = useContext(AppContext);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Detect file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const isCSV = fileExtension === 'csv';
      const isZIP = fileExtension === 'zip';
      const isPDF = fileExtension === 'pdf';
      const isHTML = fileExtension === 'html' || fileExtension === 'htm';

      // CSV and ZIP don't require API key (parsed locally)
      const requiresAPIKey = isHTML || isPDF;

      if (requiresAPIKey && !apiKey) {
        toast.error(t('ai_feed.api_key_missing'));
        event.target.value = '';
        return;
      }

      setIsLoading(true);

      // Choose the appropriate parser based on file type
      let promise: Promise<CvData>;

      if (isCSV) {
        promise = parseLinkedInCSVFile(file, setCvData, onImported);
      } else if (isZIP) {
        promise = parseLinkedInZIPFile(file, setCvData, onImported);
      } else if (isPDF) {
        promise = parseLinkedInPDF(apiKey!, file, setCvData, onImported);
      } else {
        // Default to HTML parsing
        promise = parseLinkedInProfile(apiKey!, file, setCvData, onImported);
      }

      toast.promise(promise, {
        loading: t('ai_feed.parsing_linkedin'),
        success: t('ai_feed.import_success'),
        error: (err: Error) => {
          console.error("Toast Error:", err);
          return `${t('ai_feed.import_error')}: ${err.message || t('ai_feed.unknown_error')}`;
        },
        finally: () => {
          setIsLoading(false);
          event.target.value = '';
        },
      });
    },
    [setCvData, t, apiKey, onImported],
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
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Supports: HTML, PDF, CSV, or ZIP (LinkedIn Data Export)
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
            {t('ai_feed.upload_file') || 'Upload File'}
            <input
              id="linkedin-upload"
              type="file"
              className="sr-only"
              accept=".html,.htm,.pdf,.csv,.zip"
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
