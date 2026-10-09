import type { BlockData } from "@studio/shared";
import { RichText } from "../../components/RichText";
import styles from "./About.module.css";

// Presentación: foto, texto y listas (formazione, specializzazioni, approccio).
export function AboutRender({ data }: { data: BlockData<"about"> }) {
  return (
    <section className={styles.about}>
      <div className="container">
        <div className={styles.intro}>
          {data.photoUrl && (
            <img
              className={styles.photo}
              src={data.photoUrl}
              alt={data.photoAlt}
              width={600}
              height={750}
              loading="lazy"
            />
          )}
          <div>
            <h2 className={styles.title}>{data.title}</h2>
            <RichText html={data.html} />
          </div>
        </div>

        {data.lists.length > 0 && (
          <div className={styles.lists}>
            {data.lists.map((list, index) => (
              <div key={index} className={styles.list}>
                <h3 className={styles.listTitle}>{list.title}</h3>
                <ul>
                  {list.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
