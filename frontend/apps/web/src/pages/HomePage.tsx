import { useState } from 'react'
import { HireForm } from '../components/HireForm'
import { loadTrip } from '../lib/trip'

export function HomePage() {
  const [initial] = useState(loadTrip)

  return (
    <>
      <section className="sunil-hero">
        <p className="sunil-eyebrow">Self-drive and chauffeur · Pune</p>
        <h1>Cars for the days you drive, and the days you don’t.</h1>
        <p>Tell us the hire. A person calls you back with the price.</p>
      </section>
      <HireForm initial={initial} />
    </>
  )
}
