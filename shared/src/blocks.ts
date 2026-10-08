import { z } from "zod";
import { optionalImageUrl, optionalLink, optionalText, requiredText, richTextHtml } from "./fields";

// Un esquema por tipo de bloque: describe la forma de `block.data`.
// El backend valida con ellos al guardar una página; el frontend los usa en los
// formularios del panel. Para agregar un tipo nuevo, ver CLAUDE.md.

export const heroDataSchema = z.object({
  title: requiredText(120),
  subtitle: optionalText(300),
  imageUrl: optionalImageUrl,
  imageAlt: optionalText(200),
  buttonLabel: optionalText(60),
  buttonHref: optionalLink,
});

export const aboutDataSchema = z.object({
  title: requiredText(120),
  photoUrl: optionalImageUrl,
  photoAlt: optionalText(200),
  html: richTextHtml,
  // Listas tipo "Formazione", "Specializzazioni", "Approccio".
  lists: z.array(
    z.object({
      title: requiredText(80),
      items: z.array(requiredText(200)),
    }),
  ),
});

export const richTextDataSchema = z.object({
  html: richTextHtml,
});

export const contactFormDataSchema = z.object({
  title: optionalText(120),
  intro: optionalText(600),
});

// Los datos (email, teléfono, dirección) salen de siteSettings;
// el bloque solo decide cuáles mostrar.
export const contactInfoDataSchema = z.object({
  title: optionalText(120),
  showEmail: z.boolean(),
  showPhone: z.boolean(),
  showAddress: z.boolean(),
  showOnlineSessions: z.boolean(),
});

export const imageDataSchema = z.object({
  url: optionalImageUrl,
  alt: optionalText(200),
  caption: optionalText(300),
});

const blockId = z.string().min(1).max(64);

// Un bloque = { id, type, data }. `type` decide qué esquema valida `data`.
export const blockSchema = z.discriminatedUnion("type", [
  z.object({ id: blockId, type: z.literal("hero"), data: heroDataSchema }),
  z.object({ id: blockId, type: z.literal("about"), data: aboutDataSchema }),
  z.object({ id: blockId, type: z.literal("richText"), data: richTextDataSchema }),
  z.object({ id: blockId, type: z.literal("contactForm"), data: contactFormDataSchema }),
  z.object({ id: blockId, type: z.literal("contactInfo"), data: contactInfoDataSchema }),
  z.object({ id: blockId, type: z.literal("image"), data: imageDataSchema }),
]);

export type Block = z.infer<typeof blockSchema>;
export type BlockType = Block["type"];

// El bloque completo de un tipo, p. ej. BlockOf<"hero">.
export type BlockOf<T extends BlockType> = Extract<Block, { type: T }>;
// Solo sus datos, p. ej. BlockData<"hero">.
export type BlockData<T extends BlockType> = BlockOf<T>["data"];
