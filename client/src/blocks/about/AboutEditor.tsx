import type { BlockData } from "@studio/shared";
import adminStyles from "../../admin/Admin.module.css";
import { ImageField } from "../../admin/ImageField";
import { RichTextEditor } from "../../admin/RichTextEditor";
import { TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

type AboutList = BlockData<"about">["lists"][number];

export function AboutEditor({ data, onChange, errors, idPrefix }: BlockEditorProps<"about">) {
  const labels = it.admin.blockEditors.about;
  const imageLabels = it.admin.blockEditors.image;

  // Sustituye una lista por su versión modificada.
  function updateList(listIndex: number, list: AboutList) {
    onChange({ ...data, lists: data.lists.map((old, i) => (i === listIndex ? list : old)) });
  }

  return (
    <>
      <TextField
        id={`${idPrefix}-title`}
        label={labels.title}
        value={data.title}
        onChange={(title) => onChange({ ...data, title })}
        error={errors.title}
      />
      <ImageField
        id={`${idPrefix}-photoUrl`}
        label={labels.photo}
        value={data.photoUrl}
        onChange={(photoUrl) => onChange({ ...data, photoUrl })}
        error={errors.photoUrl}
      />
      <TextField
        id={`${idPrefix}-photoAlt`}
        label={imageLabels.alt}
        hint={imageLabels.altHelp}
        value={data.photoAlt}
        onChange={(photoAlt) => onChange({ ...data, photoAlt })}
        error={errors.photoAlt}
        optional
      />
      <RichTextEditor
        id={`${idPrefix}-html`}
        label={labels.text}
        value={data.html}
        onChange={(html) => onChange({ ...data, html })}
        error={errors.html}
      />

      <fieldset className={adminStyles.fieldset}>
        <legend>{labels.lists}</legend>

        {data.lists.map((list, listIndex) => (
          <div key={listIndex} className={adminStyles.subCard}>
            <TextField
              id={`${idPrefix}-list-${listIndex}-title`}
              label={labels.listTitle}
              placeholder={labels.listTitlePlaceholder}
              value={list.title}
              onChange={(title) => updateList(listIndex, { ...list, title })}
              error={errors[`lists.${listIndex}.title`]}
            />

            {list.items.map((item, itemIndex) => (
              <div key={itemIndex} className={adminStyles.inlineRow}>
                <TextField
                  id={`${idPrefix}-list-${listIndex}-item-${itemIndex}`}
                  label={`${labels.listItem} ${itemIndex + 1}`}
                  value={item}
                  onChange={(value) =>
                    updateList(listIndex, {
                      ...list,
                      items: list.items.map((old, i) => (i === itemIndex ? value : old)),
                    })
                  }
                  error={errors[`lists.${listIndex}.items.${itemIndex}`]}
                />
                <button
                  type="button"
                  className={adminStyles.textButton}
                  onClick={() =>
                    updateList(listIndex, {
                      ...list,
                      items: list.items.filter((_, i) => i !== itemIndex),
                    })
                  }
                >
                  {labels.removeItem}
                  <span className="visually-hidden"> {itemIndex + 1}</span>
                </button>
              </div>
            ))}

            <div className={adminStyles.actions}>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => updateList(listIndex, { ...list, items: [...list.items, ""] })}
              >
                {labels.addItem}
              </button>
              <button
                type="button"
                className={adminStyles.textButton}
                onClick={() =>
                  onChange({ ...data, lists: data.lists.filter((_, i) => i !== listIndex) })
                }
              >
                {labels.removeList}
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="button button-secondary"
          onClick={() => onChange({ ...data, lists: [...data.lists, { title: "", items: [""] }] })}
        >
          {labels.addList}
        </button>
      </fieldset>
    </>
  );
}
