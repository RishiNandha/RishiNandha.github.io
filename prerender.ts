import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url"; // add pathToFileURL
import blogData from "./src/assets/blog/blog.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = "https://rishinandha.github.io";

const DEFAULT_META = {
  title: "Rishi Nandha Vanchinathan - Portfolio, Research, Music & Blog",
  description: "Portfolio website of Rishi Nandha V, A student at IITM. Page lists research projects in RF IC Design & Neuromorphic Computing, Original Music & Covers, and Blog Posts",
  image: `${BASE_URL}/RishiNandha.ico`, // put a fallback image in /public
};
const AUTHOR    = "Rishi Nandha Vanchinathan";
const SITE_NAME = "Rishi Nandha Vanchinathan";

const OG_IMAGE_WIDTH  = "600"; 
const OG_IMAGE_HEIGHT = "600";
const OG_IMAGE_TYPE   = "image/x-icon";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Trim description to ~155 chars at a word boundary — ideal for Google snippets
function trimDesc(s: string, max = 155): string {
  const clean = s.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(" ", max)) + "…";
}

// ── JSON-LD builders ─────────────────────────────────────────────────────────
// JSON-LD is what Google uses for rich results / knowledge panels.
// It's separate from meta tags and significantly boosts discoverability.

function jsonLdWebsite(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR,
    url: BASE_URL,
    sameAs: [
      "https://www.linkedin.com/in/rishinandhav/",
      "https://github.com/RishiNandha",
      "https://www.youtube.com/@rishinandha_vanchi",
    ],
    jobTitle: "Research Student",
    affiliation: { "@type": "Organization", name: "IIT Madras" },
    knowsAbout: ["RF IC Design", "Neuromorphic Computing", "Music Technology", "Guitar", "Veganism", "IIT Madras"],
  });
}

function jsonLdArticle(post: typeof blogData[number], url: string, keywordsO: string): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: trimDesc(post.metaDescription + " " + post.description),
    image: `${BASE_URL}/blogs/thumbnails/${post.thumbnail}`,
    datePublished: post.date,
    dateModified:  post.date,
    author: {
      "@type": "Person",
      name: AUTHOR,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR,
      url: BASE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: [...post.keywords, ...post.tags, AUTHOR, "IIT Madras"].join(", "),
    // Breadcrumb helps Google show "site > Blog > Post Title" in results
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home",  item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Blog",  item: `${BASE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  });
}

// ── Meta tag builder ──────────────────────────────────────────────────────────

function buildMetaTags(route: string): string {
  let title       = DEFAULT_META.title;
  let description = DEFAULT_META.description;
  let image       = DEFAULT_META.image;
  let type        = "website";
  let jsonLd      = jsonLdWebsite();
  let extraOg     = "";          // article-specific OG properties
  let keywords    = "Rishi Nandha Vanchinathan, IIT Madras, RF IC Design, Neuromorphic Computing, research, blog, Rishi iitm, Rishi Nandha V, full duplex iitm, veganism iitm, music iitm, rishi nandha iitm elec, neurmorphic iitm, rishi nandha music, rishi nandha blog";

  const url = `${BASE_URL}${route}`;

  if (route.startsWith("/blog/")) {
    const slug = route.replace("/blog/", "");
    const post = blogData.find((b) => b.url === slug && b.publish === 1);

    if (post) {
      title       = `${post.title} — ${AUTHOR}`;
      description = trimDesc(post.metaDescription + " " + post.description);
      image       = `${BASE_URL}/blogs/thumbnails/${post.thumbnail}`;
      type        = "article";
      keywords    = [...post.keywords, ...post.tags, AUTHOR, "IIT Madras"].join(", ");
      jsonLd      = jsonLdArticle(post, url, keywords);

      // These extra OG tags tell LinkedIn/Facebook it's an article, unlocking richer previews
      extraOg = `
    <meta property="article:author"         content="${esc(AUTHOR)}" />
    <meta property="article:published_time" content="${post.date}" />
    ${post.tags.map((t) => `<meta property="article:tag" content="${esc(t)}" />`).join("\n    ")}`;
    }
  }

  const isHome = route === "/";

  const canonicalUrl = isHome
    ? BASE_URL
    : `${BASE_URL}${route}/`;

  return `
    <!-- Injected by prerender -->
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="keywords"    content="${esc(keywords)}" />
    <link rel="canonical"    href="${canonicalUrl}" />

    <!-- Open Graph -->
    <meta property="og:site_name"   content="${SITE_NAME}" />
    <meta property="og:type"        content="${type}" />
    <meta property="og:url"         content="${canonicalUrl}" />
    <meta property="og:title"       content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image"       content="${image}" />
    <meta property="og:image:alt"   content="${esc(title)}" />${extraOg}
    <meta property="og:image:width"  content="${OG_IMAGE_WIDTH}" />
    <meta property="og:image:height" content="${OG_IMAGE_HEIGHT}" />
    <meta property="og:image:type"   content="${OG_IMAGE_TYPE}" />

    <!-- Twitter / X -->
    <meta name="twitter:card"        content="summary_large_image" />
    <meta name="twitter:site"        content="@rishinandha_v" />
    <meta name="twitter:url"         content="${canonicalUrl}" />
    <meta name="twitter:title"       content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image"       content="${image}" />
    <meta name="twitter:image:alt"   content="${esc(title)}" />

    <!-- Structured data (JSON-LD) -->
    <script type="application/ld+json">${jsonLd}</script>`;
}

// ── Routes & render ───────────────────────────────────────────────────────────

const blogRoutes = blogData
  .filter((b) => b.publish === 1)
  .map((b) => `/blog/${b.url}`);

const routes = ["/", "/projects", "/music", "/blog", "/cv", "/research", "/activism", ...blogRoutes];

const dist        = path.resolve("dist");
const distClient  = path.join(dist, "client");
const template    = fs.readFileSync(path.join(distClient, "index.html"), "utf-8");

const serverEntry = pathToFileURL(path.join(dist, "server", "entry-server.js")).href;
const { render }  = await import(serverEntry);

for (const route of routes) {
  const { html } = render(route);
  const page = template
    .replace(`<div id="root"></div>`, `<div id="root">${html}</div>`)
    .replace(`</head>`, `${buildMetaTags(route)}\n  </head>`);

  const dir = route === "/" ? distClient : path.join(distClient, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page);
  console.log("✔", route);
}
