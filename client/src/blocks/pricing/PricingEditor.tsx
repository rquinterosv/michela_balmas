import { IconPicker } from "../../admin/IconPicker";
import { ItemListEditor } from "../../admin/ItemListEditor";
import { TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

export default function PricingEditor({
  data,
  onChange,
  errors,
  idPrefix,
}: BlockEditorProps<"pricing">) {
  const labels = it.admin.blockEditors.pricing;

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
        legend={labels.prices}
        items={data.prices}
        onChange={(prices) => onChange({ ...data, prices })}
        itemLabel={labels.price}
        addLabel={labels.addPrice}
        createItem={() => ({ id: crypto.randomUUID(), name: "", description: "", price: "" })}
        renderFields={(item, index, update) => {
          const fieldId = `${idPrefix}-price-${item.id}`;
          return (
            <>
              <TextField
                id={`${fieldId}-name`}
                label={labels.name}
                value={item.name}
                onChange={(name) => update({ ...item, name })}
                error={errors[`prices.${index}.name`]}
              />
              <TextField
                id={`${fieldId}-description`}
                label={labels.description}
                value={item.description}
                onChange={(description) => update({ ...item, description })}
                error={errors[`prices.${index}.description`]}
                optional
              />
              <TextField
                id={`${fieldId}-price`}
                label={labels.amount}
                hint={labels.amountHelp}
                value={item.price}
                onChange={(price) => update({ ...item, price })}
                error={errors[`prices.${index}.price`]}
              />
            </>
          );
        }}
      />
      <ItemListEditor
        legend={labels.notes}
        items={data.notes}
        onChange={(notes) => onChange({ ...data, notes })}
        itemLabel={labels.note}
        addLabel={labels.addNote}
        createItem={() => ({
          id: crypto.randomUUID(),
          icon: "shield-check" as const,
          title: "",
          text: "",
        })}
        renderFields={(item, index, update) => {
          const fieldId = `${idPrefix}-note-${item.id}`;
          return (
            <>
              <IconPicker
                name={`${fieldId}-icon`}
                label={labels.icon}
                value={item.icon}
                onChange={(icon) => update({ ...item, icon })}
              />
              <TextField
                id={`${fieldId}-title`}
                label={labels.noteTitle}
                value={item.title}
                onChange={(title) => update({ ...item, title })}
                error={errors[`notes.${index}.title`]}
              />
              <TextField
                id={`${fieldId}-text`}
                label={labels.noteText}
                value={item.text}
                onChange={(text) => update({ ...item, text })}
                error={errors[`notes.${index}.text`]}
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
