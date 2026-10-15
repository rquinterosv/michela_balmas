import type { PostSummary, SiteSettings } from "@studio/shared";
import { PlayIcon } from "../components/VideoPlayer";
import { imageSrc } from "../lib/images";
import styles from "./Blog.module.css";

// Piezas pequeñas que comparten el listado, el artículo y la vista previa del panel.

// Autor de un artículo: el suyo o, si está vacío, el de «Impostazioni del sito».
export function postAuthor(post: Pick<PostSummary, "author">, settings: SiteSettings) {
  return {
    name: post.author.name || settings.siteName,
    photoUrl: post.author.photoUrl || settings.photoUrl,
  };
}

// Foto pequeña y redonda con el nombre al lado.
export function AuthorLine({ name, photoUrl }: { name: string; photoUrl: string }) {
  return (
    <span className={styles.author}>
      {photoUrl && (
        <img className={styles.authorPhoto} src={imageSrc(photoUrl)} alt="" loading="lazy" />
      )}
      <span>{name}</span>
    </span>
  );
}

// Imagen de la tarjeta: la de copertina, la anteprima del video o, en un video
// sin anteprima, un recuadro neutro con el símbolo play. Sin copertina, nada.
export function CoverThumbnail({ cover }: { cover: PostSummary["cover"] }) {
  if (cover.type === "none") return null;

  return (
    <span className={styles.thumbnail}>
      {cover.imageUrl && (
        <img
          className={styles.thumbnailImage}
          src={imageSrc(cover.imageUrl)}
          // La tarjeta ya tiene el título: la imagen es decorativa.
          alt=""
          loading="lazy"
        />
      )}
      {cover.type === "video" && <PlayIcon className={styles.thumbnailPlay} />}
    </span>
  );
}
