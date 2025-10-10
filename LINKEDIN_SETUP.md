# LinkedIn HTML Parse Kurulumu

## Gerekli Adımlar:

### 1. Gemini API Key Alma
1. [Google AI Studio](https://makersuite.google.com/app/apikey) adresine gidin
2. "Create API Key" butonuna tıklayın
3. API anahtarınızı kopyalayın

### 2. Projeyi Çalıştırın
Artık hem frontend hem backend'i aynı anda çalıştırmak için:
```bash
npm run dev
```

Bu komut:
- Backend server'ı `http://localhost:3001` adresinde
- Frontend'i `http://localhost:5173` adresinde (veya başka bir port) çalıştıracak
- Frontend, Vite proxy üzerinden backend'e istek gönderecek (CORS sorunu olmayacak)

### 3. API Key'i Uygulamaya Girin
1. Uygulamayı açın
2. **Settings (Ayarlar)** sekmesine gidin
3. Gemini API Key'inizi girin ve kaydedin

### 4. LinkedIn HTML Dosyası İndirme
1. LinkedIn profilinize gidin
2. Sayfaya sağ tıklayın → "Farklı Kaydet" → "Web Sayfası, Yalnızca HTML"
3. Dosyayı kaydedin
4. Uygulamada "AI Besleme" sekmesinden bu dosyayı yükleyin

**NOT:** API Key artık uygulama içinden girildiği için deployment'ta da çalışacak!

## Sorun Giderme

### CORS Hatası Alıyorsanız:
- `npm run dev` ile **hem backend hem frontend**'in çalıştığından emin olun
- Tarayıcı konsolunda `http://localhost:3001` yerine `/api/parse-linkedin` görmelisiniz
- Port 3001'in başka bir uygulama tarafından kullanılmadığından emin olun

### "API Key Missing" Hatası:
- Settings sayfasından API key'i girdiğinizden emin olun
- API key'in doğru girildiğinden emin olun (boşluk vs. olmamalı)
- Sayfayı yenileyin ve tekrar deneyin
