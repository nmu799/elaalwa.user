// generate.js — مولّد صفحات إيلا علوة
const fs = require('fs');
const path = require('path');
const regions = require('./regions.json');

const SITE = 'https://elaalwa.com';
const OUT = './docs';

const KURDISH_GOVS = ['erbil', 'sulaymaniyah', 'duhok', 'halabja'];
const GOV_NAMES_KU = {
  erbil: 'هەولێر',
  sulaymaniyah: 'سلێمانی',
  duhok: 'دهۆک',
  halabja: 'هەڵەبجە'
};

// 68 صورة — بأسماء إنجليزية بسيطة (بدون بادئة طويلة)
const CATEGORIES = [
  { f:'elaalwa-alwairaq-iraqi-ad-restaurants-01.webp',  slug:'restaurants',   ar:'مطاعم',           ku:'چێشتخانە' },
  { f:'elaalwa-alwairaq-iraqi-ad-cafes-01.webp',        slug:'cafes',         ar:'مقاهي',           ku:'قاوەخانە' },
  { f:'elaalwa-alwairaq-iraqi-ad-sweets-01.webp',       slug:'sweets',        ar:'حلويات',          ku:'شیرینی' },
  { f:'elaalwa-alwairaq-iraqi-ad-juices-01.webp',       slug:'juices',        ar:'عصائر',           ku:'شەربەت' },
  { f:'elaalwa-alwairaq-iraqi-ad-supermarkets-01.webp', slug:'supermarkets',  ar:'سوبرماركت',       ku:'سوپەرمارکێت' },
  { f:'elaalwa-alwairaq-iraqi-ad-pharmacies-01.webp',   slug:'pharmacies',    ar:'صيدليات',         ku:'دەرمانخانە' },
  { f:'elaalwa-alwairaq-iraqi-ad-clinics-01.webp',      slug:'clinics',       ar:'عيادات',          ku:'کلینیک' },
  { f:'elaalwa-alwairaq-iraqi-ad-hospitals-01.webp',    slug:'hospitals',     ar:'مستشفيات',        ku:'نەخۆشخانە' },
  { f:'elaalwa-alwairaq-iraqi-ad-labs-01.webp',         slug:'labs',          ar:'مختبرات',         ku:'تاقیگە' },
  { f:'elaalwa-alwairaq-iraqi-ad-institutes-01.webp',   slug:'institutes',    ar:'معاهد',           ku:'پەیمانگا' },
  { f:'elaalwa-alwairaq-iraqi-ad-universities-01.webp', slug:'universities',  ar:'جامعات',          ku:'زانکۆ' },
  { f:'elaalwa-alwairaq-iraqi-ad-schools-01.webp',      slug:'schools',       ar:'مدارس',           ku:'قوتابخانە' },
  { f:'elaalwa-alwairaq-iraqi-ad-kindergartens-01.webp',slug:'kindergartens', ar:'رياض أطفال',      ku:'باخچەی منداڵان' },
  { f:'elaalwa-alwairaq-iraqi-ad-real-estate-01.webp',  slug:'real-estate',   ar:'عقارات',          ku:'خانووبەرە' },
  { f:'elaalwa-alwairaq-iraqi-ad-cars-01.webp',         slug:'cars',          ar:'سيارات',          ku:'ئۆتۆمبێل' },
  { f:'elaalwa-alwairaq-iraqi-ad-furniture-01.webp',    slug:'furniture',     ar:'أثاث',            ku:'کەلوپەلی ماڵ' },
  { f:'elaalwa-alwairaq-iraqi-ad-fashion-01.webp',      slug:'fashion',       ar:'أزياء',           ku:'جلوبەرگ' },
  { f:'elaalwa-alwairaq-iraqi-ad-electronics-01.webp',  slug:'electronics',   ar:'إلكترونيات',      ku:'ئەلیکترۆنی' },
  { f:'elaalwa-alwairaq-iraqi-ad-mobiles-01.webp',      slug:'mobiles',       ar:'هواتف',           ku:'مۆبایل' },
  { f:'elaalwa-alwairaq-iraqi-ad-perfumes-01.webp',     slug:'perfumes',      ar:'عطورات',          ku:'بۆن' },
  { f:'elaalwa-alwairaq-iraqi-ad-cosmetics-01.webp',    slug:'cosmetics',     ar:'مستحضرات تجميل',  ku:'جوانکاری' },
  { f:'elaalwa-alwairaq-iraqi-ad-salons-01.webp',       slug:'salons',        ar:'صالونات',         ku:'سالۆن' },
  { f:'elaalwa-alwairaq-iraqi-ad-barbers-01.webp',      slug:'barbers',       ar:'حلاقين',          ku:'سەرتاش' },
  { f:'elaalwa-alwairaq-iraqi-ad-home-services-01.webp',slug:'home-services', ar:'خدمات منزلية',    ku:'خزمەتگوزاری ماڵ' },
  { f:'elaalwa-alwairaq-iraqi-ad-moving-01.webp',       slug:'moving',        ar:'نقل عفش',         ku:'گواستنەوە' },
  { f:'elaalwa-alwairaq-iraqi-ad-delivery-01.webp',     slug:'delivery',      ar:'توصيل',           ku:'گەیاندن' },
  { f:'elaalwa-alwairaq-iraqi-ad-events-01.webp',       slug:'events',        ar:'مناسبات',         ku:'ئاهەنگ' },
  { f:'elaalwa-alwairaq-iraqi-ad-wedding-halls-01.webp',slug:'wedding-halls', ar:'قاعات أعراس',     ku:'هۆڵی زەماوەند' },
  { f:'elaalwa-alwairaq-iraqi-ad-travel-01.webp',       slug:'travel',        ar:'سفر وسياحة',      ku:'گەشتوگوزار' },
  { f:'elaalwa-alwairaq-iraqi-ad-hajj-umrah-01.webp',   slug:'hajj-umrah',    ar:'حج وعمرة',        ku:'حەج و عومرە' },
  { f:'elaalwa-alwairaq-iraqi-ad-hotels-01.webp',       slug:'hotels',        ar:'فنادق',           ku:'هۆتێل' },
  { f:'elaalwa-alwairaq-iraqi-ad-banking-01.webp',      slug:'banking',       ar:'مصارف',           ku:'بانک' },
  { f:'elaalwa-alwairaq-iraqi-ad-e-wallets-01.webp',    slug:'e-wallets',     ar:'محافظ إلكترونية', ku:'جزدانی ئەلیکترۆنی' },
  { f:'elaalwa-alwairaq-iraqi-ad-telecom-01.webp',      slug:'telecom',       ar:'اتصالات',         ku:'پەیوەندی' },
  { f:'elaalwa-alwairaq-iraqi-ad-internet-01.webp',     slug:'internet',      ar:'إنترنت',          ku:'ئینتەرنێت' },
  { f:'elaalwa-alwairaq-iraqi-ad-generators-01.webp',   slug:'generators',    ar:'مولدات',          ku:'مۆلیدە' },
  { f:'elaalwa-alwairaq-iraqi-ad-solar-01.webp',        slug:'solar',         ar:'طاقة شمسية',      ku:'وزەی خۆر' },
  { f:'elaalwa-alwairaq-iraqi-ad-construction-01.webp', slug:'construction',  ar:'إنشاءات',         ku:'بیناسازی' },
  { f:'elaalwa-alwairaq-iraqi-ad-decor-01.webp',        slug:'decor',         ar:'ديكور',           ku:'دیکۆر' },
  { f:'elaalwa-alwairaq-iraqi-ad-legal-01.webp',        slug:'legal',         ar:'خدمات قانونية',   ku:'خزمەتی یاسایی' },
  { f:'elaalwa-alwairaq-iraqi-ad-accounting-01.webp',   slug:'accounting',    ar:'محاسبة',          ku:'ژمێریاری' },
  { f:'elaalwa-alwairaq-iraqi-ad-jobs-01.webp',         slug:'jobs',          ar:'وظائف',           ku:'کار' },
  { f:'elaalwa-alwairaq-iraqi-ad-insurance-01.webp',    slug:'insurance',     ar:'تأمين',           ku:'دڵنیایی' },
  { f:'elaalwa-alwairaq-iraqi-ad-agriculture-01.webp',  slug:'agriculture',   ar:'زراعة',           ku:'کشتوکاڵ' },
  { f:'elaalwa-alwairaq-iraqi-ad-vet-01.webp',          slug:'vet',           ar:'طب بيطري',        ku:'پزیشکی ئاژەڵ' },
  { f:'elaalwa-alwairaq-iraqi-ad-pets-01.webp',         slug:'pets',          ar:'حيوانات أليفة',   ku:'ئاژەڵی ماڵ' },
  { f:'elaalwa-alwairaq-iraqi-ad-sports-01.webp',       slug:'sports',        ar:'رياضة',           ku:'وەرزش' },
  { f:'elaalwa-alwairaq-iraqi-ad-gyms-01.webp',         slug:'gyms',          ar:'صالات رياضية',    ku:'هۆڵی وەرزش' },
  { f:'elaalwa-alwairaq-iraqi-ad-photography-01.webp',  slug:'photography',   ar:'تصوير',           ku:'وێنەگرتن' },
  { f:'elaalwa-alwairaq-iraqi-ad-printing-01.webp',     slug:'printing',      ar:'طباعة',           ku:'چاپ' },
  { f:'elaalwa-alwairaq-iraqi-ad-gifts-01.webp',        slug:'gifts',         ar:'هدايا',           ku:'دیاری' },
  { f:'elaalwa-alwairaq-iraqi-ad-flowers-01.webp',      slug:'flowers',       ar:'زهور',            ku:'گوڵ' },
  { f:'elaalwa-alwairaq-iraqi-ad-baby-01.webp',         slug:'baby',          ar:'مستلزمات أطفال',  ku:'کەلوپەلی منداڵ' },
  { f:'elaalwa-alwairaq-iraqi-ad-water-01.webp',        slug:'water',         ar:'مياه',            ku:'ئاو' },
  { f:'elaalwa-alwairaq-iraqi-ad-food-beverages-01.webp',slug:'food-beverages',ar:'أغذية ومشروبات',  ku:'خواردن' },
  { f:'elaalwa-alwairaq-iraqi-ad-home-appliances-01.webp',slug:'home-appliances',ar:'أجهزة منزلية',  ku:'ئامێری ماڵ' },
  { f:'elaalwa-alwairaq-iraqi-ad-electrical-01.webp',   slug:'electrical',    ar:'كهربائيات',       ku:'کارەبا' },
  { f:'elaalwa-alwairaq-iraqi-ad-sanitary-01.webp',     slug:'sanitary',      ar:'أدوات صحية',      ku:'کەلوپەلی تەندروستی' },
  { f:'elaalwa-alwairaq-iraqi-ad-kitchens-01.webp',     slug:'kitchens',      ar:'مطابخ',           ku:'چێشتخانە' },
  { f:'elaalwa-alwairaq-iraqi-ad-aluminum-01.webp',     slug:'aluminum',      ar:'ألمنيوم',         ku:'ئەلەمنیۆم' },
  { f:'elaalwa-alwairaq-iraqi-ad-glass-01.webp',        slug:'glass',         ar:'زجاج',            ku:'شووشە' },
  { f:'elaalwa-alwairaq-iraqi-ad-blacksmith-01.webp',   slug:'blacksmith',    ar:'حدادة',           ku:'ئاسنگەری' },
  { f:'elaalwa-alwairaq-iraqi-ad-carpentry-01.webp',    slug:'carpentry',     ar:'نجارة',           ku:'دارتاشی' },
  { f:'elaalwa-alwairaq-iraqi-ad-painting-01.webp',     slug:'painting',      ar:'صباغة',           ku:'بۆیاخ' },
  { f:'elaalwa-alwairaq-iraqi-ad-hvac-01.webp',         slug:'hvac',          ar:'تكييف وتدفئة',    ku:'ساردکەرەوە' },
  { f:'elaalwa-alwairaq-iraqi-ad-cctv-01.webp',         slug:'cctv',          ar:'كاميرات مراقبة',  ku:'کامێرای چاودێری' },
  { f:'elaalwa-alwairaq-iraqi-ad-security-01.webp',     slug:'security',      ar:'أمن وحماية',      ku:'پاراستن' },
  { f:'elaalwa-alwairaq-iraqi-ad-cleaning-01.webp',     slug:'cleaning',      ar:'تنظيف',           ku:'پاککردنەوە' },
  { f:'elaalwa-alwairaq-iraqi-ad-companies-01.webp',    slug:'companies',     ar:'شركات',           ku:'کۆمپانیا' },
  { f:'elaalwa-alwairaq-iraqi-ad-tailoring-01.webp',    slug:'tailoring',     ar:'خياطة',           ku:'دەرزی' }
];

/* ============ كلمات ============ */
const AR_INTROS = [
  (a,g)=>`اكتشف أفضل الخدمات في <strong>${a}</strong>، محافظة <strong>${g}</strong>، عبر منصة إيلا علوة. منصة إعلانية عراقية تُعرض لكل منطقة إعلان واحد حصري لمدة 24 ساعة.`,
  (a,g)=>`أعلن عن مشروعك في <strong>${a}</strong> بمحافظة <strong>${g}</strong> واحصل على ظهور حصري لمدة 24 ساعة كاملة. منصة إيلا علوة تربط أصحاب المشاريع بسكان المنطقة مباشرة.`,
  (a,g)=>`تبحث عن خدمات في <strong>${a}</strong>؟ منصة إيلا علوة تعرض أفضل الإعلانات في منطقتك، وتتيح لأصحاب المشاريع حجز إعلان حصري يومي.`,
  (a,g)=>`<strong>${a}</strong> — منصة إيلا علوة تعرض أفضل الخدمات والمشاريع في منطقتك، وتتيح حجز إعلانك اليومي للوصول لجمهور مستهدف.`,
  (a,g)=>`مع إيلا علوة، الإعلان عن مشروعك في <strong>${a}</strong> أسهل من أي وقت. إعلان واحد لكل منطقة لمدة 24 ساعة — فرصتك للظهور للجميع.`,
  (a,g)=>`اكتشف أفضل الخدمات في <strong>${a}</strong> محافظة <strong>${g}</strong>، أو أعلن عن مشروعك حصرياً على منصة إيلا علوة لمدة 24 ساعة.`,
];

const KU_INTROS = [
  (a,g)=>`باشترین خزمەتگوزاری لە <strong>${a}</strong>، پارێزگای <strong>${g}</strong> بدۆزەرەوە بە پلاتفۆرمی ئێلا عەلوە.`,
  (a,g)=>`لە <strong>${a}</strong> پارێزگای <strong>${g}</strong> ڕیکلام بکە و بۆ 24 کاتژمێری تەواو دەرکەوتنی تایبەت بەدەست بهێنە.`,
  (a,g)=>`بەدوای خزمەتگوزاریدا دەگەڕێیت لە <strong>${a}</strong>؟ ئێلا عەلوە باشترین ڕیکلامەکان پیشان دەدات.`,
  (a,g)=>`بە ئێلا عەلوە، ڕیکلامکردن لە <strong>${a}</strong> ئاسانترە لە هەر کاتێک. یەک ڕیکلام بۆ هەر ناوچەیەک بۆ 24 کاتژمێر.`,
  (a,g)=>`<strong>${a}</strong> — ئێلا عەلوە باشترین خزمەتگوزاری و پڕۆژەکان پیشان دەدات.`,
];

const EXTRA_AR = [
  'إعلان واحد فقط لكل منطقة — بدون منافسة',
  'مدة العرض 24 ساعة كاملة',
  'استهداف دقيق لسكان المنطقة',
  'الوصول لجمهور محلي حقيقي',
  'رفع صورة عالية الجودة مع وصف',
  'ظهور فوري بدون انتظار',
  'إمكانية الإعلان عن أي مشروع',
  'سعر رمزي لجميع الفئات',
  'دعم فني عبر الواتساب',
  'نتائج فورية خلال ساعات'
];

const EXTRA_KU = [
  'تەنها یەک ڕیکلام بۆ هەر ناوچەیەک',
  'ماوەی پیشاندان 24 کاتژمێری تەواو',
  'ئاراستەی ورد بۆ دانیشتووان',
  'گەیشتن بە بینەری ڕاستەقینە',
  'بارکردنی وێنەی کوالیتی بەرز',
  'دەرکەوتنی دەستبەجێ',
  'توانای ڕیکلامکردن بۆ هەر پڕۆژەیەک',
  'نرخی هەرزان',
  'پشتگیری 24/7',
  'ئەنجامی دەستبەجێ'
];

/* ============ دوال ============ */
function hash(s){let h=0;for(let i=0;i<s.length;i++){h=((h<<5)-h+s.charCodeAt(i))|0;}return Math.abs(h);}
function pickN(seed,n,total){const h=hash(seed);const out=new Set();let i=0;while(out.size<n&&i<total*4){out.add((h+i*7)%total);i++;}return[...out].slice(0,n);}
function pickCats(seed,n=9){return pickN(seed,n,CATEGORIES.length).map(i=>CATEGORIES[i]);}
function pickOne(seed,arr){return arr[hash(seed)%arr.length];}
function nearbyAreas(gov,currentSlug,n=5){const others=gov.a.filter(a=>a.s!==currentSlug);if(!others.length)return[];return pickN(currentSlug+gov.g,n,others.length).map(i=>others[i]);}

/* ============ CSS محدّث — الصور الطويلة 1080×2401 ============ */
const CSS = `<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Cairo',system-ui,sans-serif;background:#fff;color:#1c1f26;line-height:1.75}
.wrap{max-width:900px;margin:0 auto;padding:20px}
header{background:#04722b;color:#fff;padding:14px 0;margin-bottom:24px}
header .wrap{display:flex;gap:12px;align-items:center;padding:0 20px;flex-wrap:wrap}
header a{color:#fff;text-decoration:none;font-weight:600}
h1{color:#04722b;font-size:1.9rem;margin-bottom:12px}
h2{color:#035a22;font-size:1.3rem;margin:28px 0 12px}
h3{color:#035a22;font-size:1.1rem;margin:18px 0 8px}
p{margin-bottom:14px;color:#4b5160}
ul{margin:12px 0 20px 20px;color:#4b5160}
li{padding:4px 0}
a{color:#04722b}
.cta{display:inline-block;background:#ff6600;color:#fff;padding:14px 28px;border-radius:6px;font-weight:700;text-decoration:none;margin:20px 0}
.cta:hover{background:#cc5200}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;margin:20px 0}
.card{background:#f6fbf7;border:1px solid #e2efe5;border-radius:12px;overflow:hidden;text-align:center;padding-bottom:12px;transition:transform .2s,box-shadow .2s}
.card:hover{transform:translateY(-3px);box-shadow:0 8px 20px rgba(4,114,43,.15)}
.card img{width:100%;height:auto;aspect-ratio:1080/2401;object-fit:cover;display:block;background:#eaf3ec}
.card .name{font-weight:700;color:#04722b;margin:10px 6px 4px;font-size:1rem}
.card .note{font-size:.72rem;color:#888;padding:0 6px}
.steps{background:#f6fbf7;border:1px solid #e2efe5;border-radius:10px;padding:20px;margin:20px 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
.step{text-align:center}
.step .num{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#04722b;color:#fff;border-radius:50%;font-weight:700;margin-bottom:10px}
.step h4{color:#035a22;font-size:1rem;margin-bottom:6px}
.step p{font-size:.87rem;color:#4b5160;margin:0}
.nearby-list{background:#fff8f0;border:1px solid #ffe2cc;border-radius:10px;padding:16px 20px;margin:16px 0}
.nearby-list li{color:#8a4a00}
footer{background:#023d17;color:#fff;text-align:center;padding:24px;margin-top:48px}
footer a{color:#f1c548}
.contact{background:#f6fbf7;border:1px solid #e2efe5;border-radius:10px;padding:16px 20px;margin:20px 0}
.contact a{display:inline-block;margin:4px 10px 4px 0;font-weight:600}
@media(max-width:480px){
  .grid{grid-template-columns:repeat(2,1fr);gap:10px}
  h1{font-size:23px}
  h2{font-size:18px}
  .card .name{font-size:.9rem}
}
</style>`;

function card(p,name,gov,isFirst){
  const load = isFirst ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
  const alt = `${p.ar} في ${name} ${gov} - إعلان حصري 24 ساعة على إيلا علوة`;
  return `<div class="card">
  <img src="/${p.f}" alt="${alt}" title="${p.ar} في ${name}" ${load} width="1080" height="2401" decoding="async">
  <div class="name">${p.ar}</div>
  <div class="note">إعلان حصري 24 ساعة</div>
</div>`;
}
function cardKu(p,name,gov,isFirst){
  const load = isFirst ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
  const alt = `${p.ku} لە ${name} ${gov} - ڕیکلامی تایبەت 24 کاتژمێر لە ئێلا عەلوە`;
  return `<div class="card">
  <img src="/${p.f}" alt="${alt}" title="${p.ku} لە ${name}" ${load} width="1080" height="2401" decoding="async">
  <div class="name">${p.ku}</div>
  <div class="note">ڕیکلامی تایبەت 24 کاتژمێر</div>
</div>`;
}

function makePage(gov,area){
  const seed=`${gov.g}/${area.s}`;
  const hasKu=KURDISH_GOVS.includes(gov.g);
  const kuLink=hasKu?`<link rel="alternate" hreflang="ckb" href="${SITE}/ckb/iraq/${gov.g}/${area.s}/">`:'';
  const cats=pickCats(seed,9);
  const heroCat=cats[0];
  const intro=pickOne(seed+'-intro',AR_INTROS)(area.n,gov.ga);
  const extraService=pickOne(seed+'-svc',EXTRA_AR);
  const gridHtml=cats.map((c,i)=>card(c,area.n,gov.ga,i===0)).join('\n');
  const nearby=nearbyAreas(gov,area.s,5);
  const nearbyHtml=nearby.map(a=>`<li><a href="/iraq/${gov.g}/${a.s}/">إعلانات ${a.n}</a></li>`).join('');

  /* Schema معرض الصور */
  const imageGallerySchema = JSON.stringify({
    "@context":"https://schema.org",
    "@type":"ImageGallery",
    "name":`صور إعلانات ${area.n} - ${gov.ga}`,
    "description":`مجموعة صور الفئات الإعلانية المتاحة في ${area.n}`,
    "image": cats.map(c => ({
      "@type":"ImageObject",
      "url":`${SITE}/${c.f}`,
      "name":`${c.ar} في ${area.n}`,
      "description":`إعلان ${c.ar} حصري 24 ساعة في ${area.n}`,
      "width":1080,
      "height":2401,
      "caption":`${c.ar} - ${area.n} - إيلا علوة`
    }))
  });

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>إعلانات ${area.n} | أعلن حصرياً لمدة 24 ساعة — إيلا علوة</title>
<meta name="description" content="أعلن عن مشروعك في ${area.n}، ${gov.ga}، عبر منصة إيلا علوة. إعلان حصري واحد لكل منطقة لمدة 24 ساعة كاملة. ${nearby.slice(0,3).map(a=>a.n).join('، ')} أيضاً.">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${SITE}/iraq/${gov.g}/${area.s}/">
<link rel="alternate" hreflang="ar" href="${SITE}/iraq/${gov.g}/${area.s}/">
${kuLink}
<link rel="alternate" hreflang="x-default" href="${SITE}/iraq/${gov.g}/${area.s}/">
<link rel="icon" type="image/png" href="/elaalwa-favicon.png">
<meta property="og:type" content="website">
<meta property="og:title" content="إعلانات ${area.n} — إيلا علوة">
<meta property="og:description" content="أعلن حصرياً في ${area.n} لمدة 24 ساعة.">
<meta property="og:image" content="${SITE}/${heroCat.f}">
<meta property="og:image:width" content="1080">
<meta property="og:image:height" content="2401">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebPage","name":"إعلانات ${area.n} — إيلا علوة","description":"منصة إعلانية لعرض الإعلانات في ${area.n}، ${gov.ga}. إعلان حصري واحد لكل منطقة لمدة 24 ساعة.","url":"${SITE}/iraq/${gov.g}/${area.s}/","inLanguage":"ar","isPartOf":{"@type":"WebSite","name":"إيلا علوة","url":"${SITE}/"},"publisher":{"@type":"Organization","name":"إيلا علوة","url":"${SITE}/"},"primaryImageOfPage":{"@type":"ImageObject","url":"${SITE}/${heroCat.f}","width":1080,"height":2401},"about":{"@type":"Place","name":"${area.n}، ${gov.ga}، العراق"}}
</script>
<script type="application/ld+json">
${imageGallerySchema}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"الرئيسية","item":"${SITE}/"},{"@type":"ListItem","position":2,"name":"${gov.ga}","item":"${SITE}/iraq/${gov.g}/"},{"@type":"ListItem","position":3,"name":"${area.n}","item":"${SITE}/iraq/${gov.g}/${area.s}/"}]}
</script>
${CSS}
</head>
<body>
<header><div class="wrap"><a href="/">إيلا علوة</a><span>›</span><a href="/iraq/${gov.g}/">${gov.ga}</a><span>›</span><span>${area.n}</span></div></header>
<main class="wrap">
<h1>إعلانات ${area.n} — أعلن حصرياً 24 ساعة</h1>
<p>${intro}</p>
<a class="cta" href="/">احجز إعلانك في ${area.n} الآن</a>

<h2>كيف تعمل منصة إيلا علوة في ${area.n}؟</h2>
<div class="steps">
<div class="step"><div class="num">1</div><h4>اختر منطقتك</h4><p>حدد ${area.n} كمنطقة إعلانك المستهدفة.</p></div>
<div class="step"><div class="num">2</div><h4>ارفع إعلانك</h4><p>صورة + وصف + رابط + بريدك للتواصل.</p></div>
<div class="step"><div class="num">3</div><h4>احصل على 24 ساعة حصرية</h4><p>إعلانك يظهر لكل سكان ${area.n} بدون منافسة.</p></div>
</div>

<h2>الفئات المدعومة في ${area.n}</h2>
<div class="grid">
${gridHtml}
</div>

<h2>مزايا الإعلان في ${area.n}</h2>
<ul>
<li>إعلان واحد فقط لكل منطقة — بدون منافسة في ${area.n}</li>
<li>مدة العرض 24 ساعة كاملة من وقت النشر</li>
<li>ظهور لجميع سكان ${area.n} أثناء البحث</li>
<li>رفع صورة عالية الجودة مع وصف ورابط</li>
<li>${extraService}</li>
</ul>

<h2>تواصل معنا</h2>
<div class="contact">
<p>فريق إيلا علوة جاهز لمساعدتك:</p>
<a href="https://wa.me/9647813130254" target="_blank" rel="noopener">💬 واتساب</a>
<a href="mailto:alwairaqe@gmail.com">✉️ alwairaqe@gmail.com</a>
</div>

<h2>مناطق قريبة من ${area.n}</h2>
<ul class="nearby-list">${nearbyHtml}</ul>

<h2>أسئلة شائعة</h2>
<h3>كيف أعلن في ${area.n}؟</h3>
<p>افتح منصة إيلا علوة، اختر ${area.n}، ارفع صورة إعلانك، اكتب وصفاً ورابطاً، ثم أرسل الطلب. سيظهر إعلانك حصرياً لمدة 24 ساعة.</p>
<h3>كم تستمر مدة الإعلان في ${area.n}؟</h3>
<p>24 ساعة كاملة من وقت النشر، وخلالها لا يظهر أي إعلان آخر في نفس المنطقة.</p>

<h2>تصفح مناطق ${gov.ga}</h2>
<p><a href="/iraq/${gov.g}/">جميع مناطق ${gov.ga} (${gov.a.length} منطقة) ←</a></p>
</main>
<footer><p>© 2026 إيلا علوة — منصة الإعلانات العراقية</p><p><a href="/">الرئيسية</a></p></footer>
</body>
</html>`;
}

function makeKuPage(gov,area,govNameKu){
  const seed=`${gov.g}/${area.s}`;
  const cats=pickCats(seed,9);
  const heroCat=cats[0];
  const intro=pickOne(seed+'-intro',KU_INTROS)(area.n,govNameKu);
  const extraService=pickOne(seed+'-svc',EXTRA_KU);
  const gridHtml=cats.map((c,i)=>cardKu(c,area.n,govNameKu,i===0)).join('\n');
  const nearby=nearbyAreas(gov,area.s,5);
  const nearbyHtml=nearby.map(a=>`<li><a href="/ckb/iraq/${gov.g}/${a.s}/">ڕیکلام لە ${a.n}</a></li>`).join('');

  const imageGallerySchema = JSON.stringify({
    "@context":"https://schema.org",
    "@type":"ImageGallery",
    "name":`وێنەکانی ڕیکلام لە ${area.n} - ${govNameKu}`,
    "image": cats.map(c => ({
      "@type":"ImageObject",
      "url":`${SITE}/${c.f}`,
      "name":`${c.ku} لە ${area.n}`,
      "description":`ڕیکلامی ${c.ku} لە ${area.n}`,
      "width":1080,
      "height":2401,
      "caption":`${c.ku} - ${area.n} - ئێلا عەلوە`
    }))
  });

  return `<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ڕیکلامەکان لە ${area.n} | ڕیکلامی تایبەت 24 کاتژمێر — ئێلا عەلوە</title>
<meta name="description" content="ڕیکلام لە پڕۆژەکەت بکە لە ${area.n}، پارێزگای ${govNameKu}، بە پلاتفۆرمی ئێلا عەلوە. یەک ڕیکلامی تایبەت بۆ هەر ناوچەیەک بۆ 24 کاتژمێر.">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${SITE}/ckb/iraq/${gov.g}/${area.s}/">
<link rel="alternate" hreflang="ar" href="${SITE}/iraq/${gov.g}/${area.s}/">
<link rel="alternate" hreflang="ckb" href="${SITE}/ckb/iraq/${gov.g}/${area.s}/">
<link rel="icon" type="image/png" href="/elaalwa-favicon.png">
<meta property="og:type" content="website">
<meta property="og:image" content="${SITE}/${heroCat.f}">
<meta property="og:image:width" content="1080">
<meta property="og:image:height" content="2401">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebPage","name":"ڕیکلامەکان لە ${area.n} — ئێلا عەلوە","description":"پلاتفۆرمی ڕیکلامی لە ${area.n}، ${govNameKu}.","url":"${SITE}/ckb/iraq/${gov.g}/${area.s}/","inLanguage":"ckb","isPartOf":{"@type":"WebSite","name":"ئێلا عەلوە","url":"${SITE}/"},"primaryImageOfPage":{"@type":"ImageObject","url":"${SITE}/${heroCat.f}","width":1080,"height":2401},"about":{"@type":"Place","name":"${area.n}، ${govNameKu}، عێراق"}}
</script>
<script type="application/ld+json">
${imageGallerySchema}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"سەرەکی","item":"${SITE}/"},{"@type":"ListItem","position":2,"name":"${govNameKu}","item":"${SITE}/ckb/iraq/${gov.g}/"},{"@type":"ListItem","position":3,"name":"${area.n}","item":"${SITE}/ckb/iraq/${gov.g}/${area.s}/"}]}
</script>
${CSS}
</head>
<body>
<header><div class="wrap"><a href="/">ئێلا عەلوە</a><span>›</span><a href="/ckb/iraq/${gov.g}/">${govNameKu}</a><span>›</span><span>${area.n}</span></div></header>
<main class="wrap">
<h1>ڕیکلامەکان لە ${area.n} — ڕیکلامی تایبەت 24 کاتژمێر</h1>
<p>${intro}</p>
<a class="cta" href="/">ڕیکلامەکەت لە ${area.n} داوا بکە ئێستا</a>

<h2>پلاتفۆرمی ئێلا عەلوە لە ${area.n} چۆن کار دەکات؟</h2>
<div class="steps">
<div class="step"><div class="num">1</div><h4>ناوچەکەت هەڵبژێرە</h4><p>${area.n} وەک ناوچەی ئاراستەکراو دیاری بکە.</p></div>
<div class="step"><div class="num">2</div><h4>ڕیکلامەکەت بار بکە</h4><p>وێنە + وەسف + لینک + ئیمەیڵ.</p></div>
<div class="step"><div class="num">3</div><h4>24 کاتژمێری تایبەت</h4><p>ڕیکلامەکەت بۆ هەموو دانیشتووانی ${area.n} دەردەکەوێت.</p></div>
</div>

<h2>پۆلە پشتگیریکراوەکان</h2>
<div class="grid">
${gridHtml}
</div>

<h2>باشییەکانی ڕیکلامکردن لە ${area.n}</h2>
<ul>
<li>تەنها یەک ڕیکلام بۆ هەر ناوچەیەک — بێ ڕکابەری</li>
<li>ماوەی پیشاندان 24 کاتژمێری تەواو</li>
<li>دەرکەوتن بۆ هەموو دانیشتووانی ${area.n}</li>
<li>بارکردنی وێنەی کوالیتی بەرز</li>
<li>${extraService}</li>
</ul>

<h2>پەیوەندیمان پێوە بکە</h2>
<div class="contact">
<p>تیمی ئێلا عەلوە ئامادەیە یارمەتیت بدات:</p>
<a href="https://wa.me/9647813130254" target="_blank" rel="noopener">💬 واتساپ</a>
<a href="mailto:alwairaqe@gmail.com">✉️ alwairaqe@gmail.com</a>
</div>

<h2>ناوچەکانی نزیک لە ${area.n}</h2>
<ul class="nearby-list">${nearbyHtml}</ul>

<h2>پرسیارە باوەکان</h2>
<h3>چۆن لە ${area.n} ڕیکلام بکەم؟</h3>
<p>پلاتفۆرمی ئێلا عەلوە بکەرەوە، ${area.n} هەڵبژێرە، وێنەکەت بار بکە، وەسف و لینک بنووسە، پاشان داواکاریەکەت بنێرە.</p>
<h3>ماوەی ڕیکلام چەندە؟</h3>
<p>24 کاتژمێری تەواو لە کاتی بڵاوکردنەوە.</p>

<h2>ناوچەکانی ${govNameKu}</h2>
<p><a href="/ckb/iraq/${gov.g}/">هەموو ناوچەکانی ${govNameKu} (${gov.a.length} ناوچە) ←</a></p>
</main>
<footer><p>© 2026 ئێلا عەلوە</p><p><a href="/">سەرەکی</a></p></footer>
</body>
</html>`;
}

function makeGovPage(gov){
  const list=gov.a.map(a=>`<li><a href="/iraq/${gov.g}/${a.s}/">إعلانات ${a.n}</a></li>`).join('\n');
  const hasKu=KURDISH_GOVS.includes(gov.g);
  const kuLink=hasKu?`<link rel="alternate" hreflang="ckb" href="${SITE}/ckb/iraq/${gov.g}/">`:'';
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>إعلانات ${gov.ga} | أعلن حصرياً — إيلا علوة</title>
<meta name="description" content="أعلن في محافظة ${gov.ga} عبر منصة إيلا علوة. تصفح ${gov.a.length} منطقة واحجز إعلانك الحصري 24 ساعة.">
<link rel="canonical" href="${SITE}/iraq/${gov.g}/">
<link rel="alternate" hreflang="ar" href="${SITE}/iraq/${gov.g}/">
${kuLink}
<link rel="icon" type="image/png" href="/elaalwa-favicon.png">
${CSS}
</head>
<body>
<header><div class="wrap"><a href="/">إيلا علوة</a><span>›</span><span>${gov.ga}</span></div></header>
<main class="wrap">
<h1>إعلانات محافظة ${gov.ga}</h1>
<p>تصفح جميع مناطق ${gov.ga} (${gov.a.length} منطقة) واحجز إعلانك الحصري لمدة 24 ساعة.</p>
<h2>جميع مناطق ${gov.ga}</h2>
<ul style="columns:2;list-style:none;padding:0">${list}</ul>
<p style="margin-top:20px"><a href="/">← الرئيسية</a></p>
</main>
<footer><p>© 2026 إيلا علوة</p></footer>
</body></html>`;
}

function makeKuGovPage(gov,govNameKu){
  const list=gov.a.map(a=>`<li><a href="/ckb/iraq/${gov.g}/${a.s}/">ڕیکلام لە ${a.n}</a></li>`).join('\n');
  return `<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ڕیکلامەکان لە ${govNameKu} | ئێلا عەلوە</title>
<meta name="description" content="ڕیکلام بکە لە ${govNameKu} بە ئێلا عەلوە. ${gov.a.length} ناوچە بگەڕێ.">
<link rel="canonical" href="${SITE}/ckb/iraq/${gov.g}/">
<link rel="alternate" hreflang="ar" href="${SITE}/iraq/${gov.g}/">
<link rel="alternate" hreflang="ckb" href="${SITE}/ckb/iraq/${gov.g}/">
<link rel="icon" type="image/png" href="/elaalwa-favicon.png">
${CSS}
</head>
<body>
<header><div class="wrap"><a href="/">ئێلا عەلوە</a><span>›</span><span>${govNameKu}</span></div></header>
<main class="wrap">
<h1>ڕیکلامەکان لە ${govNameKu}</h1>
<p>هەموو ناوچەکانی ${govNameKu} (${gov.a.length} ناوچە) بگەڕێ.</p>
<h2>هەموو ناوچەکان</h2>
<ul style="columns:2;list-style:none;padding:0">${list}</ul>
<p style="margin-top:20px"><a href="/">← سەرەکی</a></p>
</main>
<footer><p>© 2026 ئێلا عەلوە</p></footer>
</body></html>`;
}

/* ============ التوليد ============ */
if(fs.existsSync(OUT+'/iraq'))fs.rmSync(OUT+'/iraq',{recursive:true});
if(fs.existsSync(OUT+'/ckb'))fs.rmSync(OUT+'/ckb',{recursive:true});

let arCount=0,kuCount=0;

regions.forEach(gov=>{
  const govDir=path.join(OUT,'iraq',gov.g);
  fs.mkdirSync(govDir,{recursive:true});
  fs.writeFileSync(path.join(govDir,'index.html'),makeGovPage(gov));

  gov.a.forEach(area=>{
    const d=path.join(govDir,area.s);
    fs.mkdirSync(d,{recursive:true});
    fs.writeFileSync(path.join(d,'index.html'),makePage(gov,area));
    arCount++;
  });

  if(KURDISH_GOVS.includes(gov.g)){
    const govNameKu=GOV_NAMES_KU[gov.g];
    const kuDir=path.join(OUT,'ckb','iraq',gov.g);
    fs.mkdirSync(kuDir,{recursive:true});
    fs.writeFileSync(path.join(kuDir,'index.html'),makeKuGovPage(gov,govNameKu));
    gov.a.forEach(area=>{
      const d=path.join(kuDir,area.s);
      fs.mkdirSync(d,{recursive:true});
      fs.writeFileSync(path.join(d,'index.html'),makeKuPage(gov,area,govNameKu));
      kuCount++;
    });
  }
});

console.log(`✅ ${arCount} صفحة منطقة عربية + ${regions.length} صفحة محافظة`);
console.log(`✅ ${kuCount} صفحة منطقة كردية + ${KURDISH_GOVS.length} صفحة محافظة`);
console.log(`📂 في: ${OUT}/iraq/ و ${OUT}/ckb/`);
