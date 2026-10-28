import { IconItemsEditor } from "../../admin/IconItemsEditor";
import { TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

export default function TimelineEditor(props: BlockEditorProps<"timeline">) {
  const { data, onChange, errors, idPrefix } = props;

  return (
    <IconItemsEditor
      {...props}
      variant="step"
      defaultIcon="flag"
      afterTitle={
        <TextField
          id={`${idPrefix}-intro`}
          label={it.admin.blockEditors.iconItems.intro}
          value={data.intro ?? ""}
          onChange={(intro) => onChange({ ...data, intro })}
          error={errors.intro}
          multiline
          rows={2}
          optional
        />
      }
    />
  );
}
