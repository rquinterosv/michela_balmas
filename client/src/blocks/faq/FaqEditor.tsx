import type { BlockData } from "@studio/shared";
import adminStyles from "../../admin/Admin.module.css";
import { RichTextEditor } from "../../admin/RichTextEditor";
import { TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

type FaqItem = BlockData<"faq">["items"][number];

export default function FaqEditor({ data, onChange, errors, idPrefix }: BlockEditorProps<"faq">) {
  const labels = it.admin.blockEditors.faq;

  function setItems(items: FaqItem[]) {
    onChange({ ...data, items });
  }

  function updateItem(index: number, item: FaqItem) {
    setItems(data.items.map((old, i) => (i === index ? item : old)));
  }

  function move(index: number, direction: -1 | 1) {
    const reordered = [...data.items];
    const [moved] = reordered.splice(index, 1);
    if (!moved) return;
    reordered.splice(index + direction, 0, moved);
    setItems(reordered);
  }

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
        <legend>{labels.items}</legend>
        {data.items.length === 0 && <p>{labels.noItems}</p>}

        {data.items.map((item, index) => {
          const name = labels.item(index + 1);
          // Por id y no por posición: el editor de texto conserva su contenido al reordenar.
          const fieldId = `${idPrefix}-item-${item.id}`;

          return (
            <div key={item.id} className={adminStyles.subCard}>
              <div className={adminStyles.subCardHeader}>
                <h4 className={adminStyles.cardTitle}>{name}</h4>
                <div className={adminStyles.actions}>
                  <button
                    type="button"
                    className={adminStyles.iconButton}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <span aria-hidden="true">↑</span>
                    <span className="visually-hidden">
                      {it.admin.common.moveUp}: {name}
                    </span>
                  </button>
                  <button
                    type="button"
                    className={adminStyles.iconButton}
                    disabled={index === data.items.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <span aria-hidden="true">↓</span>
                    <span className="visually-hidden">
                      {it.admin.common.moveDown}: {name}
                    </span>
                  </button>
                  <button
                    type="button"
                    className={adminStyles.textButtonDanger}
                    onClick={() => setItems(data.items.filter((_, i) => i !== index))}
                  >
                    {labels.remove}
                    <span className="visually-hidden">: {name}</span>
                  </button>
                </div>
              </div>

              <TextField
                id={`${fieldId}-question`}
                label={labels.question}
                value={item.question}
                onChange={(question) => updateItem(index, { ...item, question })}
                error={errors[`items.${index}.question`]}
              />
              <RichTextEditor
                id={`${fieldId}-answer`}
                label={labels.answer}
                value={item.answer}
                onChange={(answer) => updateItem(index, { ...item, answer })}
                error={errors[`items.${index}.answer`]}
              />
            </div>
          );
        })}

        <button
          type="button"
          className="button button-secondary"
          onClick={() =>
            setItems([...data.items, { id: crypto.randomUUID(), question: "", answer: "" }])
          }
        >
          {labels.add}
        </button>
      </fieldset>
    </>
  );
}
