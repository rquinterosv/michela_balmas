import {
  categoryInputSchema,
  pageInputSchema,
  postInputSchema,
  siteSettingsSchema,
} from "@studio/shared";
import { seedCategories, seedPages, seedPosts, seedSettings } from "@studio/shared/seedContent";

// Carga el contenido inicial (datos del sitio, páginas, y categorías y artículos
// del blog) con textos de ejemplo.
//
//   npm run seed                  crea solo lo que falta; no toca nada de lo que ya existe
//   npm run seed -- --force       sobrescribe el contenido inicial
//   npm run seed -- --production  igual que sin opciones, pero contra el proyecto real
//                                 aunque server/.env apunte a los emuladores
//
// Sin --force sirve también en un sitio ya en marcha: si se agrega contenido inicial
// nuevo (p. ej. el blog), lo crea sin pisar lo de la profesional. Algo se da por
// existente si ya hay otro documento con su id o con su dirección (slug), aunque se
// haya editado. Las páginas y categorías nuevas van al final del orden.
//
// No toca los mensajes ni lo creado desde el panel.

const force = process.argv.includes("--force");
const production = process.argv.includes("--production");

// Las variables vacías tienen prioridad sobre server/.env (process.loadEnvFile no
// pisa las que ya existen): así firebase-admin no usa los emuladores.
if (production) {
  process.env.FIRESTORE_EMULATOR_HOST = "";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "";
}

async function main() {
  // Import dinámico: env.ts lee las variables al cargarse, después de lo de arriba.
  const { Timestamp } = await import("firebase-admin/firestore");
  const { env } = await import("../src/env");
  const { db } = await import("../src/firebase");
  const { sanitizeBlocks } = await import("../src/services/sanitizeHtml");

  const target = env.usingEmulators ? "emuladores" : `proyecto ${env.FIREBASE_PROJECT_ID}`;
  console.log(
    `Firebase: ${target}${force ? " (--force: se sobrescribe el contenido inicial)" : ""}`,
  );
  if (production && (force || env.FIREBASE_PROJECT_ID.startsWith("demo-"))) {
    throw new Error("--production no se combina con --force ni con un proyecto demo-.");
  }

  // Se valida con los mismos esquemas que usa la API, así el seed no puede
  // quedarse desfasado respecto al modelo de datos.
  const settingsRef = db.collection("siteSettings").doc("main");
  if (force || !(await settingsRef.get()).exists) {
    await settingsRef.set(siteSettingsSchema.parse(seedSettings));
    console.log("Datos del sitio guardados.");
  } else {
    console.log("Datos del sitio: ya existen, sin cambios.");
  }

  // Siguiente posición libre en una colección ordenada.
  const nextOrderOf = (docs: { get: (field: string) => unknown }[]) =>
    Math.max(-1, ...docs.map((doc) => doc.get("order") as number)) + 1;

  // --- Páginas ---
  const pages = (await db.collection("pages").get()).docs;
  let nextPageOrder = nextOrderOf(pages);

  for (const [id, content] of Object.entries(seedPages)) {
    const page = pageInputSchema.parse(content);
    const exists = pages.some((doc) => doc.id === id || doc.get("slug") === page.slug);
    if (exists && !force) {
      console.log(`Página /${page.slug}: ya existe, sin cambios.`);
      continue;
    }

    // En un sitio con páginas, una página nueva va detrás de las que ya hay.
    const order = force || pages.length === 0 ? page.order : nextPageOrder++;
    await db
      .collection("pages")
      .doc(id)
      .set({ ...page, order, blocks: sanitizeBlocks(page.blocks), updatedAt: Timestamp.now() });
    console.log(`Página guardada: /${page.slug}`);
  }

  // --- Categorías del blog ---
  // Clave del contenido inicial -> id real (otro, si la categoría ya existía con esa dirección).
  const categories = (await db.collection("categories").get()).docs;
  const categoryIds = new Map<string, string>();
  let nextCategoryOrder = nextOrderOf(categories);

  for (const [key, content] of Object.entries(seedCategories)) {
    const existing = categories.find((doc) => doc.id === key || doc.get("slug") === content.slug);
    if (existing && !force) {
      categoryIds.set(key, existing.id);
      console.log(`Categoría ${content.name}: ya existe, sin cambios.`);
      continue;
    }

    const parentId = content.parentId ? (categoryIds.get(content.parentId) ?? null) : null;
    const order = force || categories.length === 0 ? content.order : nextCategoryOrder++;
    const category = categoryInputSchema.parse({ ...content, parentId, order });
    await db.collection("categories").doc(key).set(category);
    categoryIds.set(key, key);
    console.log(`Categoría guardada: ${category.name}`);
  }

  // --- Artículos del blog ---
  const posts = (await db.collection("posts").get()).docs;

  for (const [id, content] of Object.entries(seedPosts)) {
    const exists = posts.some((doc) => doc.id === id || doc.get("slug") === content.slug);
    if (exists && !force) {
      console.log(`Artículo /blog/${content.slug}: ya existe, sin cambios.`);
      continue;
    }

    const categoryId = categoryIds.get(content.categoryId) ?? content.categoryId;
    const post = postInputSchema.parse({ ...content, categoryId });
    const now = Timestamp.now();
    await db
      .collection("posts")
      .doc(id)
      .set({
        ...post,
        blocks: sanitizeBlocks(post.blocks),
        date: Timestamp.fromDate(new Date(`${post.date}T00:00:00Z`)),
        createdAt: now,
        updatedAt: now,
      });
    console.log(`Artículo guardado: /blog/${post.slug}`);
  }

  console.log("Seed terminado.");
}

main().then(
  () => process.exit(0),
  (error: unknown) => {
    console.error(error);
    process.exit(1);
  },
);
