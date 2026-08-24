/**
 * Regenerates journal/posts.json from the YAML front matter of journal/*.md
 * Runs automatically on every Netlify deploy, so when Preeti publishes a post
 * in the editor the Journal index updates itself. No manual JSON editing.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DIR = "journal";

function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    if (/^\s*-\s+/.test(line) && key) {                    // list item
      (data[key] = Array.isArray(data[key]) ? data[key] : []).push(
        line.replace(/^\s*-\s+/, "").replace(/^["']|["']$/g, "")
      );
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    key = kv[1];
    let v = kv[2].trim();
    if (v === "") { data[key] = []; continue; }             // list follows
    if (/^\[.*\]$/.test(v)) {                               // inline list
      data[key] = v.slice(1, -1).split(",").map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      continue;
    }
    data[key] = v.replace(/^["']|["']$/g, "");
  }
  return { data, body: m[2] };
}

const words = s => s.replace(/[#>*_`\-\[\]()!]/g, " ").split(/\s+/).filter(Boolean).length;

const files = (await readdir(DIR)).filter(f => f.endsWith(".md"));
const posts = [];

for (const file of files) {
  const raw = await readFile(path.join(DIR, file), "utf8");
  const { data, body } = parseFrontMatter(raw);
  if (!data.title) continue;                                // skip non-posts
  posts.push({
    slug: file.replace(/\.md$/, ""),
    title: data.title,
    dek: data.dek || "",
    date: data.date || "",
    author: data.author || "Preeti Padaley",
    authorBio: data.authorBio || "",
    readingTime: `${Math.max(1, Math.round(words(body) / 200))} min read`,
    image: data.image || "",
    imageAlt: data.imageAlt || data.title || "",
    excerpt: data.excerpt || "",
    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : [])
  });
}

posts.sort((a, b) => String(b.date).localeCompare(String(a.date)));   // newest first
await writeFile(path.join(DIR, "posts.json"), JSON.stringify(posts, null, 2) + "\n");
console.log(`journal: indexed ${posts.length} post(s)`);

// Regenerate sitemap.xml from the same source, so publishing a post from the CMS
// keeps the sitemap current instead of quietly leaving it stale.
const SITE = "https://www.arthaindus.com";
const PAGES = ["/", "/curators-note.html", "/spatial-studies.html", "/perspectives.html", "/collaborate.html"];
const esc = (u) => u.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const urls = [
  ...PAGES.map((p) => ({ loc: SITE + p })),
  ...posts.map((p) => ({ loc: `${SITE}/post.html?p=${encodeURIComponent(p.slug)}`, lastmod: p.date }))
];
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`).join("\n") +
  "\n</urlset>\n";
await writeFile("sitemap.xml", sitemap);
console.log(`sitemap: ${urls.length} url(s)`);
