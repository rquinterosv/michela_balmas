import type { BlockData } from "@studio/shared";
import type { CSSProperties } from "react";
import { it } from "../../i18n/it";
import { Icon } from "../../lib/icons";
import { useRevealOnScroll } from "../../lib/useRevealOnScroll";
import styles from "./Timeline.module.css";

// Percorso a tappe: círculo con icono, "Passo N", título y texto, unidos por una
// línea fina. En columnas en escritorio, una debajo de otra en el móvil. Cada etapa
// aparece con un fundido suave al llegar a ella, salvo con prefers-reduced-motion.
export function TimelineRender({ data }: { data: BlockData<"timeline"> }) {
  const { ref, isRevealed } = useRevealOnScroll<HTMLOListElement>(data.items.length);

  if (data.items.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        {data.title && <h2 className="section-title section-title-centered">{data.title}</h2>}
        <ol ref={ref} className={styles.timeline}>
          {data.items.map((item, index) => (
            <li
              key={item.id}
              data-index={index}
              className={isRevealed(index) ? `${styles.step} ${styles.revealed}` : styles.step}
              // Las etapas aparecen una detrás de otra.
              style={{ "--step-delay": `${index * 80}ms` } as CSSProperties}
            >
              <span className={styles.marker} aria-hidden="true">
                <Icon name={item.icon} className={styles.icon} />
              </span>
              {/* El número ya lo da la lista ordenada; aquí es solo visual. */}
              <p className="eyebrow" aria-hidden="true">
                {it.timeline.step(index + 1)}
              </p>
              <h3 className={styles.stepTitle}>{item.title}</h3>
              {item.text && <p className={styles.stepText}>{item.text}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
