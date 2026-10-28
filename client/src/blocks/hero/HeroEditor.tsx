import { ImageField } from "../../admin/ImageField";
import { CheckboxField, TextField } from "../../components/TextField";
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
      {/* Sin valor guardado (cabecera anterior al rediseño), se muestran los valores
          por defecto, los mismos que se ven en el sitio. */}
      <CheckboxField
        id={`${idPrefix}-showWhatsapp`}
        label={labels.showWhatsapp}
        checked={data.showWhatsapp ?? true}
        onChange={(showWhatsapp) => onChange({ ...data, showWhatsapp })}
      />
      <TextField
        id={`${idPrefix}-highlights`}
        label={labels.highlights}
        hint={labels.highlightsHelp}
        value={(data.highlights ?? it.hero.defaultHighlights).join("\n")}
        onChange={(text) => onChange({ ...data, highlights: text.split("\n") })}
        error={errors.highlights}
        multiline
        rows={3}
        optional
      />
      <CheckboxField
        id={`${idPrefix}-showAlbo`}
        label={labels.showAlbo}
        checked={data.showAlbo ?? true}
        onChange={(showAlbo) => onChange({ ...data, showAlbo })}
      />
    </>
  );
}
