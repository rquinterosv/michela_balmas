import adminStyles from "../../admin/Admin.module.css";
import { TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

export function ContactFormEditor(props: BlockEditorProps<"contactForm">) {
  const { data, onChange, errors, idPrefix } = props;
  const labels = it.admin.blockEditors.contactForm;

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
        id={`${idPrefix}-intro`}
        label={labels.intro}
        value={data.intro}
        onChange={(intro) => onChange({ ...data, intro })}
        error={errors.intro}
        multiline
        optional
      />
      <p className={adminStyles.help}>{labels.help}</p>
    </>
  );
}
