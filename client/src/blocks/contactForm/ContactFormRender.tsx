import type { BlockData } from "@studio/shared";
import { ContactForm } from "./ContactForm";
import styles from "./ContactForm.module.css";

// Título e introducción editables + el formulario de contacto.
export function ContactFormRender({ data }: { data: BlockData<"contactForm"> }) {
  return (
    <section className={styles.section}>
      <div className="container">
        {data.title && <h2 className={styles.title}>{data.title}</h2>}
        {data.intro && <p className={styles.intro}>{data.intro}</p>}
        <ContactForm />
      </div>
    </section>
  );
}
