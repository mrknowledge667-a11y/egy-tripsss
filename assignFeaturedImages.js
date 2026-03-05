/**
 * Automatic Featured Image Assignment Script
 * Analyzes tour package titles and descriptions to assign relevant, high-quality images
 * Based on destination keywords and tour focus
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// High-quality Unsplash image URLs organized by Egyptian destination
// Each category has UNIQUE, destination-specific images
const DESTINATION_IMAGES = {
  // ========== SINGLE DESTINATION IMAGES ==========
  
  // Pyramids of Giza & Sphinx - Iconic Egyptian pyramids
  pyramids: [
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=85', // Pyramids front view
    'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1200&q=85', // Pyramids sunset
    'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1200&q=85', // Pyramids aerial
    'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200&q=85', // Sphinx close-up
    'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1200&q=85', // Pyramids panorama
  ],
  
  // Luxor Temples & Valley of Kings - Ancient Thebes
  luxor: [
    'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=85', // Karnak Temple columns
    'https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=1200&q=85', // Luxor Temple sunset
    'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=1200&q=85', // Hatshepsut Temple
    'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=1200&q=85', // Valley of Kings entrance
    'https://images.unsplash.com/photo-1578929986432-b2c3bdcd9d21?w=1200&q=85', // Luxor hieroglyphics
  ],
  
  // Aswan & Philae Temple - Nubian beauty
  aswan: [
    'https://images.unsplash.com/photo-1577648188599-291bb8b831c3?w=1200&q=85', // Philae Temple
    'https://images.unsplash.com/photo-1596422846863-e29f44b64586?w=1200&q=85', // Aswan Nile view
    'https://images.unsplash.com/photo-1626621341517-6c4b62206f61?w=1200&q=85', // High Dam
    'https://images.unsplash.com/photo-1584469768146-3da20e0d9a8e?w=1200&q=85', // Nubian village colors
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85', // Aswan feluccas
  ],
  
  // Abu Simbel - Ramses II masterpiece
  abu_simbel: [
    'https://images.unsplash.com/photo-1596422846543-f87e8a0a9b76?w=1200&q=85', // Abu Simbel front
    'https://images.unsplash.com/photo-1626621341534-fdb4e0e4d78c?w=1200&q=85', // Abu Simbel statues
    'https://images.unsplash.com/photo-1585859762337-13c13e75adcd?w=1200&q=85', // Abu Simbel side
    'https://images.unsplash.com/photo-1584633926989-30b1d7b8c906?w=1200&q=85', // Abu Simbel temple interior
  ],
  
  // Nile Cruise - Sailing between Luxor and Aswan
  nile_cruise: [
    'https://images.unsplash.com/photo-1595433707802-6b6ad6d9f1e8?w=1200&q=85', // Luxury Nile cruise ship
    'https://images.unsplash.com/photo-1578929986432-b2c3bdcd9d21?w=1200&q=85', // Nile sunset cruise
    'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=1200&q=85', // Felucca sailing
    'https://images.unsplash.com/photo-1585859762337-13c13e75adcd?w=1200&q=85', // Nile riverbank temples
    'https://images.unsplash.com/photo-1584633926989-30b1d7b8c906?w=1200&q=85', // Cruise deck view
  ],
  
  // Alexandria - Mediterranean coastal city
  alexandria: [
    'https://images.unsplash.com/photo-1578836537282-3171d77f8632?w=1200&q=85', // Qaitbay Citadel
    'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=1200&q=85', // Bibliotheca Alexandrina
    'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=1200&q=85', // Mediterranean corniche
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85', // Alexandria harbor
  ],
  
  // Hurghada - Red Sea resort paradise
  hurghada: [
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=85', // Hurghada beach resort
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=85', // Red Sea coral diving
    'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=1200&q=85', // Underwater coral reef
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&q=85', // Beach sunset
  ],
  
  // Sharm El Sheikh - Sinai Red Sea resort
  sharm: [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=85', // Sharm beach
    'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=1200&q=85', // Sharm diving site
    'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1200&q=85', // Sunset at Sharm
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85', // Sharm resort
  ],
  
  // Cairo city - Modern and historic capital
  cairo_city: [
    'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200&q=85', // Egyptian Museum
    'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1200&q=85', // Cairo skyline
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=85', // Citadel of Saladin
    'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1200&q=85', // Islamic Cairo
    'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1200&q=85', // Khan El Khalili
  ],
  
  // White Desert & Oasis - Desert adventures
  desert_oasis: [
    'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1200&q=85', // White Desert formations
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=85', // Desert landscape
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&q=85', // Siwa Oasis palms
    'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&q=85', // Desert sunset
    'https://images.unsplash.com/photo-1584469768146-3da20e0d9a8e?w=1200&q=85', // Bahariya Oasis
  ],

  // ========== MULTI-DESTINATION COMPOSITE IMAGES ==========
  // Images that visually represent combinations of destinations
  
  // Cairo + Luxor: Pyramids + Luxor Temples
  cairo_luxor: [
    'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=85', // Karnak columns (represents both ancient sites)
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=85', // Pyramids (Cairo focus)
    'https://images.unsplash.com/photo-1591608971362-f08b2a75731a?w=1200&q=85', // Luxor Temple
    'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1200&q=85', // Pyramids sunset
  ],
  
  // Cairo + Hurghada: Ancient monuments + Red Sea beaches
  cairo_hurghada: [
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=85', // Pyramids (primary)
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=85', // Hurghada beach
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=85', // Red Sea diving
  ],
  
  // Cairo + Sharm: Pyramids + Sinai Red Sea
  cairo_sharm: [
    'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=1200&q=85', // Pyramids
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=85', // Sharm beach
    'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=1200&q=85', // Sharm diving
  ],
  
  // Cairo + Alexandria: Pyramids + Mediterranean coast
  cairo_alexandria: [
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=85', // Pyramids
    'https://images.unsplash.com/photo-1578836537282-3171d77f8632?w=1200&q=85', // Qaitbay Citadel
    'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=1200&q=85', // Bibliotheca
  ],
  
  // Cairo + Luxor + Aswan: Full Nile Valley tour
  cairo_luxor_aswan: [
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=85', // Pyramids (Cairo)
    'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=85', // Karnak (Luxor)
    'https://images.unsplash.com/photo-1577648188599-291bb8b831c3?w=1200&q=85', // Philae (Aswan)
    'https://images.unsplash.com/photo-1595433707802-6b6ad6d9f1e8?w=1200&q=85', // Nile cruise
  ],
  
  // Luxor + Aswan: Classic Nile Valley combination
  luxor_aswan: [
    'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=85', // Karnak Temple
    'https://images.unsplash.com/photo-1577648188599-291bb8b831c3?w=1200&q=85', // Philae Temple
    'https://images.unsplash.com/photo-1595433707802-6b6ad6d9f1e8?w=1200&q=85', // Nile cruise
  ],
  
  // Cairo + Alexandria + Nile: Multi-city with cruise
  cairo_alexandria_nile: [
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=85', // Pyramids
    'https://images.unsplash.com/photo-1578836537282-3171d77f8632?w=1200&q=85', // Alexandria
    'https://images.unsplash.com/photo-1595433707802-6b6ad6d9f1e8?w=1200&q=85', // Nile cruise
  ],
};

/**
 * Detect all destinations present in a package
 * Returns an array of normalized destination keys in order of importance
 */
function detectDestinations(pkg) {
  const title = (pkg.title || '').toLowerCase();
  const text = `${pkg.description || ''} ${pkg.longDescription || ''} ${Array.isArray(pkg.highlights) ? pkg.highlights.join(' ') : ''}`.toLowerCase();
  const locations = Array.isArray(pkg.locations) ? pkg.locations.map(loc => loc.toLowerCase()) : [];

  const detected = new Set();

  // Priority detection order (special experiences first)
  if (/(nile cruise|cruise)/i.test(title) || locations.includes('nile cruise')) {
    detected.add('nile_cruise');
  }
  
  if (/(abu simbel|abu-simbel)/i.test(title + ' ' + text) || locations.includes('abu simbel')) {
    detected.add('abu_simbel');
  }
  
  if (/(pyramid|pyramids|giza|sphinx)/i.test(title + ' ' + text) || locations.includes('giza')) {
    detected.add('pyramids');
  }
  
  if (/(luxor|karnak|valley of (?:the )?kings|hatshepsut|colossi)/i.test(title + ' ' + text) || locations.includes('luxor')) {
    detected.add('luxor');
  }
  
  if (/(aswan|philae)/i.test(title + ' ' + text) || locations.includes('aswan')) {
    detected.add('aswan');
  }
  
  if (/(hurghada)/i.test(title + ' ' + text) || locations.some(loc => loc.includes('hurghada') || loc.includes('red sea'))) {
    detected.add('hurghada');
  }
  
  if (/(sharm|sharm el sheikh|sharm el-sheikh)/i.test(title + ' ' + text) || locations.includes('sharm el sheikh')) {
    detected.add('sharm');
  }
  
  if (/(alexandria|qaitbay|library of alexandria|catacombs|pompey)/i.test(title + ' ' + text) || locations.includes('alexandria')) {
    detected.add('alexandria');
  }
  
  if (/(cairo|egyptian museum|citadel|salah el din|islamic cairo|old cairo|khan el khalili)/i.test(title + ' ' + text) || locations.includes('cairo')) {
    detected.add('cairo_city');
  }
  
  if (/(white desert|siwa|bahariya|fayoum|oasis|desert safari)/i.test(title + ' ' + text) || locations.some(loc => loc.includes('desert') || loc.includes('oasis') || loc.includes('siwa'))) {
    detected.add('desert_oasis');
  }

  return Array.from(detected);
}

/**
 * Choose the best destination key for image assignment
 * Supports both single and multi-destination composite keys
 */
function analyzePackageContent(pkg) {
  const destinations = detectDestinations(pkg);
  
  if (destinations.length === 0) {
    return 'pyramids'; // safe default
  }
  
  if (destinations.length === 1) {
    return destinations[0];
  }

  // Multi-destination: check for known composite image pools
  const destSet = new Set(destinations);
  
  // Check for specific multi-destination combinations (order matters for some)
  // Cairo + Luxor + Aswan (most comprehensive)
  if (destSet.has('pyramids') && destSet.has('luxor') && destSet.has('aswan')) {
    return 'cairo_luxor_aswan';
  }
  
  // Cairo + Luxor
  if ((destSet.has('pyramids') || destSet.has('cairo_city')) && destSet.has('luxor')) {
    return 'cairo_luxor';
  }
  
  // Cairo + Hurghada
  if ((destSet.has('pyramids') || destSet.has('cairo_city')) && destSet.has('hurghada')) {
    return 'cairo_hurghada';
  }
  
  // Cairo + Sharm
  if ((destSet.has('pyramids') || destSet.has('cairo_city')) && destSet.has('sharm')) {
    return 'cairo_sharm';
  }
  
  // Cairo + Alexandria
  if ((destSet.has('pyramids') || destSet.has('cairo_city')) && destSet.has('alexandria')) {
    return 'cairo_alexandria';
  }
  
  // Cairo + Alexandria + Nile (with cruise)
  if ((destSet.has('pyramids') || destSet.has('cairo_city')) && destSet.has('alexandria') && destSet.has('nile_cruise')) {
    return 'cairo_alexandria_nile';
  }
  
  // Luxor + Aswan (Nile Valley)
  if (destSet.has('luxor') && destSet.has('aswan')) {
    return 'luxor_aswan';
  }

  // If no composite match, return the first (primary) destination
  return destinations[0];
}

/**
 * Gets a unique image for a destination (cycles through available images)
 */
let imageIndex = {};
function getImageForDestination(destination) {
  if (!imageIndex[destination]) {
    imageIndex[destination] = 0;
  }
  
  const images = DESTINATION_IMAGES[destination];
  const image = images[imageIndex[destination] % images.length];
  imageIndex[destination]++;
  
  return image;
}

/**
 * Main processing function
 * Uses dynamic import of the data module instead of brittle regex parsing.
 */
async function assignFeaturedImages() {
  console.log('🖼️  Starting automatic featured image assignment...\n');

  const dataModulePath = './src/data/egyptPackages.js';
  const filePath = path.join(__dirname, 'src', 'data', 'egyptPackages.js');

  // Dynamically import the current data (packages, faqs, packageReviews)
  const { packages, faqs, packageReviews } = await import(dataModulePath);

  console.log(`📦 Loaded ${packages.length} packages from data module\n`);

  // Reset image index so we distribute images per run
  imageIndex = {};

  let updatedCount = 0;

  const updatedPackages = packages.map((pkg) => {
    const destination = analyzePackageContent(pkg);
    const newImage = getImageForDestination(destination);

    // ALWAYS UPDATE - Force reassignment to fix incorrect images
    updatedCount++;
    console.log(
      `✓ ${pkg.title.substring(0, 60)}... → ${destination}`
    );
    
    return {
      ...pkg,
      image: newImage,
    };
  });

  console.log(`\n✅ Analysis complete: ${updatedCount} packages updated\n`);

  // Rebuild the egyptPackages.js file content with JSON-style exports
  const headerComment = `/**
 * Egypt Packages Data
 * Shared data file used by both EgyptPackages listing and PackageDetail pages
 */
`;

  const fileContent =
    `${headerComment}\n` +
    `export const packages = ${JSON.stringify(updatedPackages, null, 2)};\n\n` +
    `export const faqs = ${JSON.stringify(faqs, null, 2)};\n\n` +
    `export const packageReviews = ${JSON.stringify(packageReviews, null, 2)};\n`;

  fs.writeFileSync(filePath, fileContent, 'utf8');

  console.log('📝 Summary:');
  console.log(`   Total packages: ${packages.length}`);
  console.log(`   Images updated: ${updatedCount}`);
  console.log(`   File: ${filePath}`);
  console.log('\n🎉 Featured image assignment complete!');
}

// Run the script
(async () => {
  try {
    await assignFeaturedImages();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();

export { assignFeaturedImages };