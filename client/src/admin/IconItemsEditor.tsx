import type { IconItem, IconName } from "@studio/shared";
import type { ReactNode } from "react";
import { TextField } from "../components/TextField";
import { it } from "../i18n/it";
import styles from "./Admin.module.css";
import { IconPicker } from "./IconPicker";

interface IconItemsData {
  title: string;
  items: IconItem[];
}

interface IconItemsEditorProps<T extends IconItemsData> {
  data: T;
  onChange: (data: T) => void;
  errors: Record<string, string>;
  idPrefix: string;
  // "card": tarjetas («Elemento 1»); "step": etapas numeradas («Tappa 1»).
  variant: "card" | "step";
  // Campos extra bajo el título de la sección (p. ej. la entradilla del percorso).
  afterTitle?: ReactNode;
  // Icono de un elemento recién añadido.
  defaultIcon: IconName;
}

// Formulario común de los bloques "features" y "timeline": título de la sección y
// una lista de elementos (icono, título, texto) que se pueden añadir, editar,
// reordenar y eliminar.
export function IconItemsEditor<T extends IconItemsData>(props: IconItemsEditorProps<T>) {
  const { data, onChange, errors, idPrefix, variant, defaultIcon, afterTitle } = props;
  const labels = it.admin.blockEditors.iconItems;
  const itemLabel = variant === "step" ? labels.step : labels.item;

  function setItems(items: IconItem[]) {
    onChange({ ...data, items });
  }

  function updateItem(index: number, item: IconItem) {
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
        label={labels.sectionTitle}
        value={data.title}
        onChange={(title) => onChange({ ...data, title })}
        error={errors.title}
        optional
      />
      {afterTitle}

      <fieldset className={styles.fieldset}>
        <legend>{variant === "step" ? labels.steps : labels.items}</legend>
        {variant === "step" && <p className={styles.help}>{labels.stepsHelp}</p>}
        {data.items.length === 0 && <p>{labels.noItems}</p>}

        {data.items.map((item, index) => {
          const name = itemLabel(index + 1);
          const fieldId = `${idPrefix}-item-${item.id}`;

          return (
            <div key={item.id} className={styles.subCard}>
              <div className={styles.subCardHeader}>
                <h4 className={styles.cardTitle}>{name}</h4>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.iconButton}
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
                    className={styles.iconButton}
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
                    className={styles.textButtonDanger}
                    onClick={() => setItems(data.items.filter((_, i) => i !== index))}
                  >
                    {labels.remove}
                    <span className="visually-hidden">: {name}</span>
                  </button>
                </div>
              </div>

              <IconPicker
                name={`${fieldId}-icon`}
                label={labels.icon}
                value={item.icon}
                onChange={(icon) => updateItem(index, { ...item, icon })}
              />
              <TextField
                id={`${fieldId}-title`}
                label={labels.title}
                value={item.title}
                onChange={(title) => updateItem(index, { ...item, title })}
                error={errors[`items.${index}.title`]}
              />
              <TextField
                id={`${fieldId}-text`}
                label={labels.text}
                value={item.text}
                onChange={(text) => updateItem(index, { ...item, text })}
                error={errors[`items.${index}.text`]}
                multiline
                rows={2}
                optional
              />
            </div>
          );
        })}

        <button
          type="button"
          className="button button-secondary"
          onClick={() =>
            setItems([
              ...data.items,
              { id: crypto.randomUUID(), icon: defaultIcon, title: "", text: "" },
            ])
          }
        >
          {variant === "step" ? labels.addStep : labels.addItem}
        </button>
      </fieldset>
    </>
  );
}
