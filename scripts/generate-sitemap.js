// scripts/generate-sitemap.js
// Run: node scripts/generate-sitemap.js
// This script generates a sitemap.xml with all static and dynamic routes

const fs = require('fs');
const path = require('path');

// Load dynamic data
const trips = require('../src/data/trips.json');
const blogPosts = require('../src/data/blogPosts.json');

// Base site URL
const SITE = 'https://egypttravelpro.com';

// Static pages (manually defined)
const staticPages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/plan-trip', priority: 0.9, changefreq: 'weekly' },
  { url: '/trips', priority: 0.9, changefreq: 'weekly' },
  { url: '/destinations', priority: 0.9, changefreq: 'weekly' },
  { url: '/gallery', priority: 0.8, changefreq: 'weekly' },
  { url: '/blog', priority: 0.9, changefreq: 'daily' }
];

// Generate sitemap
const lines = [];
lines.push('<?xml version="1.0" encoding="UTF-8"?>');
lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
lines.push('        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
lines.push('        xmlns:xhtml="http://www.w3.org/1999/xhtml">');

// Main static pages
for (const page of staticPages) {
  lines.push('  <url>');
  lines.push(`    <loc>${SITE}${page.url}</loc>`);
  lines.push(`    <lastmod>${new Date().toISOString().substring(0, 10)}</lastmod>`);
  lines.push(`    <changefreq>${page.changefreq}</changefreq>`);
  lines.push(`    <priority>${page.priority}</priority>`);
  lines.push('  </url>');
}

// Trip detail pages
for (const trip of trips) {
  lines.push('  <url>');
  lines.push(`    <loc>${SITE}/trips/${trip.slug}</loc>`);
  lines.push(`    <lastmod>${new Date().toISOString().substring(0, 10)}</lastmod>`);
  lines.push('    <changefreq>monthly</changefreq>');
  lines.push('    <priority>0.8</priority>');
  if (trip.image) {
    lines.push('    <image:image>');
    lines.push(`      <image:loc>${trip.image}</image:loc>`);
    lines.push(`      <image:title>${trip.title}</image:title>`);
    lines.push(`      <image:caption>${trip.shortDescription || trip.description}</image:caption>`);
    lines.push('    </image:image>');
  }
  lines.push('  </url>');
}

// Blog post pages
for (const post of blogPosts) {
  lines.push('  <url>');
  lines.push(`    <loc>${SITE}/blog/${post.slug}</loc>`);
  lines.push(`    <lastmod>${(post.publishedAt || new Date().toISOString().substring(0, 10))}</lastmod>`);
  lines.push('    <changefreq>monthly</changefreq>');
  lines.push('    <priority>0.7</priority>');
  if (post.image) {
    lines.push('    <image:image>');
    lines.push(`      <image:loc>${post.image}</image:loc>`);
    lines.push(`      <image:title>${post.title}</image:title>`);
    lines.push(`      <image:caption>${post.excerpt || post.title}</image:caption>`);
    lines.push('    </image:image>');
  }
  lines.push('  </url>');
}

lines.push('</urlset>');

// Write to public/sitemap.xml
const outPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log('sitemap.xml generated at', outPath);