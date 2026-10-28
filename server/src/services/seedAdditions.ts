import type { Block, BlockType } from "@studio/shared";

// Añade una sección a una página, salvo que ya tenga una del mismo tipo (o con el
// mismo id). Con `after`, la coloca detrás de la última sección de ese tipo (si la
// página no tiene ninguna, al final). Devuelve las secciones nuevas, o null si no hay
// que hacer nada. La usa el seed para los añadidos de una sola vez (p. ej. las
// preguntas frecuentes al final de una Home que ya existe).
export function appendBlockIfMissing(
  blocks: Block[],
  block: Block,
  after?: BlockType,
): Block[] | null {
  const alreadyThere = blocks.some((other) => other.type === block.type || other.id === block.id);
  if (alreadyThere) return null;

  const anchor = after ? blocks.map((other) => other.type).lastIndexOf(after) : -1;
  if (anchor === -1) return [...blocks, block];
  return [...blocks.slice(0, anchor + 1), block, ...blocks.slice(anchor + 1)];
}
