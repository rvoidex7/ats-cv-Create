import React, { useState } from 'react';
import { useCvData } from '../hooks/useCvData';
import { CvData } from '../types';

const AIFeedPage: React.FC = () => {
  const { cvData, setCvData } = useCvData();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const htmlContent = e.target?.result as string;

        const response = await fetch('/api/parse-linkedin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ html: htmlContent }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'An unknown network error occurred.');
        }

        const parsedData: Partial<CvData> = await response.json();

        // Merge the incoming data with the existing CV data.
        // This prevents fields not returned by the AI from being lost.
        setCvData(prevData => ({
          ...prevData,
          ...parsedData,
          personalInfo: {
            ...prevData.personalInfo,
            ...parsedData.personalInfo,
          },
          experience: parsedData.experience || prevData.experience,
          education: parsedData.education || prevData.education,
          skills: parsedData.skills || prevData.skills,
          projects: parsedData.projects || prevData.projects,
        }));

        // Redirect the user to the editor page
        window.location.href = '/';

      } catch (err: any) {
        setError(err.message || 'An error occurred while processing the file.');
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('An error occurred while reading the file.');
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6 dark:bg-gray-800 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Autofill with AI</h1>

      <div className="p-4 border rounded-lg dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Option 1: Fill with LinkedIn Profile</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You can automatically fill the CV form by uploading the HTML file downloaded from your LinkedIn profile page using the "More" {'->'} "Save to PDF" option.
          <br />
          <strong className="dark:text-yellow-400">Note:</strong> This feature uses the Model 1 architecture, which processes your data on the server side to fill out the form.
        </p>
        <div className="mt-4">
          <label htmlFor="linkedin-upload" className={`px-4 py-2 text-white rounded-lg cursor-pointer ${isLoading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {isLoading ? 'Processing...' : 'Upload LinkedIn HTML'}
          </label>
          <input
            id="linkedin-upload"
            type="file"
            className="hidden"
            accept=".html"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>

      <div className="p-4 border rounded-lg dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Option 2: Fill with ChatGPT</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This method allows you to generate your CV content by giving instructions to a special GPT called "CV Expert GPT", and then instantly view your CV here with a custom-generated link.
          <br />
          <strong className="dark:text-yellow-400">Note:</strong> This feature uses the Model 2 architecture. To learn how to use it, you can check the guide in the "AI Settings" tab.
        </p>
      </div>
    </div>
  );
};

export default AIFeedPage;
