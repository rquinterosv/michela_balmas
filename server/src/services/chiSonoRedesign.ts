import type { Block } from "@studio/shared";

// Rediseño de la página «Chi sono» (prototipo Sito-Michi, src/pages/chi-sono.astro).
// La página real son filas de imagen y texto (un bloque «zigzag»): la formación y
// la experiencia de Michela. Se pasa a la estructura del diseño sin perder nada:
//
//   cabecera (con la foto de la primera fila) · «In breve» · un capítulo por fila,
//   con su mismo texto · una cita entre el primer capítulo y el segundo · franja final
//
// Los textos nuevos (resumen, etapas, cita, pie de foto) son los del prototipo,
// sacados de la web actual de Michela (Sito-Michi/src/data/percorso.ts): son suyos.
// Lo aplica el seed una sola vez (ver PAGE_REBUILDS en server/scripts/seed.ts).

const SUMMARY =
  "Mi chiamo Michela Balmas e sono una psicologa psicoterapeuta iscritta all'Albo degli " +
  "Psicologi del Lazio. Nel mio lavoro offro uno spazio riservato e privo di giudizio, in cui " +
  "potersi fermare, dare un nome a ciò che si sta vivendo e trovare insieme nuove strade.";

const MILESTONES = [
  ["2015", "Laurea triennale in Psicologia e Salute", "Sapienza, Roma"],
  ["2017", "Laurea magistrale in Psicopatologia dinamica dello sviluppo", "Sapienza, Roma"],
  ["2019", "Iscrizione all'Albo degli Psicologi del Lazio", "n. 24509"],
  ["2020", "Qualifica di tutor DSA", "Istituto Galton"],
  ["2021", "Inizio dei percorsi di sostegno online", "Attività clinica"],
  ["2023", "Collaborazione nell'ambito dell'adozione", "CIAI"],
  ["2025", "Specializzazione in psicoterapia sistemico-relazionale", "Istituto Dedalus"],
] as const;

const QUOTE =
  "Credo che ogni storia sia unica e meriti uno spazio in cui poter essere ascoltata, " +
  "compresa e riletta anche da prospettive nuove.";

const EXPERIENCE_CAPTION =
  "Un momento di intervisione e confronto nell'ambito del progetto Periphery Organizing.";

// Devuelve las secciones nuevas, o null si la página ya no es la de antes (un solo
// bloque de filas): entonces alguien la ha cambiado y no se toca.
export function redesignChiSono(blocks: Block[]): Block[] | null {
  const [zigzag] = blocks;
  if (blocks.length !== 1 || zigzag?.type !== "zigzag" || zigzag.data.rows.length === 0) {
    return null;
  }
  const [first] = zigzag.data.rows;
  if (!first) return null;

  const chapters: Block[] = zigzag.data.rows.map((row, index) => ({
    id: `chi-sono-chapter-${row.id}`,
    type: "chapter",
    data: {
      title: row.title,
      html: row.html,
      // La foto de la primera fila pasa a la cabecera; las demás cierran su capítulo.
      imageUrl: index === 0 ? "" : row.imageUrl,
      imageAlt: index === 0 ? "" : row.imageAlt,
      caption: index === 1 ? EXPERIENCE_CAPTION : "",
    },
  }));
  const [firstChapter, ...otherChapters] = chapters;

  const result: Block[] = [
    {
      id: "chi-sono-hero",
      type: "hero",
      data: {
        title: "Il mio percorso",
        subtitle: SUMMARY,
        imageUrl: first.imageUrl,
        imageAlt: first.imageAlt,
        buttonLabel: "",
        buttonHref: "",
        highlights: ["Psicologa e psicoterapeuta", "Specializzata presso l'Istituto Dedalus"],
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
        items: MILESTONES.map(([year, title, place]) => ({
          id: `milestone-${year}`,
          year,
          title,
          place,
        })),
      },
    },
    ...(firstChapter ? [firstChapter] : []),
    { id: "chi-sono-quote", type: "quote", data: { text: QUOTE } },
    ...otherChapters,
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
  ];
  return result;
}
