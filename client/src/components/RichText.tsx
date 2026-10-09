import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { isInternalLink } from "../lib/paths";
import styles from "./RichText.module.css";

// Muestra el HTML escrito con el editor de texto del panel.
// Es seguro usar dangerouslySetInnerHTML aquí porque el backend limpia ese HTML
// antes de guardarlo (server/src/services/sanitizeHtml.ts).
export function RichText({ html }: { html: string }) {
  const navigate = useNavigate();

  // Los enlaces internos del texto ("/privacy-policy") navegan sin recargar la página.
  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const link = (event.target as HTMLElement).closest("a");
    const href = link?.getAttribute("href");
    const opensNormally = event.ctrlKey || event.metaKey || event.shiftKey || link?.target;

    if (href && isInternalLink(href) && !opensNormally) {
      event.preventDefault();
      navigate(href);
    }
  }

  return (
    <div
      className={styles.richText}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
