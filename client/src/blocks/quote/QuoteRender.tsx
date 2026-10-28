import type { BlockData } from "@studio/shared";
import styles from "./Quote.module.css";

// Una frase grande, en cursiva y centrada, sobre una franja arena.
export function QuoteRender({ data }: { data: BlockData<"quote"> }) {
  return (
    <section className="section band-sand">
      <div className="container">
        <blockquote className={styles.quote}>{data.text}</blockquote>
      </div>
    </section>
  );
}
