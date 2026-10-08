import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { env } from "./env";

// Único punto donde se inicializa firebase-admin.
// - Con emuladores (desarrollo): basta el projectId; firebase-admin detecta solo
//   FIRESTORE_EMULATOR_HOST y FIREBASE_AUTH_EMULATOR_HOST.
// - En producción: credenciales de la service account por variables de entorno.
function createFirebaseApp() {
  if (env.usingEmulators) {
    return initializeApp({ projectId: env.FIREBASE_PROJECT_ID });
  }

  // Solo uno de los dos emuladores configurado: mitad de los datos iría a producción.
  if (env.FIRESTORE_EMULATOR_HOST || env.FIREBASE_AUTH_EMULATOR_HOST) {
    throw new Error(
      "Define FIRESTORE_EMULATOR_HOST y FIREBASE_AUTH_EMULATOR_HOST juntas, o ninguna.",
    );
  }

  if (!env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    throw new Error(
      "Faltan credenciales de Firebase. Para desarrollo define las variables de los " +
        "emuladores; para producción, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY " +
        "(ver server/.env.example).",
    );
  }

  return initializeApp({
    credential: cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      // Los paneles de hosting guardan la clave en una sola línea con "\n" literales.
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const app = createFirebaseApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
