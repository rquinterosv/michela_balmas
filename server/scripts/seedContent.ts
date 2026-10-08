import type { PageInput, SiteSettings } from "@studio/shared";

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
  social: { instagram: "", linkedin: "" },
  contactReasons: [
    "Primo colloquio conoscitivo",
    "Informazioni sui percorsi",
    "Colloqui online",
    "Altro",
  ],
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

const cookiePolicyHtml = [
  DRAFT_NOTICE,
  "<p>Questo sito non utilizza cookie di profilazione né strumenti di analisi statistica " +
    "(analytics), e non installa cookie di terze parti. Per questo motivo non viene mostrato " +
    "alcun banner per la raccolta del consenso.</p>",

  "<p><strong>Che cosa sono i cookie</strong></p>",
  "<p>I cookie sono piccoli file di testo che i siti visitati salvano sul dispositivo " +
    "dell'utente per memorizzare alcune informazioni tra una visita e l'altra.</p>",

  "<p><strong>Strumenti tecnici utilizzati</strong></p>",
  "<p>Il sito utilizza soltanto strumenti tecnici strettamente necessari al suo " +
    "funzionamento, per i quali la normativa non richiede il consenso. In particolare, " +
    "l'area riservata alla titolare memorizza nel browser i dati necessari a mantenere " +
    "l'accesso: questo riguarda esclusivamente chi amministra il sito, non i visitatori.</p>",

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
          photoUrl: "/images/placeholder-portrait.svg",
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
        },
      },
    ],
  },

  contatti: {
    title: "Contatti",
    slug: "contatti",
    order: 1,
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
            "<p>Per richiedere informazioni o fissare un primo colloquio può compilare il " +
            "modulo qui sotto oppure usare i recapiti indicati in questa pagina. " +
            "Le risponderò personalmente, di norma entro due giorni lavorativi.</p>",
        },
      },
      {
        id: "contatti-form",
        type: "contactForm",
        data: {
          title: "Mi scriva",
          intro: "I campi sono obbligatori, salvo dove indicato diversamente.",
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
    ],
  },

  "privacy-policy": {
    title: "Privacy Policy",
    slug: "privacy-policy",
    order: 2,
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
    order: 3,
    published: true,
    showInMenu: false,
    seo: {
      title: "Cookie Policy | Dott.ssa Anna Rossi",
      description: "Informazioni sull'uso dei cookie in questo sito.",
    },
    blocks: [{ id: "cookie-text", type: "richText", data: { html: cookiePolicyHtml } }],
  },
};
