// Fechas en formato italiano: "9 ottobre 2026 alle ore 10:30".
const dateTimeFormat = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "long",
  timeStyle: "short",
});

export function formatDateTime(isoDate: string): string {
  return dateTimeFormat.format(new Date(isoDate));
}
