import { createApp } from "./app";
import { env } from "./env";

const app = createApp();

app.listen(env.PORT, () => {
  const target = env.usingEmulators ? "emuladores" : `proyecto ${env.FIREBASE_PROJECT_ID}`;
  console.log(`API en http://localhost:${env.PORT} (Firebase: ${target})`);
  // El sitio público es una copia hecha en el build: sin Deploy Hook, lo que se
  // guarda en el panel no se publica (ver services/siteRebuild.ts).
  if (!env.usingEmulators && !env.DEPLOY_HOOK_URL) {
    console.warn("Falta DEPLOY_HOOK_URL: los cambios del panel no se publicarán en el sitio.");
  }
});
