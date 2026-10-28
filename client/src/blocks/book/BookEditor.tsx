import { ImageField } from "../../admin/ImageField";
import { TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

export default function BookEditor({ data, onChange, errors, idPrefix }: BlockEditorProps<"book">) {
  const labels = it.admin.blockEditors.book;
  const imageLabels = it.admin.blockEditors.image;

  return (
    <>
      <TextField
        id={`${idPrefix}-eyebrow`}
        label={labels.eyebrow}
        hint={labels.eyebrowHelp}
        value={data.eyebrow}
        onChange={(eyebrow) => onChange({ ...data, eyebrow })}
        error={errors.eyebrow}
        optional
      />
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
        optional
      />
      <TextField
        id={`${idPrefix}-text`}
        label={labels.text}
        value={data.text}
        onChange={(text) => onChange({ ...data, text })}
        error={errors.text}
        multiline
        rows={4}
        optional
      />
      <ImageField
        id={`${idPrefix}-coverUrl`}
        label={labels.cover}
        value={data.coverUrl}
        onChange={(coverUrl) => onChange({ ...data, coverUrl })}
        error={errors.coverUrl}
      />
      <TextField
        id={`${idPrefix}-coverAlt`}
        label={labels.coverAlt}
        hint={imageLabels.altHelp}
        value={data.coverAlt}
        onChange={(coverAlt) => onChange({ ...data, coverAlt })}
        error={errors.coverAlt}
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
      <TextField
        id={`${idPrefix}-linkLabel`}
        label={labels.linkLabel}
        value={data.linkLabel}
        onChange={(linkLabel) => onChange({ ...data, linkLabel })}
        error={errors.linkLabel}
        optional
      />
      <TextField
        id={`${idPrefix}-linkHref`}
        label={labels.linkHref}
        hint={labels.linkHrefHelp}
        value={data.linkHref}
        onChange={(linkHref) => onChange({ ...data, linkHref })}
        error={errors.linkHref}
        optional
      />
    </>
  );
}
