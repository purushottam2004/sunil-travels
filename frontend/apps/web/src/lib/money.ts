const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const whenFormat = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Kolkata',
})

const dayFormat = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeZone: 'Asia/Kolkata',
})

export function formatInr(amount: number) {
  return rupees.format(amount)
}

/** `datetime-local` value, read as India time. */
export function fromLocalDateTime(value: string) {
  return new Date(`${value}:00+05:30`).toISOString()
}

export function formatWhen(iso: string) {
  return whenFormat.format(new Date(iso))
}

export function formatDay(isoDate: string) {
  return dayFormat.format(new Date(`${isoDate}T00:00:00+05:30`))
}
