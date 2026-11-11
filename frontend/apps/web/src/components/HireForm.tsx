import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Label } from '@repo/ui'
import {
  saveTrip,
  validateSchedule,
  type AirportDirection,
  type TripDraft,
} from '../lib/trip'

export function HireForm({ initial }: { initial?: TripDraft | null }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'self_drive' | 'chauffeur'>(
    initial && initial.kind !== 'self_drive' ? 'chauffeur' : 'self_drive',
  )
  const [chauffeurKind, setChauffeurKind] = useState<'airport' | 'local' | 'outstation'>(
    initial && initial.kind !== 'self_drive' ? initial.kind : 'airport',
  )
  const [pickupAt, setPickupAt] = useState(
    initial?.kind === 'self_drive' ? initial.pickupAt : '',
  )
  const [returnAt, setReturnAt] = useState(
    initial?.kind === 'self_drive' ? initial.returnAt : '',
  )
  const [direction, setDirection] = useState<AirportDirection>(
    initial?.kind === 'airport' ? initial.direction : 'to_airport',
  )
  const [meetup, setMeetup] = useState(
    initial && initial.kind !== 'self_drive' ? initial.meetup : '',
  )
  const [tripAt, setTripAt] = useState(
    initial && (initial.kind === 'airport' || initial.kind === 'local') ? initial.tripAt : '',
  )
  const [dayPackageCount, setDayPackageCount] = useState(
    initial?.kind === 'local' ? String(initial.dayPackageCount) : '1',
  )
  const [destination, setDestination] = useState(
    initial?.kind === 'outstation' ? initial.destination : '',
  )
  const [startOn, setStartOn] = useState(
    initial?.kind === 'outstation' ? initial.startOn : '',
  )
  const [returnOn, setReturnOn] = useState(
    initial?.kind === 'outstation' ? initial.returnOn : '',
  )
  const [error, setError] = useState<string | null>(null)

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const trip = draft()
    const problem = validateSchedule(trip)
    if (problem) {
      setError(problem)
      return
    }
    saveTrip(trip)
    void navigate('/fleet')
  }

  function draft(): TripDraft {
    if (mode === 'self_drive') {
      return { kind: 'self_drive', pickupAt, returnAt }
    }
    if (chauffeurKind === 'airport') {
      return { kind: 'airport', direction, meetup, tripAt }
    }
    if (chauffeurKind === 'local') {
      return {
        kind: 'local',
        meetup,
        tripAt,
        dayPackageCount: Number(dayPackageCount),
      }
    }
    return { kind: 'outstation', meetup, destination, startOn, returnOn }
  }

  return (
    <form className="hire-card" onSubmit={onSubmit}>
      <div className="hire-tabs" role="radiogroup" aria-label="Hire">
        <label className={mode === 'self_drive' ? 'is-on' : undefined}>
          <input
            type="radio"
            name="hire-mode"
            checked={mode === 'self_drive'}
            onChange={() => setMode('self_drive')}
          />
          Self-drive
        </label>
        <label className={mode === 'chauffeur' ? 'is-on' : undefined}>
          <input
            type="radio"
            name="hire-mode"
            checked={mode === 'chauffeur'}
            onChange={() => setMode('chauffeur')}
          />
          With a driver
        </label>
      </div>

      {mode === 'self_drive' ? (
        <div className="hire-grid hire-grid-3">
          <Field label="Location" htmlFor="city">
            <Input id="city" value="Pune" readOnly />
          </Field>
          <Field label="Pickup" htmlFor="pickup">
            <Input
              id="pickup"
              type="datetime-local"
              value={pickupAt}
              onChange={(event) => setPickupAt(event.target.value)}
              required
            />
          </Field>
          <Field label="Return" htmlFor="return">
            <Input
              id="return"
              type="datetime-local"
              value={returnAt}
              onChange={(event) => setReturnAt(event.target.value)}
              required
            />
          </Field>
        </div>
      ) : (
        <>
          <div className="hire-kinds" role="radiogroup" aria-label="Chauffeur trip">
            {(
              [
                ['airport', 'Airport transfer'],
                ['local', 'Local trip'],
                ['outstation', 'Outstation trip'],
              ] as const
            ).map(([kind, label]) => (
              <label key={kind} className={chauffeurKind === kind ? 'is-on' : undefined}>
                <input
                  type="radio"
                  name="chauffeur-kind"
                  checked={chauffeurKind === kind}
                  onChange={() => setChauffeurKind(kind)}
                />
                {label}
              </label>
            ))}
          </div>
          {chauffeurKind === 'airport' ? (
            <div className="hire-grid">
              <Field label="Direction" htmlFor="direction">
                <select
                  id="direction"
                  className="hire-select"
                  value={direction}
                  onChange={(event) => setDirection(event.target.value as AirportDirection)}
                >
                  <option value="to_airport">To Pune airport</option>
                  <option value="from_airport">From Pune airport</option>
                </select>
              </Field>
              <Field label="When" htmlFor="airport-when">
                <Input
                  id="airport-when"
                  type="datetime-local"
                  value={tripAt}
                  onChange={(event) => setTripAt(event.target.value)}
                  required
                />
              </Field>
              <Field label="Meetup address" htmlFor="airport-meetup">
                <Input
                  id="airport-meetup"
                  value={meetup}
                  onChange={(event) => setMeetup(event.target.value)}
                  required
                />
              </Field>
            </div>
          ) : null}
          {chauffeurKind === 'local' ? (
            <div className="hire-grid">
              <Field label="When the driver arrives" htmlFor="local-when">
                <Input
                  id="local-when"
                  type="datetime-local"
                  value={tripAt}
                  onChange={(event) => setTripAt(event.target.value)}
                  required
                />
              </Field>
              <Field label="Day packages" htmlFor="packages">
                <Input
                  id="packages"
                  type="number"
                  min={1}
                  value={dayPackageCount}
                  onChange={(event) => setDayPackageCount(event.target.value)}
                  required
                />
              </Field>
              <Field label="Meetup address" htmlFor="local-meetup">
                <Input
                  id="local-meetup"
                  value={meetup}
                  onChange={(event) => setMeetup(event.target.value)}
                  required
                />
              </Field>
            </div>
          ) : null}
          {chauffeurKind === 'outstation' ? (
            <div className="hire-grid">
              <Field label="Destination" htmlFor="destination">
                <Input
                  id="destination"
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  required
                />
              </Field>
              <Field label="Start" htmlFor="start-on">
                <Input
                  id="start-on"
                  type="date"
                  value={startOn}
                  onChange={(event) => setStartOn(event.target.value)}
                  required
                />
              </Field>
              <Field label="Return" htmlFor="return-on">
                <Input
                  id="return-on"
                  type="date"
                  value={returnOn}
                  onChange={(event) => setReturnOn(event.target.value)}
                  required
                />
              </Field>
              <Field label="Meetup address" htmlFor="out-meetup">
                <Input
                  id="out-meetup"
                  value={meetup}
                  onChange={(event) => setMeetup(event.target.value)}
                  required
                />
              </Field>
            </div>
          ) : null}
        </>
      )}

      {error ? (
        <p className="hire-error" role="alert">
          {error}
        </p>
      ) : (
        <p className="hire-hint">Pune only. Dates do not hide a car.</p>
      )}
      <div className="hire-actions">
        <Button type="submit" size="lg">
          Show cars
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <div className="hire-field">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}
