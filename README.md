# **ATS Uyumlu Akıllı CV Oluşturucu**

Bu proje, standart CV oluşturucuların ötesine geçerek, kullanıcının dijital kimliğini anlayan ve her başvuru için hiper-kişiselleştirilmiş, otantik kariyer belgeleri üreten yeni nesil bir **"Kişisel Kariyer Stratejisti"** olmayı hedefler.  
Projenin detaylı mimarisi ve uzun vadeli vizyonu için [AGENTS.md](http://docs.google.com/AGENTS.md) dosyasına göz atabilirsiniz.





## **✨ Ana Özellikler (Mevcut Sürüm)**

* **Yeni Nesil Arayüz:** Sol tarafta dikey navigasyon menüsü ve sağ tarafta CV'nizin anlık olarak güncellenen canlı önizlemesi ile modern ve kullanıcı dostu bir deneyim.  
* **🤖 Yapay Zeka Destekli Metin Geliştirme:** "Profesyonel Özet" ve "İş Deneyimi" gibi alanlardaki metinlerinizi tek tıkla Gemini AI ile daha profesyonel ve etkileyici hale getirin.  
* **📊 Gelişmiş ATS Analizi:** CV'nizi bir iş ilanına göre analiz ederek uyumluluk puanı, anahtar kelime karşılaştırması ve somut iyileştirme önerileri alın.  
* **📄 Metin Tabanlı PDF Oluşturma:** @react-pdf/renderer sayesinde ATS uyumlu, resim tabanlı olmayan, seçilebilir ve gerçek metinler içeren PDF'ler oluşturun.  
* **💾 Veri Yönetimi:** CV verilerinizi .json formatında kaydedin (dışa aktarın) ve daha sonra tekrar yükleyin (içe aktarın).

## **🖼️ Ekran Görüntüleri**

<div align="center">
<img width="1919" height="1033" alt="Ekran görüntüsü 2025-09-19 213146" src="https://github.com/user-attachments/assets/8aba5e71-7098-4ad1-b335-0ccd555b3e00" />

<img width="601" height="772" alt="image" src="https://github.com/user-attachments/assets/1f0e3898-61ff-43fd-96f4-f5a74ebbdbc4" />
</div>

## **🗺️ Yol Haritası (Yapılacaklar)**

Proje, AGENTS.md'de belirtilen vizyon doğrultusunda geliştirilmeye devam etmektedir. Sıradaki adımlar:

* \[ \] **Diğer Platform Entegrasyonları:** "Yapay Zeka Besleme" özelliğine aşağıdaki platformlar için HTML ayrıştırıcıları eklenecek:  
  * \[ \] GitHub (Yazılımcılar için)  
  * \[ \] Behance (Tasarımcılar için)  
  * \[ \] ArtStation (Oyun Sanatçıları için)  
* \[ \] **ChatGPT Action Entegrasyonu:** Kullanıcıların kendi ChatGPT "hafızalarını" kullanarak CV oluşturmalarını sağlayan "İki Aşamalı Sihir" mimarisinin hayata geçirilmesi.  
* \[ \] **Şablon & Tasarım Sayfası:** Kullanıcıların farklı CV şablonları arasından seçim yapabilmesi ve yapay zekanın dinamik tasarımlar oluşturabilmesi.  
* \[ \] **CV Belgelerim Sayfası:** Oluşturulan farklı CV versiyonlarını yönetmek için gelişmiş bir panel.  
* \[ \] **Vercel'de Yayınlama:** Projenin tüm dünyanın kullanımına açılması.
* \[ \] **🚀 LinkedIn'den Otomatik Doldurma:** "Yapay Zeka Besleme" sayfasından LinkedIn profilinizin HTML dosyasını yükleyerek CV'nizdeki İş Deneyimi, Eğitim gibi alanları saniyeler içinde otomatik olarak doldurun.  

## Nasıl Çalıştırılır?
-------
Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

2.  **Ortam Değişkenlerini Ayarlayın:**
    Proje ana dizininde `.env` adında bir dosya oluşturun ve içine Google Gemini API anahtarınızı aşağıdaki gibi ekleyin:
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

3.  **Uygulamayı Başlatın:**
    ```bash
    npm run dev
    ```

Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışmaya başlayacaktır.
