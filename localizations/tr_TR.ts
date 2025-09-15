import { Localization } from '../types';

const tr_TR: Localization = {
    // CVForm
    PersonalInfoSection: "Kişisel Bilgiler",
    Fullname: "Ad Soyad",
    Email: "E-posta",
    Phone: "Telefon",
    Address: "Adres",
    Linkedin: "LinkedIn Profili",
    Github: "GitHub Profili",
    ProfessionalSummarySection: "Profesyonel Özet",
    Summary: "Özet",
    Professional: "Profesyonel",
    ExperienceSection: "İş Deneyimi",
    JobTitle: "Pozisyon",
    Company: "Şirket",
    StartDate: "Başlangıç Tarihi",
    EndDate: "Bitiş Tarihi",
    Description: "Açıklama",
    AddExperience: "Deneyim Ekle",
    EducationSection: "Eğitim",
    School: "Okul",
    Degree: "Bölüm ve Derece",
    AddEducation: "Eğitim Ekle",
    SkillsSection: "Yetenekler",
    AddSkill: "Yetenek Ekle",
    Position: "Pozisyon",

    // App.tsx
    Title: "ATS Uyumlu CV Oluşturucu",
    HiddenTitle: "ATS CV",
    Beta: "Beta",
    Download: "Yükle",
    Save: "Kaydet",
    Clear: "Temizle",
    Analyze: "Analiz",
    Print: "Yazdır",
    PDF: "PDF",
    ClearConfirmMessage: "Tüm CV verilerini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",

    // ErrorToast.tsx
    Error: "Hata!",
    Close: "Kapat",
    ImportCVData: 'CV Verilerini Yükle',
    SaveCVData: 'CV Verilerini Kaydet',
    ClearAllData: 'Tüm Verileri Temizle',
    ATSAnalyze: 'ATS Analizi',
    DownloadAsPDF: 'PDF Olarak İndir',
    NoCVPreview: 'CV önizleme öğesi bulunamadı.',
    CVImportSuccess: 'CV verileri başarıyla yüklendi!',
    ImportFailure: 'Dosya yüklenirken hata oluştu',

    // AtsAnalysisModal.tsx
    ATSModalTitle: "ATS Uyumluluk Analizi",
    JobDescriptionLabel: "İş İlanı",
    JobDescriptionPlaceholder: "İş ilanını buraya yapıştırın...",
    JobDescriptionHelpText: "CV'nizin başvurduğunuz pozisyona ne kadar uygun olduğunu görmek için aşağıdaki alana iş ilanını yapıştırın ve analizi başlatın.",
    GeminiApiKeyMissing: "Gemini API anahtarı ayarlanmamış. Lütfen ortam değişkenlerini kontrol edin.",
    JobDescriptionMissing: "Lütfen analiz için bir iş ilanı yapıştırın.",
    AnalyzeButton: "Analizi Başlat",
    AnalyzingButton: "Analiz Ediliyor...",
    NewAnalysisButton: "Yeni Analiz Yap",
    OverallMatchScore: "Genel Uyumluluk Skoru",
    ImprovementSuggestions: "İyileştirme Önerileri",
    MatchingKeywords: "Eşleşen Anahtar Kelimeler",
    MissingKeywords: "Eksik Anahtar Kelimeler",

    //LanguageToggleButton.tsx
    ChangeLanguage: "Dil Değiştir",
};

export default tr_TR;
