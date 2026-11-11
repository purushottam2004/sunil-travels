import { useEffect, useState } from 'react'
import { fetchMyEnquiries, type Enquiry } from '../lib/catalog'
import { formatDay, formatWhen } from '../lib/money'
import { hireTitle } from '../lib/trip'

export function MyEnquiriesPage() {
  const [rows, setRows] = useState<Enquiry[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void fetchMyEnquiries()
      .then((data) => {
        if (!cancelled) setRows(data)
      })
      .catch(() => {
        if (!cancelled) setError('Your enquiries could not be loaded.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="sunil-panel">
      <h1>My enquiries</h1>
      <p>These are the enquiries you sent while signed in. A guest enquiry stays off this list.</p>
      {error ? <p role="alert">{error}</p> : null}
      {rows === null ? <p>Loading…</p> : null}
      {rows && rows.length === 0 ? <p>You have not sent an enquiry while signed in.</p> : null}
      {rows && rows.length > 0 ? (
        <ul className="enquiry-list">
          {rows.map((row) => (
            <li key={row.id}>
              <strong>{row.vehicle_name}</strong>
              <span>{hireTitle(row.hire_kind)}</span>
              <span>{storedSummary(row)}</span>
              <span>{row.shown_rate_label}</span>
              <span>{formatWhen(row.created_at)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

function storedSummary(row: Enquiry) {
  switch (row.hire_kind) {
    case 'self_drive':
      return `Pickup ${formatWhen(row.pickup_at ?? '')} · Return ${formatWhen(row.return_at ?? '')}`
    case 'airport':
      return `${row.airport_direction === 'to_airport' ? 'To Pune airport' : 'From Pune airport'} · ${formatWhen(row.trip_at ?? '')} · ${row.meetup_address ?? ''}`
    case 'local':
      return `${row.day_package_count ?? 0} day package${row.day_package_count === 1 ? '' : 's'} · ${formatWhen(row.trip_at ?? '')} · ${row.meetup_address ?? ''}`
    case 'outstation':
      return `${row.destination ?? ''} · ${formatDay(row.start_on ?? '')} to ${formatDay(row.return_on ?? '')} · ${row.meetup_address ?? ''}`
  }
}
