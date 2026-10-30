import {
  DEFAULT_SITE_SEO,
  DEFAULT_SITE_TEXTS,
  withSettingsDefaults,
  type SiteSettings,
} from "@studio/shared";
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
  showAboutInMenu: true,
  photoUrl: "",
  officeHours: "",
  social: { facebook: "", instagram: "", linkedin: "" },
  contactReasons: [],
  texts: DEFAULT_SITE_TEXTS,
  seo: DEFAULT_SITE_SEO,
};

export async function getSettings(): Promise<SiteSettings> {
  const doc = await settingsDoc().get();
  if (!doc.exists) return EMPTY_SETTINGS;

  // Un documento guardado antes de que existiera `texts` (o algún texto nuevo) se
  // completa con los valores por defecto.
  return withSettingsDefaults(doc.data() as SiteSettings);
}

export async function saveSettings(settings: SiteSettings): Promise<SiteSettings> {
  await settingsDoc().set(settings);
  return settings;
}
