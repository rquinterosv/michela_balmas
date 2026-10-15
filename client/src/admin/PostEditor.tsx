import {
  POST_BLOCK_TYPES,
  postInputSchema,
  slugify,
  zodFieldErrors,
  type AdminCategory,
  type Post,
  type PostCover,
  type PostInput,
  type SiteSettings,
} from "@studio/shared";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PostArticle } from "../blog/BlogPostPage";
import { describedBy, Field } from "../components/Field";
import { PageError, PageLoading } from "../components/PageStatus";
import { TextField } from "../components/TextField";
import { it } from "../i18n/it";
import { ApiRequestError } from "../lib/api";
import { postPath } from "../lib/paths";
import { SiteSettingsContext } from "../lib/SiteSettingsContext";
import { useLoad } from "../lib/useLoad";
import styles from "./Admin.module.css";
import { adminApi } from "./adminApi";
import { BlockListEditor } from "./BlockListEditor";
import { ImageField } from "./ImageField";
import { toPostInput } from "./PostsList";
import { useToast } from "./Toast";
import { useUnsavedChangesWarning } from "./useUnsavedChangesWarning";

// Fecha de hoy en el formato de los artículos ("2026-10-15"), en hora local.
function today(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function newPost(categories: AdminCategory[]): PostInput {
  return {
    title: "",
    slug: "",
    categoryId: categories[0]?.id ?? "",
    date: today(),
    excerpt: "",
    cover: { type: "none", imageUrl: "", imageAlt: "", videoUrl: "" },
    author: { name: "", photoUrl: "" },
    blocks: [],
    published: false,
    seo: { title: "", description: "", imageUrl: "" },
  };
}

// Crear (/admin/blog/nuovo) o editar (/admin/blog/:id) un artículo.
// Este componente solo carga los datos; el formulario está en PostEditorForm.
export function PostEditor() {
  const { id } = useParams();
  const { state, reload } = useLoad(
    () =>
      Promise.all([
        id ? adminApi.getPost(id) : null,
        adminApi.listCategories(),
        adminApi.getSettings(),
      ]),
    [id],
  );

  if (state.status === "loading") return <PageLoading />;
  if (state.status === "error") {
    return <PageError message={state.error.message} onRetry={reload} />;
  }

  const [post, categories, settings] = state.data;
  // `key`: al pasar de un artículo a otro, el formulario empieza de cero.
  return (
    <PostEditorForm key={id ?? "new"} post={post} categories={categories} settings={settings} />
  );
}

interface PostEditorFormProps {
  // null = artículo nuevo.
  post: Post | null;
  categories: AdminCategory[];
  // Para la vista previa y para mostrar el autor por defecto.
  settings: SiteSettings;
}

function PostEditorForm({ post, categories, settings }: PostEditorFormProps) {
  const isNew = post === null;
  const labels = it.admin.postEditor;

  // `saved` es lo último guardado; `draft`, lo que hay en pantalla.
  const [saved, setSaved] = useState<PostInput>(post ? toPostInput(post) : newPost(categories));
  const [draft, setDraft] = useState<PostInput>(saved);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  // En un artículo nuevo la dirección sigue al título hasta que se edita a mano.
  const [slugEdited, setSlugEdited] = useState(!isNew);

  const navigate = useNavigate();
  const showToast = useToast();

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const { allowNextNavigation } = useUnsavedChangesWarning(dirty);

  function update(changes: Partial<PostInput>) {
    setDraft((current) => ({ ...current, ...changes }));
  }

  function updateCover(changes: Partial<PostCover>) {
    update({ cover: { ...draft.cover, ...changes } });
  }

  function updateTitle(title: string) {
    update(slugEdited ? { title } : { title, slug: slugify(title) });
  }

  // Guarda el borrador. `changes` permite guardar y publicar/ocultar a la vez.
  async function save(changes: Partial<PostInput> = {}) {
    const candidate = { ...draft, ...changes };

    // Misma validación que el backend, para avisar sin esperar a la red.
    const result = postInputSchema.safeParse(candidate);
    if (!result.success) {
      setErrors(zodFieldErrors(result.error));
      showToast(it.admin.common.checkFields, "error");
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      if (post) {
        const updated = toPostInput(await adminApi.updatePost(post.id, result.data));
        setSaved(updated);
        setDraft(updated);
        showToast(it.admin.common.saved);
      } else {
        const created = await adminApi.createPost(result.data);
        showToast(labels.created);
        allowNextNavigation();
        navigate(`/admin/blog/${created.id}`, { replace: true });
      }
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrors(error.fields);
        showToast(error.message, "error");
      } else {
        showToast(it.admin.common.error, "error");
      }
    } finally {
      setSaving(false);
    }
  }

  const heading = isNew ? labels.newTitle : labels.editTitle(saved.title);
  const category = categories.find((candidate) => candidate.id === draft.categoryId);

  return (
    <>
      <p>
        <Link to="/admin/blog">← {labels.backToPosts}</Link>
      </p>
      <div className={styles.pageHeader}>
        <h1>{heading}</h1>
        <span className={draft.published ? styles.badgeOn : styles.badgeOff}>
          {draft.published ? it.admin.blog.published : it.admin.blog.draft}
        </span>
      </div>

      {previewing && <PostPreview draft={draft} category={category} settings={settings} />}

      {/* Durante la vista previa el formulario se oculta, no se desmonta: así no se pierde nada. */}
      <div hidden={previewing}>
        <section className={styles.card}>
          <TextField
            id="post-title"
            label={labels.postTitle}
            value={draft.title}
            onChange={updateTitle}
            error={errors.title}
          />
          <TextField
            id="post-slug"
            label={labels.address}
            hint={`${labels.addressHelp} ${window.location.host}${postPath(draft.slug)}`}
            value={draft.slug}
            onChange={(slug) => {
              setSlugEdited(true);
              update({ slug });
            }}
            error={errors.slug}
          />
          <Field id="post-category" label={labels.category} error={errors.categoryId}>
            <select
              id="post-category"
              value={draft.categoryId}
              aria-invalid={Boolean(errors.categoryId)}
              aria-describedby={describedBy("post-category", undefined, errors.categoryId)}
              onChange={(event) => update({ categoryId: event.target.value })}
            >
              <option value="">{labels.categoryPlaceholder}</option>
              {categories.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.parentId ? `— ${option.name}` : option.name}
                </option>
              ))}
            </select>
          </Field>
          <TextField
            id="post-date"
            type="date"
            label={labels.date}
            hint={labels.dateHelp}
            value={draft.date}
            onChange={(date) => update({ date })}
            error={errors.date}
          />
          <TextField
            id="post-excerpt"
            label={labels.excerpt}
            hint={labels.excerptHelp}
            value={draft.excerpt}
            onChange={(excerpt) => update({ excerpt })}
            error={errors.excerpt}
            multiline
          />
        </section>

        <section className={styles.card}>
          <h2>{labels.coverSection}</h2>
          <p className={styles.help}>{labels.coverHelp}</p>
          <Field id="post-cover-type" label={labels.coverType}>
            <select
              id="post-cover-type"
              value={draft.cover.type}
              onChange={(event) => updateCover({ type: event.target.value as PostCover["type"] })}
            >
              <option value="none">{labels.coverNone}</option>
              <option value="image">{labels.coverImage}</option>
              <option value="video">{labels.coverVideo}</option>
            </select>
          </Field>

          {draft.cover.type === "video" && (
            <TextField
              id="post-cover-video"
              type="url"
              label={labels.coverVideoUrl}
              hint={labels.coverVideoHelp}
              value={draft.cover.videoUrl}
              onChange={(videoUrl) => updateCover({ videoUrl })}
              error={errors["cover.videoUrl"]}
            />
          )}
          {draft.cover.type !== "none" && (
            <>
              {draft.cover.type === "video" && (
                <p className={styles.help}>{labels.coverPosterHelp}</p>
              )}
              <ImageField
                id="post-cover-image"
                label={
                  draft.cover.type === "video" ? labels.coverPosterField : labels.coverImageField
                }
                value={draft.cover.imageUrl}
                onChange={(imageUrl) => updateCover({ imageUrl })}
                error={errors["cover.imageUrl"]}
              />
            </>
          )}
          {draft.cover.type === "image" && (
            <TextField
              id="post-cover-alt"
              label={it.admin.blockEditors.image.alt}
              hint={it.admin.blockEditors.image.altHelp}
              value={draft.cover.imageAlt}
              onChange={(imageAlt) => updateCover({ imageAlt })}
              error={errors["cover.imageAlt"]}
              optional
            />
          )}
        </section>

        <section className={styles.card}>
          <h2>{labels.authorSection}</h2>
          <p className={styles.help}>{labels.authorHelp}</p>
          <TextField
            id="post-author-name"
            label={labels.authorName}
            placeholder={settings.siteName}
            value={draft.author.name}
            onChange={(name) => update({ author: { ...draft.author, name } })}
            error={errors["author.name"]}
            optional
          />
          <ImageField
            id="post-author-photo"
            label={labels.authorPhoto}
            value={draft.author.photoUrl}
            onChange={(photoUrl) => update({ author: { ...draft.author, photoUrl } })}
            error={errors["author.photoUrl"]}
          />
        </section>

        <BlockListEditor
          blocks={draft.blocks}
          onChange={(blocks) => update({ blocks })}
          errors={errors}
          allowedTypes={POST_BLOCK_TYPES}
          help={labels.sectionsHelp}
        />

        <section className={styles.card}>
          <h2>{it.admin.pageEditor.seoSection}</h2>
          <p className={styles.help}>{it.admin.pageEditor.seoHelp}</p>
          <TextField
            id="post-seo-title"
            label={it.admin.pageEditor.seoTitle}
            value={draft.seo.title}
            onChange={(title) => update({ seo: { ...draft.seo, title } })}
            error={errors["seo.title"]}
            optional
          />
          <TextField
            id="post-seo-description"
            label={it.admin.pageEditor.seoDescription}
            value={draft.seo.description}
            onChange={(description) => update({ seo: { ...draft.seo, description } })}
            error={errors["seo.description"]}
            multiline
            optional
          />
          <p className={styles.help}>{labels.seoImageHelp}</p>
          <ImageField
            id="post-seo-image"
            label={labels.seoImage}
            value={draft.seo.imageUrl}
            onChange={(imageUrl) => update({ seo: { ...draft.seo, imageUrl } })}
            error={errors["seo.imageUrl"]}
          />
        </section>
      </div>

      {/* Barra de acciones, siempre visible al pie de la pantalla. */}
      <div className={styles.stickyBar}>
        <button type="button" className="button" disabled={saving} onClick={() => save()}>
          {saving ? it.admin.common.saving : it.admin.common.save}
        </button>
        <button
          type="button"
          className="button button-secondary"
          aria-pressed={previewing}
          onClick={() => setPreviewing((value) => !value)}
        >
          {previewing ? it.admin.pageEditor.closePreview : it.admin.pageEditor.preview}
        </button>
        <button
          type="button"
          className="button button-secondary"
          disabled={saving}
          onClick={() => save({ published: !draft.published })}
        >
          {draft.published ? it.admin.blog.unpublish : it.admin.blog.publish}
        </button>
        {saved.published && !isNew && (
          <a href={postPath(saved.slug)} target="_blank" rel="noopener noreferrer">
            {it.admin.common.viewOnSite}
          </a>
        )}
      </div>
    </>
  );
}

interface PostPreviewProps {
  draft: PostInput;
  category: AdminCategory | undefined;
  settings: SiteSettings;
}

// Vista previa: dibuja el borrador con el mismo componente que el sitio público.
function PostPreview({ draft, category, settings }: PostPreviewProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  // `inert`: se ve pero no se puede usar. React 18 aún no conoce el atributo.
  useEffect(() => {
    frameRef.current?.setAttribute("inert", "");
  }, []);

  return (
    <section aria-label={it.admin.pageEditor.preview}>
      <p className={styles.previewNotice}>{it.admin.pageEditor.previewNotice}</p>
      <div ref={frameRef} className={`${styles.previewFrame} ${styles.previewPadding}`}>
        <SiteSettingsContext.Provider value={settings}>
          <div className="container">
            <PostArticle post={draft} category={category} />
          </div>
        </SiteSettingsContext.Provider>
      </div>
    </section>
  );
}
