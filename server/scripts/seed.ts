import { pageInputSchema, siteSettingsSchema } from "@studio/shared";
import { Timestamp } from "firebase-admin/firestore";
import { env } from "../src/env";
import { db } from "../src/firebase";
import { sanitizeBlocks } from "../src/services/sanitizeHtml";
import { seedPages, seedSettings } from "./seedContent";

// Carga el contenido inicial (páginas y datos del sitio) con textos de ejemplo.
//
//   npm run seed              no hace nada si ya hay páginas
//   npm run seed -- --force   sobrescribe las páginas iniciales y los datos del sitio
//
// Actúa sobre lo que diga server/.env: emuladores o el proyecto real.
// No toca los mensajes ni las páginas creadas desde el panel.

async function main() {
  const force = process.argv.includes("--force");
  const target = env.usingEmulators ? "emuladores" : `proyecto ${env.FIREBASE_PROJECT_ID}`;
  console.log(`Firebase: ${target}`);

  const existing = await db.collection("pages").limit(1).get();
  if (!existing.empty && !force) {
    console.log(
      "Ya hay páginas: no se ha cambiado nada.\n" +
        "Para sobrescribir el contenido inicial: npm run seed -- --force",
    );
    return;
  }

  // Se valida con los mismos esquemas que usa la API, así el seed no puede
  // quedarse desfasado respecto al modelo de datos.
  const settings = siteSettingsSchema.parse(seedSettings);
  await db.collection("siteSettings").doc("main").set(settings);
  console.log("Datos del sitio guardados.");

  for (const [id, content] of Object.entries(seedPages)) {
    const page = pageInputSchema.parse(content);
    await db
      .collection("pages")
      .doc(id)
      .set({ ...page, blocks: sanitizeBlocks(page.blocks), updatedAt: Timestamp.now() });
    console.log(`Página guardada: /${page.slug}`);
  }

  console.log("Seed terminado.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
