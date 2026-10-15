import type { BlockData } from "@studio/shared";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { JsonLd } from "../../components/JsonLd";
import { RichText } from "../../components/RichText";
import styles from "./Faq.module.css";

// Ancla de la sección (p. ej. para un enlace a "/#faq").
const FAQ_ANCHOR = "faq";

// Preguntas frecuentes en acordeón: cada pregunta es un botón que abre o cierra su
// respuesta (aria-expanded). Incluye los datos FAQPage para los buscadores.
export function FaqRender({ data }: { data: BlockData<"faq"> }) {
  // ids de las preguntas abiertas. Empiezan todas cerradas.
  const [openIds, setOpenIds] = useState<string[]>([]);

  if (data.items.length === 0) return null;

  function toggle(id: string) {
    setOpenIds((ids) => (ids.includes(id) ? ids.filter((old) => old !== id) : [...ids, id]));
  }

  return (
    <section id={FAQ_ANCHOR} className={styles.section}>
      <div className={`container ${styles.inner}`}>
        {data.title && <h2 className={styles.title}>{data.title}</h2>}
        <div className={styles.list}>
          {data.items.map((item) => {
            const open = openIds.includes(item.id);
            const buttonId = `faq-${item.id}-question`;
            const panelId = `faq-${item.id}-answer`;
            return (
              <div key={item.id} className={styles.item}>
                <h3 className={styles.question}>
                  <button
                    type="button"
                    id={buttonId}
                    className={styles.button}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggle(item.id)}
                  >
                    <span>{item.question}</span>
                    <ChevronDown className={styles.chevron} aria-hidden="true" focusable="false" />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={styles.answer}
                  hidden={!open}
                >
                  <RichText html={item.answer} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data.items.map((item) => ({
            "@type": "Question",
            name: item.question,
            // Google admite en la respuesta el HTML sencillo del editor (p, ul, a…).
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
    </section>
  );
}
