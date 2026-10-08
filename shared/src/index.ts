import { z } from "zod";

// Mensajes por defecto de zod en italiano, para cualquier error que no tenga un
// mensaje propio en validationMessages.it.ts. Se configura una sola vez aquí
// porque client y server importan siempre desde este archivo.
z.config(z.locales.it());

export * from "./blocks";
export * from "./schemas";
export * from "./slug";
export * from "./types";
export * from "./validationMessages.it";
