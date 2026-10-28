import styles from "../../admin/Admin.module.css";
import { TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

export default function LatestPostsEditor({
  data,
  onChange,
  errors,
  idPrefix,
}: BlockEditorProps<"latestPosts">) {
  const labels = it.admin.blockEditors.latestPosts;

  return (
    <>
      <p className={styles.help}>{labels.help}</p>
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
        rows={2}
        optional
      />
    </>
  );
}
