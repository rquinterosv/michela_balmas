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
// Invito all'azione: un riquadro con titolo, testo breve e un pulsante (p. ej.
// "Prenota un primo colloquio" -> /contatti). El botón es lo único obligatorio.
export const ctaDataSchema = z.object({
  title: optionalText(120),
  text: optionalText(400),
  buttonLabel: requiredText(60),
  buttonHref: optionalLink.refine((value) => value !== "", validation.required),
});

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

// Iconos que se pueden elegir en el panel (bloques "features" y "timeline"). Es una
// lista cerrada: el frontend tiene un componente de lucide-react por cada nombre
// (client/src/lib/icons.tsx). Para agregar uno, añadirlo aquí y allí.
export const ICON_NAMES = [
  "network",
  "heart",
  "hand-heart",
  "video",
  "monitor-smartphone",
  "map-pin",
  "message-circle",
  "users",
  "target",
  "route",
  "flag",
  "brain",
  "house",
  "leaf",
  "sprout",
  "sun",
  "calendar-days",
  "clock",
  "shield-check",
  "sparkles",
  "compass",
  "smile",
  "puzzle",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

// Un elemento con icono, título y texto breve: una tarjeta de "features" o una
// etapa de "timeline". Lleva id para reordenar sin mezclar campos.
const iconItemSchema = z.object({
  id: blockId,
  icon: z.enum(ICON_NAMES),
  title: requiredText(80),
  text: optionalText(240),
});

export type IconItem = z.infer<typeof iconItemSchema>;

// Preguntas frecuentes: acordeón. La respuesta es texto del editor (HTML), y el
// backend la limpia como el resto (sanitizeBlocks).
export const faqDataSchema = z.object({
  title: optionalText(120),
  items: z
    .array(
      z.object({
        id: blockId,
        question: requiredText(200),
        answer: richTextHtml,
      }),
    )
    .max(30),
});

// Tarjetas con icono en fila (p. ej. "Il mio approccio"). En móvil, apiladas.
export const featuresDataSchema = z.object({
  title: optionalText(120),
  items: z.array(iconItemSchema).max(12),
});

// Percorso a tappe: línea de tiempo numerada (horizontal en escritorio,
// vertical en móvil), p. ej. "Il percorso".
export const timelineDataSchema = z.object({
  title: optionalText(120),
  items: z.array(iconItemSchema).max(10),
});

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
  z.object({ id: blockId, type: z.literal("cta"), data: ctaDataSchema }),
  z.object({ id: blockId, type: z.literal("features"), data: featuresDataSchema }),
  z.object({ id: blockId, type: z.literal("timeline"), data: timelineDataSchema }),
  z.object({ id: blockId, type: z.literal("faq"), data: faqDataSchema }),
]);

export type Block = z.infer<typeof blockSchema>;
export type BlockType = Block["type"];

// El bloque completo de un tipo, p. ej. BlockOf<"hero">.
export type BlockOf<T extends BlockType> = Extract<Block, { type: T }>;
// Solo sus datos, p. ej. BlockData<"hero">.
export type BlockData<T extends BlockType> = BlockOf<T>["data"];
