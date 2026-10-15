import type { BlockData } from "@studio/shared";
import adminStyles from "../../admin/Admin.module.css";
import { ImageField } from "../../admin/ImageField";
import { RichTextEditor } from "../../admin/RichTextEditor";
import { TextField } from "../../components/TextField";
import { it } from "../../i18n/it";
import type { BlockEditorProps } from "../editorTypes";

type ZigzagRow = BlockData<"zigzag">["rows"][number];

export default function ZigzagEditor({
  data,
  onChange,
  errors,
  idPrefix,
}: BlockEditorProps<"zigzag">) {
  const labels = it.admin.blockEditors.zigzag;
  const imageLabels = it.admin.blockEditors.image;

  function setRows(rows: ZigzagRow[]) {
    onChange({ ...data, rows });
  }

  // Sustituye una fila por su versión modificada.
  function updateRow(rowIndex: number, row: ZigzagRow) {
    setRows(data.rows.map((old, i) => (i === rowIndex ? row : old)));
  }

  function move(rowIndex: number, direction: -1 | 1) {
    const reordered = [...data.rows];
    const [moved] = reordered.splice(rowIndex, 1);
    if (!moved) return;
    reordered.splice(rowIndex + direction, 0, moved);
    setRows(reordered);
  }

  function addRow() {
    setRows([
      ...data.rows,
      { id: crypto.randomUUID(), imageUrl: "", imageAlt: "", title: "", html: "" },
    ]);
  }

  return (
    <fieldset className={adminStyles.fieldset}>
      <legend>{labels.rows}</legend>
      <p className={adminStyles.help}>{labels.help}</p>

      {data.rows.length === 0 && <p>{labels.noRows}</p>}

      {data.rows.map((row, rowIndex) => {
        const rowLabel = labels.row(rowIndex + 1);
        // La fila se identifica por su id (no por su posición): el editor de texto
        // conserva su propio contenido y no debe pasar a otra fila al reordenar.
        const fieldId = `${idPrefix}-row-${row.id}`;
        const rowError = (field: keyof ZigzagRow) => errors[`rows.${rowIndex}.${field}`];

        return (
          <div key={row.id} className={adminStyles.subCard}>
            <div className={adminStyles.subCardHeader}>
              <h4 className={adminStyles.cardTitle}>{rowLabel}</h4>
              <div className={adminStyles.actions}>
                <button
                  type="button"
                  className={adminStyles.iconButton}
                  disabled={rowIndex === 0}
                  onClick={() => move(rowIndex, -1)}
                >
                  <span aria-hidden="true">↑</span>
                  <span className="visually-hidden">
                    {it.admin.common.moveUp}: {rowLabel}
                  </span>
                </button>
                <button
                  type="button"
                  className={adminStyles.iconButton}
                  disabled={rowIndex === data.rows.length - 1}
                  onClick={() => move(rowIndex, 1)}
                >
                  <span aria-hidden="true">↓</span>
                  <span className="visually-hidden">
                    {it.admin.common.moveDown}: {rowLabel}
                  </span>
                </button>
                <button
                  type="button"
                  className={adminStyles.textButtonDanger}
                  onClick={() => setRows(data.rows.filter((_, i) => i !== rowIndex))}
                >
                  {labels.removeRow}
                  <span className="visually-hidden">: {rowLabel}</span>
                </button>
              </div>
            </div>

            <TextField
              id={`${fieldId}-title`}
              label={labels.title}
              value={row.title}
              onChange={(title) => updateRow(rowIndex, { ...row, title })}
              error={rowError("title")}
              optional
            />
            <RichTextEditor
              id={`${fieldId}-html`}
              label={labels.text}
              value={row.html}
              onChange={(html) => updateRow(rowIndex, { ...row, html })}
              error={rowError("html")}
            />
            <ImageField
              id={`${fieldId}-imageUrl`}
              label={labels.image}
              value={row.imageUrl}
              onChange={(imageUrl) => updateRow(rowIndex, { ...row, imageUrl })}
              error={rowError("imageUrl")}
            />
            <TextField
              id={`${fieldId}-imageAlt`}
              label={imageLabels.alt}
              hint={imageLabels.altHelp}
              value={row.imageAlt}
              onChange={(imageAlt) => updateRow(rowIndex, { ...row, imageAlt })}
              error={rowError("imageAlt")}
              optional
            />
          </div>
        );
      })}

      <button type="button" className="button button-secondary" onClick={addRow}>
        {labels.addRow}
      </button>
    </fieldset>
  );
}
