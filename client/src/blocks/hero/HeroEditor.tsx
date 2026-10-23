import { ImageField } from "../../admin/ImageField";
import { TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

export default function HeroEditor({ data, onChange, errors, idPrefix }: BlockEditorProps<"hero">) {
  const labels = it.admin.blockEditors.hero;
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
      <TextField
        id={`${idPrefix}-subtitle`}
        label={labels.subtitle}
        value={data.subtitle}
        onChange={(subtitle) => onChange({ ...data, subtitle })}
        error={errors.subtitle}
        multiline
        optional
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
        id={`${idPrefix}-buttonLabel`}
        label={labels.buttonLabel}
        value={data.buttonLabel}
        onChange={(buttonLabel) => onChange({ ...data, buttonLabel })}
        error={errors.buttonLabel}
        optional
      />
      <TextField
        id={`${idPrefix}-buttonHref`}
        label={labels.buttonHref}
        hint={labels.buttonHrefHelp}
        value={data.buttonHref}
        onChange={(buttonHref) => onChange({ ...data, buttonHref })}
        error={errors.buttonHref}
        optional
      />
    </>
  );
}
