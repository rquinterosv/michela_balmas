import type { CategoryWithCount } from "@studio/shared";
import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "../components/Breadcrumb";
import styles from "./Blog.module.css";
import { CategoryNav } from "./CategoryNav";
import { ContactCard } from "./ContactCard";

interface BlogShellProps {
  breadcrumb: BreadcrumbItem[];
  categories: CategoryWithCount[];
  activeCategoryId: string | null;
  children: ReactNode;
}

// Marco común del listado y del artículo.
// - Escritorio: contenido (60 %) y barra lateral fija al desplazarse (40 %) con las
//   categorías y la tarjeta de contacto.
// - Móvil: categorías arriba como "chips" horizontales, luego el contenido y al
//   final la tarjeta de contacto. Las categorías se dibujan dos veces (chips y
//   lista) y el CSS muestra solo la que corresponde a cada ancho.
export function BlogShell({ breadcrumb, categories, activeCategoryId, children }: BlogShellProps) {
  return (
    <div className={`container ${styles.shell}`}>
      <Breadcrumb items={breadcrumb} />
      {categories.length > 0 && (
        <div className={styles.mobileOnly}>
          <CategoryNav categories={categories} activeId={activeCategoryId} variant="chips" />
        </div>
      )}
      <div className={styles.columns}>
        <div className={styles.main}>{children}</div>
        <aside className={styles.aside}>
          {categories.length > 0 && (
            <div className={styles.desktopOnly}>
              <CategoryNav categories={categories} activeId={activeCategoryId} variant="list" />
            </div>
          )}
          <ContactCard />
        </aside>
      </div>
    </div>
  );
}
