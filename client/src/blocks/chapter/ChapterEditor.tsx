import { ImageField } from "../../admin/ImageField";
import { RichTextEditor } from "../../admin/RichTextEditor";
import { TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

export default function ChapterEditor({
  data,
  onChange,
  errors,
  idPrefix,
}: BlockEditorProps<"chapter">) {
  const labels = it.admin.blockEditors.chapter;
  const imageLabels = it.admin.blockEditors.image;

  return (
    <>
      <TextField
        id={`${idPrefix}-title`}
        label={labels.title}
        value={data.title}
        onChange={(title) => onChange({ ...data, title })}
        error={errors.title}
      />
      <RichTextEditor
        id={`${idPrefix}-html`}
        label={labels.text}
        value={data.html}
        onChange={(html) => onChange({ ...data, html })}
        error={errors.html}
      />
      <ImageField
        id={`${idPrefix}-imageUrl`}
        label={imageLabels.field}
        value={data.imageUrl}
        onChange={(imageUrl) => onChange({ ...data, imageUrl })}
        error={errors.imageUrl}
      />
      <TextField
        id={`${idPrefix}-imageAlt`}
        label={imageLabels.alt}
        hint={imageLabels.altHelp}
        value={data.imageAlt}
        onChange={(imageAlt) => onChange({ ...data, imageAlt })}
        error={errors.imageAlt}
        optional
      />
      <TextField
        id={`${idPrefix}-caption`}
        label={labels.caption}
        value={data.caption}
        onChange={(caption) => onChange({ ...data, caption })}
        error={errors.caption}
        optional
      />
    </>
  );
}
