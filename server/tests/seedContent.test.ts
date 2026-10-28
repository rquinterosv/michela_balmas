import {
  blockSchema,
  categoryInputSchema,
  pageInputSchema,
  postInputSchema,
  siteSettingsSchema,
} from "@studio/shared";
import { describe, expect, it } from "vitest";
import {
  contattiFormBlock,
  homeBookBlock,
  homeCtaBlock,
  homeFaqBlock,
  homeLatestPostsBlock,
  homePricingBlock,
  homeServicesBlock,
  seedCategories,
  seedPages,
  seedPosts,
  seedSettings,
} from "@studio/shared/seedContent";
import { sanitizeBlocks, sanitizeRichText } from "../src/services/sanitizeHtml";
import { contentFingerprint } from "../src/services/contentFingerprint";
import { appendBlockIfMissing } from "../src/services/seedAdditions";
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

describe("contentFingerprint", () => {
  it("no depende del orden de las claves, sí de los valores", () => {
    const a = [{ id: "x", type: "cta", data: { title: "T", text: "" } }];
    const reordered = [{ data: { text: "", title: "T" }, type: "cta", id: "x" }];
    const edited = [{ id: "x", type: "cta", data: { title: "T.", text: "" } }];

    expect(contentFingerprint(reordered)).toBe(contentFingerprint(a));
    expect(contentFingerprint(edited)).not.toBe(contentFingerprint(a));
  });
});

describe("appendBlockIfMissing", () => {
  const faq = homeFaqBlock;
  const text = { id: "t", type: "richText" as const, data: { html: "<p>Ciao</p>" } };

  it("añade la sección al final si la página no tiene una del mismo tipo", () => {
    expect(appendBlockIfMissing([text], faq)).toEqual([text, faq]);
  });

  it("no hace nada si ya hay una sección del mismo tipo", () => {
    const otherFaq = { ...faq, id: "otra" };
    expect(appendBlockIfMissing([text, otherFaq], faq)).toBeNull();
  });

  it("con `after`, la coloca detrás de la última sección de ese tipo", () => {
    const last = { ...text, id: "t2" };
    expect(appendBlockIfMissing([text, last, faq], homeServicesBlock, "richText")).toEqual([
      text,
      last,
      homeServicesBlock,
      faq,
    ]);
  });

  it("con `after` y sin una sección de ese tipo, la añade al final", () => {
    expect(appendBlockIfMissing([text], homeServicesBlock, "hero")).toEqual([
      text,
      homeServicesBlock,
    ]);
  });
});

describe("secciones del rediseño para la Home", () => {
  const blocks = [
    homeServicesBlock,
    homePricingBlock,
    homeLatestPostsBlock,
    homeBookBlock,
    homeCtaBlock,
  ];

  it.each(blocks.map((block) => [block.id, block]))("%s cumple el esquema", (_id, block) => {
    expect(blockSchema.safeParse(block).success).toBe(true);
  });

  it("la Home de ejemplo las incluye en el orden del diseño", () => {
    expect(seedPages.home?.blocks.map((block) => block.type)).toEqual([
      "hero",
      "services",
      "about",
      "pricing",
      "faq",
      "latestPosts",
      "book",
      "cta",
    ]);
  });
});

describe("formulario de contacto de ejemplo", () => {
  it("cumple el esquema y cierra la página «Contatti»", () => {
    expect(blockSchema.safeParse(contattiFormBlock).success).toBe(true);
    expect(seedPages.contatti?.blocks.at(-1)).toEqual(contattiFormBlock);
  });
});

describe("preguntas frecuentes de ejemplo", () => {
  it("son las 5 previstas, marcadas para revisar, y la Home de ejemplo las incluye", () => {
    expect(homeFaqBlock.type).toBe("faq");
    const items = homeFaqBlock.type === "faq" ? homeFaqBlock.data.items : [];
    expect(items).toHaveLength(5);
    for (const item of items) expect(item.answer).toContain("DA REVISIONARE");
    expect(seedPages.home?.blocks).toContainEqual(homeFaqBlock);
  });

  it("la respuesta se limpia como el resto del HTML", () => {
    const dirty = {
      id: "f",
      type: "faq" as const,
      data: {
        title: "",
        items: [{ id: "a", question: "D?", answer: "<p>R</p><script>x()</script>" }],
      },
    };
    const [clean] = sanitizeBlocks([dirty]);
    expect(clean).toEqual({
      ...dirty,
      data: { ...dirty.data, items: [{ id: "a", question: "D?", answer: "<p>R</p>" }] },
    });
  });
});
