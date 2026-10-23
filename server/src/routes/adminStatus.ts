import type { AdminStatus } from "@studio/shared";
import { Router } from "express";
import { env } from "../env";

// /api/admin/status (protegido con requireAdmin en app.ts): lo que el panel tiene que
// saber del servidor para avisar de un problema de configuración.
export const adminStatusRouter = Router();

adminStatusRouter.get("/", (_req, res) => {
  // Sin Deploy Hook, lo guardado en el panel no llega al sitio público hasta el
  // siguiente deploy (ver services/siteRebuild.ts).
  const status: AdminStatus = { autoPublish: Boolean(env.DEPLOY_HOOK_URL) };
  res.json(status);
});
