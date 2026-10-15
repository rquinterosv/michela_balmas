import type { BlockData } from "@studio/shared";
import type { CSSProperties } from "react";
import { Icon } from "../../lib/icons";
import { useRevealOnScroll } from "../../lib/useRevealOnScroll";
import styles from "./Timeline.module.css";

// Percorso a tappe: lista ordenada de etapas numeradas, unidas por una línea.
// Horizontal en escritorio, vertical (línea a la izquierda) en móvil. Cada etapa
// aparece con un fundido suave al llegar a ella, salvo con prefers-reduced-motion.
export function TimelineRender({ data }: { data: BlockData<"timeline"> }) {
  const { ref, isRevealed } = useRevealOnScroll<HTMLOListElement>(data.items.length);

  if (data.items.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className="container">
        {data.title && <h2 className={styles.title}>{data.title}</h2>}
        <ol ref={ref} className={styles.timeline}>
          {data.items.map((item, index) => (
            <li
              key={item.id}
              data-index={index}
              className={isRevealed(index) ? `${styles.step} ${styles.revealed}` : styles.step}
              // Las etapas aparecen una detrás de otra.
              style={{ "--step-delay": `${index * 90}ms` } as CSSProperties}
            >
              <span className={styles.marker}>
                <Icon name={item.icon} className={styles.icon} />
                {/* El número ya lo da la lista ordenada; aquí es solo visual. */}
                <span className={styles.number} aria-hidden="true">
                  {index + 1}
                </span>
              </span>
              <h3 className={styles.stepTitle}>{item.title}</h3>
              {item.text && <p className={styles.stepText}>{item.text}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
