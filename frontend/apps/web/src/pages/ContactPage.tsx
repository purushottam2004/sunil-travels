import { useEffect, useState } from 'react'
import { fetchBusiness, fetchSiteConfig, FALLBACK_BUSINESS, FALLBACK_SITE_CONFIG, whatsappHref, type Business, type SiteConfig } from '../lib/catalog'

export function ContactPage() {
  const [business, setBusiness] = useState<Business>(FALLBACK_BUSINESS)
  const [config, setConfig] = useState<SiteConfig>(FALLBACK_SITE_CONFIG)

  useEffect(() => {
    let cancelled = false
    void Promise.all([fetchBusiness(), fetchSiteConfig()]).then(([row, site]) => {
      if (cancelled) return
      setBusiness(row)
      setConfig(site)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="sunil-panel">
      <h1>Contact</h1>
      <p>
        Call <a href={`tel:+${config.whatsappPhone}`}>{config.phoneDisplay}</a>
      </p>
      <p>
        <a href={whatsappHref(config.whatsappPhone)} target="_blank" rel="noreferrer">
          WhatsApp {config.phoneDisplay}
        </a>
      </p>
      <p>
        {business.yard_label}. {business.yard_address}. Collection for a self-drive rental is from
        this yard.
      </p>
    </section>
  )
}
