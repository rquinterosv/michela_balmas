import {
  aboutDataSchema,
  contactFormDataSchema,
  contactInfoDataSchema,
  heroDataSchema,
  imageDataSchema,
  richTextDataSchema,
  type BlockData,
  type BlockType,
} from "@studio/shared";
import type { ComponentType } from "react";
import type { z } from "zod";
import { it } from "../i18n/it";
import { AboutEditor } from "./about/AboutEditor";
import { AboutRender } from "./about/AboutRender";
import { ContactFormEditor } from "./contactForm/ContactFormEditor";
import { ContactInfoEditor } from "./contactInfo/ContactInfoEditor";
import type { BlockEditorProps } from "./editorTypes";
import { HeroEditor } from "./hero/HeroEditor";
import { ImageEditor } from "./image/ImageEditor";
import { RichTextBlockEditor } from "./richText/RichTextBlockEditor";
import { ContactFormRender } from "./contactForm/ContactFormRender";
import { ContactInfoRender } from "./contactInfo/ContactInfoRender";
import { HeroRender } from "./hero/HeroRender";
import { ImageRender } from "./image/ImageRender";
import { RichTextRender } from "./richText/RichTextRender";

// Todo lo que el frontend necesita saber de un tipo de bloque.

export interface BlockDefinition<T extends BlockType> {
  // Nombre que ve la psicóloga en el panel.
  label: string;
  // Explicación corta al elegir qué sección agregar.
  description: string;
  zodSchema: z.ZodType<BlockData<T>>;
  // Datos de un bloque recién creado.
  defaultData: BlockData<T>;
  // Formulario de edición en el panel.
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
    EditorComponent: HeroEditor,
    RenderComponent: HeroRender,
  },
  about: {
    label: it.blockNames.about,
    description: it.blockDescriptions.about,
    zodSchema: aboutDataSchema,
    defaultData: { title: "", photoUrl: "", photoAlt: "", html: "", lists: [] },
    EditorComponent: AboutEditor,
    RenderComponent: AboutRender,
  },
  richText: {
    label: it.blockNames.richText,
    description: it.blockDescriptions.richText,
    zodSchema: richTextDataSchema,
    defaultData: { html: "" },
    EditorComponent: RichTextBlockEditor,
    RenderComponent: RichTextRender,
  },
  contactForm: {
    label: it.blockNames.contactForm,
    description: it.blockDescriptions.contactForm,
    zodSchema: contactFormDataSchema,
    defaultData: { title: "", intro: "" },
    EditorComponent: ContactFormEditor,
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
    EditorComponent: ContactInfoEditor,
    RenderComponent: ContactInfoRender,
  },
  image: {
    label: it.blockNames.image,
    description: it.blockDescriptions.image,
    zodSchema: imageDataSchema,
    defaultData: { url: "", alt: "", caption: "" },
    EditorComponent: ImageEditor,
    RenderComponent: ImageRender,
  },
};
