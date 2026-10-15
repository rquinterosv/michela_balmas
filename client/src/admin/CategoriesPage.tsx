import {
  categoryInputSchema,
  slugify,
  zodFieldErrors,
  type AdminCategory,
  type CategoryInput,
} from "@studio/shared";
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { describedBy, Field } from "../components/Field";
import { PageError, PageLoading } from "../components/PageStatus";
import { TextField } from "../components/TextField";
import { it } from "../i18n/it";
import { ApiRequestError } from "../lib/api";
import { categoryPath } from "../lib/paths";
import { useLoad } from "../lib/useLoad";
import styles from "./Admin.module.css";
import { adminApi } from "./adminApi";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Toast";

const EMPTY_CATEGORY: CategoryInput = {
  name: "",
  slug: "",
  parentId: null,
  order: 0,
  seo: { title: "", description: "" },
};

function toCategoryInput(category: AdminCategory): CategoryInput {
  const { id: _id, postCount: _postCount, ...input } = category;
  return input;
}

// "Categorie del blog": crear, renombrar, ordenar, elegir la categoría principal y
// eliminar (solo las que no tienen artículos ni subcategorías).
export function CategoriesPage() {
  const { state, reload } = useLoad(() => adminApi.listCategories(), []);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  // id de la categoría que se está editando, o "new" para la nueva.
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [toDelete, setToDelete] = useState<AdminCategory | null>(null);
  const showToast = useToast();
  const labels = it.admin.categories;

  useEffect(() => {
    if (state.status === "ready") setCategories(state.data);
  }, [state]);

  if (state.status === "loading") return <PageLoading />;
  if (state.status === "error") {
    return <PageError message={state.error.message} onRetry={reload} />;
  }

  const hasChildren = (id: string) => categories.some((c) => c.parentId === id);
  const nameOf = (id: string | null) => categories.find((c) => c.id === id)?.name ?? "";

  // Ejecuta una acción que devuelve la lista actualizada y muestra el resultado.
  async function run(action: () => Promise<AdminCategory[]>, successMessage: string) {
    setBusy(true);
    try {
      setCategories(await action());
      showToast(successMessage);
      return true;
    } catch (error) {
      if (!(error instanceof ApiRequestError)) showToast(it.admin.common.error, "error");
      throw error;
    } finally {
      setBusy(false);
    }
  }

  // Sube o baja una categoría entre sus hermanas (las principales entre sí, y las
  // hijas dentro de su categoría principal). La lista ya viene en orden de lectura.
  function move(category: AdminCategory, direction: -1 | 1) {
    const siblings = categories.filter((c) => c.parentId === category.parentId);
    const index = siblings.findIndex((c) => c.id === category.id);
    const swapWith = siblings[index + direction];
    if (!swapWith) return;

    const ids = categories.map((c) => c.id);
    const a = ids.indexOf(category.id);
    const b = ids.indexOf(swapWith.id);
    // Con una principal se mueven también sus hijas, que van justo detrás.
    const block = (id: string) => [
      id,
      ...categories.filter((c) => c.parentId === id).map((c) => c.id),
    ];
    let reordered: string[];
    if (category.parentId) {
      reordered = [...ids];
      reordered[a] = swapWith.id;
      reordered[b] = category.id;
    } else {
      const [first, second] = direction === -1 ? [category, swapWith] : [swapWith, category];
      const rest = ids.filter(
        (id) => !block(first.id).includes(id) && !block(second.id).includes(id),
      );
      const insertAt = Math.min(a, b);
      reordered = [
        ...rest.slice(0, insertAt),
        ...block(first.id),
        ...block(second.id),
        ...rest.slice(insertAt),
      ];
    }

    run(() => adminApi.reorderCategories(reordered), labels.orderSaved).catch((error: unknown) => {
      if (error instanceof ApiRequestError) showToast(error.message, "error");
      reload();
    });
  }

  function confirmDelete() {
    const category = toDelete;
    if (!category) return;
    setToDelete(null);
    run(() => adminApi.deleteCategory(category.id), labels.deleted).catch((error: unknown) => {
      if (error instanceof ApiRequestError) showToast(error.message, "error");
    });
  }

  return (
    <>
      <p>
        <Link to="/admin/blog">← {labels.backToPosts}</Link>
      </p>
      <h1>{labels.title}</h1>
      <p className={styles.help}>{labels.intro}</p>

      {categories.length === 0 && <p>{labels.empty}</p>}

      <ul className={styles.list}>
        {categories.map((category) => {
          const siblings = categories.filter((c) => c.parentId === category.parentId);
          const position = siblings.findIndex((c) => c.id === category.id);
          const deletable = category.postCount === 0 && !hasChildren(category.id);

          return (
            <li
              key={category.id}
              className={`${styles.card} ${styles.wrapCard} ${category.parentId ? styles.childCard : ""}`}
            >
              <div className={styles.cardMain}>
                <h2 className={styles.cardTitle}>{category.name}</h2>
                <p className={styles.badges}>
                  {category.parentId && (
                    <span className={styles.badgeOff}>
                      {labels.subcategoryOf(nameOf(category.parentId))}
                    </span>
                  )}
                  <span className={styles.badgeOff}>{labels.postCount(category.postCount)}</span>
                </p>
                {!deletable && (
                  <p id={`category-${category.id}-locked`} className={styles.help}>
                    {labels.cannotDelete}
                  </p>
                )}
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.iconButton}
                  disabled={busy || position === 0}
                  onClick={() => move(category, -1)}
                >
                  <span aria-hidden="true">↑</span>
                  <span className="visually-hidden">
                    {it.admin.common.moveUp}: {category.name}
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  disabled={busy || position === siblings.length - 1}
                  onClick={() => move(category, 1)}
                >
                  <span aria-hidden="true">↓</span>
                  <span className="visually-hidden">
                    {it.admin.common.moveDown}: {category.name}
                  </span>
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  aria-expanded={editing === category.id}
                  onClick={() => setEditing(editing === category.id ? null : category.id)}
                >
                  {editing === category.id ? it.admin.common.close : it.admin.common.edit}
                  <span className="visually-hidden">: {category.name}</span>
                </button>
                <button
                  type="button"
                  className={styles.textButtonDanger}
                  disabled={busy || !deletable}
                  aria-describedby={deletable ? undefined : `category-${category.id}-locked`}
                  onClick={() => setToDelete(category)}
                >
                  {it.admin.common.delete}
                  <span className="visually-hidden">: {category.name}</span>
                </button>
              </div>

              {editing === category.id && (
                <CategoryForm
                  idPrefix={`category-${category.id}`}
                  initial={toCategoryInput(category)}
                  categories={categories}
                  ownId={category.id}
                  submitLabel={it.admin.common.save}
                  onSubmit={(input) =>
                    run(
                      () => adminApi.updateCategory(category.id, input),
                      it.admin.common.saved,
                    ).then(() => setEditing(null))
                  }
                  onCancel={() => setEditing(null)}
                />
              )}
            </li>
          );
        })}
      </ul>

      {editing === "new" ? (
        <section className={styles.card}>
          <h2>{labels.newCategory}</h2>
          <CategoryForm
            idPrefix="category-new"
            initial={EMPTY_CATEGORY}
            categories={categories}
            submitLabel={labels.add}
            onSubmit={(input) =>
              run(() => adminApi.createCategory(input), labels.created).then(() => setEditing(null))
            }
            onCancel={() => setEditing(null)}
          />
        </section>
      ) : (
        <button type="button" className="button button-secondary" onClick={() => setEditing("new")}>
          {labels.newCategory}
        </button>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title={labels.deleteTitle}
        text={toDelete ? labels.deleteText(toDelete.name) : ""}
        confirmLabel={it.admin.common.delete}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

interface CategoryFormProps {
  idPrefix: string;
  initial: CategoryInput;
  categories: AdminCategory[];
  // La categoría que se edita (no puede ser su propia principal).
  ownId?: string;
  submitLabel: string;
  // Lanza ApiRequestError si el backend rechaza los datos.
  onSubmit: (input: CategoryInput) => Promise<unknown>;
  onCancel: () => void;
}

function CategoryForm(props: CategoryFormProps) {
  const { idPrefix, initial, categories, ownId, submitLabel, onSubmit, onCancel } = props;
  const labels = it.admin.categories;
  const [draft, setDraft] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  // En una categoría nueva la dirección sigue al nombre hasta que se edita a mano.
  const [slugEdited, setSlugEdited] = useState(Boolean(ownId));
  const showToast = useToast();

  // Una categoría con hijas no puede tener principal; solo pueden ser principales
  // las que no tienen a su vez una principal.
  const ownHasChildren = Boolean(ownId) && categories.some((c) => c.parentId === ownId);
  const parentOptions = categories.filter((c) => !c.parentId && c.id !== ownId);
  const parentId = `${idPrefix}-parent`;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = categoryInputSchema.safeParse(draft);
    if (!result.success) {
      setErrors(zodFieldErrors(result.error));
      showToast(it.admin.common.checkFields, "error");
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      await onSubmit(result.data);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrors(error.fields);
        showToast(error.message, "error");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.inlineForm} onSubmit={handleSubmit} noValidate>
      <TextField
        id={`${idPrefix}-name`}
        label={labels.name}
        value={draft.name}
        onChange={(name) =>
          setDraft((current) =>
            slugEdited ? { ...current, name } : { ...current, name, slug: slugify(name) },
          )
        }
        error={errors.name}
      />
      <TextField
        id={`${idPrefix}-slug`}
        label={labels.address}
        hint={`${labels.addressHelp} ${window.location.host}${categoryPath(draft.slug)}`}
        value={draft.slug}
        onChange={(slug) => {
          setSlugEdited(true);
          setDraft((current) => ({ ...current, slug }));
        }}
        error={errors.slug}
      />
      <Field id={parentId} label={labels.parent} hint={labels.parentHelp} error={errors.parentId}>
        <select
          id={parentId}
          value={draft.parentId ?? ""}
          disabled={ownHasChildren}
          aria-invalid={Boolean(errors.parentId)}
          aria-describedby={describedBy(parentId, labels.parentHelp, errors.parentId)}
          onChange={(event) =>
            setDraft((current) => ({ ...current, parentId: event.target.value || null }))
          }
        >
          <option value="">{labels.noParent}</option>
          {parentOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </Field>
      <TextField
        id={`${idPrefix}-seo-title`}
        label={labels.seoTitle}
        value={draft.seo.title}
        onChange={(title) =>
          setDraft((current) => ({ ...current, seo: { ...current.seo, title } }))
        }
        error={errors["seo.title"]}
        optional
      />
      <TextField
        id={`${idPrefix}-seo-description`}
        label={labels.seoDescription}
        value={draft.seo.description}
        onChange={(description) =>
          setDraft((current) => ({ ...current, seo: { ...current.seo, description } }))
        }
        error={errors["seo.description"]}
        multiline
        optional
      />
      <div className={styles.actions}>
        <button type="submit" className="button" disabled={saving}>
          {saving ? it.admin.common.saving : submitLabel}
        </button>
        <button type="button" className={styles.textButton} onClick={onCancel}>
          {it.admin.common.cancel}
        </button>
      </div>
    </form>
  );
}
