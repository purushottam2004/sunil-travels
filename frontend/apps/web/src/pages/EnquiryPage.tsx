import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@repo/auth'
import { Button, Input, Label } from '@repo/ui'
import {
  enquiryInsert,
  fetchBusiness,
  fetchVehicle,
  sendEnquiry,
  vehicleRate,
  whatsappHref,
  FALLBACK_BUSINESS,
  type Business,
  type Vehicle,
} from '../lib/catalog'
import {
  buildEnquiryMessage,
  hireTitle,
  loadTrip,
  phoneDigits,
  ratePhrase,
  tripSummary,
  type Handover,
} from '../lib/trip'

export function EnquiryPage() {
  const { vehicleId = '' } = useParams()
  const { user } = useAuth()
  const [trip] = useState(loadTrip)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [business, setBusiness] = useState<Business>(FALLBACK_BUSINESS)
  const [name, setName] = useState<string | null>(null)
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [handover, setHandover] = useState<Handover>('collection')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sentHref, setSentHref] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const meta = user?.user_metadata as { full_name?: string; name?: string } | undefined
  const googleName = meta?.full_name || meta?.name || ''
  const nameValue = name ?? googleName

  useEffect(() => {
    let cancelled = false
    void Promise.all([fetchVehicle(vehicleId), fetchBusiness()])
      .then(([row, desk]) => {
        if (cancelled) return
        setVehicle(row)
        setBusiness(desk)
      })
      .catch(() => {
        if (!cancelled) setError('This enquiry could not be opened.')
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

  const rate = vehicle ? vehicleRate(vehicle, trip.kind) : null

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!vehicle || rate === null || !trip) return
    if (phoneDigits(phone).length < 10) {
      setError('Enter a phone number we can call.')
      return
    }
    if (trip.kind === 'self_drive' && handover === 'delivery' && !deliveryAddress.trim()) {
      setError('Say where to deliver the car.')
      return
    }
    setSending(true)
    setError(null)
    const rateLabel = ratePhrase(trip.kind, rate)
    const message = buildEnquiryMessage({
      trip,
      vehicleName: vehicle.name,
      rateLabel,
      visitorName: nameValue,
      callbackPhone: phone,
      note,
      handover: trip.kind === 'self_drive' ? handover : null,
      deliveryAddress,
    })
    try {
      await sendEnquiry(
        enquiryInsert({
          trip,
          vehicle,
          rateInr: rate,
          rateLabel,
          visitorId: user?.id ?? null,
          visitorName: nameValue,
          callbackPhone: phone,
          note,
          handover: trip.kind === 'self_drive' ? handover : null,
          deliveryAddress,
        }),
      )
      const href = whatsappHref(business.whatsapp_digits, message)
      setSentHref(href)
      window.open(href, '_blank', 'noopener,noreferrer')
    } catch {
      setError('The enquiry was not saved. Nothing was sent on WhatsApp.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="sunil-panel">
      <p className="sunil-eyebrow">{hireTitle(trip.kind)}</p>
      <h1>{vehicle ? vehicle.name : 'Enquiry'}</h1>
      <p className="sunil-summary">{tripSummary(trip)}</p>
      {rate !== null ? <p className="vehicle-rate">{ratePhrase(trip.kind, rate)}</p> : null}
      {sentHref ? (
        <div className="sunil-note">
          <p>Saved. WhatsApp should open with this enquiry.</p>
          <p>
            <a href={sentHref} target="_blank" rel="noreferrer">
              Open WhatsApp again
            </a>
          </p>
        </div>
      ) : (
        <form className="enquiry-form" onSubmit={(event) => void onSubmit(event)}>
          <div className="hire-field">
            <Label htmlFor="visitor-name">Name</Label>
            <Input
              id="visitor-name"
              value={nameValue}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div className="hire-field">
            <Label htmlFor="callback-phone">Callback phone</Label>
            <Input
              id="callback-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              autoComplete="tel"
            />
          </div>
          {trip.kind === 'self_drive' ? (
            <fieldset className="handover-set">
              <legend>Handover</legend>
              <label>
                <input
                  type="radio"
                  name="handover"
                  checked={handover === 'collection'}
                  onChange={() => setHandover('collection')}
                />
                Collection from the yard
              </label>
              <label>
                <input
                  type="radio"
                  name="handover"
                  checked={handover === 'delivery'}
                  onChange={() => setHandover('delivery')}
                />
                Delivery to an address
              </label>
              {handover === 'delivery' ? (
                <div className="hire-field">
                  <Label htmlFor="delivery-address">Delivery address</Label>
                  <Input
                    id="delivery-address"
                    value={deliveryAddress}
                    onChange={(event) => setDeliveryAddress(event.target.value)}
                    required
                  />
                </div>
              ) : null}
            </fieldset>
          ) : null}
          <div className="hire-field">
            <Label htmlFor="note">Note</Label>
            <textarea
              id="note"
              className="hire-select"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
            />
          </div>
          {error ? (
            <p className="hire-error" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" size="lg" disabled={sending || rate === null || !vehicle}>
            {sending ? 'Sending…' : 'Send on WhatsApp'}
          </Button>
        </form>
      )}
    </section>
  )
}
