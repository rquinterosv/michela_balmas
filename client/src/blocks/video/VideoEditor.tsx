import adminStyles from "../../admin/Admin.module.css";
import { ImageField } from "../../admin/ImageField";
import { Field } from "../../components/Field";
import { TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

export default function VideoEditor({
  data,
  onChange,
  errors,
  idPrefix,
}: BlockEditorProps<"video">) {
  const labels = it.admin.blockEditors.video;
  const linkLabelId = `${idPrefix}-linkLabel`;

  return (
    <>
      <TextField
        id={`${idPrefix}-url`}
        type="url"
        label={labels.url}
        hint={labels.urlHelp}
        value={data.url}
        onChange={(url) => onChange({ ...data, url })}
        error={errors.url}
      />
      <TextField
        id={`${idPrefix}-title`}
        label={labels.title}
        hint={labels.titleHelp}
        value={data.title}
        onChange={(title) => onChange({ ...data, title })}
        error={errors.title}
        optional
      />
      {/* ImageField ya trae su propia ayuda; la de la anteprima va encima. */}
      <p className={adminStyles.help}>{labels.posterHelp}</p>
      <ImageField
        id={`${idPrefix}-posterUrl`}
        label={labels.poster}
        value={data.posterUrl}
        onChange={(posterUrl) => onChange({ ...data, posterUrl })}
        error={errors.posterUrl}
      />
      <Field id={linkLabelId} label={labels.linkLabel}>
        <select
          id={linkLabelId}
          value={data.linkLabel}
          onChange={(event) =>
            onChange({ ...data, linkLabel: event.target.value === "guarda" ? "guarda" : "ascolta" })
          }
        >
          <option value="ascolta">{it.video.ascolta}</option>
          <option value="guarda">{it.video.guarda}</option>
        </select>
      </Field>
    </>
  );
}
