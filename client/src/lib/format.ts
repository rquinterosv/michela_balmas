// Fechas en formato italiano: "9 ottobre 2026 alle ore 10:30".
const dateTimeFormat = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "long",
  timeStyle: "short",
});

export function formatDateTime(isoDate: string): string {
  return dateTimeFormat.format(new Date(isoDate));
}

// Fecha de calendario ("2026-10-15") en formato italiano: "15 ottobre 2026".
// Se formatea en UTC, la misma zona en la que se guarda, para no cambiar de día.
const dateFormat = new Intl.DateTimeFormat("it-IT", { dateStyle: "long", timeZone: "UTC" });

export function formatDate(calendarDate: string): string {
  return dateFormat.format(new Date(`${calendarDate}T00:00:00Z`));
}
