import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchCoverPhotos,
  fetchVehicles,
  photoUrl,
  vehicleRate,
  type Vehicle,
} from '../lib/catalog'
import { hireTitle, loadTrip, ratePhrase, tripSummary, type TripDraft } from '../lib/trip'

export function FleetPage() {
  const [trip] = useState(loadTrip)
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null)
  const [covers, setCovers] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!trip) return
    let cancelled = false
    void fetchVehicles(trip.kind)
      .then(async (rows) => {
        if (cancelled) return
        setVehicles(rows)
        const photos = await fetchCoverPhotos(rows.map((vehicle) => vehicle.id))
        if (cancelled) return
        const next: Record<string, string> = {}
        for (const photo of photos) {
          if (!next[photo.vehicle_id]) next[photo.vehicle_id] = photoUrl(photo.storage_path)
        }
        setCovers(next)
      })
      .catch(() => {
        if (!cancelled) setError('The catalog could not be loaded.')
      })
    return () => {
      cancelled = true
    }
  }, [trip])

  if (!trip) {
    return (
      <section className="sunil-panel">
        <h1>Fleet</h1>
        <p>Choose a hire on the home page, then the cars for that hire show up here.</p>
        <p>
          <Link to="/">Choose a hire</Link>
        </p>
      </section>
    )
  }

  return (
    <section className="sunil-panel">
      <p className="sunil-eyebrow">{hireTitle(trip.kind)}</p>
      <h1>Cars for this hire</h1>
      <p className="sunil-summary">{tripSummary(trip)}</p>
      <p>
        <Link to="/">Change the hire</Link>
      </p>
      {error ? (
        <p role="alert">{error}</p>
      ) : vehicles === null ? (
        <p>Loading cars…</p>
      ) : vehicles.length === 0 ? (
        <p>No car is published for this hire yet.</p>
      ) : (
        <ul className="vehicle-grid">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              kind={trip.kind}
              cover={covers[vehicle.id]}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function VehicleCard({
  vehicle,
  kind,
  cover,
}: {
  vehicle: Vehicle
  kind: TripDraft['kind']
  cover?: string
}) {
  const rate = vehicleRate(vehicle, kind)
  return (
    <li>
      <Link className="vehicle-card" to={`/vehicles/${vehicle.id}`}>
        {cover ? (
          <img src={cover} alt="" />
        ) : (
          <span className="vehicle-fallback" aria-hidden="true">
            {vehicle.name}
          </span>
        )}
        <span className="vehicle-card-copy">
          <strong>{vehicle.name}</strong>
          {rate !== null ? <span>{ratePhrase(kind, rate)}</span> : null}
        </span>
      </Link>
    </li>
  )
}
