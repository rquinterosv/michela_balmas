import { RichTextEditor } from "../../admin/RichTextEditor";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

export function RichTextBlockEditor(props: BlockEditorProps<"richText">) {
  const { data, onChange, errors, idPrefix } = props;

  return (
    <RichTextEditor
      id={`${idPrefix}-html`}
      label={it.admin.blockEditors.richText.text}
      value={data.html}
      onChange={(html) => onChange({ ...data, html })}
      error={errors.html}
    />
  );
}
