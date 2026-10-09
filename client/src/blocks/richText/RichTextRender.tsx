import type { BlockData } from "@studio/shared";
import { RichText } from "../../components/RichText";
import styles from "./RichTextBlock.module.css";

// Un texto libre escrito con el editor del panel.
export function RichTextRender({ data }: { data: BlockData<"richText"> }) {
  return (
    <section className={styles.section}>
      <div className="container">
        <RichText html={data.html} />
      </div>
    </section>
  );
}
