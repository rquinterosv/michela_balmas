import { DEFAULT_SITE_SEO, DEFAULT_SITE_TEXTS } from "./siteTexts.it";
import type { Block } from "./blocks";
import type { PageInput, SiteSettings } from "./types";

export { seedCategories, seedPosts } from "./seedBlog";

// Contenido de ejemplo en italiano. TODOS los datos son ficticios (nombre, número
// de Albo, Partita IVA, recapiti): hay que sustituirlos desde el panel.
// Registro: forma de cortesía ("Lei") con el paciente.

export const seedSettings: SiteSettings = {
  siteName: "Dott.ssa Anna Rossi",
  professionalTitle: "Psicologa",
  albo: { region: "della Lombardia", number: "00000" },
  vatNumber: "00000000000",
  email: "info@esempio.it",
  phone: "+39 000 000 0000",
  address: "Via Esempio 1, 20100 Milano (MI)",
  onlineSessions: true,
  showAboutInMenu: true,
  // Vacía: se ve el icono genérico hasta que se suba la foto desde el panel.
  photoUrl: "",
  officeHours: "Dal lunedì al venerdì, 9:00–19:00",
  social: { facebook: "", instagram: "", linkedin: "" },
  contactReasons: [
    "Primo colloquio conoscitivo",
    "Informazioni sui percorsi",
    "Colloqui online",
    "Altro",
  ],
  texts: DEFAULT_SITE_TEXTS,
  seo: DEFAULT_SITE_SEO,
};

const DRAFT_NOTICE =
  "<p><strong>[BOZZA] Testo di esempio, non valido ai fini di legge. Deve essere rivisto e " +
  "completato da un professionista (consulente privacy o legale) prima della pubblicazione." +
  "</strong></p>";

const privacyPolicyHtml = [
  DRAFT_NOTICE,
  "<p>La presente informativa descrive come vengono trattati i dati personali di chi visita " +
    "questo sito e di chi invia un messaggio tramite il modulo di contatto, ai sensi del " +
    "Regolamento (UE) 2016/679 (GDPR) e del D.Lgs. 196/2003 e successive modifiche.</p>",

  "<p><strong>1. Titolare del trattamento</strong></p>",
  "<p>Il titolare del trattamento è la Dott.ssa Anna Rossi, Psicologa, con studio in " +
    "Via Esempio 1, 20100 Milano (MI), P. IVA 00000000000. Per qualsiasi richiesta relativa " +
    'ai dati personali è possibile scrivere a <a href="mailto:info@esempio.it">info@esempio.it</a>.</p>',

  "<p><strong>2. Dati trattati</strong></p>",
  "<ul>" +
    "<li>Dati forniti con il modulo di contatto: nome e cognome, indirizzo email, numero di " +
    "telefono (facoltativo), motivo del contatto e testo del messaggio.</li>" +
    "<li>Dati tecnici di navigazione: indirizzo IP e informazioni sul dispositivo, trattati " +
    "per il tempo strettamente necessario a garantire il funzionamento e la sicurezza del sito.</li>" +
    "</ul>",
  "<p>Si invita a non inserire nel modulo informazioni cliniche o altri dati sensibili dettagliati.</p>",

  "<p><strong>3. Finalità e base giuridica</strong></p>",
  "<p>I dati sono trattati esclusivamente per rispondere alle richieste ricevute e per " +
    "fissare un eventuale primo colloquio. La base giuridica è il consenso dell'interessato " +
    "(art. 6, par. 1, lett. a GDPR) e l'esecuzione di misure precontrattuali adottate su sua " +
    "richiesta (art. 6, par. 1, lett. b GDPR). I dati non vengono utilizzati per finalità di " +
    "marketing né di profilazione.</p>",

  "<p><strong>4. Modalità del trattamento e conservazione</strong></p>",
  "<p>I messaggi sono conservati in un archivio elettronico protetto, accessibile soltanto " +
    "alla titolare, su server situati nell'Unione Europea. I dati sono conservati per il " +
    "tempo necessario a gestire la richiesta e comunque non oltre [DA DEFINIRE] mesi " +
    "dall'ultimo contatto, salvo che ne derivi un rapporto professionale.</p>",

  "<p><strong>5. Destinatari dei dati</strong></p>",
  "<p>I dati non sono diffusi. Possono essere trattati, per conto della titolare, dai " +
    "fornitori dei servizi tecnici necessari al funzionamento del sito (hosting e archiviazione " +
    "dei dati), nominati responsabili del trattamento: [ELENCO DEI FORNITORI DA COMPLETARE].</p>",

  "<p><strong>6. Diritti dell'interessato</strong></p>",
  "<p>In qualsiasi momento è possibile esercitare i diritti previsti dagli articoli 15-22 " +
    "del GDPR: accesso, rettifica, cancellazione, limitazione, portabilità, opposizione e " +
    "revoca del consenso, scrivendo all'indirizzo email indicato sopra. È inoltre possibile " +
    "proporre reclamo al Garante per la protezione dei dati personali " +
    '(<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">www.garanteprivacy.it</a>).</p>',

  "<p><em>Ultimo aggiornamento: [DATA].</em></p>",
].join("");

// Párrafo sobre los videos de YouTube del blog (bloque «Video»). Borrador: lo tiene
// que revisar un profesional. Se exporta para poder copiarlo en la Cookie Policy de
// un sitio ya en marcha (ver docs/cookie-policy-youtube.md).
export const youtubeCookiePolicyHtml = [
  "<p><strong>Video di YouTube [DA REVISIONARE]</strong></p>",
  "<p>Alcune pagine del blog contengono video ospitati su YouTube, servizio di Google " +
    "Ireland Limited. Per tutelare la Sua riservatezza, il video non viene caricato " +
    "all'apertura della pagina: al suo posto compare un riquadro con il pulsante di " +
    "riproduzione, e nessun dato viene inviato a YouTube finché non lo preme.</p>",
  "<p>Premendo il pulsante, il video viene caricato in modalità «privacy avanzata» " +
    "(dominio youtube-nocookie.com). Da quel momento YouTube può raccogliere dati come " +
    "l'indirizzo IP e salvare informazioni sul dispositivo, secondo la propria informativa: " +
    '<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">' +
    "policies.google.com/privacy</a>. Se preferisce, può guardare il video direttamente sul " +
    "sito di YouTube.</p>",
].join("");

const cookiePolicyHtml = [
  DRAFT_NOTICE,
  "<p>Questo sito non utilizza cookie di profilazione né strumenti di analisi statistica " +
    "(analytics), e durante la navigazione non installa cookie di terze parti. Per questo " +
    "motivo non viene mostrato alcun banner per la raccolta del consenso. I video di YouTube " +
    "si caricano solo se il visitatore lo richiede (vedi sotto).</p>",

  "<p><strong>Che cosa sono i cookie</strong></p>",
  "<p>I cookie sono piccoli file di testo che i siti visitati salvano sul dispositivo " +
    "dell'utente per memorizzare alcune informazioni tra una visita e l'altra.</p>",

  "<p><strong>Strumenti tecnici utilizzati</strong></p>",
  "<p>Il sito utilizza soltanto strumenti tecnici strettamente necessari al suo " +
    "funzionamento, per i quali la normativa non richiede il consenso. In particolare, " +
    "l'area riservata alla titolare memorizza nel browser i dati necessari a mantenere " +
    "l'accesso: questo riguarda esclusivamente chi amministra il sito, non i visitatori.</p>",

  youtubeCookiePolicyHtml,

  "<p><strong>Come gestire i cookie dal browser</strong></p>",
  "<p>È sempre possibile cancellare o bloccare i cookie dalle impostazioni del proprio " +
    "browser. Disattivare i cookie tecnici non compromette la consultazione delle pagine " +
    "pubbliche di questo sito.</p>",

  "<p><strong>Modifiche</strong></p>",
  "<p>Se in futuro il sito dovesse adottare strumenti che richiedono il consenso, questa " +
    "pagina verrà aggiornata e verrà mostrato un apposito banner, come previsto dalle linee " +
    "guida del Garante per la protezione dei dati personali.</p>",

  '<p>Per maggiori informazioni sul trattamento dei dati personali consulti la <a href="/privacy-policy">Privacy Policy</a>.</p>',
  "<p><em>Ultimo aggiornamento: [DATA].</em></p>",
].join("");

// Formulario de contacto, al final de «Contatti». Se exporta aparte por lo mismo
// que homeFaqBlock: el seed lo añade una sola vez a una página que ya existe.
export const contattiFormBlock: Block = {
  id: "contatti-form",
  type: "contactForm",
  data: {
    title: "Scriva un messaggio",
    intro: "Compili il modulo: Le risponderò personalmente all'indirizzo email indicato.",
  },
};

// Preguntas frecuentes, al final de la Home. Se exporta aparte porque el seed la
// añade una sola vez a una Home que ya existe (ver server/scripts/seed.ts).
// Tono informativo y neutro, sin promesas de resultados. "[DA REVISIONARE]".
export const homeFaqBlock: Block = {
  id: "home-faq",
  type: "faq",
  data: {
    title: "Domande frequenti",
    items: [
      {
        id: "faq-bisogno",
        question: "Come capisco se ho bisogno di uno psicologo?",
        answer:
          "<p><strong>[DA REVISIONARE]</strong></p>" +
          "<p>Non serve aspettare una crisi. Può essere utile rivolgersi a uno psicologo " +
          "quando un malessere dura nel tempo, quando pensieri o emozioni rendono difficile " +
          "la vita di tutti i giorni, nei momenti di cambiamento o quando le relazioni " +
          "diventano fonte di sofferenza. Anche il desiderio di conoscersi meglio è un " +
          "buon motivo. Il primo colloquio serve proprio a capirlo insieme.</p>",
      },
      {
        id: "faq-differenze",
        question: "Qual è la differenza tra psicologo, psicoterapeuta e psichiatra?",
        answer:
          "<p><strong>[DA REVISIONARE]</strong></p>" +
          "<ul>" +
          "<li><strong>Psicologo</strong>: laureato in psicologia, abilitato con l'esame di " +
          "Stato e iscritto all'Albo. Si occupa di sostegno, consulenza e valutazione " +
          "psicologica.</li>" +
          "<li><strong>Psicoterapeuta</strong>: psicologo o medico che ha completato una " +
          "scuola di specializzazione in psicoterapia di almeno quattro anni. Può condurre " +
          "percorsi di psicoterapia.</li>" +
          "<li><strong>Psichiatra</strong>: medico specializzato in psichiatria. Può " +
          "prescrivere farmaci e, se ha la formazione, fare anche psicoterapia.</li>" +
          "</ul>",
      },
      {
        id: "faq-primo-colloquio",
        question: "Che cosa succede durante il primo colloquio?",
        answer:
          "<p><strong>[DA REVISIONARE]</strong></p>" +
          "<p>Il primo colloquio è un momento di conoscenza reciproca. Si parla di ciò che " +
          "La porta a chiedere un incontro, senza bisogno di arrivare preparati. Al termine " +
          "si valuta insieme se e come proseguire. Non comporta alcun impegno a continuare.</p>",
      },
      {
        id: "faq-online",
        question: "Come funziona la terapia online?",
        answer:
          "<p><strong>[DA REVISIONARE]</strong></p>" +
          "<p>I colloqui online si svolgono in videochiamata e seguono gli stessi principi " +
          "di quelli in studio. Servono una connessione stabile, un dispositivo con " +
          "videocamera e un luogo tranquillo e riservato, in cui non essere interrotti.</p>",
      },
      {
        id: "faq-fa-per-me",
        question: "Come capisco se la terapia fa per me?",
        answer:
          "<p><strong>[DA REVISIONARE]</strong></p>" +
          "<p>Non esiste una risposta valida per tutti. Un buon punto di partenza è chiedersi " +
          "se si desidera uno spazio per capire meglio ciò che si sta vivendo. Anche sentirsi " +
          "a proprio agio con il professionista è importante: nei primi incontri si può " +
          "valutare insieme se il percorso risponde alle proprie esigenze.</p>",
      },
    ],
  },
};

// Secciones del rediseño (prototipo Sito-Michi) para la Home. Se exportan aparte,
// como homeFaqBlock: el seed las añade una sola vez a una Home que ya existe, cada
// una en su sitio (ver PAGE_ADDITIONS en server/scripts/seed.ts). "[DA REVISIONARE]".

export const homeServicesBlock: Block = {
  id: "home-services",
  type: "services",
  data: {
    title: "Di cosa mi occupo",
    intro:
      "Ogni persona vive dentro una rete di relazioni. Per questo il lavoro può riguardare " +
      "il singolo, la coppia o la famiglia. Spesso tutto comincia da una frase come queste. " +
      "[DA REVISIONARE]",
    items: [
      {
        id: "services-adulti",
        category: "Adulti",
        quote: "«Mi sento sempre in allerta e non so più come staccare.»",
        description:
          "Ansia e stress, autostima, momenti di cambiamento, relazioni che fanno fatica.",
      },
      {
        id: "services-coppie",
        category: "Coppie",
        quote: "«Litighiamo sempre per le stesse cose.»",
        description:
          "Conflitti ricorrenti, crisi, distanza, scelte importanti da affrontare insieme.",
      },
      {
        id: "services-famiglie",
        category: "Famiglie e genitori",
        quote: "«Da quando nostro figlio è cresciuto non ci capiamo più.»",
        description:
          "Fasi di passaggio, difficoltà con i figli, equilibri familiari da ricostruire.",
      },
    ],
  },
};

// "Come funziona": tres pasos, después de "Di cosa mi occupo".
export const homeHowItWorksBlock: Block = {
  id: "home-how-it-works",
  type: "timeline",
  data: {
    title: "Come funziona",
    intro: "Iniziare è più semplice di quanto sembri. Ecco cosa succede, passo dopo passo.",
    items: [
      {
        id: "how-prenota",
        icon: "calendar-days",
        title: "Prenoti il primo colloquio",
        text:
          "Mi scriva dal modulo dei contatti oppure su WhatsApp: Le risponderò per fissare " +
          "insieme giorno e orario. [DA REVISIONARE]",
      },
      {
        id: "how-conosciamo",
        icon: "message-circle",
        title: "Ci conosciamo",
        text:
          "Nel primo incontro ascolto la Sua richiesta e capiamo insieme se e come proseguire. " +
          "Nessun impegno oltre questo colloquio.",
      },
      {
        id: "how-percorso",
        icon: "route",
        title: "Costruiamo il percorso",
        text:
          "Definiamo obiettivi e frequenza. Sedute da 50 minuti, momenti di verifica e follow " +
          "up a 3, 6 o 12 mesi dalla fine.",
      },
    ],
  },
};

export const homePricingBlock: Block = {
  id: "home-pricing",
  type: "pricing",
  data: {
    title: "Tariffe e modalità",
    intro: "Trasparenza fin dall'inizio, per decidere con serenità. [DA REVISIONARE]",
    prices: [
      {
        id: "pricing-primo",
        name: "Primo colloquio",
        description: "50 minuti, per conoscersi e capire insieme come procedere.",
        price: "€ —",
      },
      {
        id: "pricing-individuale",
        name: "Seduta individuale",
        description: "50 minuti, con frequenza concordata insieme.",
        price: "€ —",
      },
      {
        id: "pricing-coppia",
        name: "Seduta di coppia o familiare",
        description: "Con tutti i partecipanti presenti o collegati.",
        price: "€ —",
      },
    ],
    notes: [
      {
        id: "pricing-dove",
        icon: "monitor-smartphone",
        title: "Dove",
        text: "In studio oppure online in videochiamata, da un luogo tranquillo e riservato.",
      },
      {
        id: "pricing-pagamento",
        icon: "calendar-days",
        title: "Pagamento",
        text: "Con bonifico o carta. Viene rilasciata fattura detraibile come spesa sanitaria.",
      },
      {
        id: "pricing-disdetta",
        icon: "clock",
        title: "Disdetta",
        text: "Gratuita fino a 48 ore prima dell'appuntamento.",
      },
      {
        id: "pricing-riservatezza",
        icon: "shield-check",
        title: "Riservatezza",
        text: "Segreto professionale e piattaforme protette, nel rispetto del Codice Deontologico.",
      },
    ],
  },
};

export const homeLatestPostsBlock: Block = {
  id: "home-latest-posts",
  type: "latestPosts",
  data: {
    title: "Dal blog",
    intro: "Riflessioni, consigli e approfondimenti sul benessere psicologico.",
  },
};

export const homeBookBlock: Block = {
  id: "home-book",
  type: "book",
  data: {
    eyebrow: "Il mio libro",
    title: "[Titolo del libro]",
    subtitle: "[Sottotitolo]",
    text:
      "[Due o tre righe di presentazione: di cosa parla il libro e a chi si rivolge.] " +
      "[DA REVISIONARE]",
    // Vacía: sin portada no se ve el panel; se sube desde el panel.
    coverUrl: "",
    coverAlt: "",
    buttonLabel: "",
    buttonHref: "",
    linkLabel: "",
    linkHref: "",
  },
};

export const homeCtaBlock: Block = {
  id: "home-cta",
  type: "cta",
  data: {
    title: "Il primo passo è il più importante",
    text:
      "Prenoti un primo colloquio: ci conosciamo e capiamo insieme se e come posso esserLe " +
      "d'aiuto. [DA REVISIONARE]",
    buttonLabel: "Prenota il primo colloquio",
    buttonHref: "/contatti",
  },
};

// La clave es el id del documento en Firestore.
export const seedPages: Record<string, PageInput> = {
  home: {
    title: "Home",
    slug: "home",
    order: 0,
    published: true,
    showInMenu: true,
    seo: {
      title: "Dott.ssa Anna Rossi, Psicologa a Milano",
      description:
        "Psicologa a Milano. Colloqui di sostegno psicologico per adulti, in studio e online. Prenoti un primo colloquio conoscitivo.",
    },
    blocks: [
      {
        id: "home-hero",
        type: "hero",
        data: {
          title: "Uno spazio di ascolto, per ritrovare il proprio equilibrio",
          subtitle:
            "Sono Anna Rossi, psicologa. Accompagno le persone adulte nei momenti di difficoltà, " +
            "di cambiamento e di crescita personale, in studio a Milano e online.",
          imageUrl: "/images/placeholder-hero.svg",
          imageAlt: "",
          buttonLabel: "Prenota un primo colloquio",
          buttonHref: "/contatti",
        },
      },
      homeServicesBlock,
      homeHowItWorksBlock,
      {
        id: "home-about",
        type: "about",
        data: {
          title: "Chi sono",
          // Vacía: se ve el icono genérico hasta que se suba la foto desde el panel.
          photoUrl: "",
          photoAlt: "Ritratto della Dott.ssa Anna Rossi",
          html:
            "<p>Mi chiamo Anna Rossi e sono una psicologa iscritta all'Albo degli Psicologi " +
            "della Lombardia. Nel mio lavoro offro uno spazio riservato e privo di giudizio, " +
            "in cui potersi fermare, dare un nome a ciò che si sta vivendo e trovare insieme " +
            "nuove strade.</p>" +
            "<p>Credo che chiedere aiuto sia un gesto di cura verso sé stessi. Ogni percorso è " +
            "diverso: per questo il <strong>primo colloquio</strong> serve a conoscersi, " +
            "ascoltare la Sua richiesta e capire insieme come procedere.</p>",
          lists: [
            {
              title: "Formazione",
              items: [
                "Laurea magistrale in Psicologia clinica",
                "Abilitazione all'esercizio della professione di psicologo",
                "Formazione continua e aggiornamento professionale",
              ],
            },
            {
              title: "Specializzazioni",
              items: [
                "Ansia e gestione dello stress",
                "Momenti di cambiamento e difficoltà relazionali",
                "Autostima e crescita personale",
              ],
            },
            {
              title: "Approccio",
              items: [
                "Ascolto empatico e rispettoso dei tempi di ciascuno",
                "Obiettivi condivisi fin dal primo incontro",
                "Massima riservatezza, nel rispetto del Codice Deontologico",
              ],
            },
          ],
          buttonLabel: "Leggi il mio percorso completo",
          buttonHref: "/chi-sono",
        },
      },
      homePricingBlock,
      homeFaqBlock,
      homeLatestPostsBlock,
      homeBookBlock,
      homeCtaBlock,
    ],
  },

  contatti: {
    title: "Contatti",
    slug: "contatti",
    order: 3,
    published: true,
    // Fuera del menú: lleva aquí el botón "Prenota" de la cabecera.
    showInMenu: false,
    seo: {
      title: "Contatti | Dott.ssa Anna Rossi, Psicologa",
      description:
        "Scriva per richiedere informazioni o prenotare un primo colloquio, in studio a Milano oppure online.",
    },
    blocks: [
      {
        id: "contatti-intro",
        type: "richText",
        data: {
          html:
            "<p>Per richiedere informazioni o fissare un primo colloquio può usare i recapiti " +
            "indicati in questa pagina. Le risponderò personalmente, di norma entro due " +
            "giorni lavorativi.</p>",
        },
      },
      {
        id: "contatti-info",
        type: "contactInfo",
        data: {
          title: "Recapiti",
          showEmail: true,
          showPhone: true,
          showAddress: true,
          showOnlineSessions: true,
        },
      },
      contattiFormBlock,
    ],
  },

  "privacy-policy": {
    title: "Privacy Policy",
    slug: "privacy-policy",
    order: 4,
    published: true,
    showInMenu: false,
    seo: {
      title: "Privacy Policy | Dott.ssa Anna Rossi",
      description: "Informativa sul trattamento dei dati personali.",
    },
    blocks: [{ id: "privacy-text", type: "richText", data: { html: privacyPolicyHtml } }],
  },

  "cookie-policy": {
    title: "Cookie Policy",
    slug: "cookie-policy",
    order: 5,
    published: true,
    showInMenu: false,
    seo: {
      title: "Cookie Policy | Dott.ssa Anna Rossi",
      description: "Informazioni sull'uso dei cookie in questo sito.",
    },
    blocks: [{ id: "cookie-text", type: "richText", data: { html: cookiePolicyHtml } }],
  },

  // Cómo trabaja la profesional, en formato visual: introducción breve, tarjetas
  // con icono ("Il mio approccio"), el percorso a tappe y una invitación final.
  // Textos provisionales, marcados "DA REVISIONARE" hasta tener los suyos.
  "come-lavoro": {
    title: "Come lavoro",
    slug: "come-lavoro",
    order: 1,
    published: true,
    // Fuera del menú: el menú es el índice de la Home, que ya tiene «Come funziona».
    showInMenu: false,
    seo: {
      title: "",
      description:
        "L'approccio sistemico-relazionale e le tappe di un percorso di psicoterapia, " +
        "dal primo contatto alla conclusione. In studio e online.",
    },
    blocks: [
      {
        id: "come-lavoro-intro",
        type: "richText",
        data: {
          html:
            "<p>Il mio lavoro si basa sull'approccio <strong>sistemico-relazionale</strong>: " +
            "guardo alla persona insieme alle sue relazioni, perché è spesso lì che " +
            "nascono le difficoltà e lì si trovano le risorse per affrontarle. " +
            "<strong>[DA REVISIONARE]</strong></p>",
        },
      },
      {
        id: "come-lavoro-approccio",
        type: "features",
        data: {
          title: "Il mio approccio",
          items: [
            {
              id: "approccio-sistemico",
              icon: "network",
              title: "Approccio sistemico-relazionale",
              text: "La persona osservata insieme alle sue relazioni: coppia, famiglia, lavoro. (DA REVISIONARE)",
            },
            {
              id: "approccio-ascolto",
              icon: "hand-heart",
              title: "Ascolto senza giudizio",
              text: "Uno spazio riservato in cui sentirsi accolti e rispettati nei propri tempi. (DA REVISIONARE)",
            },
            {
              id: "approccio-modalita",
              icon: "video",
              title: "Online e in presenza",
              text: "Colloqui in studio oppure in videochiamata, con la stessa cura. (DA REVISIONARE)",
            },
          ],
        },
      },
      {
        id: "come-lavoro-percorso",
        type: "timeline",
        data: {
          title: "Il percorso",
          items: [
            {
              id: "tappa-contatto",
              icon: "message-circle",
              title: "Primo contatto",
              text: "Mi scrive o mi telefona per fissare un primo incontro. (DA REVISIONARE)",
            },
            {
              id: "tappa-colloquio",
              icon: "users",
              title: "Primo colloquio",
              text: "Ci conosciamo e ascolto la Sua richiesta, senza impegno a proseguire. (DA REVISIONARE)",
            },
            {
              id: "tappa-obiettivi",
              icon: "target",
              title: "Definizione degli obiettivi",
              text: "Stabiliamo insieme obiettivi, frequenza e modalità degli incontri. (DA REVISIONARE)",
            },
            {
              id: "tappa-percorso",
              icon: "route",
              title: "Il percorso terapeutico",
              text: "Le sedute, al ritmo concordato, con momenti di confronto lungo il cammino. (DA REVISIONARE)",
            },
            {
              id: "tappa-conclusione",
              icon: "flag",
              title: "Verifica e conclusione",
              text: "Valutiamo insieme i cambiamenti e decidiamo come concludere. (DA REVISIONARE)",
            },
          ],
        },
      },
      {
        id: "come-lavoro-invito",
        type: "cta",
        data: {
          title: "",
          text: "Se desidera iniziare un percorso o ha qualche domanda, può scrivermi. (DA REVISIONARE)",
          buttonLabel: "Prenota un primo colloquio",
          buttonHref: "/contatti",
        },
      },
    ],
  },

  // Portada del blog (/blog): el título, el lugar en el menú y el SEO se editan como
  // los de cualquier página, y sus secciones son el texto introductorio del listado.
  // Los artículos y las categorías están en seedBlog.ts.
  blog: {
    title: "Blog",
    slug: "blog",
    order: 2,
    published: true,
    showInMenu: true,
    seo: {
      title: "",
      description:
        "Interviste, articoli e approfondimenti sul benessere psicologico, la vita di coppia e la famiglia.",
    },
    blocks: [
      {
        id: "blog-intro",
        type: "richText",
        data: {
          html:
            "<p>Interviste in radio e in video, articoli e riflessioni sul benessere " +
            "psicologico, le relazioni e la famiglia. <strong>[DA REVISIONARE]</strong></p>",
        },
      },
    ],
  },

  // Presentación completa. No sale en el menú: se llega con el botón "Leggi il mio percorso completo"
  // de la sección "Chi sono" de la home. Textos provisionales, hasta tener los reales.
  "chi-sono": {
    title: "Chi sono",
    slug: "chi-sono",
    order: 6,
    published: true,
    showInMenu: false,
    seo: {
      title: "Chi sono | Dott.ssa Anna Rossi, Psicologa",
      description:
        "Formazione, esperienza professionale e approccio della Dott.ssa Anna Rossi, psicologa a Milano.",
    },
    // Estructura del rediseño (prototipo Sito-Michi): cabecera, «In breve», capítulos
    // con el título fijo al lado, una cita y la franja final.
    blocks: [
      {
        id: "chi-sono-hero",
        type: "hero",
        data: {
          title: "Il mio percorso",
          subtitle:
            "Mi chiamo Anna Rossi e sono una psicologa iscritta all'Albo degli Psicologi della " +
            "Lombardia. Nel mio lavoro offro uno spazio riservato e privo di giudizio. " +
            "[DA REVISIONARE]",
          imageUrl: "/images/placeholder-portrait.svg",
          imageAlt: "",
          buttonLabel: "",
          buttonHref: "",
          highlights: ["Psicologa", "Colloqui in studio e online"],
          showAlbo: true,
          showWhatsapp: false,
        },
      },
      {
        id: "chi-sono-milestones",
        type: "milestones",
        data: {
          title: "In breve",
          intro: "Le tappe principali, per chi preferisce uno sguardo d'insieme.",
          items: [
            {
              id: "milestone-1",
              year: "[Anno]",
              title: "Laurea in Psicologia",
              place: "[Università]",
            },
            {
              id: "milestone-2",
              year: "[Anno]",
              title: "Iscrizione all'Albo degli Psicologi",
              place: "n. 00000",
            },
            {
              id: "milestone-3",
              year: "[Anno]",
              title: "Inizio dell'attività clinica",
              place: "Milano e online",
            },
          ],
        },
      },
      {
        id: "chi-sono-formazione",
        type: "chapter",
        data: {
          title: "Formazione",
          html:
            "<p><strong>[DA REVISIONARE]</strong></p>" +
            "<p>Mi sono laureata in Psicologia clinica e ho conseguito l'abilitazione " +
            "all'esercizio della professione di psicologo. Sono iscritta all'Albo degli " +
            "Psicologi della Lombardia.</p>",
          imageUrl: "",
          imageAlt: "",
          caption: "",
        },
      },
      {
        id: "chi-sono-quote",
        type: "quote",
        data: {
          text: "Credo che ogni storia meriti uno spazio in cui essere ascoltata senza giudizio.",
        },
      },
      {
        id: "chi-sono-esperienza",
        type: "chapter",
        data: {
          title: "Esperienza professionale",
          html:
            "<p><strong>[DA REVISIONARE]</strong></p>" +
            "<p>Negli anni ho lavorato con persone adulte in momenti diversi della loro " +
            "vita: periodi di cambiamento, difficoltà nelle relazioni, stress e ansia. " +
            "Ricevo in studio a Milano e online.</p>",
          imageUrl: "/images/placeholder-hero.svg",
          imageAlt: "",
          caption: "[Didascalia della foto]",
        },
      },
      {
        id: "chi-sono-cta",
        type: "cta",
        data: {
          title: "Il primo passo è il più importante",
          text: "Prenoti un primo colloquio: ci conosciamo e capiamo insieme se e come posso esserLe d'aiuto.",
          buttonLabel: "Prenota il primo colloquio",
          buttonHref: "/contatti",
        },
      },
    ],
  },
};
