import { z } from "zod";
import { validation } from "./validationMessages.it";
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
  // Botón "Scopri di più" (p. ej. a /chi-sono). Opcionales: los bloques guardados
  // antes de que existieran no los tienen. El botón solo sale con los dos rellenos.
  buttonLabel: optionalText(60).optional(),
  buttonHref: optionalLink.optional(),
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

// Video o audio: si la dirección es de YouTube se ve en la página (se carga solo al
// pulsar play); si es de otra plataforma (Spotify, la web de la radio…), se muestra
// un botón "Ascolta" o "Guarda" que la abre en otra pestaña.
export const videoDataSchema = z.object({
  url: z
    .string(validation.required)
    .trim()
    .min(1, validation.required)
    .max(500, validation.tooLong(500))
    .refine((value) => /^https?:\/\/\S+$/.test(value), validation.invalidUrl),
  title: optionalText(160),
  // Imagen propia que se ve antes de pulsar play (nunca la miniatura de YouTube).
  posterUrl: optionalImageUrl,
  // Texto del botón para las plataformas que no son YouTube.
  linkLabel: z.enum(["ascolta", "guarda"]),
});

const blockId = z.string().min(1).max(64);

// Filas de imagen y texto que alternan de lado: imagen a la izquierda, luego a la
// derecha, y así. Cada fila lleva su id porque el editor de texto del panel lo
// necesita como `key` para no mezclar contenidos al reordenar.
export const zigzagDataSchema = z.object({
  rows: z
    .array(
      z.object({
        id: blockId,
        imageUrl: optionalImageUrl,
        imageAlt: optionalText(200),
        title: optionalText(120),
        html: richTextHtml,
      }),
    )
    .max(20),
});

// Un bloque = { id, type, data }. `type` decide qué esquema valida `data`.
export const blockSchema = z.discriminatedUnion("type", [
  z.object({ id: blockId, type: z.literal("hero"), data: heroDataSchema }),
  z.object({ id: blockId, type: z.literal("about"), data: aboutDataSchema }),
  z.object({ id: blockId, type: z.literal("richText"), data: richTextDataSchema }),
  z.object({ id: blockId, type: z.literal("contactForm"), data: contactFormDataSchema }),
  z.object({ id: blockId, type: z.literal("contactInfo"), data: contactInfoDataSchema }),
  z.object({ id: blockId, type: z.literal("image"), data: imageDataSchema }),
  z.object({ id: blockId, type: z.literal("zigzag"), data: zigzagDataSchema }),
  z.object({ id: blockId, type: z.literal("video"), data: videoDataSchema }),
]);

export type Block = z.infer<typeof blockSchema>;
export type BlockType = Block["type"];

// El bloque completo de un tipo, p. ej. BlockOf<"hero">.
export type BlockOf<T extends BlockType> = Extract<Block, { type: T }>;
// Solo sus datos, p. ej. BlockData<"hero">.
export type BlockData<T extends BlockType> = BlockOf<T>["data"];
