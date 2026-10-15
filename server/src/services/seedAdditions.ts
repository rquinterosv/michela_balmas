import type { Block } from "@studio/shared";

// Añade una sección al final de una página, salvo que ya tenga una del mismo tipo
// (o con el mismo id). Devuelve las secciones nuevas, o null si no hay que hacer
// nada. La usa el seed para los añadidos de una sola vez (p. ej. las preguntas
// frecuentes al final de una Home que ya existe).
export function appendBlockIfMissing(blocks: Block[], block: Block): Block[] | null {
  const alreadyThere = blocks.some((other) => other.type === block.type || other.id === block.id);
  return alreadyThere ? null : [...blocks, block];
}
