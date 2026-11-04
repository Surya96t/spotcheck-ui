const DATE = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })

/** "2026-11-06" becomes "6 November 2026". */
export function formatNoteDate(date: string) {
  return DATE.format(new Date(`${date}T00:00:00Z`))
}
