import { BLOG_SLUG, CATEGORY_SEGMENT, categoriesWithCounts, HOME_SLUG } from "@studio/shared";
import { Router } from "express";
import { env } from "../env";
import { listCategories } from "../repositories/categories";
import { listPublishedPages } from "../repositories/pages";
import { listPublishedPosts } from "../repositories/posts";

// GET /sitemap.xml: las direcciones públicas del sitio, para los buscadores.
// El frontend (otro dominio) la sirve en su propia /sitemap.xml con un rewrite
// (vercel.json), y robots.txt la anuncia.
export const sitemapRouter = Router();

interface SitemapEntry {
  path: string;
  // Fecha ISO de la última modificación, si se conoce.
  lastModified?: string;
}

// Las direcciones solo llevan letras, números, "-" y "/", pero SITE_URL viene de fuera.
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

sitemapRouter.get("/sitemap.xml", async (_req, res) => {
  const [pages, posts, categories] = await Promise.all([
    listPublishedPages(),
    listPublishedPosts(),
    listCategories(),
  ]);

  const entries: SitemapEntry[] = pages.map((page) => ({
    path: page.slug === HOME_SLUG ? "/" : `/${page.slug}`,
    lastModified: page.updatedAt,
  }));

  // Los artículos y las categorías solo cuentan si el blog está publicado.
  if (pages.some((page) => page.slug === BLOG_SLUG)) {
    for (const category of categoriesWithCounts(categories, posts)) {
      entries.push({ path: `/${BLOG_SLUG}/${CATEGORY_SEGMENT}/${category.slug}` });
    }
    for (const post of posts) {
      entries.push({ path: `/${BLOG_SLUG}/${post.slug}`, lastModified: post.updatedAt });
    }
  }

  const siteUrl = env.SITE_URL.replace(/\/+$/, "");
  const urls = entries.map((entry) => {
    const lastmod = entry.lastModified
      ? `<lastmod>${entry.lastModified.slice(0, 10)}</lastmod>`
      : "";
    return `  <url><loc>${escapeXml(siteUrl + entry.path)}</loc>${lastmod}</url>`;
  });

  res
    .type("application/xml")
    .set("Cache-Control", "public, max-age=3600")
    .send(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls.join("\n") +
        "\n</urlset>\n",
    );
});
