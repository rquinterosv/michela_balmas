// Orden de las páginas al añadir las del contenido inicial a un sitio que ya tiene
// páginas (npm run seed sin --force).
//
// Cada página nueva se coloca delante de la primera página existente que, en el
// contenido inicial, va después de ella; si no hay ninguna, al final. Así "Blog"
// entra justo antes de "Contatti" y no detrás de la Cookie Policy. Las páginas
// creadas desde el panel (sin orden inicial) conservan su posición relativa.

export interface OrderedPage {
  id: string;
  // Posición en el contenido inicial, o null si la página no viene de él.
  seedOrder: number | null;
}

// `current`: las páginas existentes, en su orden actual. Devuelve todos los ids
// en el orden final.
export function mergePageOrder(current: OrderedPage[], additions: OrderedPage[]): string[] {
  const result = [...current];
  const sortedAdditions = [...additions].sort((a, b) => (a.seedOrder ?? 0) - (b.seedOrder ?? 0));

  for (const page of sortedAdditions) {
    const before = result.findIndex(
      (other) =>
        other.seedOrder !== null && page.seedOrder !== null && other.seedOrder > page.seedOrder,
    );
    if (before === -1) result.push(page);
    else result.splice(before, 0, page);
  }

  return result.map((page) => page.id);
}
