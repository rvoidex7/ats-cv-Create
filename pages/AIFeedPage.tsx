import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { useCvData } from '@/hooks/useCvData';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/common/ui/card';
import { Button } from '@/components/common/ui/button';
import { Icons } from '@/components/common/Icons';
import { type CvData } from '@/types';

export default function AIFeedPage() {
  const { setCvData } = useCvData();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      const promise = () =>
        new Promise<CvData>(async (resolve, reject) => {
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

            const parsedData = (await response.json()) as CvData;

            // Mevcut CV verilerini gelen yeni veriyle birleştirerek güncelle
            setCvData((prevData) => ({
              ...prevData,
              personalInfo: {
                ...prevData.personalInfo,
                ...parsedData.personalInfo,
              },
              summary: parsedData.summary || prevData.summary,
              experience: parsedData.experience.length
                ? parsedData.experience
                : prevData.experience,
              education: parsedData.education.length
                ? parsedData.education
                : prevData.education,
              skills: parsedData.skills.length
                ? parsedData.skills
                : prevData.skills,
            }));

            resolve(parsedData);
          } catch (err) {
            console.error('Failed to parse LinkedIn HTML:', err);
            reject(err);
          }
        });

      toast.promise(promise(), {
        loading: 'AI is parsing your LinkedIn profile...',
        success: 'CV data has been successfully imported!',
        error: (err: Error) =>
          `Failed to import data: ${err.message || 'Unknown error'}`,
        finally: () => {
          setIsLoading(false);
          // Dosya inputunu sıfırla ki aynı dosya tekrar seçilebilsin
          event.target.value = '';
        },
      });
    },
    [setCvData],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Data Feeds</CardTitle>
        <CardDescription>
          Automatically populate your CV by uploading data from your digital platforms.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 rounded-lg border p-4">
          <Icons.linkedin className="h-8 w-8 text-[#0A66C2]" />
          <div className="flex-1">
            <h3 className="font-semibold">Import from LinkedIn</h3>
            <p className="text-sm text-muted-foreground">
              Go to your LinkedIn profile, save the page as HTML, and upload it here.
            </p>
          </div>
          <Button asChild variant="outline" disabled={isLoading}>
            <label htmlFor="linkedin-upload" className="cursor-pointer">
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.upload className="mr-2 h-4 w-4" />
              )}
              Upload HTML
              <input
                id="linkedin-upload"
                type="file"
                className="sr-only"
                accept=".html"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </label>
          </Button>
        </div>
        {/* Diğer platformlar için "Yakında Gelecek" alanları */}
      </CardContent>
    </Card>
  );
}
