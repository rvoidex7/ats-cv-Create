

# Yeni Eklenen özellikler:
- Tema iyileştirmesi
- İndirme ve yazdırma butonları (burada hala problem var çözülmeyi bekleyen)
- ATS analiz özelliği: İş ilanını atın ilana göre cv ne kadar tutarlı analizi sunar
- Api key olmamasından kaynaklanan hatalar barizce kullanıcıya bildiirliyor ve arayüzden kolayca ekleyebilir hale geldi
- CV verilerini JSON olarak dışa/içe aktarma özellikleri
- PDF dosya adlarında Türkçe karakter düzeltmesi
- İş deneyimi açıklamaları için kısa ve öz prompt'lar
- localStorage ile otomatik veri kaydetme ve geri yükleme
- Gemini AI'ın mevcut metni iyileştirmesi (sıfırdan yazmak yerine)
ve diğer bazı ufak geliştirmeler...
------
# Yapılacaklar listesi:
- Fotoğraf ekleme
- Kişisel veri mahremiyetinin arttırılmasına yönelik eklemeler.
- Yerel LLM entegrasyonu
<div align="center">
<img width="1368" height="855" alt="image" src="https://github.com/user-attachments/assets/267aca02-64ee-4230-9929-f22441ca1a06" />
<img width="601" height="772" alt="image" src="https://github.com/user-attachments/assets/1f0e3898-61ff-43fd-96f4-f5a74ebbdbc4" />
</div>
1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


