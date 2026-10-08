import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./env";

// Crea la app sin llamar a listen(), para poder usarla en los tests con supertest.
export function createApp() {
  const app = express();

  // Detrás del proxy del hosting (Render, Railway, Fly): hace que req.ip sea la IP
  // real del visitante, que es la que usa el rate limit.
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigins }));
  app.use(express.json({ limit: "200kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  // Fase 2: aquí se montan las rutas públicas, /api/contact y /api/admin/*.

  return app;
}
