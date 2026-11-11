import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  fetchPhotos,
  fetchVehicle,
  photoUrl,
  vehicleRate,
  type Vehicle,
  type VehiclePhoto,
} from '../lib/catalog'
import { hireTitle, loadTrip, rateHint, ratePhrase, tripSummary } from '../lib/trip'

export function VehiclePage() {
  const { vehicleId = '' } = useParams()
  const [trip] = useState(loadTrip)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [photos, setPhotos] = useState<VehiclePhoto[]>([])
  const [active, setActive] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    let cancelled = false
    void Promise.all([fetchVehicle(vehicleId), fetchPhotos(vehicleId)])
      .then(([row, list]) => {
        if (cancelled) return
        if (!row) {
          setMissing(true)
          return
        }
        setVehicle(row)
        setPhotos(list)
      })
      .catch(() => {
        if (!cancelled) setError('This car could not be loaded.')
      })
    return () => {
      cancelled = true
    }
  }, [vehicleId])

  if (!trip) {
    return (
      <section className="sunil-panel">
        <h1>Choose a hire first</h1>
        <p>
          <Link to="/">Start on the home page</Link>
        </p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="sunil-panel">
        <p role="alert">{error}</p>
      </section>
    )
  }

  if (missing) {
    return (
      <section className="sunil-panel">
        <h1>That car is not on the list</h1>
        <p>
          <Link to="/fleet">Back to the fleet</Link>
        </p>
      </section>
    )
  }

  if (!vehicle) {
    return (
      <section className="sunil-panel">
        <p>Loading…</p>
      </section>
    )
  }

  const rate = vehicleRate(vehicle, trip.kind)
  const cover = photos[active]

  return (
    <article className="sunil-panel vehicle-detail">
      <p className="sunil-eyebrow">{hireTitle(trip.kind)}</p>
      <h1>{vehicle.name}</h1>
      <p className="sunil-summary">{tripSummary(trip)}</p>
      {cover ? (
        <img className="vehicle-hero" src={photoUrl(cover.storage_path)} alt="" />
      ) : (
        <div className="vehicle-fallback vehicle-hero">{vehicle.name}</div>
      )}
      {photos.length > 1 ? (
        <ul className="vehicle-thumbs">
          {photos.map((photo, index) => (
            <li key={photo.id}>
              <button type="button" onClick={() => setActive(index)}>
                <img src={photoUrl(photo.storage_path)} alt="" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <p>{vehicle.blurb}</p>
      {rate === null ? (
        <p>This car is not offered for {hireTitle(trip.kind).toLowerCase()}.</p>
      ) : (
        <>
          <p className="vehicle-rate">{ratePhrase(trip.kind, rate)}</p>
          <p>{rateHint(trip.kind)}</p>
          <p>
            <Link className="sunil-action" to={`/vehicles/${vehicle.id}/enquiry`}>
              Send an enquiry
            </Link>
          </p>
        </>
      )}
    </article>
  )
}
