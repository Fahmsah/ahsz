/* ============================================================
   BALKAN ROUTE — LIVE TRACKING SCRIPT
   ============================================================
   Features:
   - Live GPS tracking with real geolocation
   - Navigation guidance to next stop
   - Compass bearing & ETA calculation
   - Collapsible UI (click to reveal)
   - Simulated walker animation
   - Full Balkan Route data

   Sources:
   [1] Frontex Risk Analysis 2025-2027
   [2] IOM DTM Western Balkans 2026
   [3] Mixed Migration Centre 4Mi (888 interviews)
   [4] BVMN — Border Violence Monitoring Network
   [5] Save the Children (May 2026)
   [6] Qantara.de — Strandzha graves (2026)
   [7] InfoMigrants — Croatia pushbacks (2026)
   [8] AP News — 10-day, 200km hike (2015)
   [9] Telegraph — Calais wall (2016)
   [10] Libertad Digital — Calais surveillance (2026)
   ============================================================ */

'use strict';

/* ============================================================
   SECTION 1 — MAP INITIALISATION
   ============================================================ */

const map = L.map('map', {
    zoomControl: true,
    attributionControl: true,
    minZoom: 4,
    maxZoom: 18,
    preferCanvas: true
}).setView([44.5, 15.0], 5);

const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
});

const satelliteLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { maxZoom: 18, attribution: '&copy; Esri, Maxar' }
);

const terrainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; OpenTopoMap'
});

osmLayer.addTo(map);

/* ============================================================
   SECTION 2 — MASTER STOP DATA (33 STOPS)
   ============================================================ */

const allStops = [
    { id:'edirne', day:0, name:'أدرنة', p:[41.6771,26.5557], country:'تركيا', type:'start',
      totalKm:0, dayKm:0, walkHours:0, elevation:'42m',
      terrain:'سهول زراعية مكشوفة', wildlife:'كلاب رعاة، ثعالب',
      temp:{winter:'-2–6°C', summer:'20–32°C'},
      sleep:'فندق رخيص', water:'متجر — ماء معبأ', food:'مطاعم', toilet:'متاح',
      phone:'شحن', wifi:'مقهى', medical:'مستشفى', police:'دوريات عادية', drone:'محدودة',
      risks:{military:'متوسط',gangs:'منخفض',mafia:'مرتفع',env:'منخفض'},
      notes:'نقطة الانطلاق. شراء مؤن لـ 5 أيام. الحدود اليونانية 20 كم.',
      source:'IOM DTM 2026' },

    { id:'kapitan-andreevo', day:1, name:'كابيتان أندرييفو', p:[41.7167,26.3333], country:'بلغاريا', type:'border',
      totalKm:20, dayKm:20, walkHours:5, elevation:'150m',
      terrain:'غابات ستراندجا الجبلية', wildlife:'دببة، ذئاب، أفاعي سامة، قراد',
      temp:{winter:'-3–5°C', summer:'20–33°C'},
      sleep:'مخبأ في الغابة', water:'جدول جبلي', food:'مؤن', toilet:'في العراء',
      phone:'لا شحن', wifi:'لا يوجد', medical:'لا يوجد', police:'1,000 شرطي', drone:'مكثفة',
      risks:{military:'خطر عالٍ جداً',gangs:'مرتفع',mafia:'مرتفع',env:'مرتفع'},
      notes:'أخطر مقطع. لعبة الشرطة. قبور مجهولة НЕИЗВЕСТЕН.',
      source:'Qantara.de 2026' },

    { id:'strandzha-1', day:2, name:'ستrandja — المخبأ 1', p:[41.8000,26.1000], country:'بلغاريا', type:'wild-camp',
      totalKm:45, dayKm:25, walkHours:8, elevation:'450m',
      terrain:'غابات كثيفة + وديان', wildlife:'دببة، ذئاب، أفاعي',
      temp:{winter:'-4–4°C', summer:'18–30°C'},
      sleep:'خيمة', water:'جدول', food:'مؤن', toilet:'في العراء',
      phone:'لا شحن', wifi:'لا يوجد', medical:'لا يوجد', police:'دوريات ليلية', drone:'مكثفة',
      risks:{military:'خطر عالٍ جداً',gangs:'مرتفع',mafia:'مرتفع',env:'مرتفع'},
      notes:'اليوم 2. دببة وذئاب. لا نار.',
      source:'Qantara.de 2026' },

    { id:'strandzha-2', day:3, name:'ستrandja — المخبأ 2', p:[41.8500,26.0000], country:'بلغاريا', type:'wild-camp',
      totalKm:70, dayKm:25, walkHours:8, elevation:'580m',
      terrain:'غابات جبلية', wildlife:'دببة، ذئاب',
      temp:{winter:'-4–4°C', summer:'18–30°C'},
      sleep:'خيمة', water:'جدول', food:'مؤن', toilet:'في العراء',
      phone:'لا شحن', wifi:'لا يوجد', medical:'لا يوجد', police:'دوريات', drone:'مكثفة',
      risks:{military:'خطر عالٍ جداً',gangs:'مرتفع',mafia:'مرتفع',env:'مرتفع'},
      notes:'تعب متراكم. إبطاء.',
      source:'Qantara.de 2026' },

    { id:'strandzha-3', day:4, name:'ستrandja — المخبأ 3', p:[41.9000,25.9000], country:'بلغاريا', type:'wild-camp',
      totalKm:95, dayKm:25, walkHours:8, elevation:'620m',
      terrain:'غابات جبلية', wildlife:'دببة، ذئاب',
      temp:{winter:'-4–4°C', summer:'18–30°C'},
      sleep:'خيمة', water:'جدول', food:'مؤن', toilet:'في العراء',
      phone:'لا شحن', wifi:'لا يوجد', medical:'لا يوجد', police:'خطر عالٍ', drone:'مكثفة',
      risks:{military:'خطر عالٍ جداً',gangs:'مرتفع',mafia:'مرتفع',env:'مرتفع'},
      notes:'آخر يوم كامل. تخطيط للخروج.',
      source:'Qantara.de 2026' },

    { id:'strandzha-exit', day:5, name:'الخروج من ستراندجا', p:[41.9500,25.8000], country:'بلغاريا', type:'transit',
      totalKm:120, dayKm:25, walkHours:8, elevation:'350m',
      terrain:'غابات → طريق', wildlife:'أفاعي',
      temp:{winter:'-3–5°C', summer:'20–33°C'},
      sleep:'مخبأ', water:'متجر', food:'شراء', toilet:'متجر',
      phone:'شحن', wifi:'مقهى', medical:'صيدلية', police:'دوريات', drone:'متوسطة',
      risks:{military:'مرتفع',gangs:'متوسط',mafia:'مرتفع',env:'متوسط'},
      notes:'خروج. منطقة مكشوفة.',
      source:'Qantara.de 2026' },

    { id:'svilengrad-rest', day:6, name:'⚠️ راحة — سفيليجراد', p:[41.7667,26.2000], country:'بلغاريا', type:'rest',
      totalKm:120, dayKm:0, walkHours:0, elevation:'180m',
      terrain:'بلدة صغيرة', wildlife:'لا يوجد',
      temp:{winter:'-3–5°C', summer:'21–33°C'},
      sleep:'مخبأ', water:'متجر', food:'بقالة', toilet:'متجر',
      phone:'شحن', wifi:'مقهى', medical:'صيدلية', police:'دوريات', drone:'بعيدة',
      risks:{military:'منخفض',gangs:'منخفض',mafia:'منخفض',env:'منخفض'},
      notes:'تعب تراكمي بعد 5 أيام مشي.',
      source:'IOM DTM 2026' },

    { id:'sofia-approach', day:7, name:'طريق صوفيا', p:[42.2000,24.5000], country:'بلغاريا', type:'wild-camp',
      totalKm:220, dayKm:100, walkHours:10, elevation:'300m',
      terrain:'تلال + حقول', wildlife:'ثعالب، أفاعي',
      temp:{winter:'-3–5°C', summer:'21–33°C'},
      sleep:'خيمة', water:'قرية', food:'بقالة', toilet:'في العراء',
      phone:'شحن', wifi:'لا يوجد', medical:'لا يوجد', police:'دوريات', drone:'متوسطة',
      risks:{military:'متوسط',gangs:'منخفض',mafia:'متوسط',env:'متوسط'},
      notes:'100 كم في يوم. تعب شديد.',
      source:'IOM DTM 2026' },

    { id:'sofia', day:8, name:'صوفيا', p:[42.6977,23.3219], country:'بلغاريا', type:'hub',
      totalKm:320, dayKm:100, walkHours:10, elevation:'550m',
      terrain:'سهول + جبال فيتوشا', wildlife:'دببة، ذئاب، أفاعي',
      temp:{winter:'-4–4°C', summer:'20–32°C'},
      sleep:'مخيم استقبال', water:'ماء', food:'مطاعم', toilet:'متاح',
      phone:'شحن', wifi:'مجاني', medical:'مستشفى', police:'شرطة بلغارية', drone:'Frontex',
      risks:{military:'مرتفع',gangs:'مرتفع',mafia:'مرتفع',env:'متوسط'},
      notes:'العاصمة. 15% من المهاجرين.',
      source:'IOM DTM 2026' },

    { id:'sofia-rest', day:9, name:'⚠️ راحة — صوفيا', p:[42.6977,23.3219], country:'بلغاريا', type:'rest',
      totalKm:320, dayKm:0, walkHours:0, elevation:'550m',
      terrain:'مدينة', wildlife:'لا يوجد',
      temp:{winter:'-4–4°C', summer:'20–32°C'},
      sleep:'مخيم', water:'ماء', food:'مطاعم', toilet:'متاح',
      phone:'شحن', wifi:'مجاني', medical:'مستشفى', police:'عادية', drone:'Frontex',
      risks:{military:'منخفض',gangs:'منخفض',mafia:'منخفض',env:'منخفض'},
      notes:'جمع معلومات عن صربيا.',
      source:'IOM DTM 2026' },

    { id:'belgrade-approach', day:10, name:'طريق بلغراد', p:[43.5000,22.0000], country:'صربيا', type:'wild-camp',
      totalKm:550, dayKm:230, walkHours:12, elevation:'400m',
      terrain:'سهول + تلال', wildlife:'ثعالب، أفاعي',
      temp:{winter:'-2–6°C', summer:'24–36°C'},
      sleep:'خيمة', water:'قرية', food:'بقالة', toilet:'في العراء',
      phone:'لا شحن', wifi:'لا يوجد', medical:'لا يوجد', police:'حدودية', drone:'مكثفة',
      risks:{military:'مرتفع',gangs:'مرتفع',mafia:'مرتفع',env:'متوسط'},
      notes:'عبور الحدود. 230 كم.',
      source:'IOM DTM 2026' },

    { id:'belgrade', day:11, name:'بلغراد', p:[44.7866,20.4489], country:'صربيا', type:'hub',
      totalKm:780, dayKm:230, walkHours:12, elevation:'117m',
      terrain:'سهول بانونيا', wildlife:'كلاب، ثعالب، أفاعي',
      temp:{winter:'-2–6°C', summer:'24–36°C'},
      sleep:'مخيم أوبريوفاك', water:'ماء', food:'مطاعم رخيصة', toilet:'متاح',
      phone:'شحن', wifi:'مقهى', medical:'مستشفى', police:'عصابات BWK', drone:'متوسطة',
      risks:{military:'متوسط',gangs:'مرتفع',mafia:'مرتفع',env:'متوسط'},
      notes:'حديقة أفغانستان. BWK عصابات. فدية 30,000 يورو.',
      source:'IOM DTM 2026' },

    { id:'belgrade-rest', day:12, name:'⚠️ راحة — بلغراد', p:[44.7866,20.4489], country:'صربيا', type:'rest',
      totalKm:780, dayKm:0, walkHours:0, elevation:'117m',
      terrain:'مدينة', wildlife:'لا يوجد',
      temp:{winter:'-2–6°C', summer:'24–36°C'},
      sleep:'مخيم', water:'ماء', food:'مطاعم', toilet:'متاح',
      phone:'شحن', wifi:'مقهى', medical:'مستشفى', police:'BWK', drone:'متوسطة',
      risks:{military:'منخفض',gangs:'مرتفع',mafia:'مرتفع',env:'منخفض'},
      notes:'تنسيق مع مهربين.',
      source:'BVMN 2026' },

    { id:'horgos-approach', day:13, name:'طريق هورغوش', p:[45.5000,20.2000], country:'صربيا', type:'wild-camp',
      totalKm:880, dayKm:100, walkHours:10, elevation:'85m',
      terrain:'سهول عشبية + شجيرات', wildlife:'كلاب رعاة، خنازير',
      temp:{winter:'-5–4°C', summer:'22–34°C'},
      sleep:'خيمة', water:'قرية', food:'بقالة', toilet:'في العراء',
      phone:'لا شحن', wifi:'لا يوجد', medical:'لا يوجد', police:'خطر عالٍ', drone:'مكثفة',
      risks:{military:'خطر عالٍ جداً',gangs:'مرتفع',mafia:'مرتفع',env:'مرتفع'},
      notes:'100 كم. عصابات تيتواني.',
      source:'Gulf Times 2016' },

    { id:'horgos', day:14, name:'هورغوش — السياج', p:[46.15,19.9667], country:'صربيا', type:'border',
      totalKm:898, dayKm:18, walkHours:5, elevation:'85m',
      terrain:'سهول + شجيرات', wildlife:'كلاب، ثعالب',
      temp:{winter:'-5–4°C', summer:'22–34°C'},
      sleep:'مخبأ بعيد', water:'قرية', food:'مؤن', toilet:'في العراء',
      phone:'لا شحن', wifi:'لا يوجد', medical:'لا يوجد', police:'سياج مزدوج', drone:'مكثفة',
      risks:{military:'خطر عالٍ جداً',gangs:'مرتفع',mafia:'مرتفع',env:'مرتفع'},
      notes:'سياج 4م × 2 + كلاب + غاز. 8,403 حالة صدّ.',
      source:'Reuters 2015' },

    { id:'zagreb-approach', day:15, name:'طريق زغرب', p:[46.0000,17.5000], country:'كرواتيا', type:'wild-camp',
      totalKm:1048, dayKm:150, walkHours:12, elevation:'150m',
      terrain:'سهول + حقول', wildlife:'ثعالب، أفاعي',
      temp:{winter:'-2–5°C', summer:'22–34°C'},
      sleep:'خيمة', water:'قرية', food:'بقالة', toilet:'في العراء',
      phone:'لا شحن', wifi:'لا يوجد', medical:'لا يوجد', police:'كرواتية عنيفة', drone:'مكثفة',
      risks:{military:'خطر عالٍ',gangs:'مرتفع',mafia:'مرتفع',env:'متوسط'},
      notes:'عبور الحدود. 150 كم.',
      source:'Al Jazeera 2026' },

    { id:'zagreb', day:16, name:'زغرب', p:[45.8150,15.9819], country:'كرواتيا', type:'hub',
      totalKm:1198, dayKm:150, walkHours:12, elevation:'158m',
      terrain:'سهول بانونيا', wildlife:'دببة، ذئاب',
      temp:{winter:'-2–5°C', summer:'22–34°C'},
      sleep:'مخبأ', water:'ماء', food:'مطاعم', toilet:'متاح',
      phone:'شحن', wifi:'مقهى', medical:'مستشفى', police:'8,403 صدّ', drone:'مكثفة',
      risks:{military:'خطر عالٍ',gangs:'مرتفع',mafia:'مرتفع',env:'متوسط'},
      notes:'صدّ عنيف. 30,000 حالة.',
      source:'Borderline Europe 2026' },

    { id:'zagreb-rest', day:17, name:'⚠️ راحة — زغرب', p:[45.8150,15.9819], country:'كرواتيا', type:'rest',
      totalKm:1198, dayKm:0, walkHours:0, elevation:'158m',
      terrain:'مدينة', wildlife:'لا يوجد',
      temp:{winter:'-2–5°C', summer:'22–34°C'},
      sleep:'مخبأ', water:'ماء', food:'مطاعم', toilet:'متاح',
      phone:'شحن', wifi:'مقهى', medical:'مستشفى', police:'⚠️', drone:'مكثفة',
      risks:{military:'منخفض',gangs:'مرتفع',mafia:'مرتفع',env:'منخفض'},
      notes:'جمع معلومات سلوفينيا.',
      source:'Borderline Europe 2026' },

    { id:'ljubljana-approach', day:18, name:'طريق ليوبليانا', p:[45.9000,15.2000], country:'سلوفينيا', type:'wild-camp',
      totalKm:1268, dayKm:70, walkHours:8, elevation:'300m',
      terrain:'تلال + غابات', wildlife:'دببة، ذئاب، أفاعي',
      temp:{winter:'-2–6°C', summer:'22–33°C'},
      sleep:'خيمة', water:'قرية', food:'بقالة', toilet:'في العراء',
      phone:'لا شحن', wifi:'لا يوجد', medical:'لا يوجد', police:'سياج', drone:'متوسطة',
      risks:{military:'مرتفع',gangs:'منخفض',mafia:'متوسط',env:'متوسط'},
      notes:'70 كم. نهر كولبا سحي.',
      source:'Slovenia Times 2026' },

    { id:'ljubljana', day:19, name:'ليوبليانا', p:[46.0569,14.5058], country:'سلوفينيا', type:'hub',
      totalKm:1338, dayKm:70, walkHours:8, elevation:'295m',
      terrain:'كارست ألبي', wildlife:'دببة، ذئاب',
      temp:{winter:'-2–6°C', summer:'22–33°C'},
      sleep:'مخبأ', water:'ماء', food:'مطاعم', toilet:'متاح',
      phone:'شحن', wifi:'مقهى', medical:'مستشفى', police:'سياج', drone:'متوسطة',
      risks:{military:'مرتفع',gangs:'منخفض',mafia:'متوسط',env:'متوسط'},
      notes:'نهر كولبا. 413 وفاة.',
      source:'IOM Missing Migrants 2026' },

    { id:'ljubljana-rest', day:20, name:'⚠️ راحة — ليوبليانا', p:[46.0569,14.5058], country:'سلوفينيا', type:'rest',
      totalKm:1338, dayKm:0, walkHours:0, elevation:'295m',
      terrain:'مدينة', wildlife:'لا يوجد',
      temp:{winter:'-2–6°C', summer:'22–33°C'},
      sleep:'مخبأ', water:'ماء', food:'مطاعم', toilet:'متاح',
      phone:'شحن', wifi:'مقهى', medical:'مستشفى', police:'عادية', drone:'متوسطة',
      risks:{military:'منخفض',gangs:'منخفض',mafia:'منخفض',env:'منخفض'},
      notes:'جمع معلومات إيطاليا.',
      source:'IOM DTM 2026' },

    { id:'trieste', day:21, name:'ترييستي', p:[45.6495,13.7768], country:'إيطاليا', type:'entry',
      totalKm:1438, dayKm:100, walkHours:12, elevation:'2m',
      terrain:'كارست ألبي', wildlife:'دببة، ذئاب',
      temp:{winter:'4–10°C', summer:'24–34°C'},
      sleep:'Piazza del Mondo', water:'ماء', food:'200 وجبة/ليلة', toilet:'محدود',
      phone:'شحن', wifi:'مقهى', medical:'مستشفى', police:'إيطالية', drone:'محدودة',
      risks:{military:'متوسط',gangs:'منخفض',mafia:'متوسط',env:'منخفض'},
      notes:'12,525 مهاجر 2025.',
      source:'InfoMigrants 2026' },

    { id:'trieste-rest', day:22, name:'⚠️ راحة — ترييستي', p:[45.6495,13.7768], country:'إيطاليا', type:'rest',
      totalKm:1438, dayKm:0, walkHours:0, elevation:'2m',
      terrain:'مدينة ساحلية', wildlife:'لا يوجد',
      temp:{winter:'4–10°C', summer:'24–34°C'},
      sleep:'Piazza del Mondo', water:'ماء', food:'مطبخ', toilet:'محدود',
      phone:'شحن', wifi:'مقهى', medical:'مستشفى', police:'عادية', drone:'محدودة',
      risks:{military:'منخفض',gangs:'منخفض',mafia:'منخفض',env:'منخفض'},
      notes:'جمع معلومات ميلانو.',
      source:'InfoMigrants 2026' },

    { id:'milan-approach', day:23, name:'طريق ميلانو', p:[45.3000,11.0000], country:'إيطاليا', type:'wild-camp',
      totalKm:1638, dayKm:200, walkHours:14, elevation:'120m',
      terrain:'سهول لومبارديا', wildlife:'ثعالب، أرانب',
      temp:{winter:'2–8°C', summer:'25–35°C'},
      sleep:'خيمة', water:'قرية', food:'بقالة', toilet:'في العراء',
      phone:'لا شحن', wifi:'لا يوجد', medical:'لا يوجد', police:'إيطالية', drone:'محدودة',
      risks:{military:'منخفض',gangs:'متوسط',mafia:'متوسط',env:'منخفض'},
      notes:'200 كم. تعب شديد.',
      source:'IOM DTM 2026' },

    { id:'milan', day:24, name:'ميلانو', p:[45.4642,9.1900], country:'إيطاليا', type:'transit',
      totalKm:1738, dayKm:100, walkHours:8, elevation:'120m',
      terrain:'سهول', wildlife:'ثعالب',
      temp:{winter:'2–8°C', summer:'25–35°C'},
      sleep:'مخبأ', water:'ماء', food:'مطاعم', toilet:'متاح',
      phone:'شحن', wifi:'مقهى', medical:'مستشفى', police:'عادية', drone:'محدودة',
      risks:{military:'منخفض',gangs:'متوسط',mafia:'متوسط',env:'منخفض'},
      notes:'محطة عبور. قطارات فرنسا.',
      source:'IOM DTM 2026' },

    { id:'milan-rest', day:25, name:'⚠️ راحة — ميلانو', p:[45.4642,9.1900], country:'إيطاليا', type:'rest',
      totalKm:1738, dayKm:0, walkHours:0, elevation:'120m',
      terrain:'مدينة', wildlife:'لا يوجد',
      temp:{winter:'2–8°C', summer:'25–35°C'},
      sleep:'مخبأ', water:'ماء', food:'مطاعم', toilet:'متاح',
      phone:'شحن', wifi:'مقهى', medical:'مستشفى', police:'عادية', drone:'محدودة',
      risks:{military:'منخفض',gangs:'منخفض',mafia:'منخفض',env:'منخفض'},
      notes:'جمع معلومات ليون.',
      source:'IOM DTM 2026' },

    { id:'lyon-approach', day:26, name:'طريق ليون', p:[45.6000,6.5000], country:'فرنسا', type:'wild-camp',
      totalKm:1938, dayKm:200, walkHours:14, elevation:'300m',
      terrain:'تلال + وديان', wildlife:'ثعالب، خنازير',
      temp:{winter:'3–9°C', summer:'22–32°C'},
      sleep:'خيمة', water:'قرية', food:'بقالة', toilet:'في العراء',
      phone:'لا شحن', wifi:'لا يوجد', medical:'لا يوجد', police:'فرنسية', drone:'محدودة',
      risks:{military:'منخفض',gangs:'متوسط',mafia:'متوسط',env:'منخفض'},
      notes:'عبور الحدود الإيطالية-الفرنسية.',
      source:'IOM DTM 2026' },

    { id:'lyon', day:27, name:'ليون', p:[45.7640,4.8357], country:'فرنسا', type:'transit',
      totalKm:2138, dayKm:200, walkHours:14, elevation:'170m',
      terrain:'تلال + وديان', wildlife:'ثعالب',
      temp:{winter:'3–9°C', summer:'22–32°C'},
      sleep:'مخبأ', water:'ماء', food:'مطاعم', toilet:'متاح',
      phone:'شحن', wifi:'مقهى', medical:'مستشفى', police:'عادية', drone:'محدودة',
      risks:{military:'منخفض',gangs:'متوسط',mafia:'متوسط',env:'منخفض'},
      notes:'محطة Part-Dieu.',
      source:'IOM DTM 2026' },

    { id:'lyon-rest', day:28, name:'⚠️ راحة — ليون', p:[45.7640,4.8357], country:'فرنسا', type:'rest',
      totalKm:2138, dayKm:0, walkHours:0, elevation:'170m',
      terrain:'مدينة', wildlife:'لا يوجد',
      temp:{winter:'3–9°C', summer:'22–32°C'},
      sleep:'مخبأ', water:'ماء', food:'مطاعم', toilet:'متاح',
      phone:'شحن', wifi:'مقهى', medical:'مستشفى', police:'عادية', drone:'محدودة',
      risks:{military:'منخفض',gangs:'منخفض',mafia:'منخفض',env:'منخفض'},
      notes:'جمع معلومات باريس.',
      source:'IOM DTM 2026' },

    { id:'paris-approach', day:29, name:'طريق باريس', p:[47.5000,3.5000], country:'فرنسا', type:'wild-camp',
      totalKm:2368, dayKm:230, walkHours:15, elevation:'100m',
      terrain:'سهول + حقول', wildlife:'ثعالب',
      temp:{winter:'3–8°C', summer:'18–28°C'},
      sleep:'خيمة', water:'قرية', food:'بقالة', toilet:'في العراء',
      phone:'لا شحن', wifi:'لا يوجد', medical:'لا يوجد', police:'عادية', drone:'محدودة',
      risks:{military:'منخفض',gangs:'متوسط',mafia:'متوسط',env:'منخفض'},
      notes:'230 كم. تعب شديد.',
      source:'IOM DTM 2026' },

    { id:'paris', day:30, name:'باريس', p:[48.8566,2.3522], country:'فرنسا', type:'hub',
      totalKm:2598, dayKm:230, walkHours:15, elevation:'35m',
      terrain:'سهول إيل دو فرانس', wildlife:'ثعالب',
      temp:{winter:'3–8°C', summer:'18–28°C'},
      sleep:'مخبأ', water:'ماء', food:'مطاعم', toilet:'متاح',
      phone:'شحن', wifi:'مقهى', medical:'مستشفى', police:'عادية', drone:'محدودة',
      risks:{military:'منخفض',gangs:'مرتفع',mafia:'مرتفع',env:'منخفض'},
      notes:'محطة Gare du Nord.',
      source:'IOM DTM 2026' },

    { id:'paris-rest', day:31, name:'⚠️ راحة — باريس', p:[48.8566,2.3522], country:'فرنسا', type:'rest',
      totalKm:2598, dayKm:0, walkHours:0, elevation:'35m',
      terrain:'مدينة', wildlife:'لا يوجد',
      temp:{winter:'3–8°C', summer:'18–28°C'},
      sleep:'مخبأ', water:'ماء', food:'مطاعم', toilet:'متاح',
      phone:'شحن', wifi:'مقهى', medical:'مستشفى', police:'عادية', drone:'محدودة',
      risks:{military:'منخفض',gangs:'منخفض',mafia:'منخفض',env:'منخفض'},
      notes:'تحضير للمرحلة النهائية.',
      source:'IOM DTM 2026' },

    { id:'calais', day:32, name:'🎯 كاليه — الوجهة', p:[50.9513,1.8587], country:'فرنسا', type:'destination',
      totalKm:2888, dayKm:290, walkHours:18, elevation:'8m',
      terrain:'سهول ساحلية + كثبان', wildlife:'طيور بحرية',
      temp:{winter:'3–8°C', summer:'18–25°C'},
      sleep:'مخيم New Jungle', water:'ماء', food:'Refugee Community Kitchen', toilet:'محدود',
      phone:'شحن', wifi:'محدود', medical:'MSF', police:'جدار 4م', drone:'مراقبة مكثفة',
      risks:{military:'خطر عالٍ جداً',gangs:'مرتفع',mafia:'مرتفع',env:'متوسط'},
      notes:'جدار Great Wall. 8.5 كم سياج Eurotunnel. 14 وفاة 2026.',
      source:'Telegraph 2016; Libertad Digital 2026' },

    { id:'calais-rest', day:33, name:'⚠️ راحة — كاليه', p:[50.9513,1.8587], country:'فرنسا', type:'rest',
      totalKm:2888, dayKm:0, walkHours:0, elevation:'8m',
      terrain:'مدينة ساحلية', wildlife:'لا يوجد',
      temp:{winter:'3–8°C', summer:'18–25°C'},
      sleep:'مخيم', water:'ماء', food:'مطبخ', toilet:'محدود',
      phone:'شحن', wifi:'محدود', medical:'MSF', police:'جدار', drone:'مكثفة',
      risks:{military:'خطر عالٍ جداً',gangs:'مرتفع',mafia:'مرتفع',env:'متوسط'},
      notes:'محاولة عبور القنال.',
      source:'MSF 2026' }
];

/* ============================================================
   SECTION 3 — BARRIERS
   ============================================================ */

const barriers = [
    { name:'🇬🇷-🇹🇷 سياج إيفروس', p:[41.35,26.35], length:'35 كم + 75 كم إجمالي', height:'5 متر',
      material:'فولاذ + كاميرات حرارية', terrain:'نهر مريتسا', year:'2012-2021',
      desc:'35 كم جديد (2023-2025). نزاع مع تركيا.', color:'#d32f2f', source:'eKathimerini 2026' },
    { name:'🇧🇬-🇹🇷 سياج ستراندجا', p:[41.8,26.5], length:'30 كم (110 كم مفتوح!)', height:'3 متر',
      material:'أسلاك شائكة + 1,000 شرطي', terrain:'غابات ستراندجا', year:'2014',
      desc:'110 كم غير مراقبة! قبور НЕИЗВЕСТЕН.', color:'#b71c1c', source:'Qantara.de 2026' },
    { name:'🇭🇺-🇷🇸 السياج المجري', p:[46.15,19.8], length:'175 كم', height:'4 متر × 2',
      material:'فولاذ + أسلاك + كاميرات + طائرات', terrain:'سهول + شجيرات', year:'2015-2017',
      desc:'سياج مزدوج. 1.5م تحت الأرض. 8,403 صدّ.', color:'#b71c1c', source:'CGTN 2026' },
    { name:'🇭🇷-🇧🇦 Maljevac', p:[45.0,15.9], length:'نقطة واحدة', height:'متغير',
      material:'فولاذ + أسلاك', terrain:'كارست صخري', year:'2019',
      desc:'كرواتيا لم تبنِ سياجاً دائماً. €328 مليون مراقبة.', color:'#ff6f00', source:'ERIM' },
    { name:'🇲🇰-🇬🇷 جيفجيليا', p:[41.1,22.5], length:'30 كم', height:'3 متر',
      material:'سياج معدني + جيش ARM', terrain:'حقول + تلال', year:'2015-2026',
      desc:'الجيش المقدوني. 200 مهاجر اخترقوه 2026.', color:'#6a1b9a', source:'ChatEurope 2025' },
    { name:'🇸🇮-🇭🇷 سياج سلوفينيا', p:[45.7,15.3], length:'200 كم (جزئي)', height:'4 متر',
      material:'أسلاك + سياج معدني', terrain:'غابات + تلال', year:'2015-2016',
      desc:'ثلث الحدود. تم تفكيكه جزئياً 2022.', color:'#6a1b9a', source:'Rathaus Jena 2022' },
    { name:'🇫🇷-🇬🇧 جدار كاليه', p:[50.9513,1.8587], length:'1 كم + 8.5 كم + 40 كم', height:'4 متر',
      material:'خرسانة + أسلاك + كاميرات + إنفراريد + طائرات', terrain:'سهول ساحلية', year:'2016',
      desc:'Great Wall. £2.3M. 14 وفاة 2026.', color:'#b71c1c', source:'Telegraph 2016' }
];

/* ============================================================
   SECTION 4 — DRONE ZONES
   ============================================================ */

const droneZones = [
    { name:'🛸 Frontex V-BAT ستراندجا', center:[41.9,27.2], radius:90000,
      desc:'V-BAT بدون طيار. UK تدرّب على طائرات بريطانية.', source:'Pulitzer Center 2025' },
    { name:'🛸 كرواتيا نهر سافا', center:[45.0,18.5], radius:80000,
      desc:'مراقبة ليلية. اعترضت 96 مهاجراً 2026.', source:'InfoMigrants 2026' },
    { name:'🛸 Frontex البوسنة', center:[44.3,17.5], radius:120000,
      desc:'130 ضابطاً. 4,910 اكتشاف في 7 أشهر.', source:'MREast 2026' },
    { name:'🛸 كاليه الحدود', center:[50.95,1.85], radius:50000,
      desc:'طائرات + كاميرات حرارية + إنفراريد + 40 كم سياج.', source:'Libertad Digital 2026' },
    { name:'🛸 Frontex صربيا', center:[44.0,21.0], radius:100000,
      desc:'اتفاقية 2026. حراس على جميع الحدود.', source:'24Chasa 2026' },
    { name:'🛸 المراقبة البلغارية', center:[41.8,26.3], radius:70000,
      desc:'دوريات مشتركة + طائرات مسيرة.', source:'BNT News 2022' }
];

/* ============================================================
   SECTION 5 — RIVERS
   ============================================================ */

const riverCrossings = [
    { name:'نهر مريتسا', p:[41.0,26.3], danger:'فيضان + سياج', deaths:'عشرات', source:'ChatEurope 2025' },
    { name:'نهر أونا', p:[44.8,16.0], danger:'بارد + عميق', deaths:'غرقى موثقون', source:'IOM 2026' },
    { name:'نهر كولبا', p:[45.5,15.1], danger:'سحي', deaths:'3 (مايو 2026)', source:'Slovenia Times 2026' },
    { name:'نهر سافا', p:[45.0,18.5], danger:'تيار قوي', deaths:'3 (2025)', source:'InfoMigrants 2026' },
    { name:'نهر درينا', p:[44.0,19.3], danger:'دوامات', deaths:'10 (أغسطس 2024)', source:'IOM 2025' },
    { name:'نهر الدانوب', p:[45.2,19.0], danger:'عميق', deaths:'1 (أكتوبر 2025)', source:'InfoMigrants 2025' }
];

/* ============================================================
   SECTION 6 — MILITARY SITES
   ============================================================ */

const militarySites = [
    { name:'قاعدة سودا 🇬🇷', p:[35.4944,24.0936], type:'NATO' },
    { name:'NRDC-GR سالونيك 🇬🇷', p:[40.6401,22.9444], type:'NATO' },
    { name:'كامب بوندستيل 🇽🇰', p:[42.3833,21.4833], type:'US' },
    { name:'قاعدة جيليافا 🇧🇦', p:[44.8333,15.8333], type:'Former' },
    { name:'ثكنة بورا ماركوفيتش 🇷🇸', p:[44.6667,20.2000], type:'Repurposed' },
    { name:'قاعدة كوتشوفا 🇦🇱', p:[40.7833,20.6167], type:'NATO' }
];

/* ============================================================
   SECTION 7 — RISK ZONES
   ============================================================ */

const riskZones = [
    { name:'⚠️ الخطر البلغارية-التركية', center:[41.85,26.5], radius:60000, color:'#d32f2f',
      desc:'لعبة الشرطة. قبور НЕИЗВЕСТЕН. 6 أيام مشي.', source:'Qantara.de 2026' },
    { name:'⚠️ الخطر الكرواتية-البوسنية', center:[45.0,15.9], radius:80000, color:'#c62828',
      desc:'30,000 صدّ. 13% أطفال. عضّ كلاب.', source:'BVMN 2026' },
    { name:'⚠️ الخطر المجرية-الصربية', center:[46.15,19.8], radius:70000, color:'#b71c1c',
      desc:'سياج مزدوج. 8,403 صدّ. قنابل مسيلة.', source:'CGTN 2026' },
    { name:'⚠️ الألغام الأرضية البوسنة', center:[44.3,17.5], radius:120000, color:'#7b1fa2',
      desc:'180,000 لغم. 617 وفاة. جلسات توعية.', source:'BVMN 2026' },
    { name:'⚠️ كاليه الوجهة', center:[50.95,1.85], radius:50000, color:'#b71c1c',
      desc:'جدار 4م. 14 وفاة 2026. 6,000 في New Jungle.', source:'MSF 2026' }
];

/* ============================================================
   SECTION 8 — MAP MARKERS
   ============================================================ */

const typeColors = {
    start:'#ff6f00', border:'#6a1b9a', hub:'#1565c0', transit:'#00838f',
    entry:'#2e7d32', destination:'#ffc107', 'wild-camp':'#4caf50', rest:'#c62828'
};

const routeCoords = allStops.map(function(s) { return s.p; });

const routeLine = L.polyline(routeCoords, {
    color:'#e53935', weight:6, opacity:0.9, dashArray:'14 10', lineCap:'round'
}).addTo(map);

const stopMarkers = [];
const labelMarkers = [];

allStops.forEach(function(s) {
    const color = typeColors[s.type] || '#555';
    const size = (s.type === 'start' || s.type === 'destination') ? 20 : 12;

    const icon = L.divIcon({
        className:'',
        html: '<div style="background:' + color + ';width:' + size + 'px;height:' + size +
              'px;border-radius:50%;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.7);"></div>',
        iconSize: [size + 6, size + 6],
        iconAnchor: [(size + 6) / 2, (size + 6) / 2]
    });

    const m = L.marker(s.p, {
        icon: icon,
        zIndexOffset: s.type === 'destination' ? 3000 : 500
    }).addTo(map);

    /* Popup — click to reveal */
    m.bindPopup(buildStopPopup(s), { maxWidth: 380 });
    stopMarkers.push(m);

    /* Optional label */
    const lm = L.marker(s.p, {
        icon: L.divIcon({
            className:'',
            html: '<div class="city-label">' + s.name + '</div>',
            iconSize: [0, 0],
            iconAnchor: [0, 18]
        }),
        interactive: false
    });
    labelMarkers.push(lm);
});

/* --- Full stop popup builder --- */
function buildStopPopup(s) {
    const color = typeColors[s.type] || '#555';

    return '<div style="min-width:300px;">' +
        '<h3 style="margin:0 0 5px 0;color:' + color + ';font-size:0.95rem;">' + s.name + '</h3>' +
        '<p style="margin:1px 0;font-size:10px;color:#94a3b8;">📍 ' + s.country +
        ' • اليوم ' + s.day + ' • ' + s.elevation + '</p>' +

        '<div style="margin:6px 0;padding:6px 8px;background:rgba(56,189,248,0.1);border-radius:5px;">' +
        '<div style="font-size:10px;color:#38bdf8;font-weight:700;">📊 المسافة</div>' +
        '<div style="font-size:10px;color:#cbd5e1;">' +
        'اليوم: <b>' + s.dayKm + ' كم</b> • الإجمالي: <b>' + s.totalKm.toLocaleString() + ' كم</b>' +
        '<br>ساعات المشي: <b>' + s.walkHours + ' ساعات</b></div></div>' +

        '<div style="margin:6px 0;padding:6px 8px;background:rgba(76,175,80,0.1);border-radius:5px;">' +
        '<div style="font-size:10px;color:#81c784;font-weight:700;">🏪 المرافق</div>' +
        '<div style="font-size:10px;color:#cbd5e1;">' +
        '💧 ' + s.water + '<br>' +
        '🍞 ' + s.food + '<br>' +
        '🚻 ' + s.toilet + '<br>' +
        '📱 ' + s.phone + '<br>' +
        '📶 ' + s.wifi + '<br>' +
        '🏥 ' + s.medical + '</div></div>' +

        '<div style="margin:6px 0;padding:6px 8px;background:rgba(255,193,7,0.1);border-radius:5px;">' +
        '<div style="font-size:10px;color:#ffc107;font-weight:700;">🏠 المبيت</div>' +
        '<div style="font-size:10px;color:#cbd5e1;">' + s.sleep + '</div></div>' +

        '<div style="margin:6px 0;padding:6px 8px;background:rgba(198,40,40,0.1);border-radius:5px;">' +
        '<div style="font-size:10px;color:#fca5a5;font-weight:700;">⚠️ الشرطة والطائرات</div>' +
        '<div style="font-size:10px;color:#cbd5e1;">' + s.police + '<br>🛸 ' + s.drone + '</div></div>' +

        '<div style="margin:5px 0;font-size:10px;line-height:1.5;color:#cbd5e1;">' + s.notes + '</div>' +
        '<p style="margin:3px 0;font-size:9px;color:#475569;">📚 ' + s.source + '</p></div>';
}

/* --- Barrier markers --- */
const barrierLayer = L.layerGroup().addTo(map);
const barrierIcon = L.divIcon({
    className:'',
    html:'<div style="background:#7b1fa2;width:16px;height:16px;border-radius:3px;border:2px solid #ce93d8;display:flex;align-items:center;justify-content:center;font-size:9px;color:#fff;">🚧</div>',
    iconSize:[20,20], iconAnchor:[10,10]
});

barriers.forEach(function(b) {
    const m = L.marker(b.p, { icon: barrierIcon, zIndexOffset: 850 });
    m.bindPopup(
        '<div style="min-width:280px;">' +
        '<h3 style="margin:0 0 5px 0;color:' + b.color + ';font-size:0.85rem;">🚧 ' + b.name + '</h3>' +
        '<p style="margin:1px 0;font-size:10px;"><b>الطول:</b> ' + b.length + '</p>' +
        '<p style="margin:1px 0;font-size:10px;"><b>الارتفاع:</b> ' + b.height + '</p>' +
        '<p style="margin:1px 0;font-size:10px;"><b>المادة:</b> ' + b.material + '</p>' +
        '<p style="margin:5px 0;font-size:10px;color:#cbd5e1;">' + b.desc + '</p>' +
        '<p style="margin:2px 0;font-size:9px;color:#64748b;">📚 ' + b.source + '</p></div>'
    );
    barrierLayer.addLayer(m);
});

/* --- Drone zones --- */
const droneLayer = L.layerGroup().addTo(map);

droneZones.forEach(function(d) {
    const c = L.circle(d.center, {
        radius: d.radius, color:'#ff6f00', fillColor:'#ff6f00',
        fillOpacity: 0.06, weight: 2, dashArray:'4 6'
    });
    c.bindPopup(
        '<div style="min-width:260px;">' +
        '<h3 style="margin:0 0 5px 0;color:#ff9800;">' + d.name + '</h3>' +
        '<p style="margin:5px 0;font-size:10px;color:#cbd5e1;">' + d.desc + '</p>' +
        '<p style="margin:2px 0;font-size:9px;color:#64748b;">📚 ' + d.source + '</p></div>'
    );
    droneLayer.addLayer(c);
});

/* --- Military sites --- */
const militaryLayer = L.layerGroup().addTo(map);
const militaryIcon = L.divIcon({
    className:'',
    html:'<div style="background:#37474f;width:14px;height:14px;border-radius:3px;border:2px solid #ffeb3b;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;">⚔</div>',
    iconSize:[18,18], iconAnchor:[9,9]
});

militarySites.forEach(function(s) {
    const m = L.marker(s.p, { icon: militaryIcon, zIndexOffset: 800 });
    m.bindPopup('<div style="min-width:180px;"><h3 style="margin:0 0 4px 0;color:#ffeb3b;font-size:0.8rem;">⚔️ ' + s.name + '</h3><p style="font-size:10px;color:#94a3b8;">' + s.type + '</p></div>');
    militaryLayer.addLayer(m);
});

/* --- Rivers --- */
const riverLayer = L.layerGroup().addTo(map);
const riverIcon = L.divIcon({
    className:'',
    html:'<div style="background:#0288d1;width:14px;height:14px;border-radius:50%;border:2px solid #4fc3f7;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;">🌊</div>',
    iconSize:[18,18], iconAnchor:[9,9]
});

riverCrossings.forEach(function(r) {
    const m = L.marker(r.p, { icon: riverIcon, zIndexOffset: 700 });
    m.bindPopup('<div style="min-width:200px;"><h3 style="margin:0 0 4px 0;color:#4fc3f7;font-size:0.8rem;">🌊 ' + r.name + '</h3><p style="margin:2px 0;font-size:10px;color:#fca5a5;">⚠️ ' + r.danger + '</p><p style="margin:2px 0;font-size:10px;color:#94a3b8;">الوفيات: ' + r.deaths + '</p></div>');
    riverLayer.addLayer(m);
});

/* --- Risk zones --- */
const riskLayer = L.layerGroup().addTo(map);

riskZones.forEach(function(z) {
    const c = L.circle(z.center, {
        radius: z.radius, color: z.color, fillColor: z.color,
        fillOpacity: 0.10, weight: 2, dashArray:'6 4'
    });
    c.bindPopup('<div style="min-width:260px;"><h3 style="margin:0 0 5px 0;color:' + z.color + ';font-size:0.9rem;">' + z.name + '</h3><p style="margin:5px 0;font-size:10px;color:#cbd5e1;">' + z.desc + '</p><p style="margin:2px 0;font-size:9px;color:#64748b;">📚 ' + z.source + '</p></div>');
    riskLayer.addLayer(c);
});

/* ============================================================
   SECTION 9 — LIVE GPS TRACKING
   ============================================================ */

let userGpsMarker = null;
let userAccuracyCircle = null;
let userHeading = 0;
let currentPosition = null;
let followMode = false;
let watchId = null;
let guideMode = true;

/* --- GPS marker icon --- */
const gpsIcon = L.divIcon({
    className:'',
    html:'<div class="user-gps-marker"></div>',
    iconSize:[20,20], iconAnchor:[10,10]
});

/* --- Update GPS marker on map --- */
function updateGpsMarker(lat, lng, accuracy, heading) {
    if (!userGpsMarker) {
        userGpsMarker = L.marker([lat, lng], {
            icon: gpsIcon, zIndexOffset: 10000
        }).addTo(map);
    } else {
        userGpsMarker.setLatLng([lat, lng]);
    }

    if (!userAccuracyCircle) {
        userAccuracyCircle = L.circle([lat, lng], {
            radius: accuracy,
            color:'#2196f3', fillColor:'#2196f3',
            fillOpacity: 0.15, weight: 1
        }).addTo(map);
    } else {
        userAccuracyCircle.setLatLng([lat, lng]);
        userAccuracyCircle.setRadius(accuracy);
    }

    if (heading !== null && !isNaN(heading)) {
        userHeading = heading;
    }
}

/* --- Haversine distance --- */
function distanceKm(a, b) {
    const R = 6371;
    const lat1 = a[0] * Math.PI / 180;
    const lat2 = b[0] * Math.PI / 180;
    const dLat = (b[0] - a[0]) * Math.PI / 180;
    const dLon = (b[1] - a[1]) * Math.PI / 180;
    const x = Math.sin(dLat/2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/* --- Bearing calculation --- */
function bearing(a, b) {
    const lat1 = a[0] * Math.PI / 180;
    const lat2 = b[0] * Math.PI / 180;
    const dLon = (b[1] - a[1]) * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

/* --- Find nearest stop and next stop --- */
function findNearestAndNext(lat, lng) {
    const pos = [lat, lng];
    let nearest = allStops[0];
    let nearestDist = Infinity;
    let nearestIdx = 0;

    allStops.forEach(function(s, i) {
        const d = distanceKm(pos, s.p);
        if (d < nearestDist) {
            nearestDist = d;
            nearest = s;
            nearestIdx = i;
        }
    });

    /* Next stop = one after nearest in the route */
    let nextIdx = nearestIdx + 1;
    if (nextIdx >= allStops.length) { nextIdx = allStops.length - 1; }

    return {
        nearest: nearest,
        nearestIdx: nearestIdx,
        nearestDist: nearestDist,
        next: allStops[nextIdx],
        nextIdx: nextIdx
    };
}

/* --- Navigation update --- */
function updateNavigation(lat, lng, heading) {
    const pos = [lat, lng];
    const result = findNearestAndNext(lat, lng);
    const nextStop = result.next;
    const distToNext = distanceKm(pos, nextStop.p);
    const brg = bearing(pos, nextStop.p);
    const etaHours = distToNext / 5; /* 5 km/h avg walking speed */

    /* Update nav overlay */
    document.getElementById('nav-next-name').textContent = nextStop.name;
    document.getElementById('nav-next-distance').textContent = distToNext.toFixed(1) + ' كم';
    document.getElementById('nav-next-bearing').textContent = Math.round(brg) + '°';
    document.getElementById('nav-next-eta').textContent = etaHours.toFixed(1) + ' س';

    /* Update progress bar */
    const totalDist = allStops[allStops.length - 1].totalKm;
    const currentKm = nextStop.totalKm - distToNext;
    const pct = Math.max(0, Math.min(100, (currentKm / totalDist) * 100));
    document.getElementById('nav-progress-fill').style.width = pct + '%';
    document.getElementById('nav-progress-text').textContent =
        Math.round(currentKm).toLocaleString() + ' / ' + totalDist.toLocaleString() + ' كم';

    /* Update compass */
    updateCompass(brg, heading);

    /* Update nav HUD sidebar */
    updateNavHud(result, distToNext, brg, etaHours);

    /* Follow mode */
    if (followMode) {
        map.panTo([lat, lng], { animate: true, duration: 0.5 });
    }
}

/* --- Compass rotation --- */
function updateCompass(targetBearing, deviceHeading) {
    const arrow = document.getElementById('compass-arrow');
    const headingEl = document.getElementById('compass-heading');
    const hud = document.getElementById('compass-hud');

    if (!arrow || !headingEl || !hud) { return; }

    /* Rotate arrow to point toward target */
    const rotation = targetBearing - (deviceHeading || 0);
    arrow.style.transform = 'translate(-50%, -50%) rotate(' + rotation + 'deg)';

    headingEl.textContent = Math.round(targetBearing) + '°';
    hud.classList.add('active');
}

/* --- Update sidebar nav HUD --- */
function updateNavHud(result, distToNext, brg, etaHours) {
    const hud = document.getElementById('nav-hud');
    if (!hud) { return; }

    const dirName = getDirectionName(brg);

    hud.innerHTML =
        '<div class="nav-row nav-current">' +
        '<span class="nav-label">📍 أقرب نقطة</span>' +
        '<span class="nav-value">' + result.nearest.name + '</span>' +
        '</div>' +
        '<div class="nav-row">' +
        '<span class="nav-label">المسافة إليها</span>' +
        '<span class="nav-value">' + result.nearestDist.toFixed(1) + ' كم</span>' +
        '</div>' +
        '<div class="nav-row nav-next">' +
        '<span class="nav-label">🎯 المحطة التالية</span>' +
        '<span class="nav-value">' + result.next.name + '</span>' +
        '</div>' +
        '<div class="nav-row">' +
        '<span class="nav-label">المسافة</span>' +
        '<span class="nav-value">' + distToNext.toFixed(1) + ' كم</span>' +
        '</div>' +
        '<div class="nav-row">' +
        '<span class="nav-label">الاتجاه</span>' +
        '<span class="nav-value">' + Math.round(brg) + '° ' + dirName + '</span>' +
        '</div>' +
        '<div class="nav-row">' +
        '<span class="nav-label">الوقت المتوقع</span>' +
        '<span class="nav-value">' + etaHours.toFixed(1) + ' ساعة</span>' +
        '</div>' +
        '<div class="nav-arrow-big" style="transform:rotate(' + brg + 'deg);">▲</div>';
}

/* --- Direction name from bearing --- */
function getDirectionName(deg) {
    const dirs = ['شمال', 'شمال-شرق', 'شرق', 'جنوب-شرق', 'جنوب', 'جنوب-غرب', 'غرب', 'شمال-غرب'];
    return dirs[Math.round(deg / 45) % 8];
}

/* --- Update GPS info panel --- */
function updateGpsInfo(lat, lng, accuracy, heading, speed) {
    const info = document.getElementById('gps-info');
    if (!info) { return; }

    const result = findNearestAndNext(lat, lng);

    info.innerHTML =
        '<div class="gps-info-grid">' +
        '<div class="gps-info-item"><span class="gps-key">Latitude</span><span class="gps-val">' + lat.toFixed(5) + '</span></div>' +
        '<div class="gps-info-item"><span class="gps-key">Longitude</span><span class="gps-val">' + lng.toFixed(5) + '</span></div>' +
        '<div class="gps-info-item"><span class="gps-key">Accuracy</span><span class="gps-val">' + Math.round(accuracy) + 'm</span></div>' +
        '<div class="gps-info-item"><span class="gps-key">Heading</span><span class="gps-val">' + Math.round(heading || 0) + '°</span></div>' +
        '<div class="gps-info-item"><span class="gps-key">Speed</span><span class="gps-val">' + ((speed || 0) * 3.6).toFixed(1) + ' km/h</span></div>' +
        '<div class="gps-info-item"><span class="gps-key">Status</span><span class="gps-val" style="color:#4caf50;">نشط</span></div>' +
        '</div>' +
        '<div style="margin-top:6px;padding:6px 8px;background:#1a2332;border-radius:6px;font-size:0.65rem;color:#94a3b8;">' +
        '📍 أنت على بعد <b style="color:#38bdf8;">' + result.nearestDist.toFixed(1) + ' كم</b> من <b style="color:#f1f5f9;">' + result.nearest.name + '</b>' +
        '</div>';
}

/* --- Start GPS watch --- */
function startGpsTracking() {
    const status = document.getElementById('gps-status');
    if (!navigator.geolocation) {
        setGpsStatus('error', 'GPS غير مدعوم');
        return;
    }

    setGpsStatus('searching', 'جاري البحث...');

    watchId = navigator.geolocation.watchPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            const heading = position.coords.heading;
            const speed = position.coords.speed;

            currentPosition = { lat: lat, lng: lng, accuracy: accuracy };

            setGpsStatus('connected', 'متصل');
            updateGpsMarker(lat, lng, accuracy, heading);
            updateNavigation(lat, lng, heading);
            updateGpsInfo(lat, lng, accuracy, heading, speed);

            /* First fix — zoom to user */
            if (!window._gpsFirstFix) {
                window._gpsFirstFix = true;
                map.flyTo([lat, lng], 12, { duration: 1.5 });
            }
        },
        function(error) {
            let msg = 'خطأ';
            if (error.code === 1) { msg = 'مرفوض'; }
            else if (error.code === 2) { msg = 'غير متاح'; }
            else if (error.code === 3) { msg = 'انتهت المدة'; }
            setGpsStatus('error', msg);
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 5000
        }
    );
}

/* --- Stop GPS --- */
function stopGpsTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    setGpsStatus('', 'غير متصل');
}

/* --- Set GPS status --- */
function setGpsStatus(cls, text) {
    const status = document.getElementById('gps-status');
    if (!status) { return; }
    status.className = 'gps-status' + (cls ? ' ' + cls : '');
    const txt = status.querySelector('.gps-text');
    if (txt) { txt.textContent = text; }
}

/* ============================================================
   SECTION 10 — SIMULATED WALKER (fallback)
   ============================================================ */

let simIndex = 0;
let simMarker = null;

function initSimulatedWalker() {
    const simIcon = L.divIcon({
        className:'user-pulse',
        html:'<div style="background:#4caf50;width:18px;height:18px;border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:10px;">🚶</div>',
        iconSize:[24,24], iconAnchor:[12,12]
    });

    simMarker = L.marker(allStops[0].p, {
        icon: simIcon, zIndexOffset: 5000
    }).addTo(map);

    simMarker.bindTooltip('🚶 المسار المحاكى', {
        direction:'right', className:'city-label'
    });
}

function advanceSimulated() {
    if (simIndex >= allStops.length - 1) { simIndex = 0; }
    simIndex++;
    const stop = allStops[simIndex];

    if (simMarker) {
        simMarker.setLatLng(stop.p);
        simMarker.bindTooltip('🚶 اليوم ' + stop.day + ' — ' + stop.name, {
            direction:'right', className:'city-label'
        });
    }

    /* Update navigation as if user is at this stop */
    updateNavigation(stop.p[0], stop.p[1], 0);
    updateGpsInfo(stop.p[0], stop.p[1], 50, 0, 0);
}

/* ============================================================
   SECTION 11 — SIDEBAR PANELS
   ============================================================ */

/* --- Trip summary --- */
(function() {
    const last = allStops[allStops.length - 1];
    const totalKm = last.totalKm;
    const totalDays = last.day;
    const totalWalkHours = allStops.reduce(function(s, x) { return s + x.walkHours; }, 0);
    const restDays = allStops.filter(function(x) { return x.type === 'rest'; }).length;

    document.getElementById('trip-summary').innerHTML =
        '<div class="summary-highlight">' +
        '<div class="destination">🎯 الوجهة: كاليه، فرنسا</div>' +
        '<div class="total">' + totalKm.toLocaleString() + ' كم</div>' +
        '<div style="font-size:0.62rem;color:#94a3b8;margin-top:4px;">من أدرنة، تركيا إلى نفق القنال</div>' +
        '</div>' +
        '<div class="summary-grid">' +
        '<div class="summary-card"><span class="value">' + totalDays + '</span><span class="label">إجمالي الأيام</span></div>' +
        '<div class="summary-card"><span class="value">' + totalWalkHours + '</span><span class="label">ساعات المشي</span></div>' +
        '<div class="summary-card"><span class="value">' + restDays + '</span><span class="label">أيام راحة</span></div>' +
        '<div class="summary-card"><span class="value">6</span><span class="label">دول</span></div>' +
        '</div>';
})();

/* --- Route stats --- */
(function() {
    document.getElementById('route-stats').innerHTML =
        '<div style="padding:6px;background:#1a2332;border-radius:5px;margin-bottom:5px;">' +
        '<div style="font-size:0.7rem;color:#fca5a5;font-weight:700;">📉 انخفاض 42%</div>' +
        '<div style="font-size:0.62rem;color:#94a3b8;margin-top:2px;">12,500 عبور 2025 (Frontex)</div></div>' +
        '<div style="padding:6px;background:#1a2332;border-radius:5px;margin-bottom:5px;">' +
        '<div style="font-size:0.7rem;color:#fcd34d;font-weight:700;">💀 413 وفاة</div>' +
        '<div style="font-size:0.62rem;color:#94a3b8;margin-top:2px;">منذ 2014 (IOM)</div></div>' +
        '<div style="padding:6px;background:#1a2332;border-radius:5px;margin-bottom:5px;">' +
        '<div style="font-size:0.7rem;color:#f87171;font-weight:700;">⚠️ 30,000 صدّ</div>' +
        '<div style="font-size:0.62rem;color:#94a3b8;margin-top:2px;">كرواتيا 2020-2022</div></div>' +
        '<div style="padding:6px;background:#1a2332;border-radius:5px;">' +
        '<div style="font-size:0.7rem;color:#fcd34d;font-weight:700;">🧒 13% أطفال</div>' +
        '<div style="font-size:0.62rem;color:#94a3b8;margin-top:2px;">في حالات الصدّ</div></div>';
})();

/* --- Daily schedule (collapsed cards) --- */
(function() {
    let html = '';
    allStops.forEach(function(s) {
        if (s.type === 'rest') {
            html += '<div class="rest-card" data-stop-id="' + s.id + '">' +
                '<div class="rest-title">⚠️ ' + s.name + '</div>' +
                '<div class="rest-reason">' + s.notes + '</div></div>';
        } else {
            html += '<div class="day-card" data-stop-id="' + s.id + '">' +
                '<div class="day-title">' +
                '<span>اليوم ' + s.day + ': ' + s.name + '</span>' +
                '<span class="day-badge">' + s.totalKm.toLocaleString() + ' كم</span>' +
                '</div>' +
                '<div class="day-meta">📍 ' + s.country + ' | 🚶 ' + s.dayKm + ' كم | ⏱️ ' + s.walkHours + ' س</div>' +
                '<div class="day-hours">' +
                '💧 ' + s.water + '<br>' +
                '🍞 ' + s.food + '<br>' +
                '🏠 ' + s.sleep + '<br>' +
                '🏔️ ' + s.terrain +
                '</div></div>';
        }
    });
    document.getElementById('daily-schedule').innerHTML = html;
})();

/* --- Stop list --- */
(function() {
    let html = '';
    allStops.forEach(function(s) {
        const color = typeColors[s.type] || '#555';
        html += '<div class="stop-item" data-lat="' + s.p[0] + '" data-lng="' + s.p[1] + '" data-id="' + s.id + '">' +
            '<div class="stop-dot" style="background:' + color + ';"></div>' +
            '<div class="stop-info">' +
            '<div class="stop-name">' + s.name + '</div>' +
            '<div class="stop-meta">اليوم ' + s.day + ' • ' + s.totalKm.toLocaleString() + ' كم</div>' +
            '</div></div>';
    });
    document.getElementById('stop-list').innerHTML = html;
})();

/* --- Barriers list --- */
(function() {
    let html = '';
    barriers.forEach(function(b) {
        html += '<div class="barrier-card">' +
            '<div class="b-name">' + b.name + '</div>' +
            '<div class="b-stat">' + b.year + '</div>' +
            '<div class="b-detail">📏 ' + b.length + '</div>' +
            '<div class="b-detail">📐 ' + b.height + '</div>' +
            '<div class="b-detail">🧱 ' + b.material + '</div></div>';
    });
    document.getElementById('barriers-list').innerHTML = html;
})();

/* --- Drone list --- */
(function() {
    let html = '';
    droneZones.forEach(function(d) {
        html += '<div class="drone-card">' +
            '<div class="d-name">' + d.name + '</div>' +
            '<div class="d-detail">' + d.desc + '</div>' +
            '<div class="d-detail" style="font-size:0.58rem;color:#475569;">📚 ' + d.source + '</div></div>';
    });
    document.getElementById('drone-list').innerHTML = html;
})();

/* --- Risk list --- */
(function() {
    let html = '';
    riskZones.forEach(function(z) {
        html += '<div class="risk-card">' +
            '<div class="r-name">' + z.name + '</div>' +
            '<div class="r-detail">' + z.desc + '</div>' +
            '<div class="r-detail" style="font-size:0.58rem;color:#475569;">📚 ' + z.source + '</div></div>';
    });
    document.getElementById('risk-list').innerHTML = html;
})();

/* ============================================================
   SECTION 12 — COLLAPSIBLE PANELS
   ============================================================ */

document.querySelectorAll('.panel-title.collapsible').forEach(function(title) {
    title.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const target = document.getElementById(targetId);
        if (!target) { return; }

        const isCollapsed = this.classList.contains('collapsed');
        if (isCollapsed) {
            this.classList.remove('collapsed');
            target.classList.remove('collapsed');
            target.classList.add('expanded');
        } else {
            this.classList.add('collapsed');
            target.classList.add('collapsed');
            target.classList.remove('expanded');
        }
    });
});

/* --- Expandable cards (day, rest, barrier, drone, risk) --- */
document.querySelectorAll('.day-card, .rest-card, .barrier-card, .drone-card, .risk-card').forEach(function(card) {
    card.addEventListener('click', function(e) {
        /* Don't toggle if clicking a stop-item */
        if (e.target.closest('.stop-item')) { return; }
        this.classList.toggle('expanded');
    });
});

/* ============================================================
   SECTION 13 — STOP LIST CLICK TO FLY
   ============================================================ */

document.querySelectorAll('.stop-item').forEach(function(item) {
    item.addEventListener('click', function() {
        const lat = parseFloat(this.getAttribute('data-lat'));
        const lng = parseFloat(this.getAttribute('data-lng'));
        const id = this.getAttribute('data-id');

        map.flyTo([lat, lng], 11, { duration: 1.2 });

        /* Open marker popup */
        const stop = allStops.find(function(s) { return s.id === id; });
        if (stop) {
            const idx = allStops.indexOf(stop);
            if (stopMarkers[idx]) {
                setTimeout(function() { stopMarkers[idx].openPopup(); }, 1200);
            }
        }
    });
});

/* ============================================================
   SECTION 14 — LAYER CONTROLS
   ============================================================ */

document.getElementById('toggle-route').addEventListener('change', function() {
    this.checked ? routeLine.addTo(map) : map.removeLayer(routeLine);
});

document.getElementById('toggle-stops').addEventListener('change', function() {
    stopMarkers.forEach(function(m) {
        this.checked ? m.addTo(map) : map.removeLayer(m);
    }, this);
});

document.getElementById('toggle-labels').addEventListener('change', function() {
    labelMarkers.forEach(function(m) {
        this.checked ? m.addTo(map) : map.removeLayer(m);
    }, this);
});

document.getElementById('toggle-barriers').addEventListener('change', function() {
    this.checked ? barrierLayer.addTo(map) : map.removeLayer(barrierLayer);
});

document.getElementById('toggle-drones').addEventListener('change', function() {
    this.checked ? droneLayer.addTo(map) : map.removeLayer(droneLayer);
});

document.getElementById('toggle-military').addEventListener('change', function() {
    this.checked ? militaryLayer.addTo(map) : map.removeLayer(militaryLayer);
});

document.getElementById('toggle-rivers').addEventListener('change', function() {
    this.checked ? riverLayer.addTo(map) : map.removeLayer(riverLayer);
});

document.getElementById('toggle-risk').addEventListener('change', function() {
    this.checked ? riskLayer.addTo(map) : map.removeLayer(riskLayer);
});

/* ============================================================
   SECTION 15 — HEADER BUTTONS
   ============================================================ */

document.getElementById('btn-locate').addEventListener('click', function() {
    if (currentPosition) {
        map.flyTo([currentPosition.lat, currentPosition.lng], 13, { duration: 1.5 });
    } else if (!watchId) {
        startGpsTracking();
    }
});

document.getElementById('btn-follow').addEventListener('click', function() {
    followMode = !followMode;
    this.classList.toggle('active', followMode);
    if (followMode && currentPosition) {
        map.flyTo([currentPosition.lat, currentPosition.lng], 13, { duration: 1 });
    }
});

document.getElementById('btn-guide').addEventListener('click', function() {
    guideMode = !guideMode;
    this.classList.toggle('active', guideMode);
    const overlay = document.getElementById('nav-overlay');
    if (overlay) {
        overlay.classList.toggle('active', guideMode);
    }
});

/* Legend toggle */
document.getElementById('legend-toggle').addEventListener('click', function() {
    const legend = document.getElementById('map-legend');
    legend.classList.toggle('collapsed');
});

/* ============================================================
   SECTION 16 — INITIALISE
   ============================================================ */

/* Fit map to route */
const allPoints = [];
allStops.forEach(function(s) { allPoints.push(s.p); });
map.fitBounds(allPoints, { padding: [50, 50] });

/* Add scale */
L.control.scale({
    imperial: false, metric: true, position: 'bottomleft'
}).addTo(map);

/* Layer control */
L.control.layers(
    {
        '🗺️ شوارع': osmLayer,
        '🛰️ أقمار': satelliteLayer,
        '⛰️ تضاريس': terrainLayer
    },
    {
        '🚧 الحواجز': barrierLayer,
        '🛸 الطائرات': droneLayer,
        '⚔️ العسكرية': militaryLayer,
        '🌊 الأنهار': riverLayer,
        '⚠️ الخطر': riskLayer
    },
    { position: 'topleft' }
).addTo(map);

/* Init simulated walker */
initSimulatedWalker();

/* Try real GPS; fallback to simulation */
if (navigator.geolocation) {
    startGpsTracking();
} else {
    setGpsStatus('error', 'GPS غير مدعوم');
    setInterval(advanceSimulated, 6000);
}

/* If no GPS fix after 8s, start simulated walker */
setTimeout(function() {
    if (!window._gpsFirstFix) {
        console.log('[Simulator] No GPS fix — using simulated walker');
        setInterval(advanceSimulated, 6000);
    }
}, 8000);

/* Show nav overlay by default */
document.getElementById('nav-overlay').classList.add('active');

/* ============================================================
   END OF SCRIPT
   ============================================================
   Total stops: 33
   Total barriers: 7
   Total drone zones: 6
   Total rivers: 6
   Total risk zones: 5
   Total military sites: 6
   ============================================================ */
