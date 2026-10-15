// Mensajes de validación en italiano. Viven en /shared porque los mismos
// esquemas zod se usan en el backend (API) y en el frontend (formularios).
// Forma impersonal ("Inserire…"): sirve tanto para el paciente como para el panel.
export const validation = {
  required: "Campo obbligatorio",
  tooShort: (min: number) => `Inserire almeno ${min} caratteri`,
  tooLong: (max: number) => `Massimo ${max} caratteri`,
  invalidEmail: "Inserire un indirizzo email valido",
  invalidPhone: "Inserire un numero di telefono valido",
  invalidUrl: "Inserire un indirizzo web valido (es. https://www.esempio.it)",
  invalidImageUrl:
    "Inserire un indirizzo valido per l'immagine (es. https://… oppure /images/foto.jpg)",
  invalidImageFile: "Il file scelto non è un'immagine valida",
  imageTooLarge: "L'immagine è troppo grande",
  invalidLink: "Inserire un collegamento valido (es. /contatti oppure https://…)",
  consentRequired: "Per inviare il messaggio è necessario acconsentire al trattamento dei dati",
  invalidReason: "Selezionare un motivo del contatto",
  invalidSlug: "L'indirizzo della pagina può contenere solo lettere minuscole, numeri e trattini",
  reservedSlug: "Questo indirizzo è riservato: sceglierne un altro",
  atLeastOneReason: "Inserire almeno un motivo del contatto",
  invalidAddress: "L'indirizzo può contenere solo lettere minuscole, numeri e trattini",
  invalidDate: "Inserire una data valida",
  chooseCategory: "Scegliere una categoria",
  coverImageRequired: "Caricare un'immagine di copertina oppure scegliere «Nessuna copertina»",
  coverVideoRequired: "Inserire l'indirizzo del video oppure scegliere un altro tipo di copertina",
  sectionNotAllowed: "Questo tipo di sezione non si può usare negli articoli",
} as const;
