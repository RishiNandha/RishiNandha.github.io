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
    <changefreq>monthly</changefreq>
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
   <url>
    <loc>${baseUrl}/activism</loc>
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

const staticPages = [
  { label: 'Home',     url: `${baseUrl}/` },
  { label: 'Research', url: `${baseUrl}/research` },
  { label: 'Blog',     url: `${baseUrl}/blog` },
  { label: 'Music',    url: `${baseUrl}/music` },
  { label: 'Activism', url: `${baseUrl}/activism` },
]

const blogListItems = blogUrls
  .map((url) => `      <li><a href="${baseUrl}/blog/${url}">${url}</a></li>`)
  .join('\n')

const staticListItems = staticPages
  .map(({ label, url }) => `      <li><a href="${url}">${label}</a></li>`)
  .join('\n')

const htmlSitemap = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sitemap – Rishinandha</title>
  <style>
    body { font-family: sans-serif; max-width: 640px; margin: 2rem auto; padding: 0 1rem; color: #222; }
    h1 { font-size: 1.5rem; margin-bottom: 1.5rem; }
    h2 { font-size: 1.1rem; margin-top: 2rem; margin-bottom: 0.5rem; color: #555; }
    ul { list-style: none; padding: 0; margin: 0; }
    li { margin: 0.35rem 0; }
    a { color: #0070f3; text-decoration: none; }
    a:hover { text-decoration: underline; }
    footer { margin-top: 3rem; font-size: 0.8rem; color: #999; }
  </style>
</head>
<body>
  <h1>Sitemap</h1>

  <h2>Pages</h2>
  <ul>
${staticListItems}
  </ul>

  <h2>Blog Posts</h2>
  <ul>
${blogListItems}
  </ul>

  <footer>Last updated: ${today}</footer>
</body>
</html>`

fs.writeFileSync(path.resolve(__dirname, 'public/sitemap.html'), htmlSitemap)
console.log(`✓ Generated HTML sitemap with ${blogUrls.length} blog posts`)