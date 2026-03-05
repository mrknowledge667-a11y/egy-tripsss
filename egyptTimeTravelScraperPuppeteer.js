import puppeteer from 'puppeteer';
import fs from 'fs/promises';

/**
 * Puppeteer-based scraper for https://egypttimetravel.com/
 * Works even with Cloudflare or timeout blocks by simulating real browser activity.
 * Extracts title, price, image, description, and link for each trip.
 * Groups data by category and saves to scraper/trips.json
 */

const BASE_URL = 'https://egypttimetravel.com';
const OUTPUT_PATH = './trips.json';
const categories = [
  { name: 'Day Tours', slug: 'day-tours' },
  { name: 'Nile Cruises', slug: 'nile-cruises' },
  { name: 'Shore Excursions', slug: 'shore-excursions' },
];

async function scrapeCategory(page, category) {
  const url = `${BASE_URL}/${category.slug}`;
  console.log(`🧭 Visiting ${url}`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
  await page.waitForSelector('body');

  const trips = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('.tour-item').forEach((el) => {
      const title = el.querySelector('.tour-title a')?.innerText.trim() || '';
      const link = el.querySelector('.tour-title a')?.href || '';
      const img = el.querySelector('img')?.src || '';
      const price = el.querySelector('.tour-price')?.innerText.trim() || '';
      const shortDesc = el.querySelector('.tour-excerpt')?.innerText.trim() || '';

      if (title && link && img) {
        items.push({ title, link, image: img, price, shortDesc });
      }
    });
    return items;
  });

  const filtered = trips.filter((t) => t.link.includes('egypttimetravel.com'));
  return filtered.map((t) => ({
    ...t,
    category: category.name,
  }));
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(120000);
  page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36'
  );

  const results = [];
  for (const category of categories) {
    try {
      const trips = await scrapeCategory(page, category);
      console.log(`📦 ${category.name}: ${trips.length} trips`);
      results.push(...trips);
    } catch (e) {
      console.error(`❌ Failed ${category.name}:`, e.message);
    }
  }

  const grouped = categories.reduce((acc, cat) => {
    acc[cat.name] = results.filter((t) => t.category === cat.name);
    return acc;
  }, {});

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(grouped, null, 2), 'utf-8');
  console.log(`✅ Total trips saved: ${results.length}`);
  await browser.close();
}

main().catch((err) => {
  console.error('Fatal scraping error:', err);
});