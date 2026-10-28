import type { BlockData } from "@studio/shared";
import styles from "./Milestones.module.css";

// "In breve": las etapas principales, una por fila (año, qué, dónde), para quien
// prefiere una mirada de conjunto antes de leer.
export function MilestonesRender({ data }: { data: BlockData<"milestones"> }) {
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
        <ol className={styles.list}>
          {data.items.map((item) => (
            <li key={item.id} className={styles.item}>
              <span className={styles.year}>{item.year}</span>
              <span className={styles.what}>{item.title}</span>
              {item.place && <span className={styles.where}>{item.place}</span>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
