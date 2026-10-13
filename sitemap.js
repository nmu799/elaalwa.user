const fs = require('fs');
const path = require('path');
const regions = require('./regions.json');

const SITE = 'https://elaalwa.com';
const today = new Date().toISOString().split('T')[0];
const KURDISH_GOVS = ['erbil', 'sulaymaniyah', 'duhok', 'halabja'];

const urls = [{ loc:`${SITE}/`, cf:'daily', p:'1.0' }];

regions.forEach(gov => {
  urls.push({ loc:`${SITE}/iraq/${gov.g}/`, cf:'daily', p:'0.9' });
  gov.a.forEach(a => {
    urls.push({ loc:`${SITE}/iraq/${gov.g}/${a.s}/`, cf:'weekly', p:'0.8' });
  });
  if (KURDISH_GOVS.includes(gov.g)) {
    urls.push({ loc:`${SITE}/ckb/iraq/${gov.g}/`, cf:'daily', p:'0.9' });
    gov.a.forEach(a => {
      urls.push({ loc:`${SITE}/ckb/iraq/${gov.g}/${a.s}/`, cf:'weekly', p:'0.8' });
    });
  }
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.cf}</changefreq>
    <priority>${u.p}</priority>
  </url>`).join('\n')}
</urlset>`;

if (!fs.existsSync('./docs')) fs.mkdirSync('./docs');
fs.writeFileSync('./docs/sitemap.xml', xml);
console.log(`✅ sitemap.xml: ${urls.length} رابط`);
