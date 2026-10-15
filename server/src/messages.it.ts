// Textos en italiano que salen del backend: errores de la API (se muestran tal cual
// en el frontend) y el email de aviso a la psicóloga.
// Forma impersonal, para que sirvan tanto en el sitio público como en el panel.
export const messages = {
  notFound: "Risorsa non trovata.",
  pageNotFound: "Pagina non trovata.",
  messageNotFound: "Messaggio non trovato.",
  imageNotFound: "Immagine non trovata.",
  invalidRequest: "Richiesta non valida.",
  validation: "Alcuni dati non sono validi. Controllare i campi evidenziati.",
  internal: "Si è verificato un errore imprevisto. Riprovare più tardi.",

  tooManyRequests:
    "Sono stati inviati troppi messaggi in poco tempo. Riprovare tra qualche minuto.",

  unauthenticated: "Accesso non effettuato. Effettuare l'accesso e riprovare.",
  sessionExpired: "La sessione è scaduta. Effettuare di nuovo l'accesso.",
  forbidden: "Questo account non è autorizzato ad accedere all'area riservata.",

  slugTaken: "Esiste già una pagina con questo indirizzo.",
  homeSlugLocked: "L'indirizzo della pagina iniziale non può essere modificato.",
  homeMustStayPublished: "La pagina iniziale deve restare pubblicata.",
  homeCannotBeDeleted: "La pagina iniziale non può essere eliminata.",
  reorderOutdated: "L'elenco delle pagine non è aggiornato. Ricaricare e riprovare.",
  blogSlugLocked: "L'indirizzo della pagina del blog non può essere modificato.",
  blogCannotBeDeleted:
    "La pagina del blog non può essere eliminata. Per nasconderla, toglierne la pubblicazione.",

  postNotFound: "Articolo non trovato.",
  postSlugTaken: "Esiste già un articolo con questo indirizzo.",
  categoryNotFound: "Categoria non trovata.",
  categoryMissing: "La categoria scelta non esiste più. Sceglierne un'altra.",
  categorySlugTaken: "Esiste già una categoria con questo indirizzo.",
  categoryParentInvalid: "La categoria principale scelta non è valida.",
  categoryParentNotTopLevel:
    "Si può scegliere come categoria principale solo una categoria che non ne ha a sua volta una.",
  categoryHasChildrenNoParent:
    "Questa categoria ha delle sottocategorie: non può diventare a sua volta una sottocategoria.",
  categoryNotEmpty:
    "La categoria contiene degli articoli: spostarli in un'altra categoria prima di eliminarla.",
  categoryHasChildren:
    "La categoria contiene delle sottocategorie: eliminarle o spostarle prima di eliminarla.",
  categoriesReorderOutdated: "L'elenco delle categorie non è aggiornato. Ricaricare e riprovare.",

  // Email de aviso de mensaje nuevo. A propósito NO incluye el texto del mensaje ni
  // los datos de contacto: pueden ser datos sensibles y el email no es un canal
  // seguro. La psicóloga los lee en el panel.
  notificationEmail: {
    subject: "Nuovo messaggio dal sito",
    body: (data: { name: string; reason: string; receivedAt: string; adminUrl: string }) =>
      [
        "Buongiorno,",
        "",
        "è arrivato un nuovo messaggio dal modulo di contatto del sito.",
        "",
        `Da: ${data.name}`,
        `Motivo del contatto: ${data.reason}`,
        `Ricevuto il: ${data.receivedAt}`,
        "",
        "Per leggere il messaggio e rispondere, accedere all'area riservata:",
        data.adminUrl,
        "",
        "Questa è una notifica automatica: non rispondere a questa email.",
      ].join("\n"),
  },
} as const;
