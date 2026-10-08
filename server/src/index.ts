import { createApp } from "./app";
import { env } from "./env";

const app = createApp();

app.listen(env.PORT, () => {
  const target = env.usingEmulators ? "emuladores" : `proyecto ${env.FIREBASE_PROJECT_ID}`;
  console.log(`API en http://localhost:${env.PORT} (Firebase: ${target})`);
});
