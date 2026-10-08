import type { SiteSettings } from "@studio/shared";
import { db } from "../firebase";

const settingsDoc = () => db.collection("siteSettings").doc("main");

// Lo que se devuelve si todavía no se ha corrido el seed: el sitio no se rompe,
// simplemente sale con los datos vacíos.
const EMPTY_SETTINGS: SiteSettings = {
  siteName: "",
  professionalTitle: "",
  albo: { region: "", number: "" },
  vatNumber: "",
  email: "",
  phone: "",
  address: "",
  onlineSessions: false,
  social: { instagram: "", linkedin: "" },
  contactReasons: [],
};

export async function getSettings(): Promise<SiteSettings> {
  const doc = await settingsDoc().get();
  return doc.exists ? (doc.data() as SiteSettings) : EMPTY_SETTINGS;
}

export async function saveSettings(settings: SiteSettings): Promise<SiteSettings> {
  await settingsDoc().set(settings);
  return settings;
}
