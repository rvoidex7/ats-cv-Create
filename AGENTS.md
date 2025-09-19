# **Proje Mimarisi ve MVP Yol Haritası (AGENTS.md)**

## **1\. Genel Vizyon**

Bu proje, standart CV oluşturucuların ötesine geçerek, kullanıcının dijital kimliğini anlayan ve her başvuru için hiper-kişiselleştirilmiş, otantik kariyer belgeleri üreten bir **"Kişisel Kariyer Stratejisti"** olmayı hedefler. Geliştirme süreci, "vibe coding" ve yapay zeka destekli kodlama pratiklerini temel alır. Bu döküman, projenin bu vizyon doğrultusunda tutarlı bir şekilde geliştirilmesi için bir rehberdir.

## **2\. Temel Teknik Mimari ve Kurallar**

Bu projenin geliştirilmesinde aşağıdaki teknik kararlara **kesinlikle** uyulmalıdır. Bu kurallar, projenin temel hedeflerini (ATS uyumluluğu, esneklik, güvenlik) garantilemek için konulmuştur.

### **a. Frontend Teknolojileri**

* **Çatı (Framework):** React (Vite ile)  
* **Dil:** TypeScript  
* **Stil:** Tailwind CSS

### **b. PDF Oluşturma Motoru: @react-pdf/renderer**

* **Kural:** Bu projede PDF oluşturmak için **SADECE** @react-pdf/renderer kütüphanesi kullanılacaktır.  
* **Gerekçe:** Projenin en temel vaadi ATS uyumluluğudur. @react-pdf/renderer, resim tabanlı çıktılar yerine, ATS sistemleri tarafından mükemmel bir şekilde okunabilen, **gerçek, seçilebilir ve metin tabanlı PDF belgeleri** üretir. html2pdf.js, jsPDF veya benzeri ekran görüntüsü tabanlı kütüphanelerin kullanılması **kesinlikle yasaktır.**

### **c. Yapay Zeka Etkileşim Mimarisi**

Proje, iki temel yapay zeka etkileşim modelini kullanacaktır:

#### **Model 1: Dahili AI (Sunucu Taraflı Fonksiyonlar)**

* **Kullanım Alanları:** "ATS Analizi", "LinkedIn HTML Ayrıştırma" gibi, uygulamanın kendi içindeki özellikler.  
* **İş Akışı:**  
  1. React arayüzü, isteği Vercel'de barındırılan bir **Serverless Fonksiyon'a** gönderir.  
  2. Bu fonksiyon, **projenin kendi GEMINI\_API\_KEY'ini kullanarak** Google Gemini gibi bir LLM'e güvenli bir şekilde API çağrısı yapar.  
  3. LLM'den dönen yapısal veri (JSON) veya metin, fonksiyona geri döner ve ardından kullanıcı arayüzünde gösterilir.  
  4. Kullanıcının API anahtarı asla tarayıcıya veya istemciye ifşa edilmez.

#### **Model 2: Harici AI (ChatGPT Action Entegrasyonu \- "İki Aşamalı Sihir")**

* **Kullanım Alanı:** Kullanıcının kendi ChatGPT hesabındaki kişisel verileri ve "hafızayı" kullanarak CV oluşturması.  
* **İş Akışı:**  
  1. Kullanıcı, önceden ayarlanmış "CV Uzmanı GPT" ile sohbet ederek ham CV içeriğini oluşturur.  
  2. "CV Uzmanı GPT", bir **Action** aracılığıyla bu ham veriyi Vercel'deki özel bir API endpoint'ine (/api/create-from-gpt) gönderir.  
  3. Vercel fonksiyonu, bu ham veriyi alır ve **Model 1**'deki gibi kendi Gemini API anahtarını kullanarak LLM'e bir istek daha atar. Bu isteğin amacı, ham veriyi @react-pdf/renderer'ın anlayacağı detaylı \*\*"CV Tasarım Şeması JSON"\*\*una dönüştürmektir.  
  4. Vercel, üretilen bu tasarım JSON'unu Base64 formatında kodlayarak bir "sihirli link" (/preview?data=...) oluşturur.  
  5. Bu link, Action'ın cevabı olarak ChatGPT'ye geri gönderilir.  
  6. Kullanıcı bu linke tıkladığında, Vercel uygulaması URL'deki veriyi okur ve anında PDF önizlemesini oluşturur. Bu akışta kullanıcının Vercel sitesine giriş yapması **gerekmez.**

## **3\. MVP (v1.0) Kapsamı ve Özellikler**

MVP, yukarıdaki mimariyi temel alarak aşağıdaki özellikleri içerecek şekilde geliştirilecektir. Henüz geliştirilmemiş özellikler, arayüzde bir "Yakında Gelecek" notuyla belirtilecektir.

* **Deployment Platformu:** Proje, **Vercel** üzerinde canlıya alınacaktır. Tüm ortam değişkenleri (GEMINI\_API\_KEY vb.) Vercel proje ayarlarından yönetilecektir.  
* **Arayüz Yapısı:** Sol dikey navigasyon menüsü ve sağda sabit CV önizlemesi.  
* **MVP Sayfaları ve Fonksiyonları:**  
  1. **Yapay Zeka Ayarları:**  
     * **MVP:** Kullanıcının kendi ChatGPT'sini bağlayabilmesi için gerekli talimatlar ve "CV Uzmanı GPT" linki. Kullanıcının kendi Gemini API anahtarını girmesi için bir alan (bu, Model 1'i test etmek için kullanılabilir).  
  2. **Yapay Zeka Besleme:**  
     * **MVP (Aktif):** LinkedIn'den indirilen HTML dosyasını yükleme ve bu dosyanın **Model 1** mimarisi kullanılarak sunucu tarafında işlenip formu otomatik doldurması.  
     * **MVP (Aktif):** ChatGPT entegrasyonu. Kullanıcıya, **Model 2** mimarisini nasıl kullanacağını anlatan bir rehber sunulur.  
  3. **Form (Ana Editör):**  
     * **MVP (Aktif):** Tüm bölümlerin manuel olarak doldurulabildiği ve her bölümün CV'ye dahil edilip edilmeyeceğini belirleyen switch anahtarlarının bulunduğu tam fonksiyonel form.  
  4. **Diğer Sekmeler (Yakında Olarak İşaretlenecek):**  
     * Kilit Bilgiler  
     * Şablon & Tasarım  
     * CV Belgelerim  
     * İş Arama