import React from 'react';

const AIFeedPage: React.FC = () => {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      // Here you would trigger the server-side processing (Model 1)
      alert(`"${file.name}" yüklendi. Bu özellik yakında aktif olacaktır.`);
    }
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
          <label htmlFor="linkedin-upload" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            LinkedIn HTML Yükle
          </label>
          <input
            id="linkedin-upload"
            type="file"
            className="hidden"
            accept=".html"
            onChange={handleFileChange}
          />
        </div>
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
