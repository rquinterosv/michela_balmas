import { youtubeEmbedUrl, youtubeVideoId } from "@studio/shared";
import { useEffect, useRef, useState } from "react";
import { it } from "../i18n/it";
import { imageSrc } from "../lib/images";
import styles from "./VideoPlayer.module.css";

interface VideoPlayerProps {
  url: string;
  title: string;
  // Imagen propia de anteprima (vacía = recuadro neutro con el símbolo play).
  posterUrl: string;
  // Texto del botón si la dirección no es de YouTube.
  linkLabel: "ascolta" | "guarda";
}

// Video de YouTube con "fachada": hasta que se pulsa play solo se ve una imagen
// propia (o un recuadro neutro), sin pedir nada a Google. Al pulsar se carga el
// reproductor de youtube-nocookie.com. Nunca se usa la miniatura de YouTube.
// Si la dirección es de otra plataforma (Spotify, la web de la radio…), se muestra
// un botón que la abre en otra pestaña.
export function VideoPlayer({ url, title, posterUrl, linkLabel }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const videoId = youtubeVideoId(url);

  // El botón desaparece al pulsarlo: el foco pasa al reproductor.
  useEffect(() => {
    if (playing) frameRef.current?.focus();
  }, [playing]);

  if (!videoId) {
    return (
      <div className={styles.external}>
        <a href={url} className="button" target="_blank" rel="noopener noreferrer">
          {it.video[linkLabel]}
          <span className="visually-hidden">
            {title && `: ${title}`} ({it.common.opensInNewTab})
          </span>
        </a>
        {title && (
          <p className={styles.externalTitle} aria-hidden="true">
            {title}
          </p>
        )}
      </div>
    );
  }

  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        {playing ? (
          <iframe
            ref={frameRef}
            src={youtubeEmbedUrl(videoId)}
            title={title || it.video.iframeTitle}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button type="button" className={styles.facade} onClick={() => setPlaying(true)}>
            {posterUrl && (
              <img className={styles.poster} src={imageSrc(posterUrl)} alt="" loading="lazy" />
            )}
            <PlayIcon className={styles.playIcon} />
            <span className="visually-hidden">{it.video.play(title)}</span>
          </button>
        )}
      </div>
      <figcaption className={styles.caption}>
        {title && <span className={styles.title}>{title}</span>}
        {!playing && <span className={styles.notice}>{it.video.privacyNotice}</span>}
      </figcaption>
    </figure>
  );
}

// Círculo con triángulo: el símbolo play. Decorativo.
export function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="32" fill="currentColor" />
      <path d="M26 20l20 12-20 12z" fill="var(--color-on-primary)" />
    </svg>
  );
}
