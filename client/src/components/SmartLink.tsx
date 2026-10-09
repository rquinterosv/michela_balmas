import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { it } from "../i18n/it";
import { isInternalLink } from "../lib/paths";

interface SmartLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

// Enlace que sirve para rutas del sitio ("/contatti", sin recargar la página) y
// para direcciones externas (se abren en otra pestaña, y se avisa de ello).
export function SmartLink({ href, className, children }: SmartLinkProps) {
  if (isInternalLink(href)) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden"> ({it.common.opensInNewTab})</span>
    </a>
  );
}
