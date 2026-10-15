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

  // Iconos redondos de la cabecera (nombre accesible de cada enlace).
  contactIcons: {
    label: "Contatti e profili social",
    facebook: "Facebook",
    instagram: "Instagram",
    email: "Invia un'email",
    phone: "Chiama",
  },

  footer: {
    // Las diciture (prefix, label, text) las escribe la profesional en el panel:
    // "Impostazioni del sito" > "Testi del sito".
    albo: (prefix: string, region: string, number: string) => `${prefix} ${region} n. ${number}`,
    vatNumber: (label: string, vatNumber: string) => `${label} ${vatNumber}`,
    legalLabel: "Informazioni legali",
    socialLabel: "Profili social",
    reservedArea: "Area riservata",
    copyright: (year: number, name: string, text: string) => `© ${year} ${name}. ${text}`,
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
    // Solo en modo demo (sitio sin backend): el formulario no envía nada.
    demoNotice:
      "Versione dimostrativa: i messaggi inviati da questo modulo non vengono recapitati.",
    errorValidation: "Controlli i campi evidenziati e riprovi.",
    errorGeneric:
      "Non è stato possibile inviare il messaggio. Riprovi tra qualche minuto oppure mi scriva via email.",
    notice:
      "Per tutelare la Sua riservatezza, La invito a non inserire in questo modulo informazioni " +
      "cliniche o dati sensibili dettagliati. Questo modulo non è un servizio di emergenza: " +
      "in caso di urgenza contatti il 112 (Numero Unico di Emergenza).",
  },

  about: {
    // Botón por defecto de la sección "Chi sono" (ver AboutRender).
    defaultButtonLabel: "Scopri di più",
  },

  // Bloque «Video» y copertine con video.
  video: {
    play: (title: string) => (title ? `Riproduci il video: ${title}` : "Riproduci il video"),
    iframeTitle: "Video di YouTube",
    privacyNotice: "Il video viene caricato da YouTube (Google) solo quando si preme play.",
    ascolta: "Ascolta",
    guarda: "Guarda",
    videoBadge: "Video",
  },

  blog: {
    breadcrumbLabel: "Percorso di navigazione",
    home: "Home",
    postsLabel: "Articoli",
    empty: "Non ci sono ancora articoli.",
    emptyCategory: "Non ci sono ancora articoli in questa categoria.",
    publishedOn: "Pubblicato il",
    loadingMore: "Caricamento…",
    contactCardLabel: "Contatti",
    postCount: (count: number) => (count === 1 ? "1 articolo" : `${count} articoli`),
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
    zigzag: "Immagini e testi alternati",
    video: "Video o audio",
    cta: "Invito all'azione",
  } satisfies Record<BlockType, string>,

  // Explicación corta de cada tipo, al elegir qué sección agregar.
  blockDescriptions: {
    hero: "Titolo grande, sottotitolo, immagine e pulsante. Ideale in cima alla pagina.",
    about: "Foto, presentazione ed elenchi (formazione, specializzazioni, approccio).",
    richText: "Un testo libero con grassetto, corsivo, elenchi e collegamenti.",
    contactForm: "Il modulo con cui i visitatori possono scrivere un messaggio.",
    contactInfo: "Email, telefono e indirizzo dello studio.",
    image: "Un'immagine con una didascalia facoltativa.",
    zigzag: "Righe con un'immagine e un testo affiancati; l'immagine cambia lato a ogni riga.",
    cta: "Un riquadro con titolo, testo breve e un pulsante (es. «Prenota un primo colloquio»).",
    video:
      "Un video di YouTube, oppure un pulsante per ascoltare o guardare su un altro sito (Spotify, la radio…).",
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
      blog: "Blog",
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
      newPost: "Scrivi un articolo",
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
      blogLabel: "Copertina del blog",
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
      blogPageHelp:
        "Questa pagina è la copertina del blog (/blog): qui si modificano il titolo, la " +
        "posizione nel menu, il testo introduttivo (le sezioni qui sotto) e come appare su " +
        "Google. Gli articoli e le categorie si gestiscono in «Blog».",
      manageBlog: "Vai agli articoli del blog",
    },

    // Etiquetas de los formularios de edición de cada tipo de bloque.
    blockEditors: {
      image: {
        url: "Indirizzo dell'immagine",
        urlHelp:
          "Si compila da solo quando si carica un'immagine. In alternativa, incollare " +
          "l'indirizzo web di un'immagine (es. https://…).",
        upload: "Carica un'immagine dal computer",
        replace: "Sostituisci l'immagine",
        uploading: "Caricamento dell'immagine…",
        uploaded: "Immagine caricata. Ricordarsi di salvare la pagina.",
        remove: "Rimuovi l'immagine",
        errorNotImage:
          "Non è stato possibile leggere il file. Scegliere un'immagine in formato JPG o PNG.",
        errorUpload: "Non è stato possibile caricare l'immagine. Riprovare.",
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
        button: "Pulsante sotto il testo di presentazione",
        buttonLabel: "Testo del pulsante",
        buttonLabelPlaceholder: "Es. Scopri di più",
        buttonHref: "Collegamento del pulsante",
        buttonHrefHelp:
          "Es. /chi-sono per portare alla pagina «Chi sono». Il pulsante compare solo se " +
          "entrambi i campi sono compilati.",
      },
      zigzag: {
        rows: "Righe",
        help:
          "Su computer l'immagine si alterna a sinistra e a destra del testo; su telefono " +
          "compare sempre sotto il testo.",
        row: (number: number) => `Riga ${number}`,
        image: "Immagine",
        title: "Titolo della riga",
        text: "Testo",
        addRow: "Aggiungi riga",
        removeRow: "Rimuovi riga",
        noRows: "Nessuna riga. Aggiungerne una con il pulsante qui sotto.",
      },
      richText: {
        text: "Testo",
      },
      contactForm: {
        title: "Titolo",
        intro: "Testo introduttivo",
        help: "I motivi del contatto si modificano in «Impostazioni del sito».",
      },
      cta: {
        title: "Titolo",
        text: "Testo",
        buttonLabel: "Testo del pulsante",
        buttonHref: "Collegamento del pulsante",
        buttonHrefHelp: "Es. /contatti per portare alla pagina dei contatti.",
      },
      video: {
        url: "Indirizzo del video o dell'audio",
        urlHelp:
          "Un video di YouTube si vede direttamente nella pagina. Per Spotify, la radio o " +
          "altri siti compare un pulsante che apre il collegamento.",
        title: "Titolo",
        titleHelp: "Compare sotto il video o accanto al pulsante.",
        poster: "Immagine di anteprima",
        posterHelp:
          "Solo per YouTube: si vede prima di premere play. Se vuota, compare un riquadro con il simbolo play.",
        linkLabel: "Testo del pulsante (per i siti diversi da YouTube)",
      },
      contactInfo: {
        title: "Titolo",
        show: "Cosa mostrare",
        showEmail: "Email",
        showPhone: "Telefono",
        showAddress: "Indirizzo dello studio",
        showOnlineSessions: "Dicitura sui colloqui online",
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
      linkPrompt:
        "Indirizzo del collegamento (es. https://www.esempio.it). Lasciare vuoto per rimuoverlo.",
      // Texto corto que se ve en los botones de la barra.
      bulletListShort: "Elenco",
      orderedListShort: "Elenco",
      linkShort: "Collegamento",
    },

    blog: {
      title: "Blog",
      intro: "Gli articoli del blog, dal più recente.",
      newPost: "Nuovo articolo",
      categories: "Categorie",
      editBlogPage: "Titolo e introduzione del blog",
      noBlogPage:
        "La pagina «Blog» non esiste ancora: finché non viene creata e pubblicata, il blog non è visibile sul sito.",
      noCategories:
        "Prima di scrivere un articolo bisogna creare almeno una categoria in «Categorie».",
      filtersLabel: "Filtra gli articoli",
      filterStatus: "Stato",
      filterCategory: "Categoria",
      allStatuses: "Tutti",
      allCategories: "Tutte le categorie",
      published: "Pubblicato",
      draft: "Bozza (non visibile sul sito)",
      onlyPublished: "Pubblicati",
      onlyDrafts: "Bozze",
      empty: "Non ci sono ancora articoli.",
      emptyFiltered: "Nessun articolo con questi filtri.",
      publish: "Pubblica",
      unpublish: "Nascondi dal sito",
      publishedNow: "Articolo pubblicato",
      unpublishedNow: "L'articolo non è più visibile sul sito",
      deleteTitle: "Eliminare l'articolo?",
      deleteText: (title: string) =>
        `L'articolo «${title}» verrà eliminato definitivamente. L'operazione non può essere annullata.`,
      deleted: "Articolo eliminato",
    },

    postEditor: {
      newTitle: "Nuovo articolo",
      editTitle: (title: string) => `Modifica «${title}»`,
      backToPosts: "Torna agli articoli",
      postTitle: "Titolo dell'articolo",
      address: "Indirizzo dell'articolo",
      addressHelp:
        "Viene creato automaticamente dal titolo. È la parte finale dell'indirizzo web dell'articolo:",
      category: "Categoria",
      categoryPlaceholder: "Scegliere una categoria",
      date: "Data di pubblicazione",
      dateHelp: "Gli articoli sono mostrati dal più recente.",
      excerpt: "Estratto",
      excerptHelp: "Breve riassunto mostrato nell'elenco degli articoli.",
      coverSection: "Copertina",
      coverHelp: "Compare in cima all'articolo e nell'elenco degli articoli.",
      coverType: "Tipo di copertina",
      coverNone: "Nessuna copertina",
      coverImage: "Immagine",
      coverVideo: "Video di YouTube",
      coverImageField: "Immagine di copertina",
      coverPosterField: "Immagine di anteprima del video",
      coverPosterHelp:
        "Facoltativa: si vede prima di premere play e nell'elenco. Se vuota, compare un riquadro con il simbolo play.",
      coverVideoUrl: "Indirizzo del video",
      coverVideoHelp: "Es. https://www.youtube.com/watch?v=…",
      authorSection: "Autore",
      authorHelp: "Lasciare vuoti i campi per usare il nome e la foto di «Impostazioni del sito».",
      authorName: "Nome dell'autore",
      authorPhoto: "Foto dell'autore",
      sectionsHelp: "Il contenuto dell'articolo, sezione per sezione.",
      seoImage: "Immagine per la condivisione sui social",
      seoImageHelp: "Se vuota, si usa l'immagine di copertina.",
      created: "Articolo creato",
    },

    categories: {
      title: "Categorie del blog",
      intro:
        "Le categorie compaiono accanto agli articoli, nell'ordine qui indicato. Quelle senza articoli pubblicati non vengono mostrate sul sito.",
      backToPosts: "Torna agli articoli",
      empty: "Non ci sono ancora categorie.",
      name: "Nome",
      address: "Indirizzo della categoria",
      addressHelp: "Viene creato automaticamente dal nome:",
      parent: "Categoria principale",
      noParent: "Nessuna (è una categoria principale)",
      parentHelp:
        "Una sottocategoria compare sotto la sua categoria principale. È possibile un solo livello.",
      seoTitle: "Titolo per i motori di ricerca",
      seoDescription: "Breve descrizione per i motori di ricerca",
      newCategory: "Nuova categoria",
      add: "Aggiungi categoria",
      created: "Categoria creata",
      orderSaved: "Ordine delle categorie salvato",
      postCount: (count: number) => (count === 1 ? "1 articolo" : `${count} articoli`),
      subcategoryOf: (name: string) => `Sottocategoria di «${name}»`,
      cannotDelete: "Si può eliminare solo una categoria senza articoli né sottocategorie.",
      deleteTitle: "Eliminare la categoria?",
      deleteText: (name: string) => `La categoria «${name}» verrà eliminata definitivamente.`,
      deleted: "Categoria eliminata",
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
      contactSectionHelp:
        "Email e telefono compaiono anche come icone in cima a ogni pagina. " +
        "Lasciando vuoto il telefono, la sua icona non viene mostrata.",
      socialSection: "Profili social",
      socialSectionHelp:
        "Facebook e Instagram compaiono come icone in cima a ogni pagina. " +
        "Lasciando vuoto un campo, la sua icona non viene mostrata.",
      facebook: "Facebook (indirizzo della pagina)",
      instagram: "Instagram (indirizzo del profilo)",
      linkedin: "LinkedIn (indirizzo del profilo)",
      menuSection: "Menu del sito",
      menuHelp:
        "Le pagine del menu si scelgono in «Pagine». Qui si gestisce la voce che porta alla " +
        "sezione «Chi sono» della pagina iniziale; compare subito dopo «Home».",
      showAboutInMenu: "Mostra nel menu la voce che porta alla sezione «Chi sono»",
      aboutMenu: "Testo della voce",
      textsSection: "Testi del sito",
      textsHelp: "Le diciture fisse che compaiono in fondo a ogni pagina e nei recapiti.",
      textOnlineSessions: "Dicitura sui colloqui online",
      textOnlineSessionsHelp: "Compare solo se è selezionato «Offro colloqui anche online».",
      textAlboPrefix: "Dicitura prima dell'Ordine regionale",
      textVatLabel: "Dicitura prima della Partita IVA",
      textCopyright: "Dicitura dopo il nome, in fondo alla pagina",
      textEmailLabel: "Etichetta dell'email nei recapiti",
      textPhoneLabel: "Etichetta del telefono nei recapiti",
      textAddressLabel: "Etichetta dell'indirizzo nei recapiti",
      blogSection: "Blog: scheda contatti e autore",
      blogHelp:
        "Nome, titolo professionale, telefono ed email della scheda contatti accanto agli " +
        "articoli sono quelli inseriti sopra. Nome e foto sono anche l'autore predefinito degli articoli.",
      photo: "Foto professionale",
      officeHours: "Orari di ricevimento",
      officeHoursPlaceholder: "Es. Dal lunedì al venerdì, 9:00–19:00",
      blogTextsSection: "Testi del blog",
      textBlogCategories: "Titolo dell'elenco delle categorie",
      textBlogAllPosts: "Voce per vedere tutti gli articoli",
      textBlogReadMore: "Collegamento per aprire un articolo",
      textBlogLoadMore: "Pulsante per caricare altri articoli",
      textBlogBack: "Collegamento per tornare al blog",
      textBlogRelated: "Titolo degli articoli correlati",
      textOfficeHoursLabel: "Etichetta degli orari",
      textContactCardButton: "Pulsante della scheda contatti",
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
      filterLabel: "Filtra i messaggi",
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
