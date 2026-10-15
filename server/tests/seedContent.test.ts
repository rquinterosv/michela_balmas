import {
  categoryInputSchema,
  pageInputSchema,
  postInputSchema,
  siteSettingsSchema,
} from "@studio/shared";
import { describe, expect, it } from "vitest";
import { seedCategories, seedPages, seedPosts, seedSettings } from "@studio/shared/seedContent";
import { sanitizeBlocks, sanitizeRichText } from "../src/services/sanitizeHtml";
import { mergePageOrder } from "../src/services/seedOrder";

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

describe("contenido de ejemplo del blog", () => {
  it.each(Object.entries(seedCategories))("la categoría %s cumple el esquema", (_id, category) => {
    expect(categoryInputSchema.safeParse(category).success).toBe(true);
  });

  it.each(Object.entries(seedPosts))("el artículo %s cumple el esquema", (_id, post) => {
    expect(postInputSchema.safeParse(post).success).toBe(true);
    expect(sanitizeBlocks(post.blocks)).toEqual(post.blocks);
    expect(Object.keys(seedCategories)).toContain(post.categoryId);
  });

  it("hay 6 artículos y todos están marcados para revisar", () => {
    const posts = Object.values(seedPosts);
    expect(posts).toHaveLength(6);
    for (const post of posts) expect(JSON.stringify(post.blocks)).toContain("DA REVISIONARE");
  });
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

describe("sanitizeBlocks", () => {
  it("limpia el HTML de cada fila del bloque zigzag", () => {
    const row = { id: "r1", imageUrl: "", imageAlt: "", title: "Titolo", html: "" };
    const [block] = sanitizeBlocks([
      {
        id: "z",
        type: "zigzag",
        data: { rows: [{ ...row, html: "<p>Testo</p><script>alert(1)</script>" }] },
      },
    ]);

    expect(block).toEqual({
      id: "z",
      type: "zigzag",
      data: { rows: [{ ...row, html: "<p>Testo</p>" }] },
    });
  });
});

describe("mergePageOrder", () => {
  it("coloca cada página nueva delante de la primera que va después en el contenido inicial", () => {
    const current = [
      { id: "home", seedOrder: 0 },
      { id: "contatti", seedOrder: 3 },
      { id: "creata-dal-pannello", seedOrder: null },
      { id: "privacy-policy", seedOrder: 4 },
    ];
    const added = [
      { id: "blog", seedOrder: 2 },
      { id: "come-lavoro", seedOrder: 1 },
    ];

    expect(mergePageOrder(current, added)).toEqual([
      "home",
      "come-lavoro",
      "blog",
      "contatti",
      "creata-dal-pannello",
      "privacy-policy",
    ]);
  });

  it("si ninguna va después, la nueva queda al final", () => {
    expect(
      mergePageOrder([{ id: "home", seedOrder: 0 }], [{ id: "chi-sono", seedOrder: 6 }]),
    ).toEqual(["home", "chi-sono"]);
  });
});
