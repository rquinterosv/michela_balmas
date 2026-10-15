import { pageInputSchema, siteSettingsSchema } from "@studio/shared";
import { Timestamp } from "firebase-admin/firestore";
import { env } from "../src/env";
import { db } from "../src/firebase";
import { sanitizeBlocks } from "../src/services/sanitizeHtml";
import { seedPages, seedSettings } from "@studio/shared/seedContent";

// Carga el contenido inicial (páginas y datos del sitio) con textos de ejemplo.
//
//   npm run seed              crea solo lo que falta; no toca nada de lo que ya existe
//   npm run seed -- --force   sobrescribe las páginas iniciales y los datos del sitio
//
// Sin --force sirve también en un sitio ya en marcha: si se agrega una página al
// contenido inicial (p. ej. "Chi sono"), la crea sin pisar el contenido de la
// profesional. Una página se da por existente si ya hay otra con su id o con su
// dirección (slug), aunque se haya editado. Las nuevas van al final del orden.
//
// Actúa sobre lo que diga server/.env: emuladores o el proyecto real.
// No toca los mensajes ni las páginas creadas desde el panel.

async function main() {
  const force = process.argv.includes("--force");
  const target = env.usingEmulators ? "emuladores" : `proyecto ${env.FIREBASE_PROJECT_ID}`;
  console.log(
    `Firebase: ${target}${force ? " (--force: se sobrescribe el contenido inicial)" : ""}`,
  );

  // Se valida con los mismos esquemas que usa la API, así el seed no puede
  // quedarse desfasado respecto al modelo de datos.
  const settingsRef = db.collection("siteSettings").doc("main");
  if (force || !(await settingsRef.get()).exists) {
    await settingsRef.set(siteSettingsSchema.parse(seedSettings));
    console.log("Datos del sitio guardados.");
  } else {
    console.log("Datos del sitio: ya existen, sin cambios.");
  }

  const existing = (await db.collection("pages").get()).docs;
  const existingIds = new Set(existing.map((doc) => doc.id));
  const existingSlugs = new Set(existing.map((doc) => doc.get("slug") as string));
  let nextOrder = Math.max(-1, ...existing.map((doc) => doc.get("order") as number)) + 1;

  for (const [id, content] of Object.entries(seedPages)) {
    const page = pageInputSchema.parse(content);

    if (!force && (existingIds.has(id) || existingSlugs.has(page.slug))) {
      console.log(`Página /${page.slug}: ya existe, sin cambios.`);
      continue;
    }

    // En un sitio con páginas, una página nueva va detrás de las que ya hay.
    const order = force || existing.length === 0 ? page.order : nextOrder++;
    await db
      .collection("pages")
      .doc(id)
      .set({
        ...page,
        order,
        blocks: sanitizeBlocks(page.blocks),
        updatedAt: Timestamp.now(),
      });
    console.log(`Página guardada: /${page.slug}`);
  }

  console.log("Seed terminado.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
