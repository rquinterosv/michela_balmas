import { blockSchema, type Block } from "@studio/shared";
import { describe, expect, it } from "vitest";
import { redesignChiSono } from "../src/services/chiSonoRedesign";

// Una página «Chi sono» como la real: un solo bloque de filas (formación y experiencia).
const zigzag: Block = {
  id: "chi-sono-zigzag",
  type: "zigzag",
  data: {
    rows: [
      {
        id: "chi-sono-formazione",
        imageUrl: "/api/images/ritratto",
        imageAlt: "Ritratto",
        title: "Il mio percorso formativo",
        html: "<p>Formazione…</p>",
      },
      {
        id: "chi-sono-esperienza",
        imageUrl: "/api/images/intervisione",
        imageAlt: "Intervisione",
        title: "La mia esperienza professionale",
        html: "<p>Esperienza…</p>",
      },
    ],
  },
};

describe("redesignChiSono", () => {
  const blocks = redesignChiSono([zigzag]) ?? [];

  it("arma la página del diseño, en su orden", () => {
    expect(blocks.map((block) => block.type)).toEqual([
      "hero",
      "milestones",
      "chapter",
      "quote",
      "chapter",
      "cta",
    ]);
  });

  it("todas las secciones cumplen el esquema de la API", () => {
    for (const block of blocks) expect(blockSchema.safeParse(block).success).toBe(true);
  });

  it("conserva los textos y las fotos de las filas", () => {
    const [hero, , first, , second] = blocks;
    expect(hero?.type === "hero" && hero.data.imageUrl).toBe("/api/images/ritratto");
    expect(first?.type === "chapter" && first.data).toMatchObject({
      title: "Il mio percorso formativo",
      html: "<p>Formazione…</p>",
      imageUrl: "",
    });
    expect(second?.type === "chapter" && second.data).toMatchObject({
      title: "La mia esperienza professionale",
      html: "<p>Esperienza…</p>",
      imageUrl: "/api/images/intervisione",
      imageAlt: "Intervisione",
    });
  });

  it("no toca una página que ya no es un solo bloque de filas", () => {
    const text: Block = { id: "t", type: "richText", data: { html: "<p>Ciao</p>" } };
    expect(redesignChiSono([zigzag, text])).toBeNull();
    expect(redesignChiSono([text])).toBeNull();
    expect(redesignChiSono(blocks)).toBeNull();
  });
});
