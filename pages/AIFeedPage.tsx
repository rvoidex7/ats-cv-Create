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
          throw new Error(errorData.error || 'Bilinmeyen bir ağ hatası oluştu.');
        }

        const parsedData: Partial<CvData> = await response.json();

        // Mevcut CV verileriyle gelen verileri birleştir.
        // Bu, AI'ın döndürmediği alanların kaybolmasını önler.
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

        // Kullanıcıyı düzenleyici sayfasına yönlendir
        window.location.href = '/';

      } catch (err: any) {
        setError(err.message || 'Dosya işlenirken bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Dosya okunurken bir hata oluştu.');
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6 dark:bg-gray-800 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yapay Zeka ile Otomatik Doldur</h1>

      <div className="p-4 border rounded-lg dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Seçenek 1: LinkedIn Profili ile Doldur</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          LinkedIn profil sayfanızdan "Daha Fazla" {'->'} "PDF olarak kaydet" seçeneği ile indirdiğiniz HTML dosyasını yükleyerek CV formunu otomatik olarak doldurabilirsiniz.
          <br />
          <strong className="dark:text-yellow-400">Not:</strong> Bu özellik, sunucu tarafında sizin verilerinizi işleyerek formu dolduran Model 1 mimarisini kullanır.
        </p>
        <div className="mt-4">
          <label htmlFor="linkedin-upload" className={`px-4 py-2 text-white rounded-lg cursor-pointer ${isLoading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {isLoading ? 'İşleniyor...' : 'LinkedIn HTML Yükle'}
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
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Seçenek 2: ChatGPT ile Doldur</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Bu yöntem, "CV Uzmanı GPT" adlı özel bir GPT'ye talimatlar vererek CV içeriğinizi oluşturmanızı ve ardından size özel üretilen bir link ile CV'nizi burada anında görüntülemenizi sağlar.
          <br />
          <strong className="dark:text-yellow-400">Not:</strong> Bu özellik, Model 2 mimarisini kullanır. Nasıl yapılacağını öğrenmek için "Yapay Zeka Ayarları" sekmesindeki rehberi inceleyebilirsiniz.
        </p>
      </div>
    </div>
  );
};

export default AIFeedPage;
