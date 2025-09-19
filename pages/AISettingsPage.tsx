import React from 'react';

const AISettingsPage: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6 dark:bg-gray-800 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yapay Zeka Ayarları</h1>

      <div className="p-4 border rounded-lg dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">ChatGPT Entegrasyonu</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Kendi ChatGPT hesabınızı kullanarak CV'nizi oluşturmak için aşağıdaki adımları izleyin:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>"CV Uzmanı GPT" sayfasına gidin (Link yakında eklenecektir).</li>
          <li>GPT ile sohbet ederek CV'nizin ham içeriğini oluşturun.</li>
          <li>GPT, size özel bir "sihirli link" üretecektir.</li>
          <li>Bu linki tarayıcınıza yapıştırarak anında CV önizlemenizi görün.</li>
        </ol>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled>
          CV Uzmanı GPT'ye Git (Yakında)
        </button>
      </div>

      <div className="p-4 border rounded-lg dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Google Gemini API Anahtarı</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Uygulama içi yapay zeka özelliklerini (örn: LinkedIn profili ile doldurma, ATS Analizi) kullanmak için kendi Gemini API anahtarınızı buraya girebilirsiniz. Bu anahtar sadece sizin tarayıcınızda saklanır.
        </p>
        <div className="flex items-center space-x-2">
          <input
            type="password"
            placeholder="Gemini API Anahtarınızı Buraya Girin"
            className="flex-grow p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Kaydet
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          API anahtarınızı nasıl alacağınızı öğrenmek için <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google AI Studio</a> sayfasını ziyaret edebilirsiniz.
        </p>
      </div>
    </div>
  );
};

export default AISettingsPage;
