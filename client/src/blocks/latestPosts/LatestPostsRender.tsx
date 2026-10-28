import type { BlockData } from "@studio/shared";
import { Link } from "react-router-dom";
import { CoverThumbnail } from "../../blog/blogParts";
import { it } from "../../i18n/it";
import { api } from "../../lib/api";
import { formatDate } from "../../lib/format";
import { BLOG_PATH, postPath } from "../../lib/paths";
import { useSiteSettings } from "../../lib/SiteSettingsContext";
import { useLoad } from "../../lib/useLoad";
import styles from "./LatestPosts.module.css";

// "Dal blog": los últimos artículos publicados (la primera página del blog), en
// una fila que se desliza con el dedo. Sin artículos, o si no cargan, la sección no
// aparece: no hay nada que ofrecer.
export function LatestPostsRender({ data }: { data: BlockData<"latestPosts"> }) {
  const settings = useSiteSettings();
  const { state } = useLoad(() => api.getPosts(undefined, 1), []);

  if (state.status !== "ready" || state.data.posts.length === 0) return null;

  return (
    <section className="section band-light">
      <div className="container">
        {(data.title || data.intro) && (
          <div className={`section-title section-title-centered ${styles.intro}`}>
            {data.title && <h2>{data.title}</h2>}
            {data.intro && <p>{data.intro}</p>}
          </div>
        )}

        <ul className={styles.posts} aria-label={it.latestPosts.listLabel}>
          {state.data.posts.map((post) => (
            <li key={post.id} className={styles.item}>
              <article className={styles.post}>
                {post.cover.type !== "none" && (
                  <div className={styles.frame}>
                    <CoverThumbnail cover={post.cover} />
                  </div>
                )}
                <div className={styles.body}>
                  <p className={styles.meta}>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </p>
                  {/* El enlace cubre toda la tarjeta, pero su nombre es solo el título. */}
                  <h3 className={styles.title}>
                    <Link to={postPath(post.slug)} className={styles.link}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className={styles.excerpt}>{post.excerpt}</p>
                  <span className={styles.readMore} aria-hidden="true">
                    {settings.texts.blogReadMore} →
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className={styles.all}>
          <Link to={BLOG_PATH} className="button button-secondary">
            {it.latestPosts.allPosts}
          </Link>
        </p>
      </div>
    </section>
  );
}
