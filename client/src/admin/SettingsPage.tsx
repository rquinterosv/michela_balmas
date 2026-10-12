import { siteSettingsSchema, zodFieldErrors, type SiteSettings } from "@studio/shared";
import { useState, type FormEvent } from "react";
import { PageError, PageLoading } from "../components/PageStatus";
import { CheckboxField, TextField } from "../components/TextField";
import { it } from "../i18n/it";
import { ApiRequestError } from "../lib/api";
import { useLoad } from "../lib/useLoad";
import styles from "./Admin.module.css";
import { adminApi } from "./adminApi";
import { useToast } from "./Toast";
import { useUnsavedChangesWarning } from "./useUnsavedChangesWarning";

// "Impostazioni del sito": los datos que salen en el footer, en los recapiti y
// en el formulario de contacto.
export function SettingsPage() {
  const { state, reload } = useLoad(() => adminApi.getSettings(), []);

  if (state.status === "loading") return <PageLoading />;
  if (state.status === "error") {
    return <PageError message={state.error.message} onRetry={reload} />;
  }
  return <SettingsForm settings={state.data} />;
}

function SettingsForm({ settings }: { settings: SiteSettings }) {
  const labels = it.admin.settings;
  const [saved, setSaved] = useState(settings);
  const [draft, setDraft] = useState(settings);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

  useUnsavedChangesWarning(JSON.stringify(draft) !== JSON.stringify(saved));

  function update(changes: Partial<SiteSettings>) {
    setDraft((current) => ({ ...current, ...changes }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const result = siteSettingsSchema.safeParse(draft);
    if (!result.success) {
      setErrors(zodFieldErrors(result.error));
      showToast(it.admin.common.checkFields, "error");
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      const updated = await adminApi.saveSettings(result.data);
      setSaved(updated);
      setDraft(updated);
      showToast(it.admin.common.saved);
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

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>{labels.title}</h1>
      <p className={styles.help}>{labels.intro}</p>

      <section className={styles.card}>
        <h2>{labels.professionalSection}</h2>
        <TextField
          id="settings-siteName"
          label={labels.siteName}
          value={draft.siteName}
          onChange={(siteName) => update({ siteName })}
          error={errors.siteName}
        />
        <TextField
          id="settings-professionalTitle"
          label={labels.professionalTitle}
          placeholder={labels.professionalTitlePlaceholder}
          value={draft.professionalTitle}
          onChange={(professionalTitle) => update({ professionalTitle })}
          error={errors.professionalTitle}
        />
        <TextField
          id="settings-alboRegion"
          label={labels.alboRegion}
          hint={labels.alboRegionHelp}
          value={draft.albo.region}
          onChange={(region) => update({ albo: { ...draft.albo, region } })}
          error={errors["albo.region"]}
        />
        <TextField
          id="settings-alboNumber"
          label={labels.alboNumber}
          value={draft.albo.number}
          onChange={(number) => update({ albo: { ...draft.albo, number } })}
          error={errors["albo.number"]}
        />
        <TextField
          id="settings-vatNumber"
          label={labels.vatNumber}
          value={draft.vatNumber}
          onChange={(vatNumber) => update({ vatNumber })}
          error={errors.vatNumber}
        />
      </section>

      <section className={styles.card}>
        <h2>{labels.contactSection}</h2>
        <TextField
          id="settings-email"
          type="email"
          label={labels.email}
          value={draft.email}
          onChange={(email) => update({ email })}
          error={errors.email}
        />
        <TextField
          id="settings-phone"
          type="tel"
          label={labels.phone}
          value={draft.phone}
          onChange={(phone) => update({ phone })}
          error={errors.phone}
          optional
        />
        <TextField
          id="settings-address"
          label={labels.address}
          value={draft.address}
          onChange={(address) => update({ address })}
          error={errors.address}
          optional
        />
        <CheckboxField
          id="settings-onlineSessions"
          label={labels.onlineSessions}
          checked={draft.onlineSessions}
          onChange={(onlineSessions) => update({ onlineSessions })}
        />
      </section>

      <section className={styles.card}>
        <h2>{labels.socialSection}</h2>
        <TextField
          id="settings-instagram"
          type="url"
          label={labels.instagram}
          value={draft.social.instagram}
          onChange={(instagram) => update({ social: { ...draft.social, instagram } })}
          error={errors["social.instagram"]}
          optional
        />
        <TextField
          id="settings-linkedin"
          type="url"
          label={labels.linkedin}
          value={draft.social.linkedin}
          onChange={(linkedin) => update({ social: { ...draft.social, linkedin } })}
          error={errors["social.linkedin"]}
          optional
        />
      </section>

      <section className={styles.card}>
        <h2>{labels.reasonsSection}</h2>
        <p className={styles.help}>{labels.reasonsHelp}</p>
        {draft.contactReasons.map((reason, index) => (
          <div key={index} className={styles.inlineRow}>
            <TextField
              id={`settings-reason-${index}`}
              label={`${labels.reason} ${index + 1}`}
              value={reason}
              onChange={(value) =>
                update({
                  contactReasons: draft.contactReasons.map((old, i) => (i === index ? value : old)),
                })
              }
              error={errors[`contactReasons.${index}`]}
            />
            <button
              type="button"
              className={styles.textButton}
              onClick={() =>
                update({ contactReasons: draft.contactReasons.filter((_, i) => i !== index) })
              }
            >
              {labels.removeReason}
              <span className="visually-hidden"> {index + 1}</span>
            </button>
          </div>
        ))}
        {errors.contactReasons && (
          <p role="alert" className={styles.formError}>
            {errors.contactReasons}
          </p>
        )}
        <button
          type="button"
          className="button button-secondary"
          onClick={() => update({ contactReasons: [...draft.contactReasons, ""] })}
        >
          {labels.addReason}
        </button>
      </section>

      <div className={styles.stickyBar}>
        <button type="submit" className="button" disabled={saving}>
          {saving ? it.admin.common.saving : it.admin.common.save}
        </button>
      </div>
    </form>
  );
}
