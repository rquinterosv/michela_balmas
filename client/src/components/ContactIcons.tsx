import type { SiteSettings } from "@studio/shared";
import type { ReactNode } from "react";
import { it } from "../i18n/it";
import { phoneHref } from "../lib/paths";
import styles from "./ContactIcons.module.css";

// Iconos redondos de la cabecera: Facebook, Instagram, email y teléfono. Los destinos
// salen de "Impostazioni del sito"; un icono solo aparece si su dato está relleno.
//
// Los dibujos son SVG escritos aquí mismo, sin librería de iconos. El de email es un
// sobre genérico (no el logotipo de ningún proveedor de correo).

const facebookIcon = (
  <path
    fill="currentColor"
    d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.300-.1-2.300 0-3.800 1.400-3.800 3.900v2.300H8v3h2.500V21z"
  />
);

const instagramIcon = (
  <>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
  </>
);

const emailIcon = (
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3.5 7l8.5 6 8.500-6" />
  </>
);

const phoneIcon = (
  <path d="M22 16.920v3a2 2 0 0 1-2.180 2 19.790 19.790 0 0 1-8.630-3.070 19.500 19.500 0 0 1-6-6 19.790 19.790 0 0 1-3.070-8.670A2 2 0 0 1 4.110 2h3a2 2 0 0 1 2 1.720 12.840 12.840 0 0 0 .7 2.810 2 2 0 0 1-.450 2.110L8.090 9.910a16 16 0 0 0 6 6l1.270-1.270a2 2 0 0 1 2.110-.450 12.840 12.840 0 0 0 2.810.7A2 2 0 0 1 22 16.920z" />
);

interface IconLink {
  key: string;
  href: string;
  label: string;
  icon: ReactNode;
  // Las redes sociales se abren en otra pestaña; email y teléfono, no.
  external: boolean;
}

export function ContactIcons({ settings }: { settings: SiteSettings }) {
  const { social, email, phone } = settings;

  const links: IconLink[] = [
    { key: "facebook", href: social.facebook, label: it.contactIcons.facebook, icon: facebookIcon },
    {
      key: "instagram",
      href: social.instagram,
      label: it.contactIcons.instagram,
      icon: instagramIcon,
    },
  ]
    .filter((link) => link.href)
    .map((link) => ({ ...link, external: true }));

  if (email) {
    links.push({
      key: "email",
      href: `mailto:${email}`,
      label: it.contactIcons.email,
      icon: emailIcon,
      external: false,
    });
  }
  if (phone) {
    links.push({
      key: "phone",
      href: phoneHref(phone),
      label: it.contactIcons.phone,
      icon: phoneIcon,
      external: false,
    });
  }

  if (links.length === 0) return null;

  return (
    <ul className={styles.icons} aria-label={it.contactIcons.label}>
      {links.map((link) => (
        <li key={link.key}>
          <a
            href={link.href}
            className={styles.icon}
            // title: el nombre aparece al pasar el ratón por encima.
            title={link.label}
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {link.icon}
            </svg>
            <span className="visually-hidden">
              {link.label}
              {link.external && ` (${it.common.opensInNewTab})`}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
