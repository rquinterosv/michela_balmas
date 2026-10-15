import { TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

export default function CtaEditor({ data, onChange, errors, idPrefix }: BlockEditorProps<"cta">) {
  const labels = it.admin.blockEditors.cta;

  return (
    <>
      <TextField
        id={`${idPrefix}-title`}
        label={labels.title}
        value={data.title}
        onChange={(title) => onChange({ ...data, title })}
        error={errors.title}
        optional
      />
      <TextField
        id={`${idPrefix}-text`}
        label={labels.text}
        value={data.text}
        onChange={(text) => onChange({ ...data, text })}
        error={errors.text}
        multiline
        optional
      />
      <TextField
        id={`${idPrefix}-buttonLabel`}
        label={labels.buttonLabel}
        value={data.buttonLabel}
        onChange={(buttonLabel) => onChange({ ...data, buttonLabel })}
        error={errors.buttonLabel}
      />
      <TextField
        id={`${idPrefix}-buttonHref`}
        label={labels.buttonHref}
        hint={labels.buttonHrefHelp}
        value={data.buttonHref}
        onChange={(buttonHref) => onChange({ ...data, buttonHref })}
        error={errors.buttonHref}
      />
    </>
  );
}
