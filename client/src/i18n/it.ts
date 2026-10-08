import type { BlockType, MessageStatus } from "@studio/shared";

// Todos los textos de la interfaz, en italiano. Ningún componente debe llevar
// texto visible escrito a mano: se agrega aquí una clave y se usa `it.algo.clave`.
//
// Registro:
// - Sitio público: forma de cortesía ("Lei") con el paciente.
// - Panel (admin.*): forma impersonal y lenguaje no técnico.
//
// Los textos con datos variables son funciones: it.footer.albo("della Lombardia", "12345").
//
// No están aquí (porque también los usa el backend):
// - mensajes de validación de formularios -> shared/src/validationMessages.it.ts
// - errores de la API y plantilla de email -> server/src/messages.it.ts
export const it = {
  common: {
    loading: "Caricamento…",
    error: "Si è verificato un errore. Riprovi tra qualche istante.",
    retry: "Riprova",
    skipToContent: "Vai al contenuto",
    optional: "facoltativo",
    opensInNewTab: "si apre in una nuova scheda",
  },

  seo: {
    // Descripción por defecto si la página no tiene una propia.
    defaultDescription:
      "Studio di psicologia: uno spazio di ascolto e sostegno. Colloqui in studio e online.",
  },

  nav: {
    label: "Navigazione principale",
    openMenu: "Apri il menu",
    closeMenu: "Chiudi il menu",
  },

  footer: {
    albo: (region: string, number: string) =>
      `Iscritta all'Albo degli Psicologi ${region} n. ${number}`,
    vatNumber: (vatNumber: string) => `P. IVA ${vatNumber}`,
    onlineSessions: "Colloqui anche online",
    legalLabel: "Informazioni legali",
    privacyPolicy: "Privacy Policy",
    cookiePolicy: "Cookie Policy",
    socialLabel: "Profili social",
    reservedArea: "Area riservata",
    copyright: (year: number, name: string) => `© ${year} ${name}. Tutti i diritti riservati.`,
  },

  contactInfo: {
    email: "Email",
    phone: "Telefono",
    address: "Studio",
    onlineSessions: "Colloqui anche online",
  },

  contactForm: {
    name: "Nome e cognome",
    email: "Email",
    phone: "Telefono",
    reason: "Motivo del contatto",
    reasonPlaceholder: "Selezioni un motivo",
    message: "Messaggio",
    // El consentimiento se arma en tres partes para poder poner el enlace en medio.
    consentBefore: "Ho letto l'",
    consentLink: "informativa privacy",
    consentAfter: " e acconsento al trattamento dei dati",
    honeypot: "Non compilare questo campo",
    submit: "Invia messaggio",
    submitting: "Invio in corso…",
    successTitle: "Messaggio inviato",
    successText: "Grazie per avermi scritto. Le risponderò il prima possibile.",
    sendAnother: "Invia un altro messaggio",
    errorValidation: "Controlli i campi evidenziati e riprovi.",
    errorGeneric:
      "Non è stato possibile inviare il messaggio. Riprovi tra qualche minuto oppure mi scriva via email.",
    notice:
      "Per tutelare la Sua riservatezza, La invito a non inserire in questo modulo informazioni " +
      "cliniche o dati sensibili dettagliati. Questo modulo non è un servizio di emergenza: " +
      "in caso di urgenza contatti il 112 (Numero Unico di Emergenza).",
  },

  notFound: {
    title: "Pagina non trovata",
    text: "La pagina che cerca non esiste o è stata spostata.",
    backHome: "Torna alla pagina iniziale",
  },

  // Nombres visibles de los tipos de bloque ("Sezioni" en el panel).
  blockNames: {
    hero: "Intestazione",
    about: "Chi sono",
    richText: "Testo",
    contactForm: "Modulo di contatto",
    contactInfo: "Recapiti",
    image: "Immagine",
  } satisfies Record<BlockType, string>,

  // Explicación corta de cada tipo, al elegir qué sección agregar.
  blockDescriptions: {
    hero: "Titolo grande, sottotitolo, immagine e pulsante. Ideale in cima alla pagina.",
    about: "Foto, presentazione ed elenchi (formazione, specializzazioni, approccio).",
    richText: "Un testo libero con grassetto, corsivo, elenchi e collegamenti.",
    contactForm: "Il modulo con cui i visitatori possono scrivere un messaggio.",
    contactInfo: "Email, telefono e indirizzo dello studio.",
    image: "Un'immagine con una didascalia facoltativa.",
  } satisfies Record<BlockType, string>,

  messageStatus: {
    nuovo: "Nuovo",
    letto: "Letto",
    risposto: "Risposto",
  } satisfies Record<MessageStatus, string>,

  admin: {
    common: {
      save: "Salva modifiche",
      saving: "Salvataggio…",
      saved: "Modifiche salvate",
      cancel: "Annulla",
      confirm: "Conferma",
      delete: "Elimina",
      edit: "Modifica",
      add: "Aggiungi",
      close: "Chiudi",
      back: "Indietro",
      moveUp: "Sposta su",
      moveDown: "Sposta giù",
      viewOnSite: "Vedi sul sito",
      loading: "Caricamento…",
      error: "Si è verificato un errore. Riprovare tra qualche istante.",
      checkFields: "Controllare i campi evidenziati.",
      unsavedChanges: "Ci sono modifiche non salvate. Uscire senza salvare?",
      sessionExpired: "La sessione è scaduta. Effettuare di nuovo l'accesso.",
    },

    nav: {
      label: "Menu dell'area riservata",
      dashboard: "Inizio",
      pages: "Pagine",
      messages: "Messaggi",
      settings: "Impostazioni del sito",
      viewSite: "Vai al sito",
      logout: "Esci",
    },

    login: {
      title: "Area riservata",
      email: "Email",
      password: "Password",
      submit: "Accedi",
      submitting: "Accesso in corso…",
      forgotPassword: "Password dimenticata?",
      wrongCredentials: "Email o password non corretti.",
      tooManyAttempts: "Troppi tentativi di accesso. Riprovare tra qualche minuto.",
      notAuthorized: "Questo account non è autorizzato ad accedere all'area riservata.",
      backToSite: "Torna al sito",
      resetTitle: "Reimposta la password",
      resetIntro:
        "Inserire l'email dell'account: verrà inviato un link per scegliere una nuova password.",
      resetSubmit: "Invia il link",
      resetSent: "Se l'indirizzo è corretto, a breve arriverà un'email con le istruzioni.",
      backToLogin: "Torna all'accesso",
    },

    dashboard: {
      title: "Benvenuta",
      newMessages: (count: number) => {
        if (count === 0) return "Nessun nuovo messaggio";
        if (count === 1) return "1 nuovo messaggio";
        return `${count} nuovi messaggi`;
      },
      quickLinks: "Accessi rapidi",
      editHome: "Modifica Home",
      editContacts: "Modifica Contatti",
      viewMessages: "Vedi messaggi",
    },

    pages: {
      title: "Pagine",
      intro: "Le pagine del sito, nell'ordine in cui compaiono nel menu.",
      newPage: "Nuova pagina",
      empty: "Non ci sono ancora pagine.",
      published: "Pubblicata",
      draft: "Bozza (non visibile sul sito)",
      inMenu: "Nel menu",
      notInMenu: "Non nel menu",
      publish: "Pubblica",
      unpublish: "Nascondi dal sito",
      publishedNow: "Pagina pubblicata",
      unpublishedNow: "La pagina non è più visibile sul sito",
      orderSaved: "Ordine delle pagine salvato",
      deleteTitle: "Eliminare la pagina?",
      deleteText: (title: string) =>
        `La pagina «${title}» verrà eliminata definitivamente. L'operazione non può essere annullata.`,
      deleted: "Pagina eliminata",
      homeLabel: "Pagina iniziale",
    },

    pageEditor: {
      newTitle: "Nuova pagina",
      editTitle: (title: string) => `Modifica «${title}»`,
      pageTitle: "Titolo della pagina",
      address: "Indirizzo della pagina",
      addressHelp:
        "Viene creato automaticamente dal titolo. È la parte finale dell'indirizzo web della pagina.",
      showInMenu: "Mostra nel menu del sito",
      published: "Pagina pubblicata (visibile sul sito)",
      seoSection: "Come appare su Google",
      seoHelp:
        "Titolo e descrizione mostrati nei risultati di ricerca. Se lasciati vuoti, viene usato il titolo della pagina.",
      seoTitle: "Titolo per i motori di ricerca",
      seoDescription: "Breve descrizione",
      sections: "Sezioni",
      sectionsHelp: "Ogni pagina è composta da sezioni, mostrate una sotto l'altra.",
      noSections: "Questa pagina non ha ancora sezioni.",
      addSection: "Aggiungi sezione",
      chooseSection: "Che tipo di sezione aggiungere?",
      editSection: "Modifica sezione",
      deleteSectionTitle: "Eliminare la sezione?",
      deleteSectionText: (name: string) =>
        `La sezione «${name}» verrà rimossa dalla pagina quando si salvano le modifiche.`,
      preview: "Anteprima",
      closePreview: "Chiudi anteprima",
      previewNotice: "Anteprima: le modifiche non sono ancora state salvate.",
      created: "Pagina creata",
      backToPages: "Torna alle pagine",
    },

    // Etiquetas de los formularios de edición de cada tipo de bloque.
    blockEditors: {
      image: {
        url: "Indirizzo dell'immagine",
        urlHelp: "Incollare l'indirizzo web dell'immagine (es. https://… oppure /images/foto.jpg).",
        alt: "Descrizione dell'immagine",
        altHelp: "Viene letta dai lettori di schermo a chi non può vedere l'immagine.",
        caption: "Didascalia",
      },
      hero: {
        title: "Titolo",
        subtitle: "Sottotitolo",
        buttonLabel: "Testo del pulsante",
        buttonHref: "Collegamento del pulsante",
        buttonHrefHelp: "Es. /contatti per portare alla pagina dei contatti.",
      },
      about: {
        title: "Titolo",
        photo: "Foto",
        text: "Testo di presentazione",
        lists: "Elenchi",
        listTitle: "Titolo dell'elenco",
        listTitlePlaceholder: "Es. Formazione",
        listItem: "Voce",
        addList: "Aggiungi elenco",
        addItem: "Aggiungi voce",
        removeList: "Rimuovi elenco",
        removeItem: "Rimuovi voce",
      },
      richText: {
        text: "Testo",
      },
      contactForm: {
        title: "Titolo",
        intro: "Testo introduttivo",
        help: "I motivi del contatto si modificano in «Impostazioni del sito».",
      },
      contactInfo: {
        title: "Titolo",
        show: "Cosa mostrare",
        showEmail: "Email",
        showPhone: "Telefono",
        showAddress: "Indirizzo dello studio",
        showOnlineSessions: "Dicitura «Colloqui anche online»",
        help: "I recapiti si modificano in «Impostazioni del sito».",
      },
    },

    richTextEditor: {
      toolbar: "Formattazione del testo",
      bold: "Grassetto",
      italic: "Corsivo",
      bulletList: "Elenco puntato",
      orderedList: "Elenco numerato",
      link: "Collegamento",
      removeLink: "Rimuovi collegamento",
      linkPrompt: "Indirizzo del collegamento (es. https://www.esempio.it)",
    },

    settings: {
      title: "Impostazioni del sito",
      intro: "Questi dati compaiono in fondo a ogni pagina e nella pagina dei contatti.",
      professionalSection: "Dati professionali",
      siteName: "Nome e cognome",
      professionalTitle: "Titolo professionale",
      professionalTitlePlaceholder: "Es. Psicologa",
      alboRegion: "Ordine regionale",
      alboRegionHelp:
        "Scrivere come deve apparire dopo «Albo degli Psicologi»: es. «della Lombardia».",
      alboNumber: "Numero di iscrizione all'Albo",
      vatNumber: "Partita IVA",
      contactSection: "Recapiti",
      email: "Email",
      phone: "Telefono",
      address: "Indirizzo dello studio",
      onlineSessions: "Offro colloqui anche online",
      socialSection: "Profili social",
      instagram: "Instagram (indirizzo del profilo)",
      linkedin: "LinkedIn (indirizzo del profilo)",
      reasonsSection: "Motivi del contatto",
      reasonsHelp: "Le opzioni tra cui il visitatore può scegliere nel modulo di contatto.",
      reason: "Motivo",
      addReason: "Aggiungi motivo",
      removeReason: "Rimuovi motivo",
    },

    messages: {
      title: "Messaggi",
      intro: "I messaggi ricevuti dal modulo di contatto del sito.",
      empty: "Non ci sono ancora messaggi.",
      emptyFiltered: "Nessun messaggio in questa categoria.",
      filterAll: "Tutti",
      from: "Da",
      email: "Email",
      phone: "Telefono",
      reason: "Motivo del contatto",
      message: "Messaggio",
      receivedAt: "Ricevuto il",
      consentAt: (date: string) => `Consenso al trattamento dei dati fornito il ${date}`,
      markRead: "Segna come letto",
      markReplied: "Segna come risposto",
      markNew: "Segna come nuovo",
      replyByEmail: "Rispondi via email",
      replySubject: (reason: string) => `Risposta alla Sua richiesta: ${reason}`,
      deleteTitle: "Eliminare il messaggio?",
      deleteText: (name: string) =>
        `Il messaggio di ${name} verrà eliminato definitivamente. L'operazione non può essere annullata.`,
      deleted: "Messaggio eliminato",
      backToMessages: "Torna ai messaggi",
    },
  },
} as const;
