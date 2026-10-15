import {
  BLOG_SLUG,
  HOME_SLUG,
  pageInputSchema,
  slugify,
  zodFieldErrors,
  type Page,
  type PageInput,
  type SiteSettings,
} from "@studio/shared";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageError, PageLoading } from "../components/PageStatus";
import { CheckboxField, TextField } from "../components/TextField";
import { it } from "../i18n/it";
import { ApiRequestError } from "../lib/api";
import { pagePath } from "../lib/paths";
import { SiteSettingsContext } from "../lib/SiteSettingsContext";
import { useLoad } from "../lib/useLoad";
import { PageContent } from "../pages/PublicPage";
import styles from "./Admin.module.css";
import { adminApi } from "./adminApi";
import { BlockListEditor } from "./BlockListEditor";
import { toPageInput } from "./PagesList";
import { useToast } from "./Toast";
import { useUnsavedChangesWarning } from "./useUnsavedChangesWarning";

const NEW_PAGE: PageInput = {
  title: "",
  slug: "",
  order: 0,
  published: false,
  showInMenu: true,
  seo: { title: "", description: "" },
  blocks: [],
};

// Crear (/admin/pagine/nuova) o editar (/admin/pagine/:id) una página.
// Este componente solo carga los datos; el formulario está en PageEditorForm.
export function PageEditor() {
  const { id } = useParams();
  const { state, reload } = useLoad(
    () => Promise.all([id ? adminApi.getPage(id) : null, adminApi.getSettings()]),
    [id],
  );

  if (state.status === "loading") return <PageLoading />;
  if (state.status === "error") {
    return <PageError message={state.error.message} onRetry={reload} />;
  }

  const [page, settings] = state.data;
  // `key`: al pasar de una página a otra, el formulario empieza de cero.
  return <PageEditorForm key={id ?? "new"} page={page} settings={settings} />;
}

interface PageEditorFormProps {
  // null = página nueva.
  page: Page | null;
  // Para la vista previa (el footer y los recapiti salen de aquí).
  settings: SiteSettings;
}

function PageEditorForm({ page, settings }: PageEditorFormProps) {
  const isNew = page === null;
  const isHome = page?.slug === HOME_SLUG;
  // La portada del blog: su dirección es fija (la usan /blog y sus artículos).
  const isBlog = page?.slug === BLOG_SLUG;
  const labels = it.admin.pageEditor;

  // `saved` es lo último guardado; `draft`, lo que hay en pantalla.
  const [saved, setSaved] = useState<PageInput>(page ? toPageInput(page) : NEW_PAGE);
  const [draft, setDraft] = useState<PageInput>(saved);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  // En una página nueva la dirección sigue al título hasta que se edita a mano.
  const [slugEdited, setSlugEdited] = useState(!isNew);

  const navigate = useNavigate();
  const showToast = useToast();

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const { allowNextNavigation } = useUnsavedChangesWarning(dirty);

  function update(changes: Partial<PageInput>) {
    setDraft((current) => ({ ...current, ...changes }));
  }

  function updateTitle(title: string) {
    update(slugEdited ? { title } : { title, slug: slugify(title) });
  }

  // Guarda el borrador. `changes` permite guardar y publicar/ocultar a la vez.
  async function save(changes: Partial<PageInput> = {}) {
    const candidate = { ...draft, ...changes };

    // Misma validación que el backend, para avisar sin esperar a la red.
    const result = pageInputSchema.safeParse(candidate);
    if (!result.success) {
      setErrors(zodFieldErrors(result.error));
      showToast(it.admin.common.checkFields, "error");
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      if (page) {
        const updated = toPageInput(await adminApi.updatePage(page.id, result.data));
        setSaved(updated);
        setDraft(updated);
        showToast(it.admin.common.saved);
      } else {
        // Una página nueva va al final del menú.
        const order = (await adminApi.listPages()).length;
        const created = await adminApi.createPage({ ...result.data, order });
        showToast(labels.created);
        allowNextNavigation();
        navigate(`/admin/pagine/${created.id}`, { replace: true });
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

  return (
    <>
      <p>
        <Link to="/admin/pagine">← {labels.backToPages}</Link>
      </p>
      <div className={styles.pageHeader}>
        <h1>{heading}</h1>
        <span className={draft.published ? styles.badgeOn : styles.badgeOff}>
          {draft.published ? it.admin.pages.published : it.admin.pages.draft}
        </span>
      </div>

      {previewing && <PagePreview draft={draft} settings={settings} />}

      {/* Durante la vista previa el formulario se oculta, no se desmonta: así no se pierde nada. */}
      <div hidden={previewing}>
        {isBlog && (
          <p className={styles.notice}>
            {labels.blogPageHelp} <Link to="/admin/blog">{labels.manageBlog}</Link>
          </p>
        )}
        <section className={styles.card}>
          <TextField
            id="page-title"
            label={labels.pageTitle}
            value={draft.title}
            onChange={updateTitle}
            error={errors.title}
          />
          {/* La página inicial vive siempre en "/": su dirección no se muestra ni se cambia. */}
          {!isHome && !isBlog && (
            <TextField
              id="page-slug"
              label={labels.address}
              hint={`${labels.addressHelp} ${window.location.host}/${draft.slug}`}
              value={draft.slug}
              onChange={(slug) => {
                setSlugEdited(true);
                update({ slug });
              }}
              error={errors.slug}
            />
          )}
          <CheckboxField
            id="page-showInMenu"
            label={labels.showInMenu}
            checked={draft.showInMenu}
            onChange={(showInMenu) => update({ showInMenu })}
          />
        </section>

        <BlockListEditor
          blocks={draft.blocks}
          onChange={(blocks) => update({ blocks })}
          errors={errors}
        />

        <section className={styles.card}>
          <h2>{labels.seoSection}</h2>
          <p className={styles.help}>{labels.seoHelp}</p>
          <TextField
            id="page-seo-title"
            label={labels.seoTitle}
            value={draft.seo.title}
            onChange={(title) => update({ seo: { ...draft.seo, title } })}
            error={errors["seo.title"]}
            optional
          />
          <TextField
            id="page-seo-description"
            label={labels.seoDescription}
            value={draft.seo.description}
            onChange={(description) => update({ seo: { ...draft.seo, description } })}
            error={errors["seo.description"]}
            multiline
            optional
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
          {previewing ? labels.closePreview : labels.preview}
        </button>
        {!isHome && (
          <button
            type="button"
            className="button button-secondary"
            disabled={saving}
            onClick={() => save({ published: !draft.published })}
          >
            {draft.published ? it.admin.pages.unpublish : it.admin.pages.publish}
          </button>
        )}
        {saved.published && !isNew && (
          <a href={pagePath(saved.slug)} target="_blank" rel="noopener noreferrer">
            {it.admin.common.viewOnSite}
          </a>
        )}
      </div>
    </>
  );
}

// Vista previa: dibuja el borrador con los mismos componentes que el sitio público.
function PagePreview({ draft, settings }: { draft: PageInput; settings: SiteSettings }) {
  const frameRef = useRef<HTMLDivElement>(null);

  // `inert`: la vista previa se ve pero no se puede usar (así nadie envía el
  // formulario de contacto desde aquí). React 18 aún no conoce el atributo,
  // por eso se pone a mano.
  useEffect(() => {
    frameRef.current?.setAttribute("inert", "");
  }, []);

  const page: Page = { ...draft, id: "preview", updatedAt: new Date().toISOString() };

  return (
    <section aria-label={it.admin.pageEditor.preview}>
      <p className={styles.previewNotice}>{it.admin.pageEditor.previewNotice}</p>
      <div ref={frameRef} className={styles.previewFrame}>
        <SiteSettingsContext.Provider value={settings}>
          <PageContent page={page} updateMeta={false} />
        </SiteSettingsContext.Provider>
      </div>
    </section>
  );
}
