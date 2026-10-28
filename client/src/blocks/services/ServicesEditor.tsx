import { ItemListEditor } from "../../admin/ItemListEditor";
import { TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

export default function ServicesEditor({
  data,
  onChange,
  errors,
  idPrefix,
}: BlockEditorProps<"services">) {
  const labels = it.admin.blockEditors.services;

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
        rows={3}
        optional
      />
      <ItemListEditor
        legend={labels.items}
        items={data.items}
        onChange={(items) => onChange({ ...data, items })}
        itemLabel={labels.item}
        addLabel={labels.add}
        createItem={() => ({ id: crypto.randomUUID(), category: "", quote: "", description: "" })}
        renderFields={(item, index, update) => {
          const fieldId = `${idPrefix}-item-${item.id}`;
          return (
            <>
              <TextField
                id={`${fieldId}-category`}
                label={labels.category}
                hint={labels.categoryHelp}
                value={item.category}
                onChange={(category) => update({ ...item, category })}
                error={errors[`items.${index}.category`]}
              />
              <TextField
                id={`${fieldId}-quote`}
                label={labels.quote}
                hint={labels.quoteHelp}
                value={item.quote}
                onChange={(quote) => update({ ...item, quote })}
                error={errors[`items.${index}.quote`]}
                optional
              />
              <TextField
                id={`${fieldId}-description`}
                label={labels.description}
                value={item.description}
                onChange={(description) => update({ ...item, description })}
                error={errors[`items.${index}.description`]}
                multiline
                rows={2}
                optional
              />
            </>
          );
        }}
      />
    </>
  );
}
