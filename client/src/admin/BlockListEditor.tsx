import type { Block, BlockType } from "@studio/shared";
import { Suspense, useState, type ComponentType } from "react";
import type { BlockEditorProps } from "../blocks/editorTypes";
import { blockRegistry } from "../blocks/registry";
import { it } from "../i18n/it";
import styles from "./Admin.module.css";
import { ConfirmDialog } from "./ConfirmDialog";

interface BlockListEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  // Errores de toda la página; los de los bloques empiezan por "blocks.<n>.data.".
  errors: Record<string, string>;
}

// Los errores de un bloque, con la clave relativa a sus datos:
// "blocks.2.data.title" -> "title".
function errorsOfBlock(errors: Record<string, string>, index: number): Record<string, string> {
  const prefix = `blocks.${index}.data.`;
  const blockErrors: Record<string, string> = {};
  for (const [key, message] of Object.entries(errors)) {
    if (key.startsWith(prefix)) blockErrors[key.slice(prefix.length)] = message;
  }
  return blockErrors;
}

// Editor de las "Sezioni" de una página: agregar, editar, subir/bajar y eliminar.
export function BlockListEditor({ blocks, onChange, errors }: BlockListEditorProps) {
  // ids de los bloques cuyo formulario está desplegado.
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [choosingType, setChoosingType] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<Block | null>(null);
  const labels = it.admin.pageEditor;

  function toggleOpen(id: string) {
    setOpenIds((ids) => (ids.includes(id) ? ids.filter((old) => old !== id) : [...ids, id]));
  }

  function addBlock(type: BlockType) {
    // El `as Block` es necesario porque TypeScript no relaciona `type` con el
    // `defaultData` de ese mismo tipo al leerlo del registro.
    const block = {
      id: crypto.randomUUID(),
      type,
      data: blockRegistry[type].defaultData,
    } as Block;
    onChange([...blocks, block]);
    setOpenIds((ids) => [...ids, block.id]); // se abre para rellenarlo
    setChoosingType(false);
  }

  function move(index: number, direction: -1 | 1) {
    const reordered = [...blocks];
    const [moved] = reordered.splice(index, 1);
    if (!moved) return;
    reordered.splice(index + direction, 0, moved);
    onChange(reordered);
  }

  function confirmDelete() {
    if (!blockToDelete) return;
    onChange(blocks.filter((block) => block.id !== blockToDelete.id));
    setBlockToDelete(null);
  }

  return (
    <section className={styles.blockSection}>
      <h2>{labels.sections}</h2>
      <p className={styles.help}>{labels.sectionsHelp}</p>

      {blocks.length === 0 && <p>{labels.noSections}</p>}

      <ol className={styles.list}>
        {blocks.map((block, index) => {
          const definition = blockRegistry[block.type];
          const blockErrors = errorsOfBlock(errors, index);
          const hasErrors = Object.keys(blockErrors).length > 0;
          // Un bloque con errores se muestra siempre abierto.
          const isOpen = openIds.includes(block.id) || hasErrors;
          const panelId = `block-${block.id}-panel`;

          // Mismo motivo que en BlockRenderer: el registro garantiza que el editor
          // corresponde al tipo, pero TypeScript no puede comprobarlo aquí.
          const Editor = definition.EditorComponent as ComponentType<BlockEditorProps<BlockType>>;

          return (
            <li key={block.id} className={`${styles.card} ${styles.blockCard}`}>
              <div className={styles.blockHeader}>
                <h3 className={styles.cardTitle}>
                  {index + 1}. {definition.label}
                </h3>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.iconButton}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <span aria-hidden="true">↑</span>
                    <span className="visually-hidden">
                      {it.admin.common.moveUp}: {definition.label}
                    </span>
                  </button>
                  <button
                    type="button"
                    className={styles.iconButton}
                    disabled={index === blocks.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <span aria-hidden="true">↓</span>
                    <span className="visually-hidden">
                      {it.admin.common.moveDown}: {definition.label}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="button button-secondary"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleOpen(block.id)}
                  >
                    {isOpen ? it.admin.common.close : it.admin.common.edit}
                    <span className="visually-hidden">: {definition.label}</span>
                  </button>
                  <button
                    type="button"
                    className={styles.textButtonDanger}
                    onClick={() => setBlockToDelete(block)}
                  >
                    {it.admin.common.delete}
                    <span className="visually-hidden">: {definition.label}</span>
                  </button>
                </div>
              </div>

              {/* Se oculta en vez de desmontarse: así el editor de texto no pierde su estado. */}
              <div id={panelId} hidden={!isOpen} className={styles.blockBody}>
                {/* Suspense: el formulario se descarga la primera vez que hace falta. */}
                <Suspense fallback={<p>{it.admin.common.loading}</p>}>
                  <Editor
                    data={block.data}
                    errors={blockErrors}
                    idPrefix={`block-${block.id}`}
                    onChange={(data) =>
                      onChange(
                        blocks.map((old) =>
                          old.id === block.id ? ({ ...old, data } as Block) : old,
                        ),
                      )
                    }
                  />
                </Suspense>
              </div>
            </li>
          );
        })}
      </ol>

      {choosingType ? (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{labels.chooseSection}</h3>
          <ul className={styles.typeChooser}>
            {(Object.keys(blockRegistry) as BlockType[]).map((type) => (
              <li key={type}>
                <button type="button" className={styles.typeButton} onClick={() => addBlock(type)}>
                  <strong>{blockRegistry[type].label}</strong>
                  <span>{blockRegistry[type].description}</span>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={styles.textButton}
            onClick={() => setChoosingType(false)}
          >
            {it.admin.common.cancel}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="button button-secondary"
          onClick={() => setChoosingType(true)}
        >
          {labels.addSection}
        </button>
      )}

      <ConfirmDialog
        open={blockToDelete !== null}
        title={labels.deleteSectionTitle}
        text={
          blockToDelete ? labels.deleteSectionText(blockRegistry[blockToDelete.type].label) : ""
        }
        confirmLabel={it.admin.common.delete}
        onConfirm={confirmDelete}
        onCancel={() => setBlockToDelete(null)}
      />
    </section>
  );
}
