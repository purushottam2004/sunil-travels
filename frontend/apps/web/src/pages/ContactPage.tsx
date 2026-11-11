import { useEffect, useState } from 'react'
import { fetchBusiness, FALLBACK_BUSINESS, whatsappHref, type Business } from '../lib/catalog'

export function ContactPage() {
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
      <h1>Contact</h1>
      <p>
        Call <a href={`tel:+${business.whatsapp_digits}`}>{business.phone_display}</a>
      </p>
      <p>
        <a href={whatsappHref(business.whatsapp_digits)} target="_blank" rel="noreferrer">
          WhatsApp {business.phone_display}
        </a>
      </p>
      <p>
        {business.yard_label}. {business.yard_address}. Collection for a self-drive rental is from
        this yard.
      </p>
    </section>
  )
}
