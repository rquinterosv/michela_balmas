import type { ReactNode } from "react";
import { it } from "../i18n/it";
import styles from "./Admin.module.css";

interface ItemListEditorProps<T extends { id: string }> {
  legend: string;
  items: T[];
  onChange: (items: T[]) => void;
  // Nombre de cada elemento en pantalla: «Ambito 1», «Voce 2»…
  itemLabel: (number: number) => string;
  addLabel: string;
  // Elemento nuevo, vacío, al pulsar el botón de añadir.
  createItem: () => T;
  // Los campos de un elemento. `update` recibe el elemento ya modificado.
  renderFields: (item: T, index: number, update: (item: T) => void) => ReactNode;
}

// Lista de elementos de un bloque que se pueden añadir, editar, reordenar y quitar.
// La usan los bloques nuevos del diseño (services, pricing); es la misma interfaz
// que IconItemsEditor, pero los campos de cada elemento los pone el bloque.
export function ItemListEditor<T extends { id: string }>(props: ItemListEditorProps<T>) {
  const { legend, items, onChange, itemLabel, addLabel, createItem, renderFields } = props;
  const labels = it.admin.blockEditors.itemList;

  function move(index: number, direction: -1 | 1) {
    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    if (!moved) return;
    reordered.splice(index + direction, 0, moved);
    onChange(reordered);
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend>{legend}</legend>
      {items.length === 0 && <p>{labels.empty}</p>}

      {items.map((item, index) => {
        const name = itemLabel(index + 1);
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
                  disabled={index === items.length - 1}
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
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                >
                  {labels.remove}
                  <span className="visually-hidden">: {name}</span>
                </button>
              </div>
            </div>

            {renderFields(item, index, (updated) =>
              onChange(items.map((old, i) => (i === index ? updated : old))),
            )}
          </div>
        );
      })}

      <button
        type="button"
        className="button button-secondary"
        onClick={() => onChange([...items, createItem()])}
      >
        {addLabel}
      </button>
    </fieldset>
  );
}
