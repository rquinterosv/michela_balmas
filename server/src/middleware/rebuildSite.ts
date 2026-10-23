import type { RequestHandler } from "express";
import { scheduleSiteRebuild } from "../services/siteRebuild";

// Tras cada cambio del panel que termina bien (POST, PUT, PATCH, DELETE con
// respuesta 2xx), programa un build nuevo del sitio público.
export const rebuildSiteAfterChange: RequestHandler = (req, res, next) => {
  if (req.method !== "GET") {
    res.on("finish", () => {
      if (res.statusCode < 400) scheduleSiteRebuild();
    });
  }
  next();
};
