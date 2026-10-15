import { BLOG_SLUG, type AdminCategory, type Post, type PostInput } from "@studio/shared";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Field } from "../components/Field";
import { PageError, PageLoading } from "../components/PageStatus";
import { it } from "../i18n/it";
import { ApiRequestError } from "../lib/api";
import { formatDate } from "../lib/format";
import { postPath } from "../lib/paths";
import { useLoad } from "../lib/useLoad";
import styles from "./Admin.module.css";
import { adminApi } from "./adminApi";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Toast";

type StatusFilter = "all" | "published" | "draft";

// De un artículo guardado a lo que espera la API al actualizarlo (sin id ni fechas).
export function toPostInput(post: Post): PostInput {
  // Los nombres con "_" son los campos que se descartan.
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input } = post;
  return input;
}

// "Blog": artículos del más reciente, con filtros, publicar/ocultar y eliminar.
export function PostsList() {
  const { state, reload } = useLoad(
    () => Promise.all([adminApi.listPosts(), adminApi.listCategories(), adminApi.listPages()]),
    [],
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [categoryId, setCategoryId] = useState("");
  const [busy, setBusy] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const showToast = useToast();
  const labels = it.admin.blog;

  // La copia local permite actualizar la lista sin volver a cargarla entera.
  useEffect(() => {
    if (state.status === "ready") setPosts(state.data[0]);
  }, [state]);

  if (state.status === "loading") return <PageLoading />;
  if (state.status === "error") {
    return <PageError message={state.error.message} onRetry={reload} />;
  }

  const [, categories, pages] = state.data;
  const blogPage = pages.find((page) => page.slug === BLOG_SLUG);
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "";

  // Al filtrar por una categoría principal se ven también los de sus hijas.
  const familyIds = categoryId
    ? [categoryId, ...categories.filter((c) => c.parentId === categoryId).map((c) => c.id)]
    : null;
  const visible = posts.filter(
    (post) =>
      (status === "all" || post.published === (status === "published")) &&
      (!familyIds || familyIds.includes(post.categoryId)),
  );

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

  function togglePublished(post: Post) {
    const published = !post.published;
    run(
      async () => {
        const updated = await adminApi.updatePost(post.id, { ...toPostInput(post), published });
        setPosts((current) => current.map((old) => (old.id === updated.id ? updated : old)));
      },
      published ? labels.publishedNow : labels.unpublishedNow,
    );
  }

  function confirmDelete() {
    const post = postToDelete;
    if (!post) return;
    setPostToDelete(null);
    run(async () => {
      await adminApi.deletePost(post.id);
      setPosts((current) => current.filter((old) => old.id !== post.id));
    }, labels.deleted);
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1>{labels.title}</h1>
          <p className={styles.help}>{labels.intro}</p>
        </div>
        <div className={styles.actions}>
          {categories.length > 0 && (
            <Link to="/admin/blog/nuovo" className="button">
              {labels.newPost}
            </Link>
          )}
          <Link to="/admin/blog/categorie" className="button button-secondary">
            {labels.categories}
          </Link>
          {blogPage && (
            <Link to={`/admin/pagine/${blogPage.id}`} className="button button-secondary">
              {labels.editBlogPage}
            </Link>
          )}
        </div>
      </div>

      {!blogPage && <p className={styles.notice}>{labels.noBlogPage}</p>}
      {categories.length === 0 && <p className={styles.notice}>{labels.noCategories}</p>}

      {posts.length > 0 && (
        <fieldset className={`${styles.fieldset} ${styles.selectFilters}`}>
          <legend className="visually-hidden">{labels.filtersLabel}</legend>
          <Field id="posts-status" label={labels.filterStatus}>
            <select
              id="posts-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as StatusFilter)}
            >
              <option value="all">{labels.allStatuses}</option>
              <option value="published">{labels.onlyPublished}</option>
              <option value="draft">{labels.onlyDrafts}</option>
            </select>
          </Field>
          <Field id="posts-category" label={labels.filterCategory}>
            <select
              id="posts-category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              <option value="">{labels.allCategories}</option>
              {categories.map((category: AdminCategory) => (
                <option key={category.id} value={category.id}>
                  {category.parentId ? `— ${category.name}` : category.name}
                </option>
              ))}
            </select>
          </Field>
        </fieldset>
      )}

      {posts.length === 0 && <p>{labels.empty}</p>}
      {posts.length > 0 && visible.length === 0 && <p>{labels.emptyFiltered}</p>}

      <ul className={styles.list}>
        {visible.map((post) => (
          <li key={post.id} className={styles.card}>
            <div className={styles.cardMain}>
              <h2 className={styles.cardTitle}>{post.title}</h2>
              <p className={styles.badges}>
                <span className={post.published ? styles.badgeOn : styles.badgeOff}>
                  {post.published ? labels.published : labels.draft}
                </span>
                <span className={styles.badgeOff}>{categoryName(post.categoryId)}</span>
                <span className={styles.badgeOff}>{formatDate(post.date)}</span>
              </p>
            </div>

            <div className={styles.actions}>
              <Link to={`/admin/blog/${post.id}`} className="button">
                {it.admin.common.edit}
                <span className="visually-hidden">: {post.title}</span>
              </Link>
              {post.published && (
                <a
                  href={postPath(post.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-secondary"
                >
                  {it.admin.common.viewOnSite}
                </a>
              )}
              <button
                type="button"
                className="button button-secondary"
                disabled={busy}
                onClick={() => togglePublished(post)}
              >
                {post.published ? labels.unpublish : labels.publish}
              </button>
              <button
                type="button"
                className={styles.textButtonDanger}
                disabled={busy}
                onClick={() => setPostToDelete(post)}
              >
                {it.admin.common.delete}
                <span className="visually-hidden">: {post.title}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={postToDelete !== null}
        title={labels.deleteTitle}
        text={postToDelete ? labels.deleteText(postToDelete.title) : ""}
        confirmLabel={it.admin.common.delete}
        onConfirm={confirmDelete}
        onCancel={() => setPostToDelete(null)}
      />
    </>
  );
}
