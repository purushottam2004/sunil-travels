import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@repo/auth'
import { fetchBusiness, fetchSiteConfig, whatsappHref, type Business, FALLBACK_BUSINESS, FALLBACK_SITE_CONFIG, type SiteConfig } from '../lib/catalog'

export function SiteLayout() {
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
    <div className="sunil">
      <SiteHeader name={business.trading_name} />
      <Outlet />
      <SiteFooter business={business} config={config} />
    </div>
  )
}

function SiteHeader({ name }: { name: string }) {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header className="sunil-header">
      <Link to="/" className="sunil-brand" onClick={() => setOpen(false)}>
        <span className="sunil-mark" aria-hidden="true">
          S
        </span>
        <span>
          <strong>{name}</strong>
          <small>Pune</small>
        </span>
      </Link>
      <button
        type="button"
        className="sunil-menu"
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((value) => !value)}
      >
        Menu
      </button>
      <nav id="site-nav" className={open ? 'sunil-nav is-open' : 'sunil-nav'}>
        <NavLink to="/fleet" onClick={() => setOpen(false)}>
          Fleet
        </NavLink>
        <NavLink to="/about" onClick={() => setOpen(false)}>
          About
        </NavLink>
        <NavLink to="/contact" onClick={() => setOpen(false)}>
          Contact
        </NavLink>
        {user ? (
          <NavLink to="/enquiries" onClick={() => setOpen(false)}>
            My enquiries
          </NavLink>
        ) : null}
        {user ? (
          <button
            type="button"
            className="sunil-nav-button"
            onClick={() => {
              setOpen(false)
              void signOut()
            }}
          >
            Sign out
          </button>
        ) : (
          <NavLink className="sunil-signin" to="/login" onClick={() => setOpen(false)}>
            Sign in
          </NavLink>
        )}
      </nav>
    </header>
  )
}

function SiteFooter({
  business,
  config,
}: {
  business: Business
  config: SiteConfig
}) {
  return (
    <footer className="sunil-footer">
      <p>
        <a href={`tel:+${config.whatsappPhone}`}>{config.phoneDisplay}</a>
        <span aria-hidden="true"> · </span>
        <a href={whatsappHref(config.whatsappPhone)} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
      </p>
      <p>
        {business.yard_label}. {business.yard_address}
      </p>
    </footer>
  )
}
