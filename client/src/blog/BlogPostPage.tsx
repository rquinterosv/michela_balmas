import { BLOG_SLUG, postShareMeta, type PostInput } from "@studio/shared";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { BlockList } from "../blocks/BlockRenderer";
import { JsonLd } from "../components/JsonLd";
import { PageError, PageLoading } from "../components/PageStatus";
import { VideoPlayer } from "../components/VideoPlayer";
import { it } from "../i18n/it";
import { api } from "../lib/api";
import { formatDate } from "../lib/format";
import { imageSrc } from "../lib/images";
import { BLOG_PATH, categoryPath, postPath } from "../lib/paths";
import { absoluteImageUrl, absoluteUrl, setPageMeta } from "../lib/seo";
import { useSiteSettings } from "../lib/SiteSettingsContext";
import { useLoad } from "../lib/useLoad";
import { NotFound } from "../pages/NotFound";
import styles from "./Blog.module.css";
import { AuthorLine, postAuthor } from "./blogParts";
import { BlogShell } from "./BlogShell";
import { PostCard } from "./PostCard";

// /blog/:postSlug: un artículo, con la misma barra lateral que el listado.
export function BlogPostPage() {
  const { postSlug = "" } = useParams();
  const settings = useSiteSettings();
  const { state, reload } = useLoad(
    () => Promise.all([api.getPage(BLOG_SLUG), api.getBlogCategories(), api.getPost(postSlug)]),
    [postSlug],
  );

  const data = state.status === "ready" ? state.data : null;

  useEffect(() => {
    if (!data) return;
    const { post } = data[2];
    setPageMeta({
      ...postShareMeta(post, settings),
      path: postPath(post.slug),
      siteName: settings.siteName,
    });
  }, [data, settings]);

  if (state.status === "loading") return <PageLoading />;
  if (state.status === "error") {
    if (state.error.status === 404) return <NotFound />;
    return <PageError message={state.error.message} onRetry={reload} />;
  }

  const [blogPage, categories, { post, related }] = state.data;
  const category = categories.find((candidate) => candidate.id === post.categoryId);
  const author = postAuthor(post, settings);
  const image = post.seo.imageUrl || post.cover.imageUrl;

  const breadcrumb = [
    { label: it.blog.home, path: "/" },
    { label: blogPage.title, path: BLOG_PATH },
    ...(category ? [{ label: category.name, path: categoryPath(category.slug) }] : []),
    { label: post.title, path: postPath(post.slug) },
  ];

  return (
    <BlogShell breadcrumb={breadcrumb} categories={categories} activeCategoryId={post.categoryId}>
      <PostArticle post={post} category={category} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.seo.description || post.excerpt,
          datePublished: post.date,
          dateModified: post.updatedAt,
          author: { "@type": "Person", name: author.name },
          image: image ? absoluteImageUrl(image) : undefined,
          mainEntityOfPage: absoluteUrl(postPath(post.slug)),
        }}
      />

      <footer className={styles.postFooter}>
        <p>
          <Link to={BLOG_PATH} className={styles.backLink}>
            <span aria-hidden="true">←</span> {settings.texts.blogBack}
          </Link>
        </p>
        {related.length > 0 && (
          <section aria-labelledby="related-posts-title">
            <h2 id="related-posts-title" className={styles.relatedTitle}>
              {settings.texts.blogRelated}
            </h2>
            <div className={styles.relatedList}>
              {related.map((relatedPost) => (
                <PostCard
                  key={relatedPost.id}
                  post={relatedPost}
                  category={categories.find((c) => c.id === relatedPost.categoryId)}
                  headingLevel={3}
                />
              ))}
            </div>
          </section>
        )}
      </footer>
    </BlogShell>
  );
}

interface PostArticleProps {
  post: PostInput;
  category: { name: string; slug: string } | undefined;
}

// Cabecera y contenido de un artículo. También lo usa la vista previa del panel.
export function PostArticle({ post, category }: PostArticleProps) {
  const settings = useSiteSettings();
  const { cover } = post;

  return (
    <article className={styles.article}>
      <header className={styles.articleHeader}>
        {category && (
          <p className={styles.articleCategory}>
            <Link to={categoryPath(category.slug)}>{category.name}</Link>
          </p>
        )}
        <h1 className={styles.articleTitle}>{post.title}</h1>
        <p className={styles.articleMeta}>
          <AuthorLine {...postAuthor(post, settings)} />
          <span aria-hidden="true">·</span>
          <span>
            {it.blog.publishedOn} <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
        </p>
        {cover.type === "image" && cover.imageUrl && (
          <img
            className={styles.articleCover}
            src={imageSrc(cover.imageUrl)}
            alt={cover.imageAlt}
          />
        )}
        {cover.type === "video" && cover.videoUrl && (
          <VideoPlayer
            url={cover.videoUrl}
            title=""
            posterUrl={cover.imageUrl}
            linkLabel="guarda"
          />
        )}
      </header>
      <div className={`${styles.flush} ${styles.articleBody}`}>
        <BlockList blocks={post.blocks} />
      </div>
    </article>
  );
}
