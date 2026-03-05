import fs from 'fs/promises';
import slugify from 'slugify';

/**
 * Reads trips.json (grouped by category) and generates
 * SEO-optimized markdown + metadata for each trip.
 * Output is organized in /seo_output/{category}/{slug}/index.html
 */

const TRIPS_PATH = './scraper/trips.json';
const OUTPUT_DIR = './seo_output';

async function generateSEOContent() {
  const raw = await fs.readFile(TRIPS_PATH, 'utf-8');
  const data = JSON.parse(raw);

  for (const [category, trips] of Object.entries(data)) {
    for (const trip of trips) {
      const slug = slugify(trip.title, { lower: true, strict: true });
      const dir = `${OUTPUT_DIR}/${category.replace(/\\s+/g, '-').toLowerCase()}/${slug}`;
      await fs.mkdir(dir, { recursive: true });

      const seoTitle = `${trip.title} | ${category} Egypt Travel Tours`;
      const seoDesc =
        trip.shortDesc ||
        `Explore ${trip.title} — one of Egypt's best ${category.toLowerCase()} options offered by Egypt Time Travel. Discover unforgettable experiences, great prices, and expert guides.`;

      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${seoTitle}</title>
<meta name="description" content="${seoDesc}" />
<meta property="og:title" content="${seoTitle}" />
<meta property="og:description" content="${seoDesc}" />
<meta property="og:image" content="${trip.image}" />
<meta property="og:url" content="${trip.link}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="keywords" content="${trip.title}, ${category}, Egypt tours, Nile cruises, travel Egypt, Egypt Time Travel" />
</head>
<body>
  <header>
    <h1>${trip.title}</h1>
    <p><strong>Category:</strong> ${category}</p>
    <img src="${trip.image}" alt="${trip.title} image" style="max-width:600px;border-radius:8px;" />
  </header>
  <section>
    <p><strong>Price:</strong> ${trip.price || 'Contact for best rate'}</p>
    <p>${seoDesc}</p>
    <a href="${trip.link}" target="_blank" rel="nofollow noopener">View Full Tour Details →</a>
  </section>
</body>
</html>
      `;

      await fs.writeFile(`${dir}/index.html`, html.trim(), 'utf-8');
      console.log(`🧩 Generated SEO page: ${dir}`);
    }
  }

  console.log('✅ SEO content generation complete.');
}

generateSEOContent().catch((err) => {
  console.error('❌ Error generating SEO content:', err.message);
});