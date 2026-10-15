import { DEFAULT_SITE_TEXTS } from "./siteTexts.it";
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
          buttonLabel: "Scopri di più",
          buttonHref: "/chi-sono",
        },
      },
    ],
  },

  contatti: {
    title: "Contatti",
    slug: "contatti",
    order: 3,
    published: true,
    showInMenu: true,
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
      // El formulario ("Modulo di contatto") no va en el contenido inicial por ahora:
      // se añade desde el panel como una sección más cuando haga falta.
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

  // Cómo trabaja la profesional: el enfoque sistémico-relacional y cómo son las
  // sesiones. Textos provisionales ("[DA REVISIONARE]") hasta tener los suyos.
  "come-lavoro": {
    title: "Come lavoro",
    slug: "come-lavoro",
    order: 1,
    published: true,
    showInMenu: true,
    seo: {
      title: "",
      description:
        "L'approccio sistemico-relazionale e come si svolge un percorso di psicoterapia: " +
        "il primo colloquio, le sedute, in studio e online.",
    },
    blocks: [
      {
        id: "come-lavoro-intro",
        type: "richText",
        data: {
          html:
            "<p><strong>[DA REVISIONARE] Testo di esempio.</strong></p>" +
            "<p>In questa pagina trova qualche informazione sul mio modo di lavorare: " +
            "l'orientamento che guida il mio sguardo e come si svolge, in pratica, un " +
            "percorso insieme. Spero possa aiutarLa a farsi un'idea di che cosa aspettarsi.</p>",
        },
      },
      {
        id: "come-lavoro-sezioni",
        type: "zigzag",
        data: {
          rows: [
            {
              id: "come-lavoro-approccio",
              imageUrl: "",
              imageAlt: "",
              title: "L'approccio sistemico-relazionale",
              html:
                "<p><strong>[DA REVISIONARE]</strong></p>" +
                "<p>L'approccio sistemico-relazionale guarda alla persona all'interno delle " +
                "sue relazioni: la famiglia, la coppia, gli amici, il lavoro. Le difficoltà " +
                "non vengono considerate solo come qualcosa di individuale, ma anche come il " +
                "segnale di equilibri che, in un certo momento della vita, faticano a funzionare.</p>" +
                "<p>Per questo, a seconda della richiesta, il lavoro può coinvolgere la singola " +
                "persona, la coppia oppure la famiglia.</p>",
            },
            {
              id: "come-lavoro-primo-colloquio",
              imageUrl: "",
              imageAlt: "",
              title: "Il primo colloquio",
              html:
                "<p><strong>[DA REVISIONARE]</strong></p>" +
                "<p>Il primo colloquio è un momento di conoscenza reciproca. Si parte da ciò " +
                "che La porta a chiedere un incontro, senza bisogno di arrivare preparati. " +
                "Al termine valutiamo insieme se e come proseguire.</p>",
            },
            {
              id: "come-lavoro-sedute",
              imageUrl: "",
              imageAlt: "",
              title: "Come si svolgono le sedute",
              html:
                "<p><strong>[DA REVISIONARE]</strong></p>" +
                "<ul><li>Le sedute durano circa [DA COMPLETARE] minuti.</li>" +
                "<li>La frequenza si concorda insieme, in base alla richiesta e ai Suoi tempi " +
                "(di solito [DA COMPLETARE]).</li>" +
                "<li>Gli obiettivi vengono definiti insieme e possono cambiare nel corso del percorso.</li>" +
                "<li>Tutto ciò che emerge durante le sedute è coperto dal segreto professionale.</li></ul>",
            },
            {
              id: "come-lavoro-studio-online",
              imageUrl: "",
              imageAlt: "",
              title: "In studio oppure online",
              html:
                "<p><strong>[DA REVISIONARE]</strong></p>" +
                "<p>I colloqui si svolgono in studio oppure online, in videochiamata. La " +
                "modalità online segue gli stessi principi di quella in presenza: servono " +
                "soltanto una connessione stabile e un luogo tranquillo e riservato.</p>",
            },
          ],
        },
      },
      {
        id: "come-lavoro-invito",
        type: "cta",
        data: {
          title: "Vuole saperne di più?",
          text:
            "Può scrivermi per qualsiasi domanda oppure per fissare un primo colloquio " +
            "conoscitivo.",
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

  // Presentación completa. No sale en el menú: se llega con el botón "Scopri di più"
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
    blocks: [
      {
        id: "chi-sono-zigzag",
        type: "zigzag",
        data: {
          rows: [
            {
              id: "chi-sono-formazione",
              imageUrl: "/images/placeholder-portrait.svg",
              imageAlt: "",
              title: "Formazione",
              html:
                "<p><strong>[DA REVISIONARE]</strong></p>" +
                "<p>Mi sono laureata in Psicologia clinica e ho conseguito l'abilitazione " +
                "all'esercizio della professione di psicologo. Sono iscritta all'Albo degli " +
                "Psicologi della Lombardia.</p>" +
                "<ul><li>Laurea magistrale in Psicologia clinica</li>" +
                "<li>Tirocinio professionalizzante in ambito clinico</li>" +
                "<li>Esame di Stato e iscrizione all'Albo</li></ul>",
            },
            {
              id: "chi-sono-esperienza",
              imageUrl: "/images/placeholder-hero.svg",
              imageAlt: "",
              title: "Esperienza professionale",
              html:
                "<p><strong>[DA REVISIONARE]</strong></p>" +
                "<p>Negli anni ho lavorato con persone adulte in momenti diversi della loro " +
                "vita: periodi di cambiamento, difficoltà nelle relazioni, stress e ansia. " +
                "Ricevo in studio a Milano e online.</p>",
            },
            {
              id: "chi-sono-approccio",
              imageUrl: "/images/placeholder-portrait.svg",
              imageAlt: "",
              title: "Il mio approccio",
              html:
                "<p><strong>[DA REVISIONARE]</strong></p>" +
                "<p>Ogni percorso parte dall'ascolto della Sua richiesta. Nel primo colloquio " +
                "ci conosciamo e valutiamo insieme se e come proseguire, nel rispetto dei " +
                "Suoi tempi e del Codice Deontologico degli Psicologi Italiani.</p>",
            },
          ],
        },
      },
    ],
  },
};
