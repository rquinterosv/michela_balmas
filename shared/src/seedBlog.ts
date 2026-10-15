import type { CategoryInput, PostInput } from "./blog";

// Contenido de ejemplo del blog: categorías y artículos, todos marcados
// "[DA REVISIONARE]". No nombran a nadie (el autor vacío es el autor por defecto,
// el de «Impostazioni del sito»), así que sirven tanto en producción como en el
// modo demo. La clave es el id del documento en Firestore.
//
// El artículo con video usa una dirección de YouTube provisional (id "DA_INSERIRE"):
// hay que sustituirla desde el panel por la de la entrevista real.

const REVIEW = "<p><strong>[DA REVISIONARE] Testo di esempio.</strong></p>";
const HERO_IMAGE = "/images/placeholder-hero.svg";
const PORTRAIT_IMAGE = "/images/placeholder-portrait.svg";
const NO_SEO = { title: "", description: "", imageUrl: "" };
const DEFAULT_AUTHOR = { name: "", photoUrl: "" };

export const seedCategories: Record<string, CategoryInput> = {
  interviste: {
    name: "Interviste",
    slug: "interviste",
    parentId: null,
    order: 0,
    seo: {
      title: "",
      description: "Interviste radiofoniche e video su psicologia e benessere.",
    },
  },
  radio: {
    name: "Radio",
    slug: "radio",
    // Subcategoría de "Interviste" (es la clave de arriba).
    parentId: "interviste",
    order: 1,
    seo: { title: "", description: "Interviste e interventi in radio." },
  },
  articoli: {
    name: "Articoli",
    slug: "articoli",
    parentId: null,
    order: 2,
    seo: { title: "", description: "Articoli di approfondimento sul benessere psicologico." },
  },
};

export const seedPosts: Record<string, PostInput> = {
  "intervista-salute-psicologica": {
    title: "Intervista: prendersi cura della propria salute psicologica",
    slug: "intervista-salute-psicologica",
    categoryId: "interviste",
    date: "2026-10-01",
    excerpt:
      "Perché la salute psicologica merita la stessa attenzione di quella fisica e quali " +
      "segnali possono suggerire di chiedere un confronto con un professionista.",
    cover: {
      type: "video",
      imageUrl: "",
      imageAlt: "",
      videoUrl: "https://www.youtube.com/watch?v=DA_INSERIRE",
    },
    author: DEFAULT_AUTHOR,
    blocks: [
      {
        id: "intervista-salute-testo",
        type: "richText",
        data: {
          html:
            REVIEW +
            "<p>In questa intervista si parla di salute psicologica nella vita di tutti i " +
            "giorni: che cosa significa prendersene cura, come riconoscere i momenti in cui " +
            "il carico diventa troppo pesante e che cosa aspettarsi da un primo incontro con " +
            "uno psicologo.</p>" +
            "<p><em>[Link del video provvisorio: sostituirlo con quello dell'intervista.]</em></p>",
        },
      },
    ],
    published: true,
    seo: NO_SEO,
  },

  "radio-ansia-stress": {
    title: "In radio: ansia e stress nella vita di tutti i giorni",
    slug: "radio-ansia-stress",
    categoryId: "radio",
    date: "2026-09-18",
    excerpt:
      "Una puntata dedicata all'ansia: che cos'è, quando diventa un problema e alcune " +
      "indicazioni generali per gestire lo stress quotidiano.",
    cover: { type: "image", imageUrl: HERO_IMAGE, imageAlt: "", videoUrl: "" },
    author: DEFAULT_AUTHOR,
    blocks: [
      {
        id: "radio-ansia-testo",
        type: "richText",
        data: {
          html:
            REVIEW +
            "<p>L'ansia è una reazione naturale, che ci prepara ad affrontare le situazioni " +
            "impegnative. Può diventare un problema quando è molto intensa, dura a lungo o " +
            "limita le attività di ogni giorno.</p>" +
            "<p>Durante la puntata si è parlato di come riconoscerla e di quando può essere " +
            "utile chiedere un parere professionale.</p>",
        },
      },
      {
        id: "radio-ansia-puntata",
        type: "video",
        data: {
          url: "https://example.com/puntata-da-inserire",
          title: "Ascolta la puntata completa [link provvisorio]",
          posterUrl: "",
          linkLabel: "ascolta",
        },
      },
    ],
    published: true,
    seo: NO_SEO,
  },

  "quando-chiedere-aiuto": {
    title: "Quando può essere utile rivolgersi a uno psicologo",
    slug: "quando-chiedere-aiuto",
    categoryId: "articoli",
    date: "2026-09-05",
    excerpt:
      "Non serve aspettare una crisi per chiedere aiuto. Alcune situazioni in cui un " +
      "confronto con uno psicologo può fare la differenza.",
    cover: { type: "image", imageUrl: PORTRAIT_IMAGE, imageAlt: "", videoUrl: "" },
    author: DEFAULT_AUTHOR,
    blocks: [
      {
        id: "chiedere-aiuto-testo",
        type: "richText",
        data: {
          html:
            REVIEW +
            "<p>Rivolgersi a uno psicologo non significa avere qualcosa che non va. Può " +
            "essere utile in molti momenti della vita, ad esempio:</p>" +
            "<ul><li>durante un cambiamento importante (lavoro, trasferimento, separazione);</li>" +
            "<li>quando preoccupazioni o pensieri ricorrenti tolgono serenità;</li>" +
            "<li>quando le relazioni diventano fonte di sofferenza;</li>" +
            "<li>quando si desidera conoscersi meglio.</li></ul>",
        },
      },
      {
        id: "chiedere-aiuto-immagine",
        type: "image",
        data: { url: HERO_IMAGE, alt: "", caption: "Immagine di esempio [DA REVISIONARE]" },
      },
    ],
    published: true,
    seo: NO_SEO,
  },

  "primo-colloquio": {
    title: "Il primo colloquio: che cosa aspettarsi",
    slug: "primo-colloquio",
    categoryId: "articoli",
    date: "2026-08-20",
    excerpt:
      "Il primo incontro serve a conoscersi e a capire insieme la richiesta. Come si " +
      "svolge e perché non è necessario arrivare preparati.",
    cover: { type: "none", imageUrl: "", imageAlt: "", videoUrl: "" },
    author: DEFAULT_AUTHOR,
    blocks: [
      {
        id: "primo-colloquio-testo",
        type: "richText",
        data: {
          html:
            REVIEW +
            "<p>Il primo colloquio è un momento di conoscenza reciproca. Non è necessario " +
            "sapere già che cosa dire: si parte da ciò che La porta a chiedere un incontro.</p>" +
            "<p>Al termine si valuta insieme se e come proseguire, con quali tempi e in quale " +
            "forma, in studio oppure online.</p>",
        },
      },
    ],
    published: true,
    seo: NO_SEO,
  },

  "terapia-online": {
    title: "La terapia online: come funziona",
    slug: "terapia-online",
    categoryId: "articoli",
    date: "2026-07-30",
    excerpt:
      "I colloqui online seguono gli stessi principi di quelli in studio. Che cosa serve " +
      "e alcuni accorgimenti per viverli al meglio.",
    cover: { type: "image", imageUrl: HERO_IMAGE, imageAlt: "", videoUrl: "" },
    author: DEFAULT_AUTHOR,
    blocks: [
      {
        id: "terapia-online-testo",
        type: "richText",
        data: {
          html:
            REVIEW +
            "<p>Per un colloquio online bastano una connessione stabile, un dispositivo con " +
            "videocamera e un luogo tranquillo e riservato.</p>" +
            "<ul><li>Scegliere uno spazio in cui non essere interrotti.</li>" +
            "<li>Usare le cuffie, per una maggiore riservatezza.</li>" +
            "<li>Collegarsi qualche minuto prima dell'orario concordato.</li></ul>",
        },
      },
    ],
    published: true,
    seo: NO_SEO,
  },

  "intervista-relazioni-famiglia": {
    title: "Intervista: le relazioni in famiglia, tra cambiamenti e nuovi equilibri",
    slug: "intervista-relazioni-famiglia",
    categoryId: "interviste",
    date: "2026-07-10",
    excerpt:
      "Le famiglie cambiano nel tempo, e con loro gli equilibri tra le persone. Uno " +
      "sguardo sistemico-relazionale sui momenti di passaggio.",
    cover: { type: "image", imageUrl: PORTRAIT_IMAGE, imageAlt: "", videoUrl: "" },
    author: DEFAULT_AUTHOR,
    blocks: [
      {
        id: "relazioni-famiglia-righe",
        type: "zigzag",
        data: {
          rows: [
            {
              id: "relazioni-famiglia-1",
              imageUrl: HERO_IMAGE,
              imageAlt: "",
              title: "I momenti di passaggio",
              html:
                REVIEW +
                "<p>La nascita di un figlio, l'adolescenza, l'uscita di casa dei figli: sono " +
                "tappe che chiedono a tutta la famiglia di trovare nuovi equilibri.</p>",
            },
            {
              id: "relazioni-famiglia-2",
              imageUrl: PORTRAIT_IMAGE,
              imageAlt: "",
              title: "Uno sguardo d'insieme",
              html:
                REVIEW +
                "<p>L'approccio sistemico-relazionale osserva la persona all'interno delle sue " +
                "relazioni, per comprendere insieme ciò che accade.</p>",
            },
          ],
        },
      },
    ],
    published: true,
    seo: NO_SEO,
  },
};
