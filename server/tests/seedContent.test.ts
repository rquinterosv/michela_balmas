import { pageInputSchema, siteSettingsSchema } from "@studio/shared";
import { describe, expect, it } from "vitest";
import { seedPages, seedSettings } from "../scripts/seedContent";
import { sanitizeBlocks, sanitizeRichText } from "../src/services/sanitizeHtml";

// El seed no se puede probar sin emuladores, pero sí su contenido.
describe("contenido del seed", () => {
  it("los datos del sitio cumplen el esquema", () => {
    expect(siteSettingsSchema.safeParse(seedSettings).success).toBe(true);
  });

  it.each(Object.entries(seedPages))("la página %s cumple el esquema", (_id, page) => {
    expect(pageInputSchema.safeParse(page).success).toBe(true);
  });

  it.each(Object.entries(seedPages))(
    "el HTML de la página %s no cambia al limpiarlo",
    (_id, page) => {
      // Si cambiara, el seed estaría usando etiquetas que el editor no permite.
      expect(sanitizeBlocks(page.blocks)).toEqual(page.blocks);
    },
  );
});

describe("sanitizeRichText", () => {
  it("elimina scripts y atributos peligrosos", () => {
    const dirty = '<p onclick="x()">Ciao</p><script>alert(1)</script><img src="x" onerror="y()">';

    expect(sanitizeRichText(dirty)).toBe("<p>Ciao</p>");
  });

  it("elimina los enlaces javascript:", () => {
    expect(sanitizeRichText('<a href="javascript:alert(1)">clic</a>')).toBe("<a>clic</a>");
  });

  it("conserva el formato que produce el editor", () => {
    const html =
      '<p><strong>Grassetto</strong> e <em>corsivo</em></p><ul><li>Voce</li></ul><p><a href="https://esempio.it">link</a></p>';

    expect(sanitizeRichText(html)).toBe(html);
  });
});
