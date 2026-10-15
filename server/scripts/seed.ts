import {
  type Block,
  categoryInputSchema,
  pageInputSchema,
  postInputSchema,
  siteSettingsSchema,
} from "@studio/shared";
import {
  homeFaqBlock,
  seedCategories,
  seedPages,
  seedPosts,
  seedSettings,
} from "@studio/shared/seedContent";
import { contentFingerprint } from "../src/services/contentFingerprint";
import { appendBlockIfMissing } from "../src/services/seedAdditions";
import { mergePageOrder, type OrderedPage } from "../src/services/seedOrder";

// Huellas de las secciones de versiones anteriores del contenido inicial, por
// dirección de página. Una página que sigue idéntica a una de ellas no la ha
// editado nadie, y el seed puede ponerle la versión nueva sin pisar nada.
// Secciones nuevas del contenido inicial para páginas que ya existen. Cada añadido
// se aplica una sola vez: queda anotado en seedState/main y no se repite aunque
// después se borre la sección desde el panel.
const PAGE_ADDITIONS = [
  // Preguntas frecuentes al final de la Home.
  { id: "home-faq", slug: "home", block: homeFaqBlock },
];

const OUTDATED_SEED_BLOCKS: Record<string, string[]> = {
  // «Come lavoro» solo con texto (commit a4aa7ba), antes de las tarjetas y el percorso.
  "come-lavoro": ["f2b5a28428e7910d496c8499baa1d7eb093d98cfb351a7525d8094ce7ccc0b2c"],
};

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
// haya editado (salvo una página que siga idéntica a una versión anterior del
// contenido inicial: esa se actualiza, ver OUTDATED_SEED_BLOCKS). Una página nueva se coloca en su sitio del menú (p. ej. "Blog"
// delante de "Contatti", ver src/services/seedOrder.ts); una categoría nueva, al final.
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
  const seedOrderOf = (slug: unknown) =>
    Object.values(seedPages).find((page) => page.slug === slug)?.order ?? null;
  const added: OrderedPage[] = [];

  for (const [id, content] of Object.entries(seedPages)) {
    const page = pageInputSchema.parse(content);
    const existing = pages.find((doc) => doc.id === id || doc.get("slug") === page.slug);
    if (existing && !force) {
      // Si sigue exactamente como una versión anterior del contenido inicial (nadie
      // la ha editado), se le ponen las secciones nuevas. Si no, no se toca.
      const untouched = (OUTDATED_SEED_BLOCKS[page.slug] ?? []).includes(
        contentFingerprint(existing.get("blocks")),
      );
      if (untouched) {
        await existing.ref.update({
          blocks: sanitizeBlocks(page.blocks),
          seo: page.seo,
          updatedAt: Timestamp.now(),
        });
        console.log(
          `Página /${page.slug}: actualizada al nuevo contenido inicial (no se había editado).`,
        );
      } else {
        console.log(`Página /${page.slug}: ya existe, sin cambios.`);
      }
      continue;
    }

    await db
      .collection("pages")
      .doc(id)
      .set({ ...page, blocks: sanitizeBlocks(page.blocks), updatedAt: Timestamp.now() });
    added.push({ id, seedOrder: page.order });
    console.log(`Página guardada: /${page.slug}`);
  }

  // En un sitio con páginas, las nuevas se colocan en su sitio del menú (ver
  // seedOrder.ts). De las existentes solo cambia el campo "order", si hace falta.
  if (!force && pages.length > 0 && added.length > 0) {
    const current = [...pages]
      .sort((a, b) => (a.get("order") as number) - (b.get("order") as number))
      .map((doc) => ({ id: doc.id, seedOrder: seedOrderOf(doc.get("slug")) }));
    const batch = db.batch();
    mergePageOrder(current, added).forEach((id, index) => {
      batch.update(db.collection("pages").doc(id), { order: index });
    });
    await batch.commit();
    console.log("Orden de las páginas actualizado.");
  }

  // --- Añadidos de una sola vez ---
  const stateRef = db.collection("seedState").doc("main");
  const applied = ((await stateRef.get()).get("appliedAdditions") as string[] | undefined) ?? [];

  for (const addition of PAGE_ADDITIONS) {
    if (applied.includes(addition.id)) {
      console.log(`Añadido "${addition.id}": ya aplicado, sin cambios.`);
      continue;
    }
    const pageDoc = (await db.collection("pages").where("slug", "==", addition.slug).limit(1).get())
      .docs[0];
    const blocks = pageDoc
      ? appendBlockIfMissing(pageDoc.get("blocks") as Block[], sanitizeBlocks([addition.block])[0]!)
      : null;
    if (pageDoc && blocks) {
      await pageDoc.ref.update({ blocks, updatedAt: Timestamp.now() });
      console.log(`Añadido "${addition.id}": sección añadida al final de /${addition.slug}.`);
    } else {
      console.log(`Añadido "${addition.id}": no hace falta (la página ya la tiene o no existe).`);
    }
    applied.push(addition.id);
  }
  await stateRef.set({ appliedAdditions: applied }, { merge: true });

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
