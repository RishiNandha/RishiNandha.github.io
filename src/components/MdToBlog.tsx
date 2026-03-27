import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import { FaLinkedin, FaYoutube, FaGithub } from "react-icons/fa";
import blogData from "../assets/blog/blog.json";
import "./MdToBlog.css";
import { slug } from "github-slugger";
import headshotJpg from '../assets/headshot.jpg';

// Updated to match new blog.json shape — also update BlogProps in Iblog.tsx
type BlogProps = {
  url: string;
  filename: string;
  title: string;
  publish: 0 | 1;
  thumbnail: string;
  tags: string[];
  date: string;
  description: string;
  related: string[];
};


const markdownModules = import.meta.glob("/src/assets/blog/markdowns/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

console.log("Loaded markdown files:", Object.keys(markdownModules));

// ─── Types ────────────────────────────────────────────────────────────────────
type TocEntry = {
  level: number;
  text: string;
  id: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractToc(markdown: string): TocEntry[] {
  const toc: TocEntry[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let insideCodeBlock = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("```")) {
      insideCodeBlock = !insideCodeBlock;
      continue;
    }
    if (insideCodeBlock) continue;
    const match = line.match(/^(#{1,3})\s+(.*)$/);
    if (!match) continue;
    const level = match[1].length;
    const text = match[2].trim();
    if (!text) continue;
    toc.push({
      level,
      text,
      id: slugify(text),
    });
  }
  return toc;
}

// ─── Sub-components ───────────────────────────────────────────────────────────


// TOC _------------------------------------------------------------------------------------
function TableOfContents({ toc, activeId }: { toc: TocEntry[]; activeId: string }) {
  if (toc.length === 0) return null;
  return (
    <nav className="toc" aria-label="Table of contents">
      <p className="related__heading">On this page</p>
      <ul className="toc__list">
        {toc.map((entry) => (
          <li
            key={entry.id}
            className={`toc__item toc__item--h${entry.level} ${
              activeId === entry.id ? "toc__item--active" : ""
            }`}
          >
            <a href={`#${entry.id}`} className="toc__link">
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function RelatedCard({ post }: { post: BlogProps }) {
  return (
    <Link to={`/blog/${post.url}`} className="related-card">
      <div className="related-card__thumb">
        <img src={`/blogs/thumbnails/${post.thumbnail}`} alt={post.title} />
      </div>
      <div className="related-card__body">
        <p className="related-card__title">{post.title}</p>
        <span className="related-card__date">{post.date}</span>
      </div>
    </Link>
  );
}

function AuthorBox() {
  return (
    <div className="author-box">
      <div className="author-box__avatar-wrap">
        <img src={headshotJpg} alt="Rishi Nandha V" className="author-box__avatar" />
      </div>
      <div className="author-box__content">
        <p className="author-box__written">Written by</p>
        <h3 className="author-box__name">Rishi Nandha V</h3>
        <p className="author-box__bio">
          I'm a final year student at IIT Madras with research experience in RF IC Design and Neuromorphic Computing. I also play the guitar
          and write music.
        </p>
        <div className="author-box__links">
          <a href="https://www.linkedin.com/in/rishinandhav/" target="_blank" rel="noopener noreferrer" className="author-box__link" aria-label="LinkedIn">
            <FaLinkedin /><span>LinkedIn</span>
          </a>
          <a href="https://www.youtube.com/@rishinandha_vanchi" target="_blank" rel="noopener noreferrer" className="author-box__link author-box__link--yt" aria-label="YouTube">
            <FaYoutube /><span>YouTube</span>
          </a>
          <a href="https://github.com/RishiNandha" target="_blank" rel="noopener noreferrer" className="author-box__link author-box__link--gh" aria-label="GitHub">
            <FaGithub /><span>GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MdToBlog() {
  const { post } = useParams<{ post: string }>();
  const [activeId, setActiveId] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  console.log(post);
  const meta = (blogData as BlogProps[]).find((b) => b.url === post);
  // Wrong link error
  if (!meta) {
    return (
      <div className="blog-page blog-page--error">
        <h2>404 — Not Found</h2>
        <p>
          No such post in <code>/blog/{post}</code>.{" "}
          <Link to="/blog">← Back to main page</Link>
        </p>
      </div>
    );
  }
  // Markdown Error
  const markdown = markdownModules[`/src/assets/blog/markdowns/${meta.filename}`];
    if (!markdown) {
    return (
      <div className="blog-page blog-page--error">
        <h2>404 — Not Found</h2>
        <p>
          Markdown for blog is missing.{" "}
          <Link to="/blog">← Back to main page</Link>
        </p>
      </div>
    );
  }

  // ── Related posts resolved via url field ────────────────────────────────────
  const relatedPosts = meta.related;
  const toc = extractToc(markdown);
  console.log(relatedPosts);
  console.log(toc);
  // ── Active TOC tracking ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!contentRef.current) return;
    const headings = contentRef.current.querySelectorAll("h1, h2, h3");
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [markdown]);

  return (
    <div className="blog-page">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className = "headerwrap">
      <header className="blog-page__header">
        <Link to="/blog" className="blog-page__back">← All posts</Link>
        <div className="blog-page__tags">
          {meta.tags.map((t) => (
            <span key={t} className="blog-page__tag">#{t}</span>
          ))}
        </div>
        <h1 className="blog-page__title">{meta.title}</h1>
        <p className="blog-page__date">📅 {meta.date}</p>
      </header>
    </div>
      {/* ── Three-column body ────────────────────────────────────────────────── */}
      <div className="blog-page__body">
        
        <aside className="blog-page__toc-col">
          <div className="blog-page__toc-sticky">
            <TableOfContents toc={toc} activeId={activeId} />
          </div>
        </aside>

        <article className="blog-page__content" ref={contentRef}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
              [rehypeKatex, { strict: false }],
            ]}
          >
            {markdown}
          </ReactMarkdown>
          <AuthorBox />
        </article>

        {relatedPosts.length > 0 && (
          <aside className="blog-page__related-col">
            <p className="related__heading">Related</p>
            <div className="related__list">
              {relatedPosts.map((p) => (
                <RelatedCard key={p} post={
                    (blogData as BlogProps[]).find((b) => b.url === p) as BlogProps
                } />
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}