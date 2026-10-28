import { TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

export default function QuoteEditor({
  data,
  onChange,
  errors,
  idPrefix,
}: BlockEditorProps<"quote">) {
  return (
    <TextField
      id={`${idPrefix}-text`}
      label={it.admin.blockEditors.quote.text}
      value={data.text}
      onChange={(text) => onChange({ ...data, text })}
      error={errors.text}
      multiline
      rows={3}
    />
  );
}
