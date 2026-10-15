import { Link } from "react-router-dom";
import { it } from "../i18n/it";
import { absoluteUrl } from "../lib/seo";
import styles from "./Breadcrumb.module.css";
import { JsonLd } from "./JsonLd";

export interface BreadcrumbItem {
  label: string;
  // Ruta del sitio. El último elemento (la página actual) no lleva enlace.
  path: string;
}

// Migas de pan: "Home › Blog › Interviste". Incluye los datos BreadcrumbList
// para que Google pueda mostrar el recorrido en los resultados.
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label={it.blog.breadcrumbLabel} className={styles.breadcrumb}>
      <ol>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={item.path}>
              {isCurrent ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link to={item.path}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            item: absoluteUrl(item.path),
          })),
        }}
      />
    </nav>
  );
}
