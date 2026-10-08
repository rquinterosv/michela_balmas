import { z } from "zod";

// En local carga server/.env si existe (Node >= 20.12, sin dotenv).
// En producción no hay archivo: las variables las define el hosting.
try {
  process.loadEnvFile();
} catch {
  // Sin .env: se usan las variables del entorno tal como están.
}

const flag = z.enum(["true", "false"]).default("false");

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  // Orígenes permitidos por CORS, separados por coma.
  CORS_ORIGINS: z.string().default("http://localhost:5173"),

  FIREBASE_PROJECT_ID: z.string().min(1).default("demo-studio"),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  // Si están definidas, firebase-admin habla con los emuladores y no con producción.
  FIRESTORE_EMULATOR_HOST: z.string().optional(),
  FIREBASE_AUTH_EMULATOR_HOST: z.string().optional(),

  // Máximo de envíos del formulario de contacto por IP cada 15 minutos.
  CONTACT_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),

  EMAIL_NOTIFICATIONS_ENABLED: flag,
  RESEND_API_KEY: z.string().optional(),
  NOTIFY_EMAIL_TO: z.string().optional(),
  NOTIFY_EMAIL_FROM: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Variables de entorno inválidas (ver server/.env.example):");
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  emailNotificationsEnabled: parsed.data.EMAIL_NOTIFICATIONS_ENABLED === "true",
  usingEmulators: Boolean(
    parsed.data.FIRESTORE_EMULATOR_HOST && parsed.data.FIREBASE_AUTH_EMULATOR_HOST,
  ),
};
