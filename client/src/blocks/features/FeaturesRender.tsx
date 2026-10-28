import type { BlockData } from "@studio/shared";
import { Icon } from "../../lib/icons";
import styles from "./Features.module.css";

// Lista de temas en filas separadas por una línea fina: icono, título grande en
// cursiva y la explicación al lado. En el móvil, cada fila en columna.
export function FeaturesRender({ data }: { data: BlockData<"features"> }) {
  if (data.items.length === 0) return null;

  return (
    <section className="section band-light">
      <div className="container">
        {data.title && <h2 className="section-title section-title-centered">{data.title}</h2>}
        <ul className={styles.rows}>
          {data.items.map((item) => (
            <li key={item.id} className={styles.row}>
              <span className={styles.badge}>
                <Icon name={item.icon} className={styles.icon} />
              </span>
              <h3 className={styles.rowTitle}>{item.title}</h3>
              {item.text && <p className={styles.rowText}>{item.text}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
