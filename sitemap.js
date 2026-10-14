// sitemap.js — يولّد sitemap.xml + sitemap-images.xml
const fs = require('fs');
const path = require('path');
const regions = require('./regions.json');

const SITE = 'https://elaalwa.com';
const today = new Date().toISOString().split('T')[0];
const KURDISH_GOVS = ['erbil', 'sulaymaniyah', 'duhok', 'halabja'];

/* ========== 68 صورة ========== */
const CATEGORIES = [
  { f:'elaalwa-alwairaq-iraqi-ad-restaurants-01.webp',  ar:'مطاعم' },
  { f:'elaalwa-alwairaq-iraqi-ad-cafes-01.webp',        ar:'مقاهي' },
  { f:'elaalwa-alwairaq-iraqi-ad-sweets-01.webp',       ar:'حلويات' },
  { f:'elaalwa-alwairaq-iraqi-ad-juices-01.webp',       ar:'عصائر' },
  { f:'elaalwa-alwairaq-iraqi-ad-supermarkets-01.webp', ar:'سوبرماركت' },
  { f:'elaalwa-alwairaq-iraqi-ad-pharmacies-01.webp',   ar:'صيدليات' },
  { f:'elaalwa-alwairaq-iraqi-ad-clinics-01.webp',      ar:'عيادات' },
  { f:'elaalwa-alwairaq-iraqi-ad-hospitals-01.webp',    ar:'مستشفيات' },
  { f:'elaalwa-alwairaq-iraqi-ad-labs-01.webp',         ar:'مختبرات' },
  { f:'elaalwa-alwairaq-iraqi-ad-institutes-01.webp',   ar:'معاهد' },
  { f:'elaalwa-alwairaq-iraqi-ad-universities-01.webp', ar:'جامعات' },
  { f:'elaalwa-alwairaq-iraqi-ad-schools-01.webp',      ar:'مدارس' },
  { f:'elaalwa-alwairaq-iraqi-ad-kindergartens-01.webp',ar:'رياض أطفال' },
  { f:'elaalwa-alwairaq-iraqi-ad-real-estate-01.webp',  ar:'عقارات' },
  { f:'elaalwa-alwairaq-iraqi-ad-cars-01.webp',         ar:'سيارات' },
  { f:'elaalwa-alwairaq-iraqi-ad-furniture-01.webp',    ar:'أثاث' },
  { f:'elaalwa-alwairaq-iraqi-ad-fashion-01.webp',      ar:'أزياء' },
  { f:'elaalwa-alwairaq-iraqi-ad-electronics-01.webp',  ar:'إلكترونيات' },
  { f:'elaalwa-alwairaq-iraqi-ad-mobiles-01.webp',      ar:'هواتف' },
  { f:'elaalwa-alwairaq-iraqi-ad-perfumes-01.webp',     ar:'عطورات' },
  { f:'elaalwa-alwairaq-iraqi-ad-cosmetics-01.webp',    ar:'مستحضرات تجميل' },
  { f:'elaalwa-alwairaq-iraqi-ad-salons-01.webp',       ar:'صالونات' },
  { f:'elaalwa-alwairaq-iraqi-ad-barbers-01.webp',      ar:'حلاقين' },
  { f:'elaalwa-alwairaq-iraqi-ad-home-services-01.webp',ar:'خدمات منزلية' },
  { f:'elaalwa-alwairaq-iraqi-ad-moving-01.webp',       ar:'نقل عفش' },
  { f:'elaalwa-alwairaq-iraqi-ad-delivery-01.webp',     ar:'توصيل' },
  { f:'elaalwa-alwairaq-iraqi-ad-events-01.webp',       ar:'مناسبات' },
  { f:'elaalwa-alwairaq-iraqi-ad-wedding-halls-01.webp',ar:'قاعات أعراس' },
  { f:'elaalwa-alwairaq-iraqi-ad-travel-01.webp',       ar:'سفر وسياحة' },
  { f:'elaalwa-alwairaq-iraqi-ad-hajj-umrah-01.webp',   ar:'حج وعمرة' },
  { f:'elaalwa-alwairaq-iraqi-ad-hotels-01.webp',       ar:'فنادق' },
  { f:'elaalwa-alwairaq-iraqi-ad-banking-01.webp',      ar:'مصارف' },
  { f:'elaalwa-alwairaq-iraqi-ad-e-wallets-01.webp',    ar:'محافظ إلكترونية' },
  { f:'elaalwa-alwairaq-iraqi-ad-telecom-01.webp',      ar:'اتصالات' },
  { f:'elaalwa-alwairaq-iraqi-ad-internet-01.webp',     ar:'إنترنت' },
  { f:'elaalwa-alwairaq-iraqi-ad-generators-01.webp',   ar:'مولدات' },
  { f:'elaalwa-alwairaq-iraqi-ad-solar-01.webp',        ar:'طاقة شمسية' },
  { f:'elaalwa-alwairaq-iraqi-ad-construction-01.webp', ar:'إنشاءات' },
  { f:'elaalwa-alwairaq-iraqi-ad-decor-01.webp',        ar:'ديكور' },
  { f:'elaalwa-alwairaq-iraqi-ad-legal-01.webp',        ar:'خدمات قانونية' },
  { f:'elaalwa-alwairaq-iraqi-ad-accounting-01.webp',   ar:'محاسبة' },
  { f:'elaalwa-alwairaq-iraqi-ad-jobs-01.webp',         ar:'وظائف' },
  { f:'elaalwa-alwairaq-iraqi-ad-insurance-01.webp',    ar:'تأمين' },
  { f:'elaalwa-alwairaq-iraqi-ad-agriculture-01.webp',  ar:'زراعة' },
  { f:'elaalwa-alwairaq-iraqi-ad-vet-01.webp',          ar:'طب بيطري' },
  { f:'elaalwa-alwairaq-iraqi-ad-pets-01.webp',         ar:'حيوانات أليفة' },
  { f:'elaalwa-alwairaq-iraqi-ad-sports-01.webp',       ar:'رياضة' },
  { f:'elaalwa-alwairaq-iraqi-ad-gyms-01.webp',         ar:'صالات رياضية' },
  { f:'elaalwa-alwairaq-iraqi-ad-photography-01.webp',  ar:'تصوير' },
  { f:'elaalwa-alwairaq-iraqi-ad-printing-01.webp',     ar:'طباعة' },
  { f:'elaalwa-alwairaq-iraqi-ad-gifts-01.webp',        ar:'هدايا' },
  { f:'elaalwa-alwairaq-iraqi-ad-flowers-01.webp',      ar:'زهور' },
  { f:'elaalwa-alwairaq-iraqi-ad-baby-01.webp',         ar:'مستلزمات أطفال' },
  { f:'elaalwa-alwairaq-iraqi-ad-water-01.webp',        ar:'مياه' },
  { f:'elaalwa-alwairaq-iraqi-ad-food-beverages-01.webp',ar:'أغذية ومشروبات' },
  { f:'elaalwa-alwairaq-iraqi-ad-home-appliances-01.webp',ar:'أجهزة منزلية' },
  { f:'elaalwa-alwairaq-iraqi-ad-electrical-01.webp',   ar:'كهربائيات' },
  { f:'elaalwa-alwairaq-iraqi-ad-sanitary-01.webp',     ar:'أدوات صحية' },
  { f:'elaalwa-alwairaq-iraqi-ad-kitchens-01.webp',     ar:'مطابخ' },
  { f:'elaalwa-alwairaq-iraqi-ad-aluminum-01.webp',     ar:'ألمنيوم' },
  { f:'elaalwa-alwairaq-iraqi-ad-glass-01.webp',        ar:'زجاج' },
  { f:'elaalwa-alwairaq-iraqi-ad-blacksmith-01.webp',   ar:'حدادة' },
  { f:'elaalwa-alwairaq-iraqi-ad-carpentry-01.webp',    ar:'نجارة' },
  { f:'elaalwa-alwairaq-iraqi-ad-painting-01.webp',     ar:'صباغة' },
  { f:'elaalwa-alwairaq-iraqi-ad-hvac-01.webp',         ar:'تكييف وتدفئة' },
  { f:'elaalwa-alwairaq-iraqi-ad-cctv-01.webp',         ar:'كاميرات مراقبة' },
  { f:'elaalwa-alwairaq-iraqi-ad-security-01.webp',     ar:'أمن وحماية' },
  { f:'elaalwa-alwairaq-iraqi-ad-cleaning-01.webp',     ar:'تنظيف' },
  { f:'elaalwa-alwairaq-iraqi-ad-companies-01.webp',    ar:'شركات' },
  { f:'elaalwa-alwairaq-iraqi-ad-tailoring-01.webp',    ar:'خياطة' }
];

/* ========== جمع كل الروابط ========== */
const urls = [{ loc:`${SITE}/`, cf:'daily', p:'1.0', imgs:[] }];

regions.forEach(gov => {
  urls.push({ loc:`${SITE}/iraq/${gov.g}/`, cf:'daily', p:'0.9', imgs:[] });
  gov.a.forEach(a => {
    urls.push({
      loc:`${SITE}/iraq/${gov.g}/${a.s}/`,
      cf:'weekly',
      p:'0.8',
      imgs: CATEGORIES,
      areaName: a.n
    });
  });
  if (KURDISH_GOVS.includes(gov.g)) {
    urls.push({ loc:`${SITE}/ckb/iraq/${gov.g}/`, cf:'daily', p:'0.9', imgs:[] });
    gov.a.forEach(a => {
      urls.push({
        loc:`${SITE}/ckb/iraq/${gov.g}/${a.s}/`,
        cf:'weekly',
        p:'0.8',
        imgs: CATEGORIES,
        areaName: a.n
      });
    });
  }
});

/* ========== sitemap.xml (مع صور مضمّنة) ========== */
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(u => {
  const imgTags = (u.imgs || []).map(img =>
`    <image:image>
      <image:loc>${SITE}/${img.f}</image:loc>
      <image:title>${img.ar}</image:title>
      <image:caption>إعلان ${img.ar} حصري 24 ساعة - إيلا علوة</image:caption>
    </image:image>`).join('\n');

  return `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.cf}</changefreq>
    <priority>${u.p}</priority>
${imgTags}
  </url>`;
}).join('\n')}
</urlset>`;

/* ========== sitemap-images.xml (منفصل - 68 صورة) ========== */
const imagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${CATEGORIES.map(cat => `  <url>
    <loc>${SITE}/${cat.f}</loc>
    <image:image>
      <image:loc>${SITE}/${cat.f}</image:loc>
      <image:title>${cat.ar} - إيلا علوة</image:title>
      <image:caption>إعلانات ${cat.ar} في العراق - منصة إيلا علوة</image:caption>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

/* ========== كتابة الملفات ========== */
if (!fs.existsSync('./docs')) fs.mkdirSync('./docs');
fs.writeFileSync('./docs/sitemap.xml', sitemapXml);
fs.writeFileSync('./docs/sitemap-images.xml', imagesXml);

console.log(`✅ sitemap.xml: ${urls.length} رابط`);
console.log(`✅ sitemap-images.xml: ${CATEGORIES.length} صورة`);
