import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Scan blog directory for posts
const blogPath = path.resolve(__dirname, "src/assets/blog/blog.json");
const blogData = JSON.parse(fs.readFileSync(blogPath, "utf-8"));

const blogUrls = blogData
  .filter((b) => b.publish === 1)
  .map((b) => b.url);

// Generate sitemap
const baseUrl = 'https://rishinandha.github.io'
const today = new Date().toISOString().split('T')[0]

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/research</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`

// Add blog posts dynamically
blogUrls.forEach((url) => {
  sitemap += `
  <url>
    <loc>${baseUrl}/blog/${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.8</priority>
  </url>`
})

sitemap += `
  <url>
    <loc>${baseUrl}/music</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`

fs.writeFileSync(
  path.resolve(__dirname, 'public/sitemap.xml'),
  sitemap
)

console.log(`✓ Generated sitemap with ${blogUrls.length} blog posts`)