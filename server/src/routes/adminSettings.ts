import { siteSettingsSchema } from "@studio/shared";
import { Router } from "express";
import { getSettings, saveSettings } from "../repositories/settings";

// /api/admin/settings (protegido con requireAdmin en app.ts).
export const adminSettingsRouter = Router();

adminSettingsRouter.get("/", async (_req, res) => {
  res.json(await getSettings());
});

adminSettingsRouter.put("/", async (req, res) => {
  const settings = siteSettingsSchema.parse(req.body);
  res.json(await saveSettings(settings));
});
