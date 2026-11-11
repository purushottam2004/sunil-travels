import { useEffect, useState } from 'react'
import { fetchBusiness, FALLBACK_BUSINESS, type Business } from '../lib/catalog'

export function AboutPage() {
  const [business, setBusiness] = useState<Business>(FALLBACK_BUSINESS)

  useEffect(() => {
    let cancelled = false
    void fetchBusiness().then((row) => {
      if (!cancelled) setBusiness(row)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="sunil-panel">
      <h1>About {business.trading_name}</h1>
      <p>{business.about}</p>
    </section>
  )
}
