import type { BlockData, BlockType } from "@studio/shared";

// Lo que recibe el formulario de edición de cualquier tipo de bloque.
export interface BlockEditorProps<T extends BlockType> {
  data: BlockData<T>;
  // Se llama con los datos completos del bloque, ya modificados.
  onChange: (data: BlockData<T>) => void;
  // Errores de validación de este bloque. La clave es la ruta del campo dentro
  // de `data`: "title", "lists.0.title", "lists.0.items.2"…
  errors: Record<string, string>;
  // Prefijo único para los id de los campos (hay varios bloques en la misma página).
  idPrefix: string;
}
