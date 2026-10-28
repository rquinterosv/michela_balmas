import { ItemListEditor } from "../../admin/ItemListEditor";
import { TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

export default function MilestonesEditor({
  data,
  onChange,
  errors,
  idPrefix,
}: BlockEditorProps<"milestones">) {
  const labels = it.admin.blockEditors.milestones;

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
        rows={2}
        optional
      />
      <ItemListEditor
        legend={labels.items}
        items={data.items}
        onChange={(items) => onChange({ ...data, items })}
        itemLabel={labels.item}
        addLabel={labels.add}
        createItem={() => ({ id: crypto.randomUUID(), year: "", title: "", place: "" })}
        renderFields={(item, index, update) => {
          const fieldId = `${idPrefix}-item-${item.id}`;
          return (
            <>
              <TextField
                id={`${fieldId}-year`}
                label={labels.year}
                value={item.year}
                onChange={(year) => update({ ...item, year })}
                error={errors[`items.${index}.year`]}
              />
              <TextField
                id={`${fieldId}-title`}
                label={labels.itemTitle}
                value={item.title}
                onChange={(title) => update({ ...item, title })}
                error={errors[`items.${index}.title`]}
              />
              <TextField
                id={`${fieldId}-place`}
                label={labels.place}
                value={item.place}
                onChange={(place) => update({ ...item, place })}
                error={errors[`items.${index}.place`]}
                optional
              />
            </>
          );
        }}
      />
    </>
  );
}
