import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { it } from "../i18n/it";
import { setPageMeta } from "../lib/seo";
import { useSiteSettings } from "../lib/SiteSettingsContext";
import styles from "./NotFound.module.css";

export function NotFound() {
  const settings = useSiteSettings();
  const { pathname } = useLocation();

  useEffect(() => {
    setPageMeta({
      title: `${it.notFound.title} | ${settings.siteName}`,
      description: settings.texts.notFoundText,
      path: pathname,
      siteName: settings.siteName,
      index: false,
    });
  }, [pathname, settings.siteName, settings.texts.notFoundText]);

  return (
    <div className={`container ${styles.notFound}`}>
      <h1>{it.notFound.title}</h1>
      <p>{settings.texts.notFoundText}</p>
      <Link to="/" className="button">
        {it.notFound.backHome}
      </Link>
    </div>
  );
}
