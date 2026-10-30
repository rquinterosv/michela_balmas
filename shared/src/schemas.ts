import { z } from "zod";
import { blockSchema } from "./blocks";
import { optionalImageUrl, optionalText, optionalUrl, requiredText } from "./fields";
import { RESERVED_SLUGS, SLUG_PATTERN } from "./slug";
import { DEFAULT_SITE_TEXTS } from "./siteTexts.it";
import { validation } from "./validationMessages.it";

const email = z
  .string(validation.required)
  .trim()
  .min(1, validation.required)
  .pipe(z.email(validation.invalidEmail));

// Teléfono permisivo: dígitos, espacios y + ( ) . -  Vacío = no informado.
const optionalPhone = optionalText(30).refine(
  (value) => value === "" || /^\+?[0-9 ().-]{6,}$/.test(value),
  validation.invalidPhone,
);

// --- Formulario de contacto (POST /api/contact) ---

export const contactSchema = z.object({
  name: requiredText(120),
  email,
  phone: optionalPhone,
  reason: z.string(validation.invalidReason).trim().min(1, validation.invalidReason).max(120),
  message: z
    .string(validation.required)
    .trim()
    .min(10, validation.tooShort(10))
    .max(4000, validation.tooLong(4000)),
  consent: z.literal(true, validation.consentRequired),
  // Honeypot anti-spam: campo oculto que una persona deja vacío y un bot rellena.
  // Aquí se acepta cualquier texto; la ruta descarta el mensaje si viene relleno.
  website: z.string().max(200).optional(),
});

// --- Páginas ---

export const pageInputSchema = z.object({
  title: requiredText(120),
  slug: z
    .string()
    .trim()
    .min(1, validation.required)
    .max(80, validation.tooLong(80))
    .regex(SLUG_PATTERN, validation.invalidSlug)
    .refine((slug) => !RESERVED_SLUGS.includes(slug), validation.reservedSlug),
  order: z.number().int().min(0),
  published: z.boolean(),
  showInMenu: z.boolean(),
  seo: z.object({
    title: optionalText(70),
    description: optionalText(200),
  }),
  blocks: z.array(blockSchema).max(50),
});

// PATCH /api/admin/pages/reorder: ids de las páginas en su nuevo orden.
export const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

// --- Datos del sitio ---

export const siteSettingsSchema = z.object({
  siteName: requiredText(120),
  professionalTitle: requiredText(120),
  albo: z.object({
    // Con la preposición, tal como se lee en el footer: "della Lombardia", "del Lazio"…
    region: optionalText(80),
    number: optionalText(30),
  }),
  vatNumber: optionalText(30),
  email,
  phone: optionalPhone,
  address: optionalText(300),
  onlineSessions: z.boolean(),
  // Foto de la profesional: tarjeta de contacto del blog y autor por defecto.
  photoUrl: optionalImageUrl.default(""),
  // Horario de atención, en la tarjeta de contacto del blog.
  officeHours: optionalText(300).default(""),
  social: z.object({
    facebook: optionalUrl,
    instagram: optionalUrl,
    linkedin: optionalUrl,
  }),
  // Ítem del menú que baja a la sección "Chi sono" de la home. Su texto va en texts.aboutMenu.
  showAboutInMenu: z.boolean().default(true),
  contactReasons: z.array(requiredText(120)).min(1, validation.atLeastOneReason).max(20),
  // Rótulos fijos del sitio, editables desde el panel (ver siteTexts.it.ts).
  texts: z
    .object({
      onlineSessions: requiredText(120),
      alboPrefix: requiredText(120),
      vatLabel: requiredText(40),
      copyright: requiredText(120),
      emailLabel: requiredText(40),
      phoneLabel: requiredText(40),
      addressLabel: requiredText(40),
      aboutMenu: requiredText(40),
      blogCategories: requiredText(40),
      blogAllPosts: requiredText(40),
      blogReadMore: requiredText(40),
      blogLoadMore: requiredText(40),
      blogBack: requiredText(40),
      blogRelated: requiredText(60),
      officeHoursLabel: requiredText(40),
      contactCardButton: requiredText(40),
      whatsappButton: requiredText(40),
      whatsappMessage: requiredText(300),
      socialTitle: requiredText(60),
      emergencyNotice: requiredText(300),
      formReasonPlaceholder: requiredText(60),
      formNotice: requiredText(600),
      formSuccessText: requiredText(300),
      formErrorValidation: requiredText(200),
      formErrorGeneric: requiredText(300),
      notFoundText: requiredText(200),
    })
    .default(DEFAULT_SITE_TEXTS),
});

// --- Mensajes ---

export const MESSAGE_STATUSES = ["nuovo", "letto", "risposto"] as const;

export const messageUpdateSchema = z.object({
  status: z.enum(MESSAGE_STATUSES),
});
