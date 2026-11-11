import { getSupabaseClient } from '@repo/auth'
import type { Database } from '@repo/db'
import { fromLocalDateTime } from './money'
import {
  rateColumn,
  type HireKind,
  type Handover,
  type TripDraft,
} from './trip'

export type Business = Database['public']['Tables']['business']['Row']
export type Vehicle = Database['public']['Tables']['vehicles']['Row']
export type VehiclePhoto = Database['public']['Tables']['vehicle_photos']['Row']
export type Enquiry = Database['public']['Tables']['enquiries']['Row']
type EnquiryInsert = Database['public']['Tables']['enquiries']['Insert']

export const FALLBACK_SITE_CONFIG = {
  whatsappPhone: '919800000000',
  phoneDisplay: '98000 00000',
}

export type SiteConfig = typeof FALLBACK_SITE_CONFIG

export async function fetchSiteConfig(): Promise<SiteConfig> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('configurations').select('key, value')
    if (error || !data) return FALLBACK_SITE_CONFIG
    const values = Object.fromEntries(data.map((row) => [row.key, row.value]))
    return {
      whatsappPhone: values.whatsapp_phone || FALLBACK_SITE_CONFIG.whatsappPhone,
      phoneDisplay: values.phone_display || FALLBACK_SITE_CONFIG.phoneDisplay,
    }
  } catch {
    return FALLBACK_SITE_CONFIG
  }
}

export const FALLBACK_BUSINESS: Business = {
  id: 1,
  trading_name: 'Sunil Travels',
  phone_display: '98000 00000',
  whatsapp_digits: '919800000000',
  yard_label: 'Pune yard',
  yard_address: 'Pune yard — address to be added',
  about:
    'Sunil Travels hires cars in Pune. Drive one yourself, or sit with a driver for the airport, a day in the city, or a trip out of town. The rate on the page is a starting rate. A person confirms the car and the price with you directly.',
}

export async function fetchBusiness(): Promise<Business> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('business')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
    if (error || !data) return FALLBACK_BUSINESS
    return data
  } catch {
    return FALLBACK_BUSINESS
  }
}

export async function fetchVehicles(kind: HireKind) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .not(rateColumn(kind), 'is', null)
    .order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function fetchVehicle(id: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function fetchCoverPhotos(vehicleIds: string[]) {
  if (vehicleIds.length === 0) return []
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('vehicle_photos')
    .select('*')
    .in('vehicle_id', vehicleIds)
    .order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function fetchPhotos(vehicleId: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('vehicle_photos')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('sort_order')
  if (error) throw error
  return data ?? []
}

export function photoUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const supabase = getSupabaseClient()
  return supabase.storage.from('vehicle_photos').getPublicUrl(path).data.publicUrl
}

export function vehicleRate(vehicle: Vehicle, kind: HireKind) {
  return vehicle[rateColumn(kind)]
}

export function enquiryInsert(input: {
  trip: TripDraft
  vehicle: Vehicle
  rateInr: number
  rateLabel: string
  visitorId: string | null
  visitorName: string
  callbackPhone: string
  note: string
  handover: Handover | null
  deliveryAddress: string
}): EnquiryInsert {
  const note = input.note.trim() || null
  const base = {
    visitor_id: input.visitorId,
    vehicle_id: input.vehicle.id,
    vehicle_name: input.vehicle.name,
    hire_kind: input.trip.kind,
    visitor_name: input.visitorName.trim(),
    callback_phone: input.callbackPhone.trim(),
    note,
    shown_rate_inr: input.rateInr,
    shown_rate_label: input.rateLabel,
  }
  const trip = input.trip
  if (trip.kind === 'self_drive') {
    return {
      ...base,
      pickup_at: fromLocalDateTime(trip.pickupAt),
      return_at: fromLocalDateTime(trip.returnAt),
      handover: input.handover,
      delivery_address:
        input.handover === 'delivery' ? input.deliveryAddress.trim() : null,
    }
  }
  if (trip.kind === 'airport') {
    return {
      ...base,
      airport_direction: trip.direction,
      meetup_address: trip.meetup.trim(),
      trip_at: fromLocalDateTime(trip.tripAt),
    }
  }
  if (trip.kind === 'local') {
    return {
      ...base,
      meetup_address: trip.meetup.trim(),
      trip_at: fromLocalDateTime(trip.tripAt),
      day_package_count: trip.dayPackageCount,
    }
  }
  return {
    ...base,
    meetup_address: trip.meetup.trim(),
    destination: trip.destination.trim(),
    start_on: trip.startOn,
    return_on: trip.returnOn,
  }
}

export async function sendEnquiry(row: EnquiryInsert) {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('enquiries')
    .insert(row)
    .setHeader('Prefer', 'return=minimal')
  if (error) throw error
}

export async function fetchMyEnquiries() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export function whatsappHref(digits: string, text?: string) {
  const base = `https://wa.me/${digits}`
  if (!text) return base
  return `${base}?text=${encodeURIComponent(text)}`
}
