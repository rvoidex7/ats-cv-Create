# **ATS Uyumlu Akıllı CV Oluşturucu**

Bu proje, standart CV oluşturucuların ötesine geçerek, kullanıcının dijital kimliğini anlayan ve her başvuru için hiper-kişiselleştirilmiş, otantik kariyer belgeleri üreten yeni nesil bir **"Kişisel Kariyer Stratejisti"** olmayı hedefler.  
Projenin detaylı mimarisi ve uzun vadeli vizyonu için [AGENTS.md](http.docs.google.com/AGENTS.md) dosyasına göz atabilirsiniz.

## Özellikler

### ✨ Ana Geliştirmeler ve Yeni Yetenekler

*   **Çoklu Dil Desteği (Uluslararasılaştırma):**
    *   Uygulama artık **İngilizce** ve **Türkçe** dillerini tam olarak desteklemektedir.
    *   Kullanıcı arayüzündeki tüm metinler, seçilen dile göre dinamik olarak değişir.
    *   Header'a eklenen dil değiştirme butonu ile diller arasında kolayca geçiş yapılabilir.

*   **Gelişmiş Mobil Arayüz ve Kullanıcı Deneyimi:**
    *   Uygulama artık tüm mobil cihazlarla (telefon, tablet) tam uyumludur.
    *   Mobil görünümde, "Form" ve "Önizleme" arasında geçiş yapmayı sağlayan pratik bir alt menü eklenmiştir.
    *   Geniş ekranlarda gizlenen, mobil cihazlar için özel bir kenar menüsü (sidebar) eklenmiştir.

*   **Akıllı Form Bölümleri (Accordion Menü):**
    *   CV formundaki her bölüm (Kişisel Bilgiler, İş Deneyimi vb.) artık kendi içine katlanabilir (accordion) bir yapıya sahiptir.
    *   Bu özellik sayesinde form daha düzenli görünür ve kullanıcılar sadece düzenlemek istedikleri bölüme odaklanabilirler.

*   **Geliştirilmiş PDF İşlevselliği:**
    *   "İndir" butonuna ek olarak, oluşturulan CV'yi tarayıcıda yeni bir sekmede açan bir **"Görüntüle"** butonu eklenmiştir.
    *   Web arayüzündeki önizleme ile indirilen PDF arasındaki font ve stil tutarlılığı sağlanmış, Türkçe karakter (`İ`) sorunları giderilmiştir.

*   **Capacitor ile Mobil Uygulama Altyapısı:**
    *   Proje, Capacitor kullanılarak native **Android** ve **iOS** uygulamalarına dönüştürülmek üzere yapılandırılmıştır.
    *   `android` ve `ios` klasörleri, ilgili platformlar için native projeleri içermektedir.

### 🔧 Teknik İyileştirmeler

*   **Dinamik Başlangıç Verileri:** Uygulama artık kullanıcının tarayıcı diline göre varsayılan CV içeriğini (İngilizce veya Türkçe) otomatik olarak yüklemektedir.
*   **Kod Kalitesi:** Projedeki TypeScript hataları ve build sorunları giderilerek daha stabil bir altyapı oluşturulmuştur.
*   **Bağımlılık Yönetimi:** Projeye `i18next`, `@headlessui/react` ve `@capacitor/core` gibi modern ve güçlü kütüphaneler eklenmiştir.

## **🖼️ Ekran Görüntüleri**

<div align="center">
<img width="1919" height="1033" alt="Ekran görüntüsü 2025-09-19 213146" src="https://github.com/user-attachments/assets/8aba5e71-7098-4ad1-b335-0ccd555b3e00" />

<img width="601" height="772" alt="image" src="https://github.com/user-attachments/assets/1f0e3898-61ff-43fd-96f4-f5a74ebbdbc4" />
</div>

## **🗺️ Yol Haritası (Yapılacaklar)**

Henüz todo oluşturulmadı, proje sahibiyle iletişime geçiniz.

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

## Bağış Linkleri
### Bu uygulamanın özgür yazlım olarak varlığını sürdürebilmesi ve güncellemelerini alabilmesi adına geliştiricilerin bağış linklerini buradan bulabilirsiniz.

<a href="https://www.buymeacoffee.com/ru1vly" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
<a href="https://buymeacoffee.com/ykpkrmzcn53" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

