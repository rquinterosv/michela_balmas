import {
  aboutDataSchema,
  contactFormDataSchema,
  ctaDataSchema,
  faqDataSchema,
  featuresDataSchema,
  contactInfoDataSchema,
  heroDataSchema,
  imageDataSchema,
  richTextDataSchema,
  timelineDataSchema,
  videoDataSchema,
  zigzagDataSchema,
  type BlockData,
  type BlockType,
} from "@studio/shared";
import { lazy, type ComponentType } from "react";
import type { z } from "zod";
import { it } from "../i18n/it";
import { AboutRender } from "./about/AboutRender";
import type { BlockEditorProps } from "./editorTypes";
import { ContactFormRender } from "./contactForm/ContactFormRender";
import { ContactInfoRender } from "./contactInfo/ContactInfoRender";
import { CtaRender } from "./cta/CtaRender";
import { FaqRender } from "./faq/FaqRender";
import { FeaturesRender } from "./features/FeaturesRender";
import { HeroRender } from "./hero/HeroRender";
import { ImageRender } from "./image/ImageRender";
import { RichTextRender } from "./richText/RichTextRender";
import { TimelineRender } from "./timeline/TimelineRender";
import { VideoRender } from "./video/VideoRender";
import { ZigzagRender } from "./zigzag/ZigzagRender";

// Todo lo que el frontend necesita saber de un tipo de bloque.

export interface BlockDefinition<T extends BlockType> {
  // Nombre que ve la psicóloga en el panel.
  label: string;
  // Explicación corta al elegir qué sección agregar.
  description: string;
  zodSchema: z.ZodType<BlockData<T>>;
  // Datos de un bloque recién creado.
  defaultData: BlockData<T>;
  // Formulario de edición en el panel. Se carga con lazy(): así el código de los
  // editores (y el editor de texto, que pesa) solo se descarga dentro del panel y
  // no lo pagan los visitantes del sitio. lazy() exige que el archivo del editor
  // tenga `export default`.
  EditorComponent: ComponentType<BlockEditorProps<T>>;
  // Cómo se ve en el sitio público.
  RenderComponent: ComponentType<{ data: BlockData<T> }>;
}

// El registro: una entrada por tipo. TypeScript exige que estén todos los tipos
// definidos en shared/src/blocks.ts. Para agregar uno nuevo, ver CLAUDE.md.
export const blockRegistry: { [T in BlockType]: BlockDefinition<T> } = {
  hero: {
    label: it.blockNames.hero,
    description: it.blockDescriptions.hero,
    zodSchema: heroDataSchema,
    defaultData: {
      title: "",
      subtitle: "",
      imageUrl: "",
      imageAlt: "",
      buttonLabel: "",
      buttonHref: "",
    },
    EditorComponent: lazy(() => import("./hero/HeroEditor")),
    RenderComponent: HeroRender,
  },
  about: {
    label: it.blockNames.about,
    description: it.blockDescriptions.about,
    zodSchema: aboutDataSchema,
    defaultData: {
      title: "",
      photoUrl: "",
      photoAlt: "",
      html: "",
      lists: [],
      buttonLabel: "",
      buttonHref: "",
    },
    EditorComponent: lazy(() => import("./about/AboutEditor")),
    RenderComponent: AboutRender,
  },
  richText: {
    label: it.blockNames.richText,
    description: it.blockDescriptions.richText,
    zodSchema: richTextDataSchema,
    defaultData: { html: "" },
    EditorComponent: lazy(() => import("./richText/RichTextBlockEditor")),
    RenderComponent: RichTextRender,
  },
  contactForm: {
    label: it.blockNames.contactForm,
    description: it.blockDescriptions.contactForm,
    zodSchema: contactFormDataSchema,
    defaultData: { title: "", intro: "" },
    EditorComponent: lazy(() => import("./contactForm/ContactFormEditor")),
    RenderComponent: ContactFormRender,
  },
  contactInfo: {
    label: it.blockNames.contactInfo,
    description: it.blockDescriptions.contactInfo,
    zodSchema: contactInfoDataSchema,
    defaultData: {
      title: "",
      showEmail: true,
      showPhone: true,
      showAddress: true,
      showOnlineSessions: true,
    },
    EditorComponent: lazy(() => import("./contactInfo/ContactInfoEditor")),
    RenderComponent: ContactInfoRender,
  },
  image: {
    label: it.blockNames.image,
    description: it.blockDescriptions.image,
    zodSchema: imageDataSchema,
    defaultData: { url: "", alt: "", caption: "" },
    EditorComponent: lazy(() => import("./image/ImageEditor")),
    RenderComponent: ImageRender,
  },
  zigzag: {
    label: it.blockNames.zigzag,
    description: it.blockDescriptions.zigzag,
    zodSchema: zigzagDataSchema,
    defaultData: { rows: [] },
    EditorComponent: lazy(() => import("./zigzag/ZigzagEditor")),
    RenderComponent: ZigzagRender,
  },
  cta: {
    label: it.blockNames.cta,
    description: it.blockDescriptions.cta,
    zodSchema: ctaDataSchema,
    defaultData: { title: "", text: "", buttonLabel: "", buttonHref: "/contatti" },
    EditorComponent: lazy(() => import("./cta/CtaEditor")),
    RenderComponent: CtaRender,
  },
  features: {
    label: it.blockNames.features,
    description: it.blockDescriptions.features,
    zodSchema: featuresDataSchema,
    defaultData: { title: "", items: [] },
    EditorComponent: lazy(() => import("./features/FeaturesEditor")),
    RenderComponent: FeaturesRender,
  },
  timeline: {
    label: it.blockNames.timeline,
    description: it.blockDescriptions.timeline,
    zodSchema: timelineDataSchema,
    defaultData: { title: "", items: [] },
    EditorComponent: lazy(() => import("./timeline/TimelineEditor")),
    RenderComponent: TimelineRender,
  },
  faq: {
    label: it.blockNames.faq,
    description: it.blockDescriptions.faq,
    zodSchema: faqDataSchema,
    defaultData: { title: "Domande frequenti", items: [] },
    EditorComponent: lazy(() => import("./faq/FaqEditor")),
    RenderComponent: FaqRender,
  },
  video: {
    label: it.blockNames.video,
    description: it.blockDescriptions.video,
    zodSchema: videoDataSchema,
    defaultData: { url: "", title: "", posterUrl: "", linkLabel: "ascolta" },
    EditorComponent: lazy(() => import("./video/VideoEditor")),
    RenderComponent: VideoRender,
  },
};
