import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./env";
import { createContactRateLimit } from "./middleware/contactRateLimit";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { requireAdmin } from "./middleware/requireAdmin";
import { adminCategoriesRouter } from "./routes/adminCategories";
import { adminImagesRouter } from "./routes/adminImages";
import { adminMessagesRouter } from "./routes/adminMessages";
import { adminPagesRouter } from "./routes/adminPages";
import { adminPostsRouter } from "./routes/adminPosts";
import { adminSettingsRouter } from "./routes/adminSettings";
import { blogRouter } from "./routes/blog";
import { contactRouter } from "./routes/contact";
import { publicRouter } from "./routes/public";
import { sitemapRouter } from "./routes/sitemap";

// Crea la app sin llamar a listen(), para poder usarla en los tests con supertest.
export function createApp() {
  const app = express();

  // Detrás del proxy del hosting (Render, Railway, Fly): hace que req.ip sea la IP
  // real del visitante, que es la que usa el rate limit.
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigins }));
  // La subida de imágenes es la única petición grande (un JPEG en base64).
  app.use("/api/admin/images", express.json({ limit: "1mb" }));
  app.use(express.json({ limit: "200kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  // Todo lo que cuelga de /api/admin exige un usuario con el claim admin.
  app.use("/api/admin", requireAdmin);
  app.use("/api/admin/pages", adminPagesRouter);
  app.use("/api/admin/settings", adminSettingsRouter);
  app.use("/api/admin/messages", adminMessagesRouter);
  app.use("/api/admin/images", adminImagesRouter);
  app.use("/api/admin/posts", adminPostsRouter);
  app.use("/api/admin/categories", adminCategoriesRouter);

  app.use("/api/contact", createContactRateLimit(), contactRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api", publicRouter);
  app.use(sitemapRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
