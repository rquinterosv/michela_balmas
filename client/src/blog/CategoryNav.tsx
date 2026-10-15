import type { CategoryWithCount } from "@studio/shared";
import { Link } from "react-router-dom";
import { BLOG_PATH, categoryPath } from "../lib/paths";
import { useSiteSettings } from "../lib/SiteSettingsContext";
import styles from "./Blog.module.css";

interface CategoryNavProps {
  categories: CategoryWithCount[];
  // Categoría que se está viendo (null = todas).
  activeId: string | null;
  // "list": barra lateral de escritorio, con las subcategorías debajo de su padre.
  // "chips": fila horizontal con desplazamiento, para el móvil.
  variant: "list" | "chips";
}

// Categorías con su número de artículos: "Interviste (5)". Al pulsar se filtra.
export function CategoryNav({ categories, activeId, variant }: CategoryNavProps) {
  const { texts } = useSiteSettings();
  const parents = categories.filter(
    (category) => !category.parentId || !categories.some((c) => c.id === category.parentId),
  );
  const childrenOf = (id: string) => categories.filter((category) => category.parentId === id);

  const allLink = (
    <Link
      to={BLOG_PATH}
      className={activeId === null ? styles.categoryActive : undefined}
      aria-current={activeId === null ? "page" : undefined}
    >
      {texts.blogAllPosts}
    </Link>
  );

  if (variant === "chips") {
    return (
      <nav aria-label={texts.blogCategories} className={styles.chips}>
        <ul>
          <li>{allLink}</li>
          {/* En fila: cada principal seguida de sus hijas. */}
          {parents.flatMap((parent) =>
            [parent, ...childrenOf(parent.id)].map((category) => (
              <li key={category.id}>
                <CategoryLink category={category} activeId={activeId} />
              </li>
            )),
          )}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-labelledby="blog-categories-title" className={styles.sideCard}>
      <h2 id="blog-categories-title" className={styles.sideTitle}>
        {texts.blogCategories}
      </h2>
      <ul className={styles.categoryList}>
        <li>{allLink}</li>
        {parents.map((parent) => {
          const children = childrenOf(parent.id);
          return (
            <li key={parent.id} className={styles.categoryParent}>
              <CategoryLink category={parent} activeId={activeId} />
              {children.length > 0 && (
                <ul>
                  {children.map((child) => (
                    <li key={child.id}>
                      <CategoryLink category={child} activeId={activeId} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function CategoryLink({
  category,
  activeId,
}: {
  category: CategoryWithCount;
  activeId: string | null;
}) {
  const active = category.id === activeId;
  return (
    <Link
      to={categoryPath(category.slug)}
      className={active ? styles.categoryActive : undefined}
      aria-current={active ? "page" : undefined}
    >
      {category.name} <span className={styles.categoryCount}>({category.count})</span>
    </Link>
  );
}
