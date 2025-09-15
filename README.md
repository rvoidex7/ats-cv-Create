# ATS Uyumlu CV Oluşturucu

Bu uygulama, Google Gemini AI yardımıyla Başvuru Takip Sistemleri (ATS) için optimize edilmiş profesyonel CV'ler oluşturmanıza yardımcı olur. Modern ve kullanıcı dostu arayüzü sayesinde CV'nizi kolayca oluşturabilir, düzenleyebilir ve yapay zeka destekli önerilerle geliştirebilirsiniz.

## Özellikler

- **Kolay CV Oluşturma:** Kişisel bilgiler, özet, iş deneyimi, eğitim ve yetenekler gibi bölümleri kolayca doldurun.
- **Gemini AI ile Geliştirme:** Tek tıkla profesyonel özetlerinizi ve iş deneyimi açıklamalarınızı yapay zeka ile daha etkileyici hale getirin.
- **ATS Uyumluluk Analizi:** CV'nizi bir iş ilanına göre analiz ederek uyumluluk puanı, anahtar kelime karşılaştırması ve somut iyileştirme önerileri alın.
- **Veri Yönetimi:** CV verilerinizi `.json` formatında kaydedin (dışa aktarın) ve daha sonra tekrar yükleyin (içe aktarın).
- **PDF Olarak İndirme ve Yazdırma:** Oluşturduğunuz CV'yi tek tıkla PDF olarak indirin veya yazdırın.
- **Modern Arayüz:** Karanlık/Aydınlık tema desteği ve mobil uyumlu şık bir tasarım.
- **Hızlı Form Doldurma:** Tarayıcıların otomatik tamamlama özelliği ile formları daha hızlı doldurun.

---

## Yeni Eklenenler

- **API Anahtar Yönetimi İyileştirmesi:** API anahtarı artık kullanıcı arayüzü yerine, daha güvenli bir yöntem olan ortam değişkenleri (`environment variables`) üzerinden yönetilmektedir. Bu, hem güvenliği artırır hem de geliştirme sürecini kolaylaştırır.
- **Gelişmiş ATS Analiz Özelliği:** İş ilanını yapıştırarak CV'nizin ilana ne kadar uygun olduğunu analiz eden, uyumluluk skoru, eşleşen/eksik anahtar kelimeler ve iyileştirme önerileri sunan gelişmiş bir modül eklendi.
- **Form Otomatik Doldurma:** Tarayıcıların kaydedilmiş bilgilerle formları daha hızlı doldurabilmesi için otomatik tamamlama (`autocomplete`) desteği eklendi.
- **Performans İyileştirmesi:** Gemini API bağlantısı artık her istekte yeniden oluşturulmuyor, bu da performansı artırıyor ve gereksiz nesne oluşturmayı engelliyor.
- **Arayüz ve Kullanılabilirlik:** Genel kullanıcı deneyimini iyileştiren tema, ikon ve görsel düzenlemeler yapıldı.

---

## Ekran Görüntüleri

<div align="center">
<img width="1368" height="855" alt="image" src="https://github.com/user-attachments/assets/267aca02-64ee-4230-9929-f22441ca1a06" />
<img width="601" height="772" alt="image" src="https://github.com/user-attachments/assets/1f0e3898-61ff-43fd-96f4-f5a74ebbdbc4" />
</div>

---

## Yapılacaklar Listesi

- [ ] Kişisel veri mahremiyetinin arttırılmasına yönelik eklemeler.
- [ ] Yerel LLM (Büyük Dil Modeli) entegrasyonu seçeneği.
- [ ] Farklı CV şablonları arasından seçim yapma imkanı.
- [ ] CV bölümlerini sürükle-bırak ile yeniden sıralama özelliği.
- [ ] Daha fazla tasarım şablon seçenği.
- [ ] CV'de hangi kısımların olacağını seçebilme esnekliği.
- [ ] Güvenli Kişisel bilgiler kasası.

---

## Nasıl Çalıştırılır?

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
