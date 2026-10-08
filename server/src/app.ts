import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./env";
import { createContactRateLimit } from "./middleware/contactRateLimit";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { requireAdmin } from "./middleware/requireAdmin";
import { adminMessagesRouter } from "./routes/adminMessages";
import { adminPagesRouter } from "./routes/adminPages";
import { adminSettingsRouter } from "./routes/adminSettings";
import { contactRouter } from "./routes/contact";
import { publicRouter } from "./routes/public";

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

  // Todo lo que cuelga de /api/admin exige un usuario con el claim admin.
  app.use("/api/admin", requireAdmin);
  app.use("/api/admin/pages", adminPagesRouter);
  app.use("/api/admin/settings", adminSettingsRouter);
  app.use("/api/admin/messages", adminMessagesRouter);

  app.use("/api/contact", createContactRateLimit(), contactRouter);
  app.use("/api", publicRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
