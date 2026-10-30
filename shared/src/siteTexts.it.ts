// Textos fijos del sitio público (rótulos del pie, de los recapiti, del menú y del blog,
// y las frases que se dirigen al visitante: botones, formulario y avisos).
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
  // Ítem del menú que baja a la sección "Chi sono" de la home (/#chi-sono).
  aboutMenu: "Chi sono",
  // Blog: barra lateral, tarjetas y artículo.
  blogCategories: "Categorie",
  blogAllPosts: "Tutti gli articoli",
  blogReadMore: "Leggi di più",
  blogLoadMore: "Carica altri articoli",
  blogBack: "Torna al blog",
  blogRelated: "Articoli correlati",
  // Tarjeta de contacto de la barra lateral del blog.
  officeHoursLabel: "Orari",
  contactCardButton: "Contattami",
  // Botón de WhatsApp (cabecera y barra fija del móvil) y el mensaje que deja escrito.
  whatsappButton: "Scrivimi su WhatsApp",
  whatsappMessage: "Buongiorno dottoressa, vorrei avere informazioni per un primo colloquio.",
  // Pie: título de la columna de los iconos y aviso de emergencia.
  socialTitle: "Mi trovi anche qui",
  emergencyNotice:
    "Questo sito non offre un servizio di emergenza. In caso di urgenza chiama il 112.",
  // Formulario de contacto.
  formReasonPlaceholder: "Seleziona un motivo",
  formNotice:
    "Per tutelare la tua riservatezza, ti invito a non inserire in questo modulo informazioni " +
    "cliniche o dati sensibili dettagliati. In caso di urgenza contatta il 112 " +
    "(Numero Unico di Emergenza).",
  formSuccessText: "Grazie per avermi scritto. Ti risponderò il prima possibile.",
  formErrorValidation: "Controlla i campi evidenziati e riprova.",
  formErrorGeneric:
    "Non è stato possibile inviare il messaggio. Riprova tra qualche minuto oppure scrivimi via email.",
  // Página "no encontrada".
  notFoundText: "La pagina che cerchi non esiste o è stata spostata.",
};

// Vista previa de los enlaces cuando la página no tiene la suya: "Impostazioni del
// sito" > "Anteprima dei collegamenti". Imagen vacía = la foto profesional.
export const DEFAULT_SITE_SEO = {
  description: "Uno spazio di ascolto e sostegno psicologico. Colloqui in studio e online.",
  imageUrl: "",
};
