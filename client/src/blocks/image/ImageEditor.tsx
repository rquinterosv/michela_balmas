import { ImageField } from "../../admin/ImageField";
import { TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

export function ImageEditor({ data, onChange, errors, idPrefix }: BlockEditorProps<"image">) {
  const labels = it.admin.blockEditors.image;

  return (
    <>
      <ImageField
        id={`${idPrefix}-url`}
        label={labels.url}
        value={data.url}
        onChange={(url) => onChange({ ...data, url })}
        error={errors.url}
      />
      <TextField
        id={`${idPrefix}-alt`}
        label={labels.alt}
        hint={labels.altHelp}
        value={data.alt}
        onChange={(alt) => onChange({ ...data, alt })}
        error={errors.alt}
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
