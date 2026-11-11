import { useState } from 'react'
import { HireForm } from '../components/HireForm'
import { loadTrip } from '../lib/trip'

export function HomePage() {
  const [initial] = useState(loadTrip)

  return (
    <>
      <section className="sunil-hero">
        <div className="sunil-hero-copy">
          <p className="sunil-eyebrow">Pune · self-drive and chauffeur</p>
          <h1>A car for the city, the airport, or the road out.</h1>
          <p>See the starting rate. Send an enquiry. We confirm the car and the price with you.</p>
        </div>
      </section>
      <HireForm initial={initial} />
      <ul className="trust-row">
        <li>
          <strong>Yard or your door</strong>
          <span>Collect a self-drive car, or have it delivered.</span>
        </li>
        <li>
          <strong>A driver when you want one</strong>
          <span>Airport, a day in Pune, or a trip out of town.</span>
        </li>
        <li>
          <strong>Confirmed by a person</strong>
          <span>The page shows a starting rate. The call settles the price.</span>
        </li>
      </ul>
    </>
  )
}
