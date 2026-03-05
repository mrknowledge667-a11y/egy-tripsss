import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';

/**
 * Scraper for https://egypttimetravel.com/
 * Extracts all trip listing pages (Day Tours, Nile Cruises, Shore Excursions)
 * Collects: title, price, image, description, category
 */

const BASE_URL = https://egypttimetravel.com/egypt-day-tours/luxor-tours/

const categories = [
  { name: 'Day Tours', slug: 'day-tours' },
  { name: 'Nile Cruises', slug: 'nile-cruises' },
  { name: 'Shore Excursions', slug: 'shore-excursions' },
];

async function scrapeCategory(category) {
  const url = `${BASE_URL}/${category.slug}`;
  console.log(`Scraping: ${url}`);
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const trips = [];

  $('.tour-item').each((_, el) => {
    const title = $(el).find('.tour-title a').text().trim();
    const link = $(el).find('.tour-title a').attr('href');
    const price = $(el).find('.tour-price').text().trim();
    const image = $(el).find('img').attr('src');
    const shortDesc = $(el).find('.tour-excerpt').text().trim();

    if (title && link && image) {
      trips.push({
        title,
        link: link.startsWith('http') ? link : BASE_URL + link,
        price,
        image: image.startsWith('http') ? image : BASE_URL + image,
        shortDesc,
        category: category.name,
      });
    }
  });

  return trips;
}

async function main() {
  const results = [];

  for (const category of categories) {
    const trips = await scrapeCategory(category);
    results.push(...trips);
  }

  // Remove trips that don't belong to egypttimetravel.com or are irrelevant
  const relevantKeywords = ['tour', 'trip', 'cruise', 'excursion', 'package'];

  const filtered = results.filter(
    (r) =>
      r.link.includes('egypttimetravel.com') &&
      relevantKeywords.some((kw) =>
        r.title.toLowerCase().includes(kw) ||
        r.shortDesc.toLowerCase().includes(kw)
      )
  );

  // Group trips by category
  const grouped = categories.reduce((acc, category) => {
    acc[category.name] = filtered.filter(t => t.category === category.name);
    return acc;
  }, {});

  // Save structured JSON data per category
  await fs.writeFile(
    './scraper/trips.json',
    JSON.stringify(grouped, null, 2),
    'utf-8'
  );

  for (const [category, trips] of Object.entries(grouped)) {
    console.log(`📦 ${category}: ${trips.length} trips`);
  }

  console.log(`✅ Scraped ${filtered.length} total trips across ${Object.keys(grouped).length} categories.`);
}

main().catch((err) => {
  console.error('❌ Error during scraping:', err.message);
});