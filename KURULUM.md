# 🚀 ATS Uyumlu CV Oluşturucu - Kurulum ve Çalıştırma Rehberi

## 📋 İçindekiler
1. [İlk Kurulum](#ilk-kurulum)
2. [Günlük Geliştirme](#günlük-geliştirme)
3. [Production Build](#production-build)
4. [Sorun Giderme](#sorun-giderme)

---

## 🎯 İlk Kurulum (Sadece İlk Seferde)

Projeyi ilk kez bilgisayarınıza kuruyorsanız:

```bash
# 1. Depoyu klonlayın (eğer henüz yapmadıysanız)
git clone https://github.com/rvoidex7/ats-cv-Create.git
cd ats-cv-Create/r7

# 2. Node.js paketlerini yükleyin
npm install

# 3. Backend sunucusunu ilk kez derleyin
npm run build:server
```

**Not:** `.env` dosyasına **gerek yok**! API key uygulama içinden girilecek.

---

## 💻 Günlük Geliştirme

Her gün projeyi çalıştırmak için **sadece bu komutu** kullanın:

```bash
npm run dev
```

### ✨ Bu Komut Ne Yapar?

`npm run dev` komutu **otomatik olarak**:
1. ✅ Backend sunucusunu derler (`npm run build:server`)
2. ✅ Backend sunucusunu başlatır (port 3001'de)
3. ✅ Frontend sunucusunu başlatır (genellikle port 5173'te)
4. ✅ Her iki sunucuyu aynı anda çalıştırır

### 📊 Terminal Çıktısı

Başarılı çalıştırma şöyle görünür:

```
> ats-uyumlu-cv-olusturucu@1.0.0 dev
> npm run build:server && concurrently "npm run start:backend" "vite"

> ats-uyumlu-cv-olusturucu@1.0.0 build:server
> tsc -p tsconfig.server.json

[0] > ats-uyumlu-cv-olusturucu@1.0.0 start:backend
[0] > node dist-server/server.js
[0] 
[1]   VITE v5.4.20  ready in 185 ms
[1]   
[1]   ➜  Local:   http://localhost:5173/
[0] [server] API server listening on http://localhost:3001
```

### 🌐 Tarayıcıda Açın

Terminalde gördüğünüz linke gidin:
- **http://localhost:5173/** (veya terminalin gösterdiği port)

---

## 🎨 Kullanım Adımları

1. **Settings Sayfasına Gidin**
   - Sol menüden "Settings" (Ayarlar) sekmesine tıklayın

2. **Gemini API Key Girin**
   - [Google AI Studio](https://aistudio.google.com/app/apikey) adresinden API key alın
   - API key'i Settings sayfasındaki alana yapıştırın
   - "Save" butonuna tıklayın

3. **LinkedIn HTML Yükleyin**
   - "AI Feed" sekmesine gidin
   - LinkedIn profilinizi HTML olarak kaydedin:
     - LinkedIn profilinize gidin
     - Sağ tık → "Farklı Kaydet" → "Web Sayfası, Yalnızca HTML"
   - Dosyayı seçin ve yükleyin

4. **CV'niz Otomatik Oluşturulacak! 🎉**

---

## 🏗️ Production Build (Deployment İçin)

Vercel, Netlify veya başka bir platforma deploy etmek için:

```bash
# 1. Production build oluşturun
npm run build

# 2. Build sonucu kontrol edin
npm run preview
```

### Vercel'e Deploy

```bash
# Vercel CLI ile (önerilen)
npm install -g vercel
vercel
```

**Not:** Vercel otomatik olarak:
- Frontend'i static olarak build edecek
- Backend'i serverless functions'a dönüştürecek

---

## 🔧 Diğer Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | **Ana komut** - Hem backend hem frontend'i başlatır |
| `npm run build` | Production build oluşturur |
| `npm run build:server` | Sadece backend'i derler |
| `npm run start:backend` | Sadece backend'i başlatır (derlendikten sonra) |
| `npm run start:frontend` | Sadece frontend'i başlatır |
| `npm run preview` | Production build'i test eder |
| `npm run lint` | Kod kalitesini kontrol eder |

---

## 🐛 Sorun Giderme

### ❌ "Port 3001 is already in use" Hatası

**Çözüm 1:** Port 3001'i kullanan uygulamayı kapatın

```powershell
# Windows PowerShell'de
netstat -ano | findstr :3001
taskkill /PID <PID_NUMARASI> /F
```

**Çözüm 2:** Farklı bir port kullanın
- `server.ts` dosyasında `const port = 3001;` satırını değiştirin
- Örnek: `const port = 3002;`
- `vite.config.ts`'deki proxy ayarını da güncelleyin

### ❌ "Cannot find module" Hatası

```bash
# Node modules'ları temizleyip yeniden yükleyin
rm -rf node_modules package-lock.json
npm install
```

### ❌ "API Key Missing" Hatası

1. Settings sayfasından API key'i girdiğinizden emin olun
2. Tarayıcıyı yenileyin (Ctrl + F5)
3. Browser Developer Tools → Application → Local Storage → `gemini-api-key` kontrol edin

### ❌ CORS Hatası

- `npm run dev` ile **hem backend hem frontend**'in çalıştığından emin olun
- İki ayrı terminal çıktısı görmeli ve iki port numarası görmelisiniz
- Tarayıcıyı hard refresh yapın (Ctrl + Shift + R)

### ❌ LinkedIn HTML Parse Hatası

**Backend loglarını kontrol edin:**
Terminal'de şu mesajları göreceksiniz:
```
[server] Request received for /api/parse-linkedin
[server] HTML content length: XXXX characters
```

Eğer hata varsa, detaylı log mesajını göreceksiniz.

---

## 📝 Hızlı Referans

### İlk Kez Kurulum
```bash
npm install
npm run build:server
npm run dev
```

### Her Gün
```bash
npm run dev
```

### Deployment
```bash
npm run build
vercel
```

---

## 🎯 Önemli Notlar

✅ **API Key:** Artık `.env` dosyasına gerek yok! Uygulama içinden girilecek.

✅ **Hot Reload:** Kod değişiklikleriniz otomatik olarak yüklenecek.

✅ **Çift Sunucu:** `npm run dev` hem backend (3001) hem frontend (5173) çalıştırır.

✅ **Proxy:** Frontend, Vite proxy üzerinden backend'e erişir (CORS yok).

---

## 🆘 Yardım

Sorun yaşıyorsanız:
1. Terminal loglarını kontrol edin
2. Browser Console'u açın (F12 → Console)
3. `LINKEDIN_SETUP.md` dosyasına bakın
4. GitHub Issues'a sorun açın

**İyi çalışmalar! 🚀**
