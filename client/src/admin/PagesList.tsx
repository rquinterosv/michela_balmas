import { HOME_SLUG, type Page, type PageInput } from "@studio/shared";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageError, PageLoading } from "../components/PageStatus";
import { it } from "../i18n/it";
import { ApiRequestError } from "../lib/api";
import { pagePath } from "../lib/paths";
import { useLoad } from "../lib/useLoad";
import styles from "./Admin.module.css";
import { adminApi } from "./adminApi";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Toast";

// De una página guardada a lo que espera la API al actualizarla (sin id ni fecha).
export function toPageInput(page: Page): PageInput {
  // Los nombres con "_" son los campos que se descartan.
  const { id: _id, updatedAt: _updatedAt, ...input } = page;
  return input;
}

// "Pagine": lista de páginas con reordenar, publicar/ocultar, editar y eliminar.
export function PagesList() {
  const { state, reload } = useLoad(() => adminApi.listPages(), []);
  const [pages, setPages] = useState<Page[]>([]);
  const [busy, setBusy] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);
  const showToast = useToast();

  // La copia local permite actualizar la lista sin volver a cargarla entera.
  useEffect(() => {
    if (state.status === "ready") setPages(state.data);
  }, [state]);

  if (state.status === "loading") return <PageLoading />;
  if (state.status === "error") {
    return <PageError message={state.error.message} onRetry={reload} />;
  }

  // Ejecuta una acción contra la API mostrando el resultado en un aviso.
  async function run(action: () => Promise<void>, successMessage: string) {
    setBusy(true);
    try {
      await action();
      showToast(successMessage);
    } catch (error) {
      showToast(error instanceof ApiRequestError ? error.message : it.admin.common.error, "error");
      reload(); // la lista en pantalla puede haber quedado desfasada
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    const reordered = [...pages];
    const [moved] = reordered.splice(index, 1);
    if (!moved) return;
    reordered.splice(target, 0, moved);

    run(
      async () => setPages(await adminApi.reorderPages(reordered.map((page) => page.id))),
      it.admin.pages.orderSaved,
    );
  }

  function togglePublished(page: Page) {
    const published = !page.published;
    run(
      async () => {
        const updated = await adminApi.updatePage(page.id, { ...toPageInput(page), published });
        setPages((current) => current.map((old) => (old.id === updated.id ? updated : old)));
      },
      published ? it.admin.pages.publishedNow : it.admin.pages.unpublishedNow,
    );
  }

  function confirmDelete() {
    const page = pageToDelete;
    if (!page) return;
    setPageToDelete(null);
    run(async () => {
      await adminApi.deletePage(page.id);
      setPages((current) => current.filter((old) => old.id !== page.id));
    }, it.admin.pages.deleted);
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1>{it.admin.pages.title}</h1>
          <p className={styles.help}>{it.admin.pages.intro}</p>
        </div>
        <Link to="/admin/pagine/nuova" className="button">
          {it.admin.pages.newPage}
        </Link>
      </div>

      {pages.length === 0 && <p>{it.admin.pages.empty}</p>}

      <ul className={styles.list}>
        {pages.map((page, index) => {
          const isHome = page.slug === HOME_SLUG;
          return (
            <li key={page.id} className={styles.card}>
              <div className={styles.cardMain}>
                <h2 className={styles.cardTitle}>{page.title}</h2>
                <p className={styles.badges}>
                  <span className={page.published ? styles.badgeOn : styles.badgeOff}>
                    {page.published ? it.admin.pages.published : it.admin.pages.draft}
                  </span>
                  <span className={styles.badgeOff}>
                    {page.showInMenu ? it.admin.pages.inMenu : it.admin.pages.notInMenu}
                  </span>
                  {isHome && <span className={styles.badgeOff}>{it.admin.pages.homeLabel}</span>}
                </p>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.iconButton}
                  disabled={busy || index === 0}
                  onClick={() => move(index, -1)}
                >
                  <span aria-hidden="true">↑</span>
                  <span className="visually-hidden">
                    {it.admin.common.moveUp}: {page.title}
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  disabled={busy || index === pages.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <span aria-hidden="true">↓</span>
                  <span className="visually-hidden">
                    {it.admin.common.moveDown}: {page.title}
                  </span>
                </button>
                <Link to={`/admin/pagine/${page.id}`} className="button">
                  {it.admin.common.edit}
                </Link>
                {page.published && (
                  <a
                    href={pagePath(page.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-secondary"
                  >
                    {it.admin.common.viewOnSite}
                  </a>
                )}
                {/* La página inicial no se puede ocultar ni eliminar. */}
                {!isHome && (
                  <>
                    <button
                      type="button"
                      className="button button-secondary"
                      disabled={busy}
                      onClick={() => togglePublished(page)}
                    >
                      {page.published ? it.admin.pages.unpublish : it.admin.pages.publish}
                    </button>
                    <button
                      type="button"
                      className={styles.textButtonDanger}
                      disabled={busy}
                      onClick={() => setPageToDelete(page)}
                    >
                      {it.admin.common.delete}
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <ConfirmDialog
        open={pageToDelete !== null}
        title={it.admin.pages.deleteTitle}
        text={pageToDelete ? it.admin.pages.deleteText(pageToDelete.title) : ""}
        confirmLabel={it.admin.common.delete}
        onConfirm={confirmDelete}
        onCancel={() => setPageToDelete(null)}
      />
    </>
  );
}
