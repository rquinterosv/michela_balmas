import type { CategoryWithCount, PostSummary } from "@studio/shared";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/format";
import { postPath } from "../lib/paths";
import { useSiteSettings } from "../lib/SiteSettingsContext";
import styles from "./Blog.module.css";
import { AuthorLine, CoverThumbnail, postAuthor } from "./blogParts";

interface PostCardProps {
  post: PostSummary;
  category?: CategoryWithCount;
  // Nivel del título: h2 en el listado, h3 en "Articoli correlati".
  headingLevel?: 2 | 3;
}

// Tarjeta de un artículo: imagen a todo el ancho y, encima de su parte inferior
// (en escritorio), una tarjeta blanca con fecha, título, extracto, autor y enlace.
export function PostCard({ post, category, headingLevel = 2 }: PostCardProps) {
  const settings = useSiteSettings();
  const Heading = `h${headingLevel}` as const;
  const path = postPath(post.slug);
  const hasCover = post.cover.type !== "none";

  return (
    <article className={hasCover ? `${styles.card} ${styles.cardWithCover}` : styles.card}>
      {/* La imagen también lleva al artículo, pero solo con el ratón: con teclado
          y lector de pantalla basta el enlace del título. */}
      {hasCover && (
        <Link to={path} tabIndex={-1} aria-hidden="true" className={styles.cardMedia}>
          <CoverThumbnail cover={post.cover} />
        </Link>
      )}
      <div className={styles.cardPanel}>
        <p className={styles.cardMeta}>
          {category && <span className={styles.cardCategory}>{category.name}</span>}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        <Heading className={styles.cardTitle}>
          <Link to={path}>{post.title}</Link>
        </Heading>
        <p className={styles.cardExcerpt}>{post.excerpt}</p>
        <div className={styles.cardFooter}>
          <AuthorLine {...postAuthor(post, settings)} />
          <Link to={path} className={styles.readMore}>
            {settings.texts.blogReadMore} <span aria-hidden="true">→</span>
            <span className="visually-hidden">: {post.title}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
