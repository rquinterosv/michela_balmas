import adminStyles from "../../admin/Admin.module.css";
import { CheckboxField, TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

export default function ContactInfoEditor(props: BlockEditorProps<"contactInfo">) {
  const { data, onChange, errors, idPrefix } = props;
  const labels = it.admin.blockEditors.contactInfo;

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
      <fieldset className={adminStyles.fieldset}>
        <legend>{labels.show}</legend>
        <CheckboxField
          id={`${idPrefix}-showEmail`}
          label={labels.showEmail}
          checked={data.showEmail}
          onChange={(showEmail) => onChange({ ...data, showEmail })}
        />
        <CheckboxField
          id={`${idPrefix}-showPhone`}
          label={labels.showPhone}
          checked={data.showPhone}
          onChange={(showPhone) => onChange({ ...data, showPhone })}
        />
        <CheckboxField
          id={`${idPrefix}-showAddress`}
          label={labels.showAddress}
          checked={data.showAddress}
          onChange={(showAddress) => onChange({ ...data, showAddress })}
        />
        <CheckboxField
          id={`${idPrefix}-showOnlineSessions`}
          label={labels.showOnlineSessions}
          checked={data.showOnlineSessions}
          onChange={(showOnlineSessions) => onChange({ ...data, showOnlineSessions })}
        />
      </fieldset>
      <p className={adminStyles.help}>{labels.help}</p>
    </>
  );
}
