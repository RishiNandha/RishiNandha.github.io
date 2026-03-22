import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Scan blog directory for posts
const blogDir = path.resolve(__dirname, 'src/assets/blog')
const blogPosts = []

if (fs.existsSync(blogDir)) {
  const files = fs.readdirSync(blogDir)
  files.forEach((file) => {
    if (file.endsWith('.md')) {
      const slug = file.replace(/\.(md)$/, '')
      // Skip index file
      if (slug !== 'index') {
        blogPosts.push(slug)
      }
    }
  })
}

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
blogPosts.forEach((post) => {
  sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post}</loc>
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

console.log(`✓ Generated sitemap with ${blogPosts.length} blog posts`)