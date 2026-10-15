import { HOME_SLUG } from "@studio/shared";
import { Link } from "react-router-dom";
import { PageError, PageLoading } from "../components/PageStatus";
import { it } from "../i18n/it";
import { useLoad } from "../lib/useLoad";
import styles from "./Admin.module.css";
import { adminApi } from "./adminApi";

const CONTACTS_SLUG = "contatti";

// Inicio del panel: mensajes nuevos y accesos rápidos a lo más habitual.
export function Dashboard() {
  const { state, reload } = useLoad(
    () => Promise.all([adminApi.listMessages("nuovo"), adminApi.listPages()]),
    [],
  );

  if (state.status === "loading") return <PageLoading />;
  if (state.status === "error") {
    return <PageError message={state.error.message} onRetry={reload} />;
  }

  const [newMessages, pages] = state.data;
  const homePage = pages.find((page) => page.slug === HOME_SLUG);
  const contactsPage = pages.find((page) => page.slug === CONTACTS_SLUG);

  return (
    <>
      <h1>{it.admin.dashboard.title}</h1>

      <Link to="/admin/messaggi" className={styles.highlightCard}>
        <span>{it.admin.dashboard.newMessages(newMessages.length)}</span>
      </Link>

      <h2>{it.admin.dashboard.quickLinks}</h2>
      <div className={styles.actions}>
        {homePage && (
          <Link to={`/admin/pagine/${homePage.id}`} className="button button-secondary">
            {it.admin.dashboard.editHome}
          </Link>
        )}
        {contactsPage && (
          <Link to={`/admin/pagine/${contactsPage.id}`} className="button button-secondary">
            {it.admin.dashboard.editContacts}
          </Link>
        )}
        <Link to="/admin/messaggi" className="button button-secondary">
          {it.admin.dashboard.viewMessages}
        </Link>
        <Link to="/admin/blog/nuovo" className="button button-secondary">
          {it.admin.dashboard.newPost}
        </Link>
      </div>
    </>
  );
}
