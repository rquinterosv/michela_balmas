// Textos fijos del sitio público (rótulos del pie de página y de los recapiti).
// Son el valor inicial: se editan desde el panel, en "Impostazioni del sito", y se
// guardan en siteSettings.texts. También se usan si el documento guardado es
// anterior a que existieran.
export const DEFAULT_SITE_TEXTS = {
  // Frase que sale si está marcada "Offro colloqui anche online".
  onlineSessions: "Colloqui anche online",
  // Pie: "<alboPrefix> della Lombardia n. 12345".
  alboPrefix: "Iscritta all'Albo degli Psicologi",
  // Pie: "<vatLabel> 01234567890".
  vatLabel: "P. IVA",
  // Pie: "© 2026 Nome Cognome. <copyright>".
  copyright: "Tutti i diritti riservati.",
  // Rótulos de la sección "Recapiti".
  emailLabel: "Email",
  phoneLabel: "Telefono",
  addressLabel: "Studio",
};
