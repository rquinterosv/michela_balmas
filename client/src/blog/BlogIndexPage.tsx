import {
  BLOG_SLUG,
  type CategoryWithCount,
  type Page,
  type PostsPage,
  type PostSummary,
} from "@studio/shared";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BlockList } from "../blocks/BlockRenderer";
import { PageError, PageLoading } from "../components/PageStatus";
import { it } from "../i18n/it";
import { api, ApiRequestError } from "../lib/api";
import { BLOG_PATH, categoryPath } from "../lib/paths";
import { setPageMeta } from "../lib/seo";
import { useSiteSettings } from "../lib/SiteSettingsContext";
import { useLoad } from "../lib/useLoad";
import { NotFound } from "../pages/NotFound";
import styles from "./Blog.module.css";
import { BlogShell } from "./BlogShell";
import { PostCard } from "./PostCard";

// /blog y /blog/categoria/:categorySlug: listado de artículos, del más reciente.
// El título, el texto introductorio y el SEO salen de la página "blog" de «Pagine».
// Si esa página no existe o no está publicada, el blog no se ve (404).
export function BlogIndexPage() {
  const { categorySlug } = useParams();
  const { state, reload } = useLoad(
    () =>
      Promise.all([api.getPage(BLOG_SLUG), api.getBlogCategories(), api.getPosts(categorySlug, 1)]),
    [categorySlug],
  );

  if (state.status === "loading") return <PageLoading />;
  if (state.status === "error") {
    if (state.error.status === 404) return <NotFound />;
    return <PageError message={state.error.message} onRetry={reload} />;
  }

  const [blogPage, categories, firstPage] = state.data;
  const category = categorySlug
    ? categories.find((candidate) => candidate.slug === categorySlug)
    : undefined;
  // Una categoría sin artículos publicados no se muestra.
  if (categorySlug && !category) return <NotFound />;

  return (
    <BlogIndex
      // Al cambiar de categoría, el listado empieza de cero.
      key={categorySlug ?? ""}
      blogPage={blogPage}
      categories={categories}
      category={category}
      firstPage={firstPage}
    />
  );
}

interface BlogIndexProps {
  blogPage: Page;
  categories: CategoryWithCount[];
  category: CategoryWithCount | undefined;
  firstPage: PostsPage;
}

function BlogIndex({ blogPage, categories, category, firstPage }: BlogIndexProps) {
  const settings = useSiteSettings();
  const [posts, setPosts] = useState<PostSummary[]>(firstPage.posts);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  // Primer artículo de la última tanda cargada: recibe el foco (ver loadMore).
  const focusIndex = useRef<number | null>(null);

  const path = category ? categoryPath(category.slug) : BLOG_PATH;
  const title = category ? category.name : blogPage.title;

  useEffect(() => {
    const blogTitle = blogPage.seo.title || `${blogPage.title} | ${settings.siteName}`;
    const blogDescription = blogPage.seo.description || it.seo.defaultDescription;
    setPageMeta({
      title: category
        ? category.seo.title || `${category.name} | ${blogPage.title} | ${settings.siteName}`
        : blogTitle,
      description: category ? category.seo.description || blogDescription : blogDescription,
      path,
      siteName: settings.siteName,
    });
  }, [blogPage, category, path, settings.siteName]);

  // Tras "Carica altri", el foco pasa al título del primer artículo nuevo: así quien
  // navega con teclado o lector de pantalla sigue leyendo desde ahí.
  useEffect(() => {
    if (focusIndex.current === null) return;
    const card = listRef.current?.children[focusIndex.current];
    card?.querySelector<HTMLAnchorElement>("h2 a")?.focus();
    focusIndex.current = null;
  }, [posts]);

  async function loadMore() {
    setLoadingMore(true);
    setLoadError("");
    try {
      const next = await api.getPosts(category?.slug, page + 1);
      focusIndex.current = posts.length;
      setPosts((current) => [...current, ...next.posts]);
      setPage(next.page);
    } catch (error) {
      setLoadError(error instanceof ApiRequestError ? error.message : it.common.error);
    } finally {
      setLoadingMore(false);
    }
  }

  const breadcrumb = [
    { label: it.blog.home, path: "/" },
    { label: blogPage.title, path: BLOG_PATH },
    ...(category ? [{ label: category.name, path }] : []),
  ];

  return (
    <BlogShell
      breadcrumb={breadcrumb}
      categories={categories}
      activeCategoryId={category?.id ?? null}
    >
      <header className={styles.intro}>
        <h1 className={styles.introTitle}>{title}</h1>
        {/* El texto introductorio (las secciones de la página "blog") solo en /blog. */}
        {!category && (
          <div className={styles.flush}>
            <BlockList blocks={blogPage.blocks} />
          </div>
        )}
      </header>

      {posts.length === 0 ? (
        <p>{category ? it.blog.emptyCategory : it.blog.empty}</p>
      ) : (
        <div ref={listRef} className={styles.postList}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              category={categories.find((candidate) => candidate.id === post.categoryId)}
            />
          ))}
        </div>
      )}

      {posts.length < firstPage.total && (
        <div className={styles.loadMore}>
          <button
            type="button"
            className="button button-secondary"
            disabled={loadingMore}
            onClick={loadMore}
          >
            {loadingMore ? it.blog.loadingMore : settings.texts.blogLoadMore}
          </button>
          {loadError && <p role="alert">{loadError}</p>}
        </div>
      )}
    </BlogShell>
  );
}
