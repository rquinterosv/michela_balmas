import type { Block } from "@studio/shared";
import sanitizeHtml from "sanitize-html";

// El HTML del editor de texto (TipTap) se guarda y luego se muestra en el sitio
// público, así que se limpia antes de guardarlo: solo quedan las etiquetas que el
// editor sabe producir. Cualquier otra cosa (<script>, estilos, onclick…) se elimina.
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "strong", "em", "ul", "ol", "li", "a"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      // Los enlaces que abren otra pestaña no deben dar acceso a window.opener.
      a: (tagName, attribs) => ({
        tagName,
        attribs: attribs.target === "_blank" ? { ...attribs, rel: "noopener noreferrer" } : attribs,
      }),
    },
  });
}

// Limpia el HTML de los bloques que lo contienen.
// Si un tipo nuevo de bloque guarda HTML del editor, hay que agregarlo aquí.
export function sanitizeBlocks(blocks: Block[]): Block[] {
  return blocks.map((block) => {
    if (block.type === "richText") {
      return { ...block, data: { ...block.data, html: sanitizeRichText(block.data.html) } };
    }
    if (block.type === "about") {
      return { ...block, data: { ...block.data, html: sanitizeRichText(block.data.html) } };
    }
    return block;
  });
}
