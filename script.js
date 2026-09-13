/* ============================================================
   BALKAN ROUTE WALKING SIMULATOR — MASTER SCRIPT
   ============================================================
   A comprehensive, data-driven simulation of the walking
   route from Edirne, Türkiye to Calais, France.

   All data is sourced from:
   ─────────────────────────────────────────────
   [1]  Frontex Risk Analysis 2025-2027
   [2]  IOM DTM Western Balkans 2026
   [3]  Mixed Migration Centre 4Mi (888 interviews)
   [4]  BVMN — Border Violence Monitoring Network
   [5]  Save the Children (May 2026)
   [6]  Qantara.de — Strandzha graves (2026)
   [7]  InfoMigrants — Croatia pushbacks (2026)
   [8]  Borderline Europe (July 2026)
   [9]  AP News — 10-day, 200km hike (2015)
   [10] Gulf Times — 200km Belgrade-Horgos walk
   [11] Telegraph — Calais wall (2016)
   [12] Libertad Digital — Calais surveillance (2026)
   [13] Peaks of the Balkans — 15-25 km/day
   ============================================================ */

'use strict';

/* ============================================================
   SECTION 1: MAP INITIALISATION
   ============================================================ */

const map = L.map('map', {
    zoomControl: true,
    attributionControl: true,
    minZoom: 4,
    maxZoom: 18,
    preferCanvas: true
}).setView([44.5, 15.0], 5);

/* Base tile layers */
const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const satelliteLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
        maxZoom: 18,
        attribution: '&copy; Esri, Maxar, Earthstar Geographics'
    }
);

const terrainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; OpenTopoMap contributors'
});

osmLayer.addTo(map);

/* ============================================================
   SECTION 2: MASTER STOP DATA
   ============================================================
   Every single location where the walker stops, rests,
   sleeps, or passes through. Each entry contains:
   - Geographic coordinates
   - Cumulative distance walked
   - Daily distance & walking hours
   - Shelter, food, water, medical info
   - Terrain type & wildlife dangers
   - Drone surveillance & police presence
   ============================================================ */

const allStops = [

    /* ========== TÜRKİYE — DAY 0 ========== */
    {
        id: 'edirne',
        day: 0,
        name: 'أدرنة',
        p: [41.6771, 26.5557],
        country: 'تركيا',
        type: 'start',
        totalKm: 0,
        dayKm: 0,
        walkHours: 0,
        elevation: '42m',
        terrain: 'سهول زراعية مكشوفة — حقول عباد الشمس والقمح',
        terrainDesc: 'سهول عريضة مسطحة. لا غابات. الأرض مستوية تماماً. لا ظل من الشمس. حرارة صيفية تصل إلى 32°C.',
        wildlife: 'كلاب رعاة، ثعالب، أفاعي حقول (نادرة)',
        temp: { winter: '-2–6°C', summer: '20–32°C' },
        sleep: 'فندق رخيص / مخبأ في محطة الحافلات',
        water: 'متجر — ماء معبأ (اشتري 6 لترات)',
        food: 'مطاعم — خبز، جبن، زيتون، معلبات',
        toilet: 'متاح في المطاعم والمحطة',
        phone: 'شحن في المقهى',
        wifi: 'مقهى إنترنت',
        medical: 'مستشفى حكومي في وسط المدينة',
        police: 'دوريات عادية — ليست مكثفة',
        drone: 'مراقبة محدودة في المناطق الحدودية',
        facilities: 'محطة حافلات، مطاعم، متاجر، صراف آلي، صيدلية، مستشفى',
        risks: {
            military: 'متوسط',
            gangs: 'منخفض',
            mafia: 'مرتفع',
            env: 'منخفض'
        },
        notes: 'نقطة الانطلاق الرئيسية. شراء مؤن لـ 5 أيام على الأقل. الحدود اليونانية على بعد 20 كم. الحدود البلغارية على بعد 18 كم. "لعبة الشرطة" بين المهربين والشرطة البلغارية موثقة. التكلفة المتوقعة للتهريب: $1,500–$3,000.',
        source: 'IOM DTM 2026; Qantara.de 2026'
    },

    /* ========== BULGARIA — BORDER ========== */
    {
        id: 'kapitan-andreevo',
        day: 1,
        name: 'كابيتان أندرييفو — الحدود',
        p: [41.7167, 26.3333],
        country: 'بلغاريا',
        type: 'border',
        totalKm: 20,
        dayKm: 20,
        walkHours: 5,
        elevation: '150m',
        terrain: 'غابات ستراندجا الجبلية الكثيفة',
        terrainDesc: 'محمية ستراندجا الطبيعية — أكبر محمية في بلغاريا. تمتد 160 كم على طول الحدود التركية-البلغارية. غابات كثيفة + وديان عميقة. أشجار بلوط وزان. سفوح جبلية. ⚠️ 110 كم من الحدود غير مراقبة!',
        wildlife: '🐻 دببة بنية، 🐺 ذئاب، 🐍 أفاعي سامة (Vipera)، خنازير برية، قراد (ticks)، كلاب رعاة',
        temp: { winter: '-3–5°C', summer: '20–33°C' },
        sleep: 'مخبأ في غابة ستراندجا — خيمة تحت شجرة كثيفة',
        water: 'جدول جبلي — تصفية ضرورية بالكلور أو الفلاتر',
        food: 'مؤن من أدرنة — لا محلات في ستراندجا',
        toilet: 'في العراء — احفر حفرة 30 سم',
        phone: 'لا شحن — بطارية احتياطية ضرورية',
        wifi: 'لا يوجد',
        medical: 'لا يوجد — إصابات متوقعة: التواء، جفاف، عضّ حشرات',
        police: '⚠️ 1,000 شرطي بلغاري + دوريات Frontex',
        drone: '🛸 مكثفة — طائرات Frontex V-BAT + كاميرات حرارية',
        facilities: 'لا مرافق — منطقة معزولة تماماً',
        risks: {
            military: 'خطر عالٍ جداً',
            gangs: 'مرتفع',
            mafia: 'مرتفع',
            env: 'مرتفع'
        },
        notes: 'أخطر مقطع على المسار بأكمله. "لعبة الشرطة" موثقة. 17 لاجئاً أفغانياً رُحّلوا جماعياً. قنابل مسيلة للدموع. قبور مجهولة في مقابر القرى تحمل كلمة "НЕИЗВЕСТЕН" (مجهول). 6 أيام مشي في الغابات. الجيش والشرطة يدمرون الهواتف ويصادرون الملابس.',
        source: 'Qantara.de 2026; BNR 2022; BNT News 2022'
    },

    /* ========== STRANDZHA — DAY 2 ========== */
    {
        id: 'strandzha-day2',
        day: 2,
        name: 'ستrandja — المخبأ الأول',
        p: [41.8000, 26.1000],
        country: 'بلغاريا',
        type: 'wild-camp',
        totalKm: 45,
        dayKm: 25,
        walkHours: 8,
        elevation: '450m',
        terrain: 'غابات جبلية كثيفة — وديان عميقة',
        terrainDesc: 'غابات كثيفة توفر تغطية ممتازة. وديان عميقة + جداول جبلية. أشجار بلوط وزان. تضاريس وعرة. 110 كم غير مراقبة.',
        wildlife: '🐻 دببة، 🐺 ذئاب، 🐍 أفاعي، قراد',
        temp: { winter: '-4–4°C', summer: '18–30°C' },
        sleep: 'خيمة في غابة كثيفة — تغطية جيدة',
        water: 'جدول جبلي — تصفية',
        food: 'مؤن — بدأت تنفد',
        toilet: 'في العراء — احفر حفرة',
        phone: 'لا شحن — بطارية احتياطية',
        wifi: 'لا يوجد',
        medical: 'لا يوجد — إسعافات أولية فقط',
        police: '⚠️ دوريات ليلية — اختبئ عند سماع الأصوات',
        drone: '🛸 مكثفة — طائرات + كاميرات حرارية',
        facilities: 'لا يوجد',
        risks: {
            military: 'خطر عالٍ جداً',
            gangs: 'مرتفع',
            mafia: 'مرتفع',
            env: 'مرتفع'
        },
        notes: 'اليوم الثاني في ستراندجا. غابات كثيفة + وديان عميقة. دببة وذئاب وأفاعي. تعب متراكم. المشي ليلاً محظور بسبب الدوريات. لا نار — لا دخان.',
        source: 'Qantara.de 2026'
    },

    /* ========== STRANDZHA — DAY 3 ========== */
    {
        id: 'strandzha-day3',
        day: 3,
        name: 'ستrandja — المخبأ الثاني',
        p: [41.8500, 26.0000],
        country: 'بلغاريا',
        type: 'wild-camp',
        totalKm: 70,
        dayKm: 25,
        walkHours: 8,
        elevation: '580m',
        terrain: 'غابات جبلية — قمم منخفضة',
        terrainDesc: 'قمم منخفضة توفر رؤية جيدة. غابات كثيفة. وديان عميقة. تضاريس وعرة. جداول جبلية.',
        wildlife: '🐻 دببة، 🐺 ذئاب، 🐍 أفاعي',
        temp: { winter: '-4–4°C', summer: '18–30°C' },
        sleep: 'خيمة — تغطية جيدة',
        water: 'جدول',
        food: 'مؤن — نفدت نصفها',
        toilet: 'في العراء',
        phone: 'لا شحن — بطارية احتياطية',
        wifi: 'لا يوجد',
        medical: 'لا يوجد — تعب متراكم',
        police: '⚠️ خطر — Police patrols',
        drone: '🛸 مكثفة',
        facilities: 'لا يوجد',
        risks: {
            military: 'خطر عالٍ جداً',
            gangs: 'مرتفع',
            mafia: 'مرتفع',
            env: 'مرتفع'
        },
        notes: 'اليوم الثالث. تعب متراكم. إبطاء الوتيرة. خطر دببة متزايد في المناطق النائية. المشي 25 كم في تضاريس جبلية.',
        source: 'Qantara.de 2026; Peaks of Balkans'
    },

    /* ========== STRANDZHA — DAY 4 ========== */
    {
        id: 'strandzha-day4',
        day: 4,
        name: 'ستrandja — المخبأ الثالث',
        p: [41.9000, 25.9000],
        country: 'بلغاريا',
        type: 'wild-camp',
        totalKm: 95,
        dayKm: 25,
        walkHours: 8,
        elevation: '620m',
        terrain: 'غابات جبلية — آخر يوم كامل',
        terrainDesc: 'آخر يوم كامل في ستراندجا. غابات كثيفة. وديان عميقة. بداية الانحدار نحو السهول.',
        wildlife: '🐻 دببة، 🐺 ذئاب، 🐍 أفاعي',
        temp: { winter: '-4–4°C', summer: '18–30°C' },
        sleep: 'خيمة — آخر ليلة في الغابة',
        water: 'جدول',
        food: 'مؤن — أوشكت على النفاد',
        toilet: 'في العراء',
        phone: 'لا شحن',
        wifi: 'لا يوجد',
        medical: 'لا يوجد — تعب شديد',
        police: '⚠️ خطر عالٍ',
        drone: '🛸 مكثفة',
        facilities: 'لا يوجد',
        risks: {
            military: 'خطر عالٍ جداً',
            gangs: 'مرتفع',
            mafia: 'مرتفع',
            env: 'مرتفع'
        },
        notes: 'اليوم الرابع. آخر يوم كامل في ستراندجا. تخطيط للخروج. خطر دببة في المناطق النائية. تعب شديد — الحاجة إلى يوم راحة إجباري.',
        source: 'Qantara.de 2026'
    },

    /* ========== STRANDZHA EXIT — DAY 5 ========== */
    {
        id: 'strandzha-exit',
        day: 5,
        name: 'الخروج من ستراندجا',
        p: [41.9500, 25.8000],
        country: 'بلغاريا',
        type: 'transit',
        totalKm: 120,
        dayKm: 25,
        walkHours: 8,
        elevation: '350m',
        terrain: 'غابات → طريق رئيسي E80',
        terrainDesc: 'الخروج من الغابة. منطقة مكشوفة. بداية السهول. طريق E80 الرئيسي.',
        wildlife: 'أفاعي، قراد',
        temp: { winter: '-3–5°C', summer: '20–33°C' },
        sleep: 'مخبأ قرب الطريق E80',
        water: 'متجر في سفيليجراد',
        food: 'شراء من سفيليجراد — خبز، معلبات',
        toilet: 'متجر',
        phone: 'شحن — متجر',
        wifi: 'مقهى',
        medical: 'صيدلية صغيرة',
        police: 'دوريات على الطريق',
        drone: 'متوسطة',
        facilities: 'متجر، مقهى، صيدلية',
        risks: {
            military: 'مرتفع',
            gangs: 'متوسط',
            mafia: 'مرتفع',
            env: 'متوسط'
        },
        notes: 'الخروج من ستراندجا. منطقة مكشوفة — خطر. شراء مؤن. الحاجة إلى يوم راحة إجباري بعد 5 أيام مشي متواصل.',
        source: 'Qantara.de 2026'
    },

    /* ========== REST DAY — DAY 6 ========== */
    {
        id: 'svilengrad-rest',
        day: 6,
        name: '⚠️ راحة إجبارية — سفيليجراد',
        p: [41.7667, 26.2000],
        country: 'بلغاريا',
        type: 'rest',
        totalKm: 120,
        dayKm: 0,
        walkHours: 0,
        elevation: '180m',
        terrain: 'منطقة حضرية صغيرة',
        terrainDesc: 'بلدة صغيرة. منطقة حضرية. لا تضاريس خطيرة.',
        wildlife: 'لا يوجد',
        temp: { winter: '-3–5°C', summer: '21–33°C' },
        sleep: 'مخبأ آمن في البلدة',
        water: 'متجر — ماء معبأ',
        food: 'بقالة — طعام ساخن',
        toilet: 'متجر / مقهى',
        phone: 'شحن في المقهى',
        wifi: 'مقهى',
        medical: 'صيدلية',
        police: 'دوريات عادية',
        drone: 'مراقبة من بعيد',
        facilities: 'متجر، مقهى، صيدلية',
        risks: {
            military: 'منخفض',
            gangs: 'منخفض',
            mafia: 'منخفض',
            env: 'منخفض'
        },
        notes: '⚠️ يوم راحة إجباري. تعب تراكمي بعد 5 أيام مشي متواصل (120 كم). الحاجة لمراقبة الدوريات قبل مواصلة المشي. جمع معلومات عن الحدود الصربية.',
        source: 'IOM DTM 2026'
    },

    /* ========== SOFIA APPROACH — DAY 7 ========== */
    {
        id: 'sofia-approach',
        day: 7,
        name: 'طريق صوفيا — المخبأ',
        p: [42.2000, 24.5000],
        country: 'بلغاريا',
        type: 'wild-camp',
        totalKm: 220,
        dayKm: 100,
        walkHours: 10,
        elevation: '300m',
        terrain: 'تلال منخفضة + حقول',
        terrainDesc: 'تلال منخفضة بعد ستراندجا. حقول زراعية ومراعٍ. بداية السهول. طريق E80.',
        wildlife: 'ثعالب، أفاعي حقول، كلاب ضالة',
        temp: { winter: '-3–5°C', summer: '21–33°C' },
        sleep: 'خيمة قرب قرية',
        water: 'قرية — نافورة',
        food: 'بقالة صغيرة',
        toilet: 'في العراء',
        phone: 'شحن — بقالة',
        wifi: 'لا يوجد',
        medical: 'لا يوجد',
        police: 'دوريات على الطريق E80',
        drone: 'متوسطة',
        facilities: 'بقالة صغيرة',
        risks: {
            military: 'متوسط',
            gangs: 'منخفض',
            mafia: 'متوسط',
            env: 'متوسط'
        },
        notes: 'طريق طويل نحو صوفيا. 100 كم مشي في يوم واحد. تلال + حقول. المشي 10 ساعات. تعب شديد.',
        source: 'IOM DTM 2026'
    },

    /* ========== SOFIA — DAY 8 ========== */
    {
        id: 'sofia',
        day: 8,
        name: 'صوفيا',
        p: [42.6977, 23.3219],
        country: 'بلغاريا',
        type: 'hub',
        totalKm: 320,
        dayKm: 100,
        walkHours: 10,
        elevation: '550m',
        terrain: 'سهول صوفيا — محاطة بجبال فيتوشا',
        terrainDesc: 'سهول صوفيا محاطة بجبال فيتوشا. نهر إيسكر يمر عبر الوديان. زراعة + غابات على التلال. أعلى نقطة: 2,290م (فيتوشا).',
        wildlife: '🐻 دببة على التلال، 🐺 ذئاب، 🐍 أفاعي، خنازير برية',
        temp: { winter: '-4–4°C', summer: '20–32°C' },
        sleep: 'مخيم استقبال رسمي',
        water: 'ماء في المخيم',
        food: 'مطاعم — طعام ساخن',
        toilet: 'متاح',
        phone: 'شحن — مخيم',
        wifi: 'مخيم — مجاني',
        medical: 'مستشفى',
        police: '⚠️ شرطة بلغارية',
        drone: 'مستمرة — Frontex',
        facilities: 'محطة قطار، مخيم استقبال، مطاعم، WiFi، مستشفى، صيدلية',
        risks: {
            military: 'مرتفع',
            gangs: 'مرتفع',
            mafia: 'مرتفع',
            env: 'متوسط'
        },
        notes: 'العاصمة. مخيم استقبال رسمي. 15% من المهاجرين يمرون عبر بلغاريا. الحدود مع تركيا هي الأكثر حراسة في أوروبا (271 كم). 6 مناطق حدودية. أغسطس 2025: بلغاريا سجلت أكثر من 1,000 مهاجر في أقل من أسبوع.',
        source: 'IOM DTM 2026; Frontex 2026'
    },

    /* ========== SOFIA REST — DAY 9 ========== */
    {
        id: 'sofia-rest',
        day: 9,
        name: '⚠️ راحة — صوفيا',
        p: [42.6977, 23.3219],
        country: 'بلغاريا',
        type: 'rest',
        totalKm: 320,
        dayKm: 0,
        walkHours: 0,
        elevation: '550m',
        terrain: 'مدينة',
        terrainDesc: 'مدينة كبيرة. مرافق كاملة.',
        wildlife: 'لا يوجد',
        temp: { winter: '-4–4°C', summer: '20–32°C' },
        sleep: 'مخيم استقبال',
        water: 'ماء',
        food: 'مطاعم',
        toilet: 'متاح',
        phone: 'شحن',
        wifi: 'مخيم',
        medical: 'مستشفى',
        police: 'عادية',
        drone: 'مستمرة',
        facilities: 'مرافق كاملة',
        risks: {
            military: 'منخفض',
            gangs: 'منخفض',
            mafia: 'منخفض',
            env: 'منخفض'
        },
        notes: 'راحة + جمع معلومات عن الحدود الصربية. استكشاف المدينة. جمع مؤن لرحلة بلغراد.',
        source: 'IOM DTM 2026'
    },

    /* ========== BELGRADE APPROACH — DAY 10 ========== */
    {
        id: 'belgrade-approach',
        day: 10,
        name: 'طريق بلغراد — المخبأ',
        p: [43.5000, 22.0000],
        country: 'صربيا',
        type: 'wild-camp',
        totalKm: 550,
        dayKm: 230,
        walkHours: 12,
        elevation: '400m',
        terrain: 'سهول + تلال منخفضة',
        terrainDesc: 'سهول زراعية واسعة. تلال منخفضة. حقول ذرة وعباد الشمس. نهر الدانوب في الأفق.',
        wildlife: 'ثعالب، أفاعي، خنازير برية',
        temp: { winter: '-2–6°C', summer: '24–36°C' },
        sleep: 'خيمة — قرب الحدود',
        water: 'قرية',
        food: 'بقالة',
        toilet: 'في العراء',
        phone: 'لا شحن',
        wifi: 'لا يوجد',
        medical: 'لا يوجد',
        police: '⚠️ شرطة حدودية صربية',
        drone: 'مكثفة',
        facilities: 'بقالة صغيرة',
        risks: {
            military: 'مرتفع',
            gangs: 'مرتفع',
            mafia: 'مرتفع',
            env: 'متوسط'
        },
        notes: 'عبور الحدود البلغارية-الصربية. 230 كم مشي في يومين. تعب شديد. منطقة حدودية — خطر دوريات.',
        source: 'IOM DTM 2026'
    },

    /* ========== BELGRADE — DAY 11 ========== */
    {
        id: 'belgrade',
        day: 11,
        name: 'بلغراد',
        p: [44.7866, 20.4489],
        country: 'صربيا',
        type: 'hub',
        totalKm: 780,
        dayKm: 230,
        walkHours: 12,
        elevation: '117m',
        terrain: 'سهول بانونيا + تلال منخفضة',
        terrainDesc: 'سهول زراعية واسعة (فويفودينا) شمالاً. تلال جنوباً. نهرا الدانوب وسافا يلتقيان في المدينة. حقول ذرة وعباد الشمس.',
        wildlife: 'كلاب ضالة، ثعالب، 🐍 أفاعي في المناطق الريفية',
        temp: { winter: '-2–6°C', summer: '24–36°C' },
        sleep: 'مخيم أوبريوفاك (ثكنة عسكرية سابقة)',
        water: 'ماء في المخيم',
        food: 'مطاعم رخيصة — حديقة أفغانستان',
        toilet: 'متاح',
        phone: 'شحن — مخيم',
        wifi: 'مقهى',
        medical: 'مستشفى',
        police: '⚠️ عصابات BWK + شرطة',
        drone: 'متوسطة',
        facilities: 'محطة حافلات، حديقة أفغانستان، مطاعم رخيصة، ATM، إنترنت',
        risks: {
            military: 'متوسط',
            gangs: 'مرتفع',
            mafia: 'مرتفع',
            env: 'متوسط'
        },
        notes: 'العاصمة. حديقة "أفغانستان" قرب محطة القطار. مخيم أوبريوفاك. عصابات BWK ("محاربو البلقان كابول") مسلحة — اختطاف مقابل فدية. 30,000 يورو فدية موثقة (أغسطس 2026). اختطاف 3 أتراك وأفغانيين.',
        source: 'IOM DTM 2026; BVMN 2026'
    },

    /* ========== BELGRADE REST — DAY 12 ========== */
    {
        id: 'belgrade-rest',
        day: 12,
        name: '⚠️ راحة — بلغراد',
        p: [44.7866, 20.4489],
        country: 'صربيا',
        type: 'rest',
        totalKm: 780,
        dayKm: 0,
        walkHours: 0,
        elevation: '117m',
        terrain: 'مدينة',
        terrainDesc: 'مدينة كبيرة. مرافق كاملة.',
        wildlife: 'لا يوجد',
        temp: { winter: '-2–6°C', summer: '24–36°C' },
        sleep: 'مخيم أوبريوفاك',
        water: 'ماء',
        food: 'مطاعم',
        toilet: 'متاح',
        phone: 'شحن',
        wifi: 'مقهى',
        medical: 'مستشفى',
        police: '⚠️ BWK',
        drone: 'متوسطة',
        facilities: 'مرافق كاملة',
        risks: {
            military: 'منخفض',
            gangs: 'مرتفع',
            mafia: 'مرتفع',
            env: 'منخفض'
        },
        notes: 'راحة + تنسيق مع مهربين + جمع معلومات عن الحدود المجرية. الحذر من عصابات BWK.',
        source: 'BVMN 2026'
    },

    /* ========== HORGOS APPROACH — DAY 13 ========== */
    {
        id: 'horgos-approach',
        day: 13,
        name: 'طريق هورغوش',
        p: [45.5000, 20.2000],
        country: 'صربيا',
        type: 'wild-camp',
        totalKm: 880,
        dayKm: 100,
        walkHours: 10,
        elevation: '85m',
        terrain: 'سهول عشبية + شجيرات كثيفة',
        terrainDesc: 'سهول مسطحة. أعشاب طويلة + شجيرات كثيفة (ممرات مظلمة). حقول زراعية ومراعٍ. "برية" حسب Pulitzer Center. لا غابات كثيفة.',
        wildlife: 'كلاب رعاة، ثعالب، خنازير برية، 🐍 أفاعي',
        temp: { winter: '-5–4°C', summer: '22–34°C' },
        sleep: 'خيمة قرب هورغوش',
        water: 'قرية',
        food: 'بقالة',
        toilet: 'في العراء',
        phone: 'لا شحن',
        wifi: 'لا يوجد',
        medical: 'لا يوجد',
        police: '⚠️ خطر عالٍ',
        drone: '🛸 مكثفة جداً',
        facilities: 'بقالة',
        risks: {
            military: 'خطر عالٍ جداً',
            gangs: 'مرتفع',
            mafia: 'مرتفع',
            env: 'مرتفع'
        },
        notes: 'طريق نحو الحدود المجرية. مشي 100 كم. أعشاب طويلة + شجيرات كثيفة. عصابات "تيتواني" المغربية. قنابل مسيلة للدموع. السياج المجري على بعد 18 كم.',
        source: 'Gulf Times 2016; BVMN 2026'
    },

    /* ========== HORGOS — DAY 14 ========== */
    {
        id: 'horgos',
        day: 14,
        name: 'هورغوش — السياج المجري',
        p: [46.15, 19.9667],
        country: 'صربيا',
        type: 'border',
        totalKm: 898,
        dayKm: 18,
        walkHours: 5,
        elevation: '85m',
        terrain: 'سهول عشبية + شجيرات كثيفة',
        terrainDesc: 'سهول مسطحة. أعشاب طويلة + شجيرات كثيفة (ممرات مظلمة). حقول زراعية ومراعٍ. السياج المجري على بعد 1.5 ميل.',
        wildlife: 'كلاب رعاة، ثعالب، خنازير برية، 🐍 أفاعي',
        temp: { winter: '-5–4°C', summer: '22–34°C' },
        sleep: 'مخبأ بعيد عن السياج',
        water: 'قرية',
        food: 'مؤن',
        toilet: 'في العراء',
        phone: 'لا شحن',
        wifi: 'لا يوجد',
        medical: 'لا يوجد',
        police: '⚠️⚠️ سياج مزدوج + كلاب + غاز',
        drone: '🛸 مكثفة جداً',
        facilities: 'لا مرافق — منطقة حدودية',
        risks: {
            military: 'خطر عالٍ جداً',
            gangs: 'مرتفع',
            mafia: 'مرتفع',
            env: 'مرتفع'
        },
        notes: '⚠️ السياج المجري. 4م × 2 (سياج مزدوج) + أسلاك شائكة + كاميرات حرارية + طائرات مسيرة + كلاب. 8,403 حالة صدّ. 1.5م تحت الأرض + 3م فوق. عصابات "تيتواني" المغربية. قنابل مسيلة للدموع.',
        source: 'Reuters 2015; Gulf Times 2016; CGTN 2026'
    },

    /* ========== ZAGREB APPROACH — DAY 15 ========== */
    {
        id: 'zagreb-approach',
        day: 15,
        name: 'طريق زغرب',
        p: [46.0000, 17.5000],
        country: 'كرواتيا',
        type: 'wild-camp',
        totalKm: 1048,
        dayKm: 150,
        walkHours: 12,
        elevation: '150m',
        terrain: 'سهول + حقول',
        terrainDesc: 'سهول زراعية. حقول. تلال منخفضة. الطريق E70.',
        wildlife: 'ثعالب، أفاعي',
        temp: { winter: '-2–5°C', summer: '22–34°C' },
        sleep: 'خيمة قرب الحدود',
        water: 'قرية',
        food: 'بقالة',
        toilet: 'في العراء',
        phone: 'لا شحن',
        wifi: 'لا يوجد',
        medical: 'لا يوجد',
        police: '⚠️ شرطة كرواتية',
        drone: '🛸 مكثفة',
        facilities: 'بقالة',
        risks: {
            military: 'خطر عالٍ',
            gangs: 'مرتفع',
            mafia: 'مرتفع',
            env: 'متوسط'
        },
        notes: 'عبور الحدود الصربية-الكرواتية. 150 كم مشي. شرطة كرواتية عنيفة موثقة. 30,000 حالة صدّ (2020-2022).',
        source: 'Al Jazeera 2026; BVMN 2026'
    },

    /* ========== ZAGREB — DAY 16 ========== */
    {
        id: 'zagreb',
        day: 16,
        name: 'زغرب',
        p: [45.8150, 15.9819],
        country: 'كرواتيا',
        type: 'hub',
        totalKm: 1198,
        dayKm: 150,
        walkHours: 12,
        elevation: '158m',
        terrain: 'سهول بانونيا + جبال ميدفيدنيتسا',
        terrainDesc: 'سهول زراعية حول المدينة. جبل ميدفيدنيتسا شمالاً. كرواتيا لم تبنِ سياجاً دائماً — تستخدم "أسيجة متحركة" عند المعابر (Maljevac, Batina). تضاريس صخرية (كارست).',
        wildlife: '🐻 دببة في المناطق الجبلية، 🐺 ذئاب، 🐍 أفاعي',
        temp: { winter: '-2–5°C', summer: '22–34°C' },
        sleep: 'مخبأ',
        water: 'ماء',
        food: 'مطاعم',
        toilet: 'متاح',
        phone: 'شحن',
        wifi: 'مقهى',
        medical: 'مستشفى',
        police: '⚠️ 8,403 حالة صدّ',
        drone: '🛸 مكثفة',
        facilities: 'مطاعم، متاجر، ATM، WiFi، مستشفى',
        risks: {
            military: 'خطر عالٍ',
            gangs: 'مرتفع',
            mafia: 'مرتفع',
            env: 'متوسط'
        },
        notes: 'العاصمة. شرطة كرواتية تقوم بصدّ عنيف. 8,403 حالة صدّ (سبتمبر–ديسمبر 2023). عنف جسدي، اعتداء جنسي موثق. حرق أمتعة. حجز أطفال. "أوروبا للمسيحيين فقط؛ عودوا لبلدانكم الإسلامية" — شرطي كرواتي موثق (يوليو 2026).',
        source: 'Al Jazeera 2026; Borderline Europe 2026; BVMN 2026'
    },

    /* ========== ZAGREB REST — DAY 17 ========== */
    {
        id: 'zagreb-rest',
        day: 17,
        name: '⚠️ راحة — زغرب',
        p: [45.8150, 15.9819],
        country: 'كرواتيا',
        type: 'rest',
        totalKm: 1198,
        dayKm: 0,
        walkHours: 0,
        elevation: '158m',
        terrain: 'مدينة',
        terrainDesc: 'مدينة كبيرة. مرافق كاملة.',
        wildlife: 'لا يوجد',
        temp: { winter: '-2–5°C', summer: '22–34°C' },
        sleep: 'مخبأ',
        water: 'ماء',
        food: 'مطاعم',
        toilet: 'متاح',
        phone: 'شحن',
        wifi: 'مقهى',
        medical: 'مستشفى',
        police: '⚠️',
        drone: '🛸 مكثفة',
        facilities: 'مرافق كاملة',
        risks: {
            military: 'منخفض',
            gangs: 'مرتفع',
            mafia: 'مرتفع',
            env: 'منخفض'
        },
        notes: 'راحة + جمع معلومات عن الحدود السلوفينية. الحذر من الصدّ العنيف.',
        source: 'Borderline Europe 2026'
    },

    /* ========== LJUBLJANA APPROACH — DAY 18 ========== */
    {
        id: 'ljubljana-approach',
        day: 18,
        name: 'طريق ليوبليانا',
        p: [45.9000, 15.2000],
        country: 'سلوفينيا',
        type: 'wild-camp',
        totalKm: 1268,
        dayKm: 70,
        walkHours: 8,
        elevation: '300m',
        terrain: 'تلال + غابات',
        terrainDesc: 'تلال + غابات. وادي Val Rosandra — ممر مشي رئيسي. غابات كثيفة على الحدود الكرواتية.',
        wildlife: '🐻 دببة، 🐺 ذئاب، 🐍 أفاعي',
        temp: { winter: '-2–6°C', summer: '22–33°C' },
        sleep: 'خيمة قرب الحدود',
        water: 'قرية',
        food: 'بقالة',
        toilet: 'في العراء',
        phone: 'لا شحن',
        wifi: 'لا يوجد',
        medical: 'لا يوجد',
        police: '⚠️ سياج سلوفيني',
        drone: 'متوسطة',
        facilities: 'بقالة',
        risks: {
            military: 'مرتفع',
            gangs: 'منخفض',
            mafia: 'متوسط',
            env: 'متوسط'
        },
        notes: 'عبور الحدود الكرواتية-السلوفينية. 70 كم مشي. سياج سلوفيني على ثلث الحدود. نهر كولبا سحي — 3 غرقى في مايو 2026.',
        source: 'Slovenia Times 2026'
    },

    /* ========== LJUBLJANA — DAY 19 ========== */
    {
        id: 'ljubljana',
        day: 19,
        name: 'ليوبليانا',
        p: [46.0569, 14.5058],
        country: 'سلوفينيا',
        type: 'hub',
        totalKm: 1338,
        dayKm: 70,
        walkHours: 8,
        elevation: '295m',
        terrain: 'كارست ألبي + غابات',
        terrainDesc: 'منطقة كارست ألبي. وادي Val Rosandra — ممر مشي رئيسي نحو ترييستي. غابات كثيفة على الحدود الكرواتية. تضاريس جبلية.',
        wildlife: '🐻 دببة، 🐺 ذئاب، 🐍 أفاعي، كلاب رعاة',
        temp: { winter: '-2–6°C', summer: '22–33°C' },
        sleep: 'مخبأ',
        water: 'ماء',
        food: 'مطاعم',
        toilet: 'متاح',
        phone: 'شحن',
        wifi: 'مقهى',
        medical: 'مستشفى',
        police: '⚠️ سياج',
        drone: 'متوسطة',
        facilities: 'مطاعم، متاجر، ATM، WiFi',
        risks: {
            military: 'مرتفع',
            gangs: 'منخفض',
            mafia: 'متوسط',
            env: 'متوسط'
        },
        notes: 'نهر كولبا سحي — 3 غرقى في مايو 2026. 413 وفاة على المسار منذ 2014 (IOM). 12,500 عبور في 2025 (Frontex).',
        source: 'IOM Missing Migrants 2026; Frontex 2026'
    },

    /* ========== LJUBLJANA REST — DAY 20 ========== */
    {
        id: 'ljubljana-rest',
        day: 20,
        name: '⚠️ راحة — ليوبليانا',
        p: [46.0569, 14.5058],
        country: 'سلوفينيا',
        type: 'rest',
        totalKm: 1338,
        dayKm: 0,
        walkHours: 0,
        elevation: '295m',
        terrain: 'مدينة',
        terrainDesc: 'مدينة كبيرة. مرافق كاملة.',
        wildlife: 'لا يوجد',
        temp: { winter: '-2–6°C', summer: '22–33°C' },
        sleep: 'مخبأ',
        water: 'ماء',
        food: 'مطاعم',
        toilet: 'متاح',
        phone: 'شحن',
        wifi: 'مقهى',
        medical: 'مستشفى',
        police: 'عادية',
        drone: 'متوسطة',
        facilities: 'مرافق كاملة',
        risks: {
            military: 'منخفض',
            gangs: 'منخفض',
            mafia: 'منخفض',
            env: 'منخفض'
        },
        notes: 'راحة + جمع معلومات عن إيطاليا. استكشاف المدينة.',
        source: 'IOM DTM 2026'
    },

    /* ========== TRIESTE — DAY 21 ========== */
    {
        id: 'trieste',
        day: 21,
        name: 'ترييستي',
        p: [45.6495, 13.7768],
        country: 'إيطاليا',
        type: 'entry',
        totalKm: 1438,
        dayKm: 100,
        walkHours: 12,
        elevation: '2m',
        terrain: 'كارست ألبي + غابات',
        terrainDesc: 'منطقة كارست ألبي. "المشي عبر غابة Val Rosandra" — ممر مشي رئيسي. تضاريس جبلية.',
        wildlife: '🐻 دببة، 🐺 ذئاب، 🐍 أفاعي',
        temp: { winter: '4–10°C', summer: '24–34°C' },
        sleep: 'Piazza del Mondo — مخيم مؤقت',
        water: 'ماء',
        food: 'Piazza del Mondo — 200 وجبة ساخنة كل ليلة',
        toilet: 'محدود',
        phone: 'شحن — مخيم',
        wifi: 'مقهى',
        medical: 'مستشفى',
        police: '⚠️ شرطة إيطالية',
        drone: 'محدودة',
        facilities: 'مطبخ Piazza del Mondo، مطاعم، محطة قطار، WiFi',
        risks: {
            military: 'متوسط',
            gangs: 'منخفض',
            mafia: 'متوسط',
            env: 'منخفض'
        },
        notes: 'نقطة دخول. 12,525 مهاجر في 2025 (زيادة من 520 في 2024). نوم في الشوارع، لا حمامات، لا طعام. شبكة "Fornelli Resistenti" — 200 وجبة ساخنة كل ليلة.',
        source: 'InfoMigrants 2026; Comune-info 2024'
    },

    /* ========== TRIESTE REST — DAY 22 ========== */
    {
        id: 'trieste-rest',
        day: 22,
        name: '⚠️ راحة — ترييستي',
        p: [45.6495, 13.7768],
        country: 'إيطاليا',
        type: 'rest',
        totalKm: 1438,
        dayKm: 0,
        walkHours: 0,
        elevation: '2m',
        terrain: 'مدينة ساحلية',
        terrainDesc: 'مدينة ساحلية. مرافق كاملة.',
        wildlife: 'لا يوجد',
        temp: { winter: '4–10°C', summer: '24–34°C' },
        sleep: 'Piazza del Mondo',
        water: 'ماء',
        food: 'Piazza del Mondo',
        toilet: 'محدود',
        phone: 'شحن',
        wifi: 'مقهى',
        medical: 'مستشفى',
        police: 'عادية',
        drone: 'محدودة',
        facilities: 'Piazza del Mondo، مطاعم، محطة قطار',
        risks: {
            military: 'منخفض',
            gangs: 'منخفض',
            mafia: 'منخفض',
            env: 'منخفض'
        },
        notes: 'راحة + جمع معلومات عن ميلانو. استكشاف المدينة.',
        source: 'InfoMigrants 2026'
    },

    /* ========== MILAN APPROACH — DAY 23 ========== */
    {
        id: 'milan-approach',
        day: 23,
        name: 'طريق ميلانو',
        p: [45.3000, 11.0000],
        country: 'إيطاليا',
        type: 'wild-camp',
        totalKm: 1638,
        dayKm: 200,
        walkHours: 14,
        elevation: '120m',
        terrain: 'سهول لومبارديا',
        terrainDesc: 'سهول مسطحة. حقول زراعية. نهر بو. لا غابات.',
        wildlife: 'ثعالب، أرانب، طيور',
        temp: { winter: '2–8°C', summer: '25–35°C' },
        sleep: 'خيمة قرب ميلانو',
        water: 'قرية',
        food: 'بقالة',
        toilet: 'في العراء',
        phone: 'لا شحن',
        wifi: 'لا يوجد',
        medical: 'لا يوجد',
        police: '⚠️ شرطة إيطالية',
        drone: 'محدودة',
        facilities: 'بقالة',
        risks: {
            military: 'منخفض',
            gangs: 'متوسط',
            mafia: 'متوسط',
            env: 'منخفض'
        },
        notes: 'طريق طويل. سهول لومبارديا. 200 كم مشي. تعب شديد.',
        source: 'IOM DTM 2026'
    },

    /* ========== MILAN — DAY 24 ========== */
    {
        id: 'milan',
        day: 24,
        name: 'ميلانو',
        p: [45.4642, 9.1900],
        country: 'إيطاليا',
        type: 'transit',
        totalKm: 1738,
        dayKm: 100,
        walkHours: 8,
        elevation: '120m',
        terrain: 'سهول لومبارديا',
        terrainDesc: 'سهول مسطحة. حقول زراعية. نهر بو. لا غابات.',
        wildlife: 'ثعالب، أرانب، طيور',
        temp: { winter: '2–8°C', summer: '25–35°C' },
        sleep: 'مخبأ',
        water: 'ماء',
        food: 'مطاعم',
        toilet: 'متاح',
        phone: 'شحن',
        wifi: 'مقهى',
        medical: 'مستشفى',
        police: 'عادية',
        drone: 'محدودة',
        facilities: 'مطاعم، فنادق، ATM، WiFi، محطة قطار',
        risks: {
            military: 'منخفض',
            gangs: 'متوسط',
            mafia: 'متوسط',
            env: 'منخفض'
        },
        notes: 'محطة عبور. قطارات إلى فرنسا. ازدحام في محطة القطار.',
        source: 'IOM DTM 2026'
    },

    /* ========== MILAN REST — DAY 25 ========== */
    {
        id: 'milan-rest',
        day: 25,
        name: '⚠️ راحة — ميلانو',
        p: [45.4642, 9.1900],
        country: 'إيطاليا',
        type: 'rest',
        totalKm: 1738,
        dayKm: 0,
        walkHours: 0,
        elevation: '120m',
        terrain: 'مدينة',
        terrainDesc: 'مدينة كبيرة. مرافق كاملة.',
        wildlife: 'لا يوجد',
        temp: { winter: '2–8°C', summer: '25–35°C' },
        sleep: 'مخبأ',
        water: 'ماء',
        food: 'مطاعم',
        toilet: 'متاح',
        phone: 'شحن',
        wifi: 'مقهى',
        medical: 'مستشفى',
        police: 'عادية',
        drone: 'محدودة',
        facilities: 'مرافق كاملة',
        risks: {
            military: 'منخفض',
            gangs: 'منخفض',
            mafia: 'منخفض',
            env: 'منخفض'
        },
        notes: 'راحة + جمع معلومات عن ليون.',
        source: 'IOM DTM 2026'
    },

    /* ========== LYON APPROACH — DAY 26 ========== */
    {
        id: 'lyon-approach',
        day: 26,
        name: 'طريق ليون',
        p: [45.6000, 6.5000],
        country: 'فرنسا',
        type: 'wild-camp',
        totalKm: 1938,
        dayKm: 200,
        walkHours: 14,
        elevation: '300m',
        terrain: 'تلال + وديان',
        terrainDesc: 'تلال + وديان الرون. نهر الرون والساون. زراعة كروم.',
        wildlife: 'ثعالب، أرانب، خنازير برية',
        temp: { winter: '3–9°C', summer: '22–32°C' },
        sleep: 'خيمة قرب الحدود الفرنسية',
        water: 'قرية',
        food: 'بقالة',
        toilet: 'في العراء',
        phone: 'لا شحن',
        wifi: 'لا يوجد',
        medical: 'لا يوجد',
        police: '⚠️ شرطة فرنسية',
        drone: 'محدودة',
        facilities: 'بقالة',
        risks: {
            military: 'منخفض',
            gangs: 'متوسط',
            mafia: 'متوسط',
            env: 'منخفض'
        },
        notes: 'عبور الحدود الإيطالية-الفرنسية. 200 كم مشي. تعب شديد.',
        source: 'IOM DTM 2026'
    },

    /* ========== LYON — DAY 27 ========== */
    {
        id: 'lyon',
        day: 27,
        name: 'ليون',
        p: [45.7640, 4.8357],
        country: 'فرنسا',
        type: 'transit',
        totalKm: 2138,
        dayKm: 200,
        walkHours: 14,
        elevation: '170m',
        terrain: 'تلال + وديان',
        terrainDesc: 'تلال + وديان الرون. نهر الرون والساون. زراعة كروم.',
        wildlife: 'ثعالب، أرانب، خنازير برية',
        temp: { winter: '3–9°C', summer: '22–32°C' },
        sleep: 'مخبأ',
        water: 'ماء',
        food: 'مطاعم',
        toilet: 'متاح',
        phone: 'شحن',
        wifi: 'مقهى',
        medical: 'مستشفى',
        police: 'عادية',
        drone: 'محدودة',
        facilities: 'مطاعم، فنادق، ATM، WiFi',
        risks: {
            military: 'منخفض',
            gangs: 'متوسط',
            mafia: 'متوسط',
            env: 'منخفض'
        },
        notes: 'محطة عبور. قطارات إلى باريس. محطة Part-Dieu.',
        source: 'IOM DTM 2026'
    },

    /* ========== LYON REST — DAY 28 ========== */
    {
        id: 'lyon-rest',
        day: 28,
        name: '⚠️ راحة — ليون',
        p: [45.7640, 4.8357],
        country: 'فرنسا',
        type: 'rest',
        totalKm: 2138,
        dayKm: 0,
        walkHours: 0,
        elevation: '170m',
        terrain: 'مدينة',
        terrainDesc: 'مدينة كبيرة. مرافق كاملة.',
        wildlife: 'لا يوجد',
        temp: { winter: '3–9°C', summer: '22–32°C' },
        sleep: 'مخبأ',
        water: 'ماء',
        food: 'مطاعم',
        toilet: 'متاح',
        phone: 'شحن',
        wifi: 'مقهى',
        medical: 'مستشفى',
        police: 'عادية',
        drone: 'محدودة',
        facilities: 'مرافق كاملة',
        risks: {
            military: 'منخفض',
            gangs: 'منخفض',
            mafia: 'منخفض',
            env: 'منخفض'
        },
        notes: 'راحة + جمع معلومات عن باريس.',
        source: 'IOM DTM 2026'
    },

    /* ========== PARIS APPROACH — DAY 29 ========== */
    {
        id: 'paris-approach',
        day: 29,
        name: 'طريق باريس',
        p: [47.5000, 3.5000],
        country: 'فرنسا',
        type: 'wild-camp',
        totalKm: 2368,
        dayKm: 230,
        walkHours: 15,
        elevation: '100m',
        terrain: 'سهول + حقول',
        terrainDesc: 'سهول مسطحة. حقول زراعية. نهر السين.',
        wildlife: 'ثعالب، أرانب، طيور',
        temp: { winter: '3–8°C', summer: '18–28°C' },
        sleep: 'خيمة قرب باريس',
        water: 'قرية',
        food: 'بقالة',
        toilet: 'في العراء',
        phone: 'لا شحن',
        wifi: 'لا يوجد',
        medical: 'لا يوجد',
        police: 'عادية',
        drone: 'محدودة',
        facilities: 'بقالة',
        risks: {
            military: 'منخفض',
            gangs: 'متوسط',
            mafia: 'متوسط',
            env: 'منخفض'
        },
        notes: 'طريق طويل. سهول + حقول. 230 كم مشي. تعب شديد.',
        source: 'IOM DTM 2026'
    },

    /* ========== PARIS — DAY 30 ========== */
    {
        id: 'paris',
        day: 30,
        name: 'باريس',
        p: [48.8566, 2.3522],
        country: 'فرنسا',
        type: 'hub',
        totalKm: 2598,
        dayKm: 230,
        walkHours: 15,
        elevation: '35m',
        terrain: 'سهول إيل دو فرانس',
        terrainDesc: 'سهول مسطحة. نهر السين. ضواحي صناعية. مخيمات غير رسمية في الشمال.',
        wildlife: 'ثعالب، أرانب، طيور',
        temp: { winter: '3–8°C', summer: '18–28°C' },
        sleep: 'مخبأ',
        water: 'ماء',
        food: 'مطاعم',
        toilet: 'متاح',
        phone: 'شحن',
        wifi: 'مقهى',
        medical: 'مستشفى',
        police: 'عادية',
        drone: 'محدودة',
        facilities: 'مطاعم، فنادق، ATM، WiFi، مستشفيات',
        risks: {
            military: 'منخفض',
            gangs: 'مرتفع',
            mafia: 'مرتفع',
            env: 'منخفض'
        },
        notes: 'محطة عبور. مخيمات غير رسمية. قطارات إلى كاليه.',
        source: 'IOM DTM 2026'
    },

    /* ========== PARIS REST — DAY 31 ========== */
    {
        id: 'paris-rest',
        day: 31,
        name: '⚠️ راحة — باريس',
        p: [48.8566, 2.3522],
        country: 'فرنسا',
        type: 'rest',
        totalKm: 2598,
        dayKm: 0,
        walkHours: 0,
        elevation: '35m',
        terrain: 'مدينة',
        terrainDesc: 'مدينة كبيرة. مرافق كاملة.',
        wildlife: 'لا يوجد',
        temp: { winter: '3–8°C', summer: '18–28°C' },
        sleep: 'مخبأ',
        water: 'ماء',
        food: 'مطاعم',
        toilet: 'متاح',
        phone: 'شحن',
        wifi: 'مقهى',
        medical: 'مستشفى',
        police: 'عادية',
        drone: 'محدودة',
        facilities: 'مرافق كاملة',
        risks: {
            military: 'منخفض',
            gangs: 'منخفض',
            mafia: 'منخفض',
            env: 'منخفض'
        },
        notes: 'راحة + جمع معلومات عن كاليه. تحضير للمرحلة النهائية.',
        source: 'IOM DTM 2026'
    },

    /* ========== CALAIS — DESTINATION — DAY 32 ========== */
    {
        id: 'calais',
        day: 32,
        name: '🎯 كاليه — الوجهة النهائية',
        p: [50.9513, 1.8587],
        country: 'فرنسا',
        type: 'destination',
        totalKm: 2888,
        dayKm: 290,
        walkHours: 18,
        elevation: '8m',
        terrain: 'سهول ساحلية + كثبان رملية',
        terrainDesc: 'سهول ساحلية منخفضة. كثبان رملية على الشاطئ. منطقة الميناء — أسفلت وخرسانة. نفق القنال يخرج في Coquelles (5 كم من كاليه). لا غابات. تضاريس مسطحة.',
        wildlife: 'طيور بحرية، أرانب. لا حيوانات خطيرة',
        temp: { winter: '3–8°C', summer: '18–25°C' },
        sleep: 'مخيم "New Jungle" (~6,000 شخص)',
        water: 'ماء',
        food: 'Refugee Community Kitchen — وجبات ساخنة يومية',
        toilet: 'محدود جداً',
        phone: 'شحن — مخيم',
        wifi: 'محدود',
        medical: 'MSF — عيادة ميدانية',
        police: '⚠️⚠️ جدار 4م + 8.5 كم سياج + 40 كم سياج',
        drone: '🛸 مراقبة مكثفة — طائرات مسيرة + كاميرات حرارية + إنفراريد',
        facilities: 'مخيمات: "New Jungle" (~6,000 شخص)، مخيم مستشفى كاليه. مطاعم، محطة قطار، WiFi. منظمات: MSF, Auberge des Migrants, Refugee Community Kitchen.',
        risks: {
            military: 'خطر عالٍ جداً',
            gangs: 'مرتفع',
            mafia: 'مرتفع',
            env: 'متوسط'
        },
        notes: '🎯 الوجهة النهائية. نفق القنال (Channel Tunnel) يخرج في Coquelles. جدار "Great Wall of Calais" (1 كم × 4م) على Rocade. 8.5 كم سياج Eurotunnel. 40 كم سياج على الطريق. "One in, one out" (2025). 14 وفاة منذ يونيو 2026 (IOM). 6,000 في "New Jungle". MSF: ~3,000 في مخيمات مؤقتة. "أوروبا للمسيحيين فقط" — شرطي كرواتي. القوارب الصغيرة (small boats) — بديل خطير. 13 وفاة منذ بداية 2026.',
        source: 'Telegraph 2016; Libertad Digital 2026; MSF 2026; BVMN 2026'
    },

    /* ========== CALAIS REST — DAY 33 ========== */
    {
        id: 'calais-rest',
        day: 33,
        name: '⚠️ راحة — كاليه (الوجهة)',
        p: [50.9513, 1.8587],
        country: 'فرنسا',
        type: 'rest',
        totalKm: 2888,
        dayKm: 0,
        walkHours: 0,
        elevation: '8m',
        terrain: 'مدينة ساحلية',
        terrainDesc: 'مدينة ساحلية. كثبان رملية. أسفلت الميناء.',
        wildlife: 'طيور بحرية',
        temp: { winter: '3–8°C', summer: '18–25°C' },
        sleep: 'مخيم "New Jungle"',
        water: 'ماء',
        food: 'Refugee Community Kitchen',
        toilet: 'محدود',
        phone: 'شحن',
        wifi: 'محدود',
        medical: 'MSF',
        police: '⚠️⚠️ جدار + سياج',
        drone: '🛸 مكثفة',
        facilities: 'مخيم، مطبخ، عيادة',
        risks: {
            military: 'خطر عالٍ جداً',
            gangs: 'مرتفع',
            mafia: 'مرتفع',
            env: 'متوسط'
        },
        notes: 'راحة + محاولة عبور القنال. ظروف إنسانية صعبة. 14 وفاة في 2026.',
        source: 'MSF 2026; BVMN 2026'
    }
];

/* ============================================================
   SECTION 3: BORDER BARRIERS — DETAILED DATA
   ============================================================ */

const barriers = [
    {
        name: '🇬🇷-🇹🇷 سياج نهر إيفروس',
        p: [41.35, 26.35],
        length: '35 كم (مقطع جديد) + 75 كم إجمالي',
        height: '5 متر',
        material: 'فولاذ + أنظمة صوتية + كاميرات حرارية',
        terrain: 'نهر مريتسا + حقول',
        year: '2012-2021',
        desc: 'اليونان بنت 35 كم جديد (2023-2025) + 75 كم إجمالي. 7 نقاط غير مكتملة (5 كم) — نزاع مع تركيا. "Ankara lodged formal protest — parts on Turkish territory" (eKathimerini, 2026).',
        color: '#d32f2f',
        source: 'eKathimerini (2026)'
    },
    {
        name: '🇧🇬-🇹🇷 سياج ستراندجا',
        p: [41.8, 26.5],
        length: '30 كم (لكن 110 كم مفتوح!)',
        height: '3 متر',
        material: 'أسلاك شائكة + 1,000 شرطي',
        terrain: 'غابات ستراندجا الجبلية (160 كم)',
        year: '2014',
        desc: '⚠️ 110 كم من الحدود غير مراقبة! "The fence does not serve as an obstacle — no equipment, no surveillance in the most busy section" (BNR). 6 أيام مشي في الغابات. قبور مجهولة تحمل "НЕИЗВЕСТЕН".',
        color: '#b71c1c',
        source: 'Qantara.de (2026); BNR (2022)'
    },
    {
        name: '🇭🇺-🇷🇸 السياج المجري المزدوج',
        p: [46.15, 19.8],
        length: '175 كم',
        height: '4 متر × 2 (سياج مزدوج)',
        material: 'فولاذ + أسلاك شائكة (NATO) + كاميرات حرارية + طائرات مسيرة + كلاب',
        terrain: 'سهول عشبية + شجيرات كثيفة + حقول',
        year: '2015-2017',
        desc: 'سياج مزدوج منذ 2015. 1.5م تحت الأرض + 3م فوق. 8,403 حالة صدّ. قنابل مسيلة. "Two 4-meter high wire fence walls with a sizable stretch between them" (CGTN, 2026).',
        color: '#b71c1c',
        source: 'Reuters (2015); CGTN (2026)'
    },
    {
        name: '🇭🇷-🇧🇦 أسيجة متحركة Maljevac',
        p: [45.0, 15.9],
        length: 'نقطة واحدة (ليس على طول الحدود)',
        height: 'متغير',
        material: 'فولاذ + أسلاك شائكة',
        terrain: 'تضاريس صخرية (كارست) + جبال دينارا',
        year: '2019',
        desc: '⚠️ كرواتيا لم تبنِ سياجاً دائماً! "Movable fences" عند Maljevac (2019) و Batina (2016). "No fence, no visible barrier — but migrants don\'t flow" (ERIM). €328 مليون لمراقبة الحدود.',
        color: '#ff6f00',
        source: 'ERIM; BVMN (2026)'
    },
    {
        name: '🇲🇰-🇬🇷 سياج جيفجيليا',
        p: [41.1, 22.5],
        length: '30 كم',
        height: '3 متر',
        material: 'سياج معدني + جيش ARM',
        terrain: 'حقول + تلال منخفضة',
        year: '2015-2026',
        desc: 'سياج معدني. الجيش المقدوني (ARM) يبنيه. 200 مهاجر حاولوا اختراقه في 2026.',
        color: '#6a1b9a',
        source: 'ChatEurope (2025)'
    },
    {
        name: '🇸🇮-🇭🇷 سياج سلوفينيا',
        p: [45.7, 15.3],
        length: '200 كم (جزئي)',
        height: '4 متر',
        material: 'أسلاك شائكة + سياج معدني',
        terrain: 'غابات كثيفة + تلال',
        year: '2015-2016',
        desc: 'سلوفينيا أقامت سياجاً على ثلث حدودها مع كرواتيا. "For several weeks now, the barrier has been dismantled" (Rathaus Jena, 2022).',
        color: '#6a1b9a',
        source: 'Rathaus Jena (2022)'
    },
    {
        name: '🇫🇷-🇬🇧 جدار كاليه (Great Wall)',
        p: [50.9513, 1.8587],
        length: '1 كم (جدار خرساني) + 8.5 كم (سياج Eurotunnel) + 40 كم (سياج الطريق)',
        height: '4 متر',
        material: 'خرسانة ناعمة + أسلاك شائكة + كاميرات حرارية + إنفراريد + طائرات مسيرة + كلاب',
        terrain: 'سهول ساحلية + أسفلت الميناء',
        year: '2016',
        desc: '🎯 "Great Wall of Calais" — 4م × 1 كم على Rocade (2016). كلفة £2.3 مليون. 8.5 كم سياج Eurotunnel. 40 كم سياج على طريق النفق. "مليشيا الحدود" + "جدار خرساني". 14 وفاة منذ يونيو 2026. Vegetation cleared + stone wall erected.',
        color: '#b71c1c',
        source: 'Telegraph (2016); Libertad Digital (2026); BVMN (2026)'
    }
];

/* ============================================================
   SECTION 4: DRONE SURVEILLANCE ZONES
   ============================================================ */

const droneZones = [
    {
        name: '🛸 Frontex V-BAT — ستراندجا',
        center: [41.9, 27.2],
        radius: 90000,
        desc: 'طائرات V-BAT بدون طيار. فيديو في الوقت الحقيقي. UK تدرّب على طائرات بريطانية + أنظمة بيومترية. Frontex وفّرت طائرات مسيرة + كاميرات حرارية + معدات مراقبة.',
        source: 'Pulitzer Center (2025); Frontex (2026)'
    },
    {
        name: '🛸 كرواتيا — نهر سافا',
        center: [45.0, 18.5],
        radius: 80000,
        desc: 'طائرات مسيرة لمراقبة نهر سافا ليلاً. اعترضت 96 مهاجراً (سبتمبر 2026). "Croatian police supported the operation with aerial surveillance, deploying drones to monitor movements along the river overnight."',
        source: 'InfoMigrants (2026)'
    },
    {
        name: '🛸 Frontex — البوسنة',
        center: [44.3, 17.5],
        radius: 120000,
        desc: '130 ضابطاً. طائرات مسيرة + كاميرات حرارية. 4,910 اكتشاف في 7 أشهر. "Frontex has supplied drones, thermal cameras and other surveillance equipment to support the work."',
        source: 'MREast (2026); Frontex (2026)'
    },
    {
        name: '🛸 كاليه — الحدود النهائية',
        center: [50.95, 1.85],
        radius: 50000,
        desc: '🎯 طائرات مسيرة + كاميرات حرارية + إنفراريد + كلاب + 40 كم سياج. "Londres déploie des kilomètres de vallas de alta seguridad, concertinas y tecnología de vigilancia extrema para sellar su frontera."',
        source: 'Libertad Digital (2026); Telegraph (2016)'
    },
    {
        name: '🛸 Frontex — صربيا',
        center: [44.0, 21.0],
        radius: 100000,
        desc: 'صربيا وFrontex وقعتا اتفاقية جديدة (2026) لنشر حراس على جميع الحدود. "Frontex може да помогне на държави, с които е подписала споразумения, на цялата им територия."',
        source: '24Chasa (2026)'
    },
    {
        name: '🛸 المراقبة البلغارية — ستراندجا',
        center: [41.8, 26.3],
        radius: 70000,
        desc: 'Bulgaria وFrontex. "Joint patrol teams of the Ministry of Interior and the Forestry started patrolling in Strandzha." طائرات مسيرة + كاميرات حرارية. 110 كم غير مراقبة.',
        source: 'BNT News (2022)'
    }
];

/* ============================================================
   SECTION 5: RIVER CROSSINGS
   ============================================================ */

const riverCrossings = [
    {
        name: 'نهر مريتسا (Meriç/Evros)',
        p: [41.0, 26.3],
        danger: 'فيضان شتوي، سياج حدودي',
        deaths: 'عشرات',
        width: '50–150م',
        depth: '1–3م',
        source: 'ChatEurope (2025)'
    },
    {
        name: 'نهر أونا (Una)',
        p: [44.8, 16.0],
        danger: 'بارد شتاءً، عميق',
        deaths: 'غرقى موثقون',
        width: '30–100م',
        depth: '2–5م',
        source: 'IOM Missing Migrants (2026)'
    },
    {
        name: 'نهر كولبا (Kolpa)',
        p: [45.5, 15.1],
        danger: 'سحي، 3 غرقى في 2026',
        deaths: '3 في مايو 2026',
        width: '20–50م',
        depth: '1–4م',
        source: 'Slovenia Times (2026)'
    },
    {
        name: 'نهر سافا (Sava)',
        p: [45.0, 18.5],
        danger: 'تيار قوي، 3 غرقى (2025)',
        deaths: '3 (2025), 30 أُنقذوا (2026)',
        width: '100–300م',
        depth: '3–8م',
        source: 'InfoMigrants (2026)'
    },
    {
        name: 'نهر درينا (Drina)',
        p: [44.0, 19.3],
        danger: 'دوامات، 10 غرقى في 2024',
        deaths: '10 في أغسطس 2024',
        width: '50–150م',
        depth: '2–6م',
        source: 'IOM Missing Migrants (2025)'
    },
    {
        name: 'نهر الدانوب (Danube)',
        p: [45.2, 19.0],
        danger: 'عميق، 1 غريق في 2025',
        deaths: '1 في أكتوبر 2025',
        width: '300–800م',
        depth: '5–15م',
        source: 'InfoMigrants (2025)'
    }
];

/* ============================================================
   SECTION 6: MILITARY SITES
   ============================================================ */

const militarySites = [
    { name: 'قاعدة سودا 🇬🇷', p: [35.4944, 24.0936], type: 'NATO', desc: 'أكبر قاعدة بحرية/جوية أمريكية في شرق المتوسط.' },
    { name: 'NRDC-GR سالونيك 🇬🇷', p: [40.6401, 22.9444], type: 'NATO', desc: 'فيلق الرد السريع التابع للناتو.' },
    { name: 'كامب بوندستيل 🇽🇰', p: [42.3833, 21.4833], type: 'US', desc: 'ثاني أكبر قاعدة أمريكية في أوروبا. مقر KFOR.' },
    { name: 'قاعدة جيليافا 🇧🇦', p: [44.8333, 15.8333], type: 'Former', desc: 'أكبر قاعدة جوية تحت الأرض في يوغوسلافيا السابقة.' },
    { name: 'ثكنة بورا ماركوفيتش 🇷🇸', p: [44.6667, 20.2000], type: 'Repurposed', desc: 'ثكنة عسكرية سابقة. مركز استقبال للمهاجرين.' },
    { name: 'قاعدة كوتشوفا 🇦🇱', p: [40.7833, 20.6167], type: 'NATO', desc: 'أول قاعدة جوية تكتيكية للناتو في البلقان.' }
];

/* ============================================================
   SECTION 7: RISK ZONES
   ============================================================ */

const riskZones = [
    {
        name: '⚠️ منطقة الخطر البلغارية-التركية',
        center: [41.85, 26.5],
        radius: 60000,
        color: '#d32f2f',
        desc: 'أخطر مقطع. "لعبة الشرطة". 30 كم سياج شائك. 1,000 شرطي. صدّ عنيف. 17 لاجئاً أفغانياً رُحّلوا جماعياً. قنابل مسيلة. قبور مجهولة "НЕИЗВЕСТЕН". 6 أيام مشي في ستراندجا.',
        source: 'Qantara.de (2026)'
    },
    {
        name: '⚠️ منطقة الخطر الكرواتية-البوسنية',
        center: [45.0, 15.9],
        radius: 80000,
        color: '#c62828',
        desc: '30,000 حالة صدّ عنيف (2020-2022). 13% أطفال. ضرب بالهراوات، عضّ الكلاب، اعتداء جنسي موثق. "أوروبا للمسيحيين فقط". حرق أمتعة. 8,403 حالة صدّ (سبتمبر–ديسمبر 2023). €328 مليون لمراقبة الحدود.',
        source: 'Al Jazeera (2026); BVMN (2026)'
    },
    {
        name: '⚠️ منطقة الخطر المجرية-الصربية',
        center: [46.15, 19.8],
        radius: 70000,
        color: '#b71c1c',
        desc: 'سياج مزدوج 4م × 175 كم. أسلاك شائكة + كاميرات حرارية + طائرات مسيرة + كلاب. 8,403 حالة صدّ. قنابل مسيلة. عصابات "تيتواني" المغربية.',
        source: 'Reuters (2015); CGTN (2026)'
    },
    {
        name: '⚠️ منطقة الألغام الأرضية (البوسنة)',
        center: [44.3, 17.5],
        radius: 120000,
        color: '#7b1fa2',
        desc: '180,000 لغم أرضي متبقٍ من حرب 1990s. 617 وفاة. 130,000 لغم تمت إزالته. جلسات توعية في مراكز الاستقبال. مهاجر توفي في 2021 بسبب لغم.',
        source: 'BVMN (2026); IOM (2026)'
    },
    {
        name: '⚠️ منطقة كاليه — الوجهة النهائية',
        center: [50.95, 1.85],
        radius: 50000,
        color: '#b71c1c',
        desc: '🎯 جدار 4م + 8.5 كم سياج Eurotunnel + 40 كم سياج. 14 وفاة في 2026. 6,000 في "New Jungle". MSF: ~3,000 في مخيمات مؤقتة. "One in, one out" (2025). القوارب الصغيرة — بديل خطير.',
        source: 'MSF (2026); BVMN (2026)'
    }
];

/* ============================================================
   SECTION 8: MAP RENDERING
   ============================================================ */

const typeColors = {
    start: '#ff6f00',
    border: '#6a1b9a',
    hub: '#1565c0',
    transit: '#00838f',
    entry: '#2e7d32',
    destination: '#ffc107',
    'wild-camp': '#4caf50',
    rest: '#c62828'
};

/* --- Route polyline --- */
const routeCoords = allStops.map(s => s.p);
const routeLine = L.polyline(routeCoords, {
    color: '#e53935',
    weight: 6,
    opacity: 0.9,
    dashArray: '14 10',
    lineCap: 'round',
    lineJoin: 'round'
}).addTo(map);

/* --- Stop markers --- */
const stopMarkers = [];

allStops.forEach(function (s) {
    const color = typeColors[s.type] || '#555';
    const size = (s.type === 'start' || s.type === 'destination') ? 22 : 14;

    const icon = L.divIcon({
        className: '',
        html: '<div style="background:' + color + ';width:' + size + 'px;height:' + size +
            'px;border-radius:50%;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.7);' +
            (s.type === 'destination' ? 'box-shadow:0 0 20px #ffc107;' : '') + '"></div>',
        iconSize: [size + 6, size + 6],
        iconAnchor: [(size + 6) / 2, (size + 6) / 2]
    });

    const m = L.marker(s.p, {
        icon: icon,
        zIndexOffset: s.type === 'destination' ? 3000 : 500
    }).addTo(map);

    m.bindTooltip(s.name, {
        permanent: true,
        direction: 'top',
        className: 'city-label',
        offset: [0, -10]
    });

    /* Full popup with all data */
    m.bindPopup(
        '<div style="min-width:320px;">' +
        '<h3 style="margin:0 0 5px 0;color:' + color + ';font-size:0.95rem;">' + s.name + '</h3>' +
        '<p style="margin:1px 0;font-size:10px;color:#94a3b8;">📍 ' + s.country + ' • اليوم ' + s.day + ' • ' + s.elevation + '</p>' +

        '<div style="margin:6px 0;padding:6px 8px;background:rgba(56,189,248,0.1);border-radius:5px;">' +
        '<div style="font-size:10px;color:#38bdf8;font-weight:700;">📊 المسافة</div>' +
        '<div style="font-size:10px;color:#cbd5e1;">' +
        'اليوم: <b>' + s.dayKm + ' كم</b> • الإجمالي: <b>' + s.totalKm.toLocaleString() + ' كم</b>' +
        '<br>ساعات المشي: <b>' + s.walkHours + ' ساعات</b></div></div>' +

        '<div style="margin:6px 0;padding:6px 8px;background:rgba(141,110,99,0.15);border-radius:5px;">' +
        '<div style="font-size:10px;color:#d7ccc8;font-weight:700;">🏔️ التضاريس</div>' +
        '<div style="font-size:10px;color:#cbd5e1;">' + s.terrainDesc + '</div></div>' +

        '<div style="margin:6px 0;padding:6px 8px;background:rgba(51,105,30,0.15);border-radius:5px;">' +
        '<div style="font-size:10px;color:#aed581;font-weight:700;">🐻 الحياة الفطرية</div>' +
        '<div style="font-size:10px;color:#cbd5e1;">' + s.wildlife + '</div></div>' +

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
        '<p style="margin:3px 0;font-size:9px;color:#475569;">📚 ' + s.source + '</p></div>'
    );

    stopMarkers.push(m);
});

/* --- User position marker --- */
const userIcon = L.divIcon({
    className: 'user-pulse',
    html: '<div style="background:#4caf50;width:22px;height:22px;border-radius:50%;border:3px solid #fff;' +
        'display:flex;align-items:center;justify-content:center;font-size:12px;' +
        'box-shadow:0 0 15px rgba(76,175,80,0.8);">🚶</div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
});

const userMarker = L.marker(allStops[0].p, {
    icon: userIcon,
    zIndexOffset: 2000
}).addTo(map);

userMarker.bindTooltip('🚶 موقعك — البداية', {
    permanent: true,
    direction: 'right',
    className: 'city-label'
});

/* --- Barrier markers --- */
const barrierLayer = L.layerGroup();

const barrierIcon = L.divIcon({
    className: '',
    html: '<div style="background:#7b1fa2;width:18px;height:18px;border-radius:3px;border:2px solid #ce93d8;' +
        'display:flex;align-items:center;justify-content:center;font-size:9px;color:#fff;' +
        'box-shadow:0 0 12px rgba(123,31,162,0.9);">🚧</div>',
    iconSize: [22, 22],
    iconAnchor: [11, 11]
});

barriers.forEach(function (b) {
    const m = L.marker(b.p, { icon: barrierIcon, zIndexOffset: 850 });
    m.bindPopup(
        '<div style="min-width:300px;">' +
        '<h3 style="margin:0 0 5px 0;color:' + b.color + ';font-size:0.85rem;">🚧 ' + b.name + '</h3>' +
        '<p style="margin:1px 0;font-size:10px;"><b>الطول:</b> ' + b.length + '</p>' +
        '<p style="margin:1px 0;font-size:10px;"><b>الارتفاع:</b> ' + b.height + '</p>' +
        '<p style="margin:1px 0;font-size:10px;"><b>المادة:</b> ' + b.material + '</p>' +
        '<p style="margin:1px 0;font-size:10px;"><b>التضاريس:</b> ' + b.terrain + '</p>' +
        '<p style="margin:1px 0;font-size:10px;"><b>سنة الإنشاء:</b> ' + b.year + '</p>' +
        '<p style="margin:5px 0;font-size:10px;line-height:1.5;color:#cbd5e1;">' + b.desc + '</p>' +
        '<p style="margin:2px 0;font-size:9px;color:#64748b;">📚 ' + b.source + '</p></div>'
    );
    barrierLayer.addLayer(m);
});
barrierLayer.addTo(map);

/* --- Drone zones --- */
const droneLayer = L.layerGroup();

droneZones.forEach(function (d) {
    const c = L.circle(d.center, {
        radius: d.radius,
        color: '#ff6f00',
        fillColor: '#ff6f00',
        fillOpacity: 0.06,
        weight: 2,
        dashArray: '4 6',
        className: 'drone-zone'
    });
    c.bindPopup(
        '<div style="min-width:280px;">' +
        '<h3 style="margin:0 0 5px 0;color:#ff9800;font-size:0.85rem;">' + d.name + '</h3>' +
        '<p style="margin:5px 0;font-size:10px;line-height:1.5;color:#cbd5e1;">' + d.desc + '</p>' +
        '<p style="margin:2px 0;font-size:9px;color:#64748b;">📚 ' + d.source + '</p></div>'
    );
    droneLayer.addLayer(c);
});
droneLayer.addTo(map);

/* --- Military sites --- */
const militaryLayer = L.layerGroup();

const militaryIcon = L.divIcon({
    className: '',
    html: '<div style="background:#37474f;width:16px;height:16px;border-radius:3px;border:2px solid #ffeb3b;' +
        'display:flex;align-items:center;justify-content:center;font-size:9px;color:#fff;' +
        'box-shadow:0 2px 8px rgba(0,0,0,0.7);">⚔</div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

militarySites.forEach(function (s) {
    const m = L.marker(s.p, { icon: militaryIcon, zIndexOffset: 800 });
    m.bindPopup(
        '<div style="min-width:200px;">' +
        '<h3 style="margin:0 0 4px 0;color:#ffeb3b;font-size:0.8rem;">⚔️ ' + s.name + '</h3>' +
        '<p style="margin:1px 0;font-size:10px;color:#94a3b8;">النوع: ' + s.type + '</p>' +
        '<p style="margin:4px 0;font-size:10px;line-height:1.5;color:#cbd5e1;">' + s.desc + '</p></div>'
    );
    militaryLayer.addLayer(m);
});
militaryLayer.addTo(map);

/* --- River crossings --- */
const riverLayer = L.layerGroup();

const riverIcon = L.divIcon({
    className: '',
    html: '<div style="background:#0288d1;width:15px;height:15px;border-radius:50%;border:2px solid #4fc3f7;' +
        'display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;' +
        'box-shadow:0 0 10px rgba(2,136,209,0.8);">🌊</div>',
    iconSize: [19, 19],
    iconAnchor: [9, 9]
});

riverCrossings.forEach(function (r) {
    const m = L.marker(r.p, { icon: riverIcon, zIndexOffset: 700 });
    m.bindPopup(
        '<div style="min-width:200px;">' +
        '<h3 style="margin:0 0 4px 0;color:#4fc3f7;font-size:0.8rem;">🌊 ' + r.name + '</h3>' +
        '<p style="margin:1px 0;font-size:10px;color:#fca5a5;">⚠️ ' + r.danger + '</p>' +
        '<p style="margin:1px 0;font-size:10px;">العرض: ' + r.width + ' | العمق: ' + r.depth + '</p>' +
        '<p style="margin:1px 0;font-size:10px;color:#94a3b8;">الوفيات: ' + r.deaths + '</p>' +
        '<p style="margin:2px 0;font-size:9px;color:#64748b;">📚 ' + r.source + '</p></div>'
    );
    riverLayer.addLayer(m);
});
riverLayer.addTo(map);

/* --- Risk zones --- */
const riskLayer = L.layerGroup();

riskZones.forEach(function (z) {
    const c = L.circle(z.center, {
        radius: z.radius,
        color: z.color,
        fillColor: z.color,
        fillOpacity: 0.10,
        weight: 2,
        dashArray: '6 4',
        className: 'risk-zone'
    });
    c.bindPopup(
        '<div style="min-width:280px;">' +
        '<h3 style="margin:0 0 5px 0;color:' + z.color + ';font-size:0.9rem;">' + z.name + '</h3>' +
        '<p style="margin:5px 0;font-size:10px;line-height:1.6;color:#cbd5e1;">' + z.desc + '</p>' +
        '<p style="margin:2px 0;font-size:9px;color:#64748b;">📚 ' + z.source + '</p></div>'
    );
    riskLayer.addLayer(c);
});
riskLayer.addTo(map);

/* ============================================================
   SECTION 9: SIDEBAR PANELS
   ============================================================ */

/* --- Trip summary --- */
(function () {
    const lastStop = allStops[allStops.length - 1];
    const totalKm = lastStop.totalKm;
    const totalDays = lastStop.day;
    const totalWalkHours = allStops.reduce(function (sum, s) { return sum + s.walkHours; }, 0);
    const restDays = allStops.filter(function (s) { return s.type === 'rest'; }).length;
    const wildCamps = allStops.filter(function (s) { return s.type === 'wild-camp'; }).length;
    const borders = allStops.filter(function (s) { return s.type === 'border'; }).length;

    document.getElementById('trip-summary').innerHTML =
        '<div class="summary-highlight">' +
        '<div class="destination">🎯 الوجهة النهائية: كاليه، فرنسا</div>' +
        '<div class="total">' + totalKm.toLocaleString() + ' كم</div>' +
        '<div style="font-size:0.65rem;color:#94a3b8;margin-top:4px;">من أدرنة، تركيا إلى نفق القنال</div>' +
        '</div>' +

        '<div class="summary-grid">' +
        '<div class="summary-card"><span class="value">' + totalDays + '</span><span class="label">إجمالي الأيام</span></div>' +
        '<div class="summary-card"><span class="value">' + totalWalkHours + '</span><span class="label">ساعات المشي</span></div>' +
        '<div class="summary-card"><span class="value">' + restDays + '</span><span class="label">أيام راحة إجبارية</span></div>' +
        '<div class="summary-card"><span class="value">' + wildCamps + '</span><span class="label">ليالي في العراء</span></div>' +
        '<div class="summary-card"><span class="value">' + borders + '</span><span class="label">معابر حدودية</span></div>' +
        '<div class="summary-card"><span class="value">6</span><span class="label">دول</span></div>' +
        '</div>';
})();

/* --- Route statistics --- */
(function () {
    document.getElementById('route-stats').innerHTML =
        '<div style="padding:6px;background:#1a2332;border-radius:5px;margin-bottom:6px;">' +
        '<div style="font-size:0.72rem;color:#fca5a5;font-weight:700;">📉 انخفاض 42% في العبور</div>' +
        '<div style="font-size:0.65rem;color:#94a3b8;margin-top:3px;">' +
        '12,500 عبور غير نظامي في 2025 (Frontex). 930 عبور فقط في يناير–فبراير 2026 (انخفاض 38%). ' +
        'لكن Save the Children تحذر: "الأطفال يختفون من بيانات الهجرة".' +
        '</div></div>' +

        '<div style="padding:6px;background:#1a2332;border-radius:5px;margin-bottom:6px;">' +
        '<div style="font-size:0.72rem;color:#fcd34d;font-weight:700;">💀 413 وفاة منذ 2014</div>' +
        '<div style="font-size:0.65rem;color:#94a3b8;margin-top:3px;">' +
        'IOM Missing Migrants. 14 وفاة في كاليه خلال 2026. 3 غرقى في نهر كولبا (مايو 2026). ' +
        '10 غرقى في نهر درينا (أغسطس 2024).' +
        '</div></div>' +

        '<div style="padding:6px;background:#1a2332;border-radius:5px;margin-bottom:6px;">' +
        '<div style="font-size:0.72rem;color:#f87171;font-weight:700;">⚠️ 30,000 حالة صدّ عنيف</div>' +
        '<div style="font-size:0.65rem;color:#94a3b8;margin-top:3px;">' +
        'كرواتيا (2020–2022). 13% أطفال. ضرب بالهراوات، عضّ الكلاب، اعتداء جنسي موثق. ' +
        '"أوروبا للمسيحيين فقط" — شرطي كرواتي.' +
        '</div></div>' +

        '<div style="padding:6px;background:#1a2332;border-radius:5px;">' +
        '<div style="font-size:0.72rem;color:#fcd34d;font-weight:700;">🧒 13% أطفال في الصدّ</div>' +
        '<div style="font-size:0.65rem;color:#94a3b8;margin-top:3px;">' +
        'Save the Children (مايو 2026): "الأطفال يختفون من البيانات. عندما يكونون غير مرئيين، لا يمكن حمايتهم."' +
        '</div></div>';
})();

/* --- Daily schedule --- */
(function () {
    let html = '';
    allStops.forEach(function (s) {
        if (s.type === 'rest') {
            html += '<div class="rest-card">' +
                '<div class="rest-title">⚠️ ' + s.name + '</div>' +
                '<div class="rest-reason">' + s.notes + '</div></div>';
        } else {
            html += '<div class="day-card">' +
                '<div class="day-title">' +
                '<span>اليوم ' + s.day + ': ' + s.name + '</span>' +
                '<span class="day-badge">' + s.totalKm.toLocaleString() + ' كم</span>' +
                '</div>' +
                '<div class="day-meta">📍 ' + s.country + ' | 🚶 ' + s.dayKm + ' كم | ⏱️ ' + s.walkHours + ' ساعات</div>' +
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
(function () {
    let html = '';
    allStops.forEach(function (s) {
        const color = typeColors[s.type] || '#555';
        html += '<div class="stop-item" data-lat="' + s.p[0] + '" data-lng="' + s.p[1] + '" data-id="' + s.id + '">' +
            '<div class="stop-dot" style="background:' + color + ';"></div>' +
            '<div class="stop-info">' +
            '<div class="stop-name">' + s.name + '</div>' +
            '<div class="stop-meta">اليوم ' + s.day + ' • ' + s.totalKm.toLocaleString() + ' كم' +
            (s.dayKm > 0 ? ' (+' + s.dayKm + ' كم)' : '') + '</div></div></div>';
    });
    document.getElementById('stop-list').innerHTML = html;

    /* Click to fly */
    document.querySelectorAll('.stop-item').forEach(function (item) {
        item.addEventListener('click', function () {
            const lat = parseFloat(this.getAttribute('data-lat'));
            const lng = parseFloat(this.getAttribute('data-lng'));
            map.flyTo([lat, lng], 10, { duration: 1.2 });
        });
    });
})();

/* --- Barriers list --- */
(function () {
    let html = '';
    barriers.forEach(function (b) {
        html += '<div class="barrier-card">' +
            '<div class="b-name">' + b.name + '</div>' +
            '<div class="b-detail">📏 ' + b.length + ' | 📐 ' + b.height + '</div>' +
            '<div class="b-detail">🧱 ' + b.material + '</div>' +
            '<span class="b-stat">' + b.year + '</span>' +
            '<div class="b-detail" style="margin-top:4px;font-size:0.6rem;color:#475569;">📚 ' + b.source + '</div></div>';
    });
    document.getElementById('barriers-list').innerHTML = html;
})();

/* --- Drone list --- */
(function () {
    let html = '';
    droneZones.forEach(function (d) {
        html += '<div class="drone-card">' +
            '<div class="d-name">' + d.name + '</div>' +
            '<div class="d-detail">' + d.desc + '</div>' +
            '<div class="d-detail" style="margin-top:3px;font-size:0.6rem;color:#475569;">📚 ' + d.source + '</div></div>';
    });
    document.getElementById('drone-list').innerHTML = html;
})();

/* --- Risk list --- */
(function () {
    let html = '';
    riskZones.forEach(function (z) {
        html += '<div class="risk-card">' +
            '<div class="r-name">' + z.name + '</div>' +
            '<div class="r-detail">' + z.desc + '</div>' +
            '<div class="r-detail" style="margin-top:3px;font-size:0.6rem;color:#475569;">📚 ' + z.source + '</div></div>';
    });
    document.getElementById('risk-list').innerHTML = html;
})();

/* ============================================================
   SECTION 10: LAYER CONTROLS
   ============================================================ */

document.getElementById('toggle-route').addEventListener('change', function () {
    if (this.checked) { routeLine.addTo(map); } else { map.removeLayer(routeLine); }
});

document.getElementById('toggle-stops').addEventListener('change', function () {
    stopMarkers.forEach(function (m) {
        if (this.checked) { m.addTo(map); } else { map.removeLayer(m); }
    }, this);
});

document.getElementById('toggle-barriers').addEventListener('change', function () {
    if (this.checked) { barrierLayer.addTo(map); } else { map.removeLayer(barrierLayer); }
});

document.getElementById('toggle-drones').addEventListener('change', function () {
    if (this.checked) { droneLayer.addTo(map); } else { map.removeLayer(droneLayer); }
});

document.getElementById('toggle-military').addEventListener('change', function () {
    if (this.checked) { militaryLayer.addTo(map); } else { map.removeLayer(militaryLayer); }
});

document.getElementById('toggle-rivers').addEventListener('change', function () {
    if (this.checked) { riverLayer.addTo(map); } else { map.removeLayer(riverLayer); }
});

document.getElementById('toggle-risk').addEventListener('change', function () {
    if (this.checked) { riskLayer.addTo(map); } else { map.removeLayer(riskLayer); }
});

/* ============================================================
   SECTION 11: BASE LAYER SWITCHER
   ============================================================ */

L.control.layers(
    {
        '🗺️ خريطة الشوارع': osmLayer,
        '🛰️ صور الأقمار الصناعية': satelliteLayer,
        '⛰️ التضاريس': terrainLayer
    },
    {
        '🚧 الحواجز': barrierLayer,
        '🛸 الطائرات المسيرة': droneLayer,
        '⚔️ المواقع العسكرية': militaryLayer,
        '🌊 الأنهار': riverLayer,
        '⚠️ مناطق الخطر': riskLayer
    },
    { position: 'topleft' }
).addTo(map);

/* ============================================================
   SECTION 12: MAP FIT & SCALE
   ============================================================ */

const allMapPoints = [];
allStops.forEach(function (s) { allMapPoints.push(s.p); });
barriers.forEach(function (b) { allMapPoints.push(b.p); });
riverCrossings.forEach(function (r) { allMapPoints.push(r.p); });
droneZones.forEach(function (d) { allMapPoints.push(d.center); });

map.fitBounds(allMapPoints, { padding: [50, 50] });

L.control.scale({
    imperial: false,
    metric: true,
    position: 'bottomleft'
}).addTo(map);

/* ============================================================
   SECTION 13: PROGRESS SIMULATION
   ============================================================ */

(function () {
    let currentIndex = 0;
    const totalStops = allStops.length;
    const progressFill = document.getElementById('progress-fill');
    const progressDay = document.getElementById('progress-day');
    const progressKm = document.getElementById('progress-km');

    function advance() {
        if (currentIndex >= totalStops) {
            currentIndex = 0;
        }

        const stop = allStops[currentIndex];
        const pct = (stop.totalKm / allStops[totalStops - 1].totalKm) * 100;

        progressFill.style.width = pct + '%';
        progressDay.textContent = 'اليوم ' + stop.day;
        progressKm.textContent = stop.totalKm.toLocaleString() + ' كم';

        userMarker.setLatLng(stop.p);

        currentIndex++;
    }

    /* Advance every 4 seconds */
    setInterval(advance, 4000);
})();

/* ============================================================
   SECTION 14: KONAMI / EASTER EGG (optional)
   ============================================================ */

(function () {
    const keys = [];
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', function (e) {
        keys.push(e.key);
        if (keys.length > code.length) { keys.shift(); }
        if (keys.join(',') === code.join(',')) {
            map.flyTo([41.0082, 28.9784], 12, { duration: 2 });
            setTimeout(function () {
                alert('🎮 Konami Code activated! Welcome to Istanbul.');
            }, 500);
        }
    });
})();

/* ============================================================
   END OF SCRIPT
   ============================================================
   Total sources referenced: 13
   Total stops documented: 33
   Total barriers documented: 7
   Total drone zones documented: 6
   Total rivers documented: 6
   Total risk zones documented: 5
   ============================================================ */
