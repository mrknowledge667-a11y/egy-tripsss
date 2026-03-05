import puppeteer from 'puppeteer';
import fs from 'fs/promises';

/**
 * Comprehensive Puppeteer scraper for https://egypttimetravel.com/
 * 
 * Phase 1: Visit category listing pages → collect all trip URLs
 * Phase 2: Visit each trip detail page → extract full data:
 *   title, price, images, description, itinerary, included, excluded,
 *   duration, highlights, rating, reviews
 * Phase 3: Save structured JSON grouped by category → data/trips.json
 * Phase 4: Generate JS data modules for DayTours, NileCruises, ShoreExcursions
 */

const BASE_URL = 'https://egypttimetravel.com';
const OUTPUT_JSON = './data/trips.json';
const OUTPUT_JS_DIR = './data';

const CATEGORIES = [
  { name: 'Day Tours', slug: 'day-tours', jsVar: 'dayTours' },
  { name: 'Nile Cruises', slug: 'nile-cruises', jsVar: 'nileCruises' },
  { name: 'Shore Excursions', slug: 'shore-excursions', jsVar: 'shoreExcursions' },
];

// Utility: wait ms
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Utility: slugify
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ─── Phase 1: Collect trip URLs from category listing pages ───
async function collectTripLinks(page, category) {
  const url = `${BASE_URL}/${category.slug}`;
  console.log(`\n🧭 [Phase 1] Visiting listing: ${url}`);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  } catch (e) {
    console.log(`  ⚠️ Timeout on initial load, waiting extra...`);
    await sleep(5000);
  }

  // Scroll down to trigger lazy-loaded content
  await autoScroll(page);
  await sleep(2000);

  // Try to find trip links using multiple selector strategies
  const links = await page.evaluate((baseUrl, catSlug) => {
    const found = new Set();

    // Strategy 1: Links containing the category slug in href
    document.querySelectorAll('a[href]').forEach((a) => {
      const href = a.href || a.getAttribute('href') || '';
      // Match links like /day-tours/pyramids-tour or /nile-cruises/al-hambra
      if (href.includes(baseUrl) && href.includes(`/${catSlug}/`) && href !== `${baseUrl}/${catSlug}/` && href !== `${baseUrl}/${catSlug}`) {
        found.add(href.split('?')[0].split('#')[0]); // clean query/hash
      }
    });

    // Strategy 2: Any internal link that looks like a tour detail
    document.querySelectorAll('a[href]').forEach((a) => {
      const href = a.href || '';
      if (href.includes(baseUrl) && !href.endsWith('/') && href.split('/').length > 4) {
        // Likely a detail page
        const path = new URL(href).pathname;
        if (path.startsWith(`/${catSlug}/`)) {
          found.add(href.split('?')[0].split('#')[0]);
        }
      }
    });

    return [...found];
  }, BASE_URL, category.slug);

  // If no specific links found, try broader approach
  if (links.length === 0) {
    console.log(`  🔍 No links found with specific selectors, trying broader approach...`);
    const broaderLinks = await page.evaluate((baseUrl) => {
      const found = new Set();
      document.querySelectorAll('a[href]').forEach((a) => {
        const href = a.href || '';
        if (href.includes(baseUrl) && href !== baseUrl && href !== baseUrl + '/') {
          found.add(href.split('?')[0].split('#')[0]);
        }
      });
      return [...found];
    }, BASE_URL);
    console.log(`  📎 All site links found: ${broaderLinks.length}`);
    // Log for debugging
    broaderLinks.slice(0, 20).forEach((l) => console.log(`    → ${l}`));
  }

  console.log(`  📦 Found ${links.length} trip links for "${category.name}"`);
  links.forEach((l) => console.log(`    → ${l}`));
  return links;
}

// ─── Phase 2: Scrape individual trip detail page ───
async function scrapeTripDetail(page, tripUrl, category) {
  console.log(`\n  🔎 [Phase 2] Scraping detail: ${tripUrl}`);
  
  try {
    await page.goto(tripUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  } catch (e) {
    console.log(`    ⚠️ Timeout, retrying...`);
    try {
      await page.goto(tripUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await sleep(3000);
    } catch (e2) {
      console.log(`    ❌ Failed to load: ${e2.message}`);
      return null;
    }
  }

  await sleep(2000);
  await autoScroll(page);
  await sleep(1000);

  const data = await page.evaluate(() => {
    // Helper: get text from first matching selector
    const getText = (...selectors) => {
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          const text = el.innerText || el.textContent || '';
          if (text.trim()) return text.trim();
        }
      }
      return '';
    };

    // Helper: get all text from matching selectors
    const getAllText = (...selectors) => {
      for (const sel of selectors) {
        const els = document.querySelectorAll(sel);
        if (els.length > 0) {
          return [...els].map((el) => (el.innerText || el.textContent || '').trim()).filter(Boolean);
        }
      }
      return [];
    };

    // Helper: get all image src
    const getAllImages = (...selectors) => {
      const imgs = new Set();
      for (const sel of selectors) {
        document.querySelectorAll(sel).forEach((el) => {
          const src = el.src || el.getAttribute('data-src') || el.getAttribute('data-lazy-src') || '';
          if (src && !src.includes('placeholder') && !src.includes('data:image') && !src.includes('svg+xml')) {
            imgs.add(src);
          }
        });
      }
      // Also try background images
      document.querySelectorAll('[style*="background-image"]').forEach((el) => {
        const match = el.style.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
        if (match && match[1] && !match[1].includes('placeholder')) {
          imgs.add(match[1]);
        }
      });
      return [...imgs];
    };

    // ─── Title ───
    const title = getText(
      'h1',
      '.entry-title',
      '.tour-title',
      '.page-title',
      '.product-title',
      'article h1',
      '.tour-detail-title',
      '.tour-heading h1'
    );

    // ─── Price ───
    let priceText = getText(
      '.tour-price',
      '.price',
      '.amount',
      '.product-price',
      '.tour-detail-price',
      '[class*="price"]',
      '.woocommerce-Price-amount'
    );
    // Try to extract numeric price
    let price = 0;
    let originalPrice = 0;
    const priceMatch = priceText.match(/\$?\s*(\d[\d,]*\.?\d*)/);
    if (priceMatch) {
      price = parseFloat(priceMatch[1].replace(',', ''));
    }
    // Look for original/strikethrough price
    const delEl = document.querySelector('del .amount, del .price, .was-price, [class*="original-price"]');
    if (delEl) {
      const origMatch = (delEl.innerText || '').match(/\$?\s*(\d[\d,]*\.?\d*)/);
      if (origMatch) originalPrice = parseFloat(origMatch[1].replace(',', ''));
    }

    // ─── Description ───
    const description = getText(
      '.tour-description',
      '.entry-content p',
      '.tour-detail-description',
      '.product-description',
      'article .description',
      '.tour-overview',
      '.tour-content p',
      'main p'
    );

    // ─── Duration ───
    const duration = getText(
      '.tour-duration',
      '[class*="duration"]',
      '.tour-meta .duration',
      '.tour-info .duration'
    );

    // ─── Images ───
    const images = getAllImages(
      '.tour-gallery img',
      '.gallery img',
      '.tour-slider img',
      '.swiper-slide img',
      '.tour-images img',
      '.product-gallery img',
      'article img',
      '.entry-content img',
      'main img',
      '.wp-block-image img',
      'figure img'
    );

    // ─── Highlights ───
    const highlights = getAllText(
      '.tour-highlights li',
      '.highlights li',
      '.tour-features li',
      '[class*="highlight"] li',
      '.tour-inclusions li'
    );

    // ─── Itinerary ───
    const itineraryItems = [];
    // Try structured itinerary
    const itinSections = document.querySelectorAll(
      '.itinerary-item, .tour-itinerary .item, [class*="itinerary"] .day, .accordion-item, .tour-day'
    );
    itinSections.forEach((section) => {
      const dayTitle = (section.querySelector('h3, h4, .day-title, .accordion-header, strong') || {}).innerText || '';
      const dayContent = (section.querySelector('p, .day-content, .accordion-body, .description') || {}).innerText || '';
      if (dayTitle || dayContent) {
        itineraryItems.push({
          time: dayTitle.trim(),
          activity: dayContent.trim(),
        });
      }
    });
    // If no structured itinerary, try tables
    if (itineraryItems.length === 0) {
      document.querySelectorAll('table tr').forEach((row) => {
        const cells = row.querySelectorAll('td, th');
        if (cells.length >= 2) {
          itineraryItems.push({
            time: (cells[0].innerText || '').trim(),
            activity: (cells[1].innerText || '').trim(),
          });
        }
      });
    }

    // ─── Included / Excluded ───
    let included = [];
    let excluded = [];
    // Try common patterns
    const allLists = document.querySelectorAll('ul, ol');
    allLists.forEach((list) => {
      const prev = list.previousElementSibling;
      const prevText = (prev?.innerText || prev?.textContent || '').toLowerCase();
      const items = [...list.querySelectorAll('li')].map((li) => (li.innerText || '').trim()).filter(Boolean);
      if (prevText.includes('include') || prevText.includes('what\'s included') || prevText.includes('included')) {
        included = items;
      }
      if (prevText.includes('exclude') || prevText.includes('not included') || prevText.includes('excluded')) {
        excluded = items;
      }
    });

    // ─── Rating & Reviews ───
    let rating = 0;
    let reviewCount = 0;
    const ratingEl = document.querySelector('[class*="rating"], .star-rating, [class*="stars"]');
    if (ratingEl) {
      const rText = ratingEl.innerText || ratingEl.getAttribute('title') || '';
      const rMatch = rText.match(/([\d.]+)/);
      if (rMatch) rating = parseFloat(rMatch[1]);
    }
    const reviewEl = document.querySelector('[class*="review-count"], [class*="reviews"], .rating-count');
    if (reviewEl) {
      const rvMatch = (reviewEl.innerText || '').match(/(\d+)/);
      if (rvMatch) reviewCount = parseInt(rvMatch[1]);
    }

    // ─── Get full page text for fallback extraction ───
    const fullPageText = document.body?.innerText || '';

    return {
      title,
      price,
      originalPrice,
      priceText,
      description,
      duration,
      images,
      highlights,
      itinerary: itineraryItems,
      included,
      excluded,
      rating,
      reviewCount,
      fullPageTextLength: fullPageText.length,
    };
  });

  if (!data || !data.title) {
    console.log(`    ❌ No title extracted`);
    return null;
  }

  // Build the trip object
  const trip = {
    id: slugify(data.title),
    category: category.name,
    categorySlug: category.slug,
    title: data.title,
    link: tripUrl,
    price: data.price || 0,
    originalPrice: data.originalPrice || 0,
    priceText: data.priceText || '',
    description: data.description || '',
    duration: data.duration || '',
    image: data.images[0] || '',
    gallery: data.images.slice(0, 6),
    highlights: data.highlights.length > 0 ? data.highlights : [],
    itinerary: data.itinerary,
    included: data.included,
    excluded: data.excluded,
    rating: data.rating || 4.8,
    reviews: data.reviewCount || 0,
    bestSeller: false,
  };

  console.log(`    ✅ "${trip.title}" — $${trip.price} — ${trip.gallery.length} images — ${trip.itinerary.length} itinerary items`);
  return trip;
}

// ─── Auto-scroll to trigger lazy loading ───
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
      // Safety timeout
      setTimeout(() => { clearInterval(timer); resolve(); }, 15000);
    });
  });
}

// ─── Phase 3: Generate JS data module for website consumption ───
function generateJSData(allTrips) {
  const grouped = {};
  for (const cat of CATEGORIES) {
    grouped[cat.name] = allTrips.filter((t) => t.category === cat.name);
  }

  // Generate a JS export for each category
  for (const cat of CATEGORIES) {
    const trips = grouped[cat.name];
    const jsContent = `// Auto-generated from egypttimetravel.com scraper — ${new Date().toISOString()}
// Category: ${cat.name}
// Total trips: ${trips.length}

export const ${cat.jsVar} = ${JSON.stringify(trips, null, 2)};

export default ${cat.jsVar};
`;
    // We'll save these later
    grouped[cat.name + '_js'] = jsContent;
  }

  return grouped;
}

// ─── Main ───
async function main() {
  console.log('🚀 Starting comprehensive Egypt Time Travel scraper...\n');
  console.log(`📍 Target: ${BASE_URL}`);
  console.log(`📂 Output: ${OUTPUT_JSON}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );
  page.setDefaultNavigationTimeout(60000);

  // Block unnecessary resources to speed up
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const type = req.resourceType();
    if (['font', 'media', 'websocket'].includes(type)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  const allTrips = [];

  for (const category of CATEGORIES) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`📁 Category: ${category.name} (/${category.slug})`);
    console.log(`${'═'.repeat(60)}`);

    // Phase 1: Get all trip links
    const tripLinks = await collectTripLinks(page, category);

    if (tripLinks.length === 0) {
      console.log(`\n  ⚠️ No links found. Trying to scrape listing page directly...`);
      // Try to extract card data directly from listing
      const listingTrips = await scrapeListingDirectly(page, category);
      allTrips.push(...listingTrips);
      continue;
    }

    // Phase 2: Visit each detail page
    for (const link of tripLinks) {
      try {
        const trip = await scrapeTripDetail(page, link, category);
        if (trip) {
          allTrips.push(trip);
        }
        await sleep(1500); // Polite delay
      } catch (e) {
        console.log(`    ❌ Error scraping ${link}: ${e.message}`);
      }
    }
  }

  // Mark best sellers (top rated or most reviews per category)
  for (const cat of CATEGORIES) {
    const catTrips = allTrips.filter((t) => t.category === cat.name);
    if (catTrips.length > 0) {
      // Sort by reviews desc, mark top 2 as best sellers
      catTrips.sort((a, b) => b.reviews - a.reviews);
      catTrips.slice(0, Math.min(2, catTrips.length)).forEach((t) => {
        const found = allTrips.find((at) => at.id === t.id);
        if (found) found.bestSeller = true;
      });
    }
  }

  // Phase 3: Save results
  console.log(`\n${'═'.repeat(60)}`);
  console.log('📊 RESULTS SUMMARY');
  console.log(`${'═'.repeat(60)}`);

  const grouped = {};
  for (const cat of CATEGORIES) {
    const catTrips = allTrips.filter((t) => t.category === cat.name);
    grouped[cat.name] = catTrips;
    console.log(`  ${cat.name}: ${catTrips.length} trips`);
  }
  console.log(`  TOTAL: ${allTrips.length} trips\n`);

  // Save JSON
  await fs.mkdir('./data', { recursive: true });
  await fs.writeFile(OUTPUT_JSON, JSON.stringify(grouped, null, 2), 'utf-8');
  console.log(`✅ Saved JSON: ${OUTPUT_JSON}`);

  // Save per-category JS modules
  for (const cat of CATEGORIES) {
    const trips = grouped[cat.name];
    const jsContent = `// Auto-generated from egypttimetravel.com scraper — ${new Date().toISOString()}
// Category: ${cat.name}
// Total trips: ${trips.length}

export const ${cat.jsVar} = ${JSON.stringify(trips, null, 2)};

export default ${cat.jsVar};
`;
    const jsPath = `${OUTPUT_JS_DIR}/${cat.jsVar}.js`;
    await fs.writeFile(jsPath, jsContent, 'utf-8');
    console.log(`✅ Saved JS module: ${jsPath}`);
  }

  await browser.close();
  console.log('\n🎉 Scraping complete!');
}

// ─── Fallback: Scrape directly from listing page cards ───
async function scrapeListingDirectly(page, category) {
  console.log(`  🔄 Attempting direct card extraction from listing page...`);
  
  const trips = await page.evaluate((catName) => {
    const results = [];

    // Try various card/item selectors
    const cardSelectors = [
      'article',
      '.tour-item',
      '.tour-card',
      '.product',
      '.card',
      '.post',
      '.listing-item',
      '[class*="tour"]',
      '[class*="trip"]',
      '[class*="package"]',
      '.elementor-post',
      '.jet-listing-grid__item',
    ];

    for (const sel of cardSelectors) {
      const cards = document.querySelectorAll(sel);
      if (cards.length > 1) {
        console.log(`Found ${cards.length} cards with selector: ${sel}`);
        cards.forEach((card) => {
          const titleEl = card.querySelector('h2, h3, h4, .title, [class*="title"] a, a[class*="title"]');
          const linkEl = card.querySelector('a[href]');
          const imgEl = card.querySelector('img');
          const priceEl = card.querySelector('[class*="price"], .amount');

          const title = (titleEl?.innerText || '').trim();
          const link = linkEl?.href || '';
          const image = imgEl?.src || imgEl?.getAttribute('data-src') || '';
          const priceText = (priceEl?.innerText || '').trim();

          if (title && link) {
            let price = 0;
            const pm = priceText.match(/\$?\s*(\d[\d,]*\.?\d*)/);
            if (pm) price = parseFloat(pm[1].replace(',', ''));

            results.push({
              title,
              link: link.split('?')[0],
              image,
              price,
              priceText,
              category: catName,
            });
          }
        });
        if (results.length > 0) break;
      }
    }

    return results;
  }, category.name);

  console.log(`  📦 Extracted ${trips.length} trips from listing cards`);

  return trips.map((t) => ({
    id: t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category: category.name,
    categorySlug: category.slug,
    title: t.title,
    link: t.link,
    price: t.price,
    originalPrice: 0,
    priceText: t.priceText,
    description: '',
    duration: '',
    image: t.image,
    gallery: t.image ? [t.image] : [],
    highlights: [],
    itinerary: [],
    included: [],
    excluded: [],
    rating: 4.8,
    reviews: 0,
    bestSeller: false,
  }));
}

main().catch((err) => {
  console.error('\n💀 Fatal error:', err);
  process.exit(1);
});