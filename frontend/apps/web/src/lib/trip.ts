import { formatDay, formatInr, formatWhen, fromLocalDateTime } from './money'

const STORAGE_KEY = 'sunil-travels-trip'

export type HireKind = 'self_drive' | 'airport' | 'local' | 'outstation'
export type AirportDirection = 'to_airport' | 'from_airport'
export type Handover = 'collection' | 'delivery'

export type TripDraft =
  | { kind: 'self_drive'; pickupAt: string; returnAt: string }
  | {
      kind: 'airport'
      direction: AirportDirection
      meetup: string
      tripAt: string
    }
  | { kind: 'local'; meetup: string; tripAt: string; dayPackageCount: number }
  | {
      kind: 'outstation'
      meetup: string
      destination: string
      startOn: string
      returnOn: string
    }

const KINDS: HireKind[] = ['self_drive', 'airport', 'local', 'outstation']

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function toDateTimeLocal(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Pickup is the moment the page loads. Return stays later on that same calendar day. */
export function defaultSelfDriveWindow(now = new Date()) {
  const pickup = new Date(now)
  pickup.setSeconds(0, 0)
  const ret = new Date(pickup)
  ret.setHours(pickup.getHours() + 6)
  const sameDay =
    ret.getFullYear() === pickup.getFullYear() &&
    ret.getMonth() === pickup.getMonth() &&
    ret.getDate() === pickup.getDate()
  if (!sameDay) {
    ret.setTime(pickup.getTime())
    ret.setHours(23, 59, 0, 0)
    if (ret <= pickup) ret.setTime(pickup.getTime() + 60 * 60 * 1000)
  }
  return {
    pickupAt: toDateTimeLocal(pickup),
    returnAt: toDateTimeLocal(ret),
  }
}

export function saveTrip(trip: TripDraft) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trip))
}

export function loadTrip(): TripDraft | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object') return null
    const kind = (value as { kind?: unknown }).kind
    if (typeof kind !== 'string' || !KINDS.includes(kind as HireKind)) return null
    return value as TripDraft
  } catch {
    return null
  }
}

export function hireTitle(kind: HireKind) {
  switch (kind) {
    case 'self_drive':
      return 'Self-drive rental'
    case 'airport':
      return 'Airport transfer'
    case 'local':
      return 'Local trip'
    case 'outstation':
      return 'Outstation trip'
  }
}

export function rateColumn(kind: HireKind) {
  switch (kind) {
    case 'self_drive':
      return 'day_rate_inr' as const
    case 'airport':
      return 'transfer_rate_inr' as const
    case 'local':
      return 'day_package_inr' as const
    case 'outstation':
      return 'kilometre_rate_inr' as const
  }
}

export function ratePhrase(kind: HireKind, amount: number) {
  const money = formatInr(amount)
  switch (kind) {
    case 'self_drive':
      return `${money} per day`
    case 'airport':
      return `${money} for the transfer`
    case 'local':
      return `${money} for a day package`
    case 'outstation':
      return `${money} per kilometre`
  }
}

export function rateHint(kind: HireKind) {
  switch (kind) {
    case 'self_drive':
      return 'Starting rate for one day. The call confirms the price.'
    case 'airport':
      return 'Starting rate for Pune airport, either way. The call confirms the price.'
    case 'local':
      return 'A day package is 8 hours and 80 km inside Pune. The call confirms the price.'
    case 'outstation':
      return 'Starting rate for one kilometre of the round trip. The call confirms the price.'
  }
}

export function tripSummary(trip: TripDraft) {
  switch (trip.kind) {
    case 'self_drive':
      return `Pickup ${formatWhen(fromLocalDateTime(trip.pickupAt))} · Return ${formatWhen(fromLocalDateTime(trip.returnAt))}`
    case 'airport':
      return `${trip.direction === 'to_airport' ? 'To Pune airport' : 'From Pune airport'} · ${formatWhen(fromLocalDateTime(trip.tripAt))} · ${trip.meetup}`
    case 'local':
      return `${trip.dayPackageCount} day package${trip.dayPackageCount === 1 ? '' : 's'} · ${formatWhen(fromLocalDateTime(trip.tripAt))} · ${trip.meetup}`
    case 'outstation':
      return `${trip.destination} · ${formatDay(trip.startOn)} to ${formatDay(trip.returnOn)} · ${trip.meetup}`
  }
}

export function validateSchedule(trip: TripDraft): string | null {
  if (trip.kind === 'self_drive') {
    if (!trip.pickupAt || !trip.returnAt) return 'Choose a pickup and a return.'
    if (fromLocalDateTime(trip.returnAt) <= fromLocalDateTime(trip.pickupAt)) {
      return 'The return has to be after the pickup.'
    }
  }
  if (trip.kind === 'airport') {
    if (!trip.meetup.trim()) return 'Say where the driver should arrive.'
    if (!trip.tripAt) return 'Choose the time.'
  }
  if (trip.kind === 'local') {
    if (!trip.meetup.trim()) return 'Say where the driver should arrive.'
    if (!trip.tripAt) return 'Choose the time.'
    if (!Number.isFinite(trip.dayPackageCount) || trip.dayPackageCount < 1) {
      return 'Ask for at least one day package.'
    }
  }
  if (trip.kind === 'outstation') {
    if (!trip.meetup.trim()) return 'Say where the driver should arrive.'
    if (!trip.destination.trim()) return 'Name the place outside Pune.'
    if (!trip.startOn || !trip.returnOn) return 'Choose the start and the return.'
    if (trip.returnOn < trip.startOn) return 'The return has to be on or after the start.'
  }
  return null
}

export function phoneDigits(value: string) {
  return value.replace(/\D/g, '')
}

export function buildEnquiryMessage(input: {
  trip: TripDraft
  vehicleName: string
  rateLabel: string
  visitorName: string
  callbackPhone: string
  note: string
  handover: Handover | null
  deliveryAddress: string
}) {
  const lines = [
    'Sunil Travels enquiry',
    `Vehicle: ${input.vehicleName}`,
    `Hire: ${hireTitle(input.trip.kind)}`,
    tripDetail(input.trip, input.handover, input.deliveryAddress),
    `Starting rate: ${input.rateLabel}`,
    `Name: ${input.visitorName}`,
    `Phone: ${input.callbackPhone}`,
  ]
  if (input.note.trim()) lines.push(`Note: ${input.note.trim()}`)
  return lines.join('\n')
}

function tripDetail(
  trip: TripDraft,
  handover: Handover | null,
  deliveryAddress: string,
) {
  switch (trip.kind) {
    case 'self_drive':
      return [
        `Pickup: ${formatWhen(fromLocalDateTime(trip.pickupAt))}`,
        `Return: ${formatWhen(fromLocalDateTime(trip.returnAt))}`,
        handover === 'delivery'
          ? `Delivery: ${deliveryAddress.trim()}`
          : 'Handover: collection from the yard',
      ].join('\n')
    case 'airport':
      return [
        trip.direction === 'to_airport' ? 'Direction: to Pune airport' : 'Direction: from Pune airport',
        `When: ${formatWhen(fromLocalDateTime(trip.tripAt))}`,
        `Meetup: ${trip.meetup.trim()}`,
      ].join('\n')
    case 'local':
      return [
        `Day packages: ${trip.dayPackageCount}`,
        `When: ${formatWhen(fromLocalDateTime(trip.tripAt))}`,
        `Meetup: ${trip.meetup.trim()}`,
      ].join('\n')
    case 'outstation':
      return [
        `Destination: ${trip.destination.trim()}`,
        `Start: ${formatDay(trip.startOn)}`,
        `Return: ${formatDay(trip.returnOn)}`,
        `Meetup: ${trip.meetup.trim()}`,
      ].join('\n')
  }
}
