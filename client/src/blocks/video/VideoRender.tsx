import type { BlockData } from "@studio/shared";
import { VideoPlayer } from "../../components/VideoPlayer";
import styles from "./Video.module.css";

// Un video de YouTube (con fachada) o un botón a otra plataforma.
export function VideoRender({ data }: { data: BlockData<"video"> }) {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <VideoPlayer
          url={data.url}
          title={data.title}
          posterUrl={data.posterUrl}
          linkLabel={data.linkLabel}
        />
      </div>
    </section>
  );
}
