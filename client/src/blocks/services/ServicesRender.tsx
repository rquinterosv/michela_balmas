import type { BlockData } from "@studio/shared";
import styles from "./Services.module.css";

// "Di cosa mi occupo": una fila por ámbito, con la categoría como etiqueta pequeña,
// la frase de quien llega en cursiva grande (lo que importa) y qué abarca.
export function ServicesRender({ data }: { data: BlockData<"services"> }) {
  if (data.items.length === 0) return null;

  return (
    <section className="section band-light">
      <div className="container">
        {(data.title || data.intro) && (
          <div className={`section-title section-title-centered ${styles.intro}`}>
            {data.title && <h2>{data.title}</h2>}
            {data.intro && <p>{data.intro}</p>}
          </div>
        )}
        <ul className={styles.rows}>
          {data.items.map((item) => (
            <li key={item.id} className={styles.row}>
              <h3 className={`eyebrow ${styles.category}`}>{item.category}</h3>
              {item.quote && <p className={styles.quote}>{item.quote}</p>}
              {item.description && <p className={styles.description}>{item.description}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
