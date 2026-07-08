// Foursquare Places adaptörü — CLAUDE.md §4, §7.3
// Yeni Foursquare Places API (2025): https://places-api.foursquare.com/places/search
//   - Auth:   Authorization: Bearer <SERVICE_KEY>
//   - Header: X-Places-Api-Version: 2025-06-17
// Anahtar: FOURSQUARE_API_KEY (Functions env, asla client'a düşmez — §5).
// findVenue arayüzünü uygular; dönen tip stub ile AYNI: { name, address, lat, lng, mapsUrl }

const BASE_URL = 'https://places-api.foursquare.com/places/search'
const API_VERSION = '2025-06-17'

export async function findVenueFoursquare(midpoint, queries, radius) {
  const apiKey = process.env.FOURSQUARE_API_KEY
  if (!apiKey) throw new Error('FOURSQUARE_API_KEY tanımlı değil')

  const query = Array.isArray(queries) ? queries[0] : queries
  const params = new URLSearchParams({
    query,
    ll: `${midpoint.lat},${midpoint.lng}`,
    radius: String(Math.round(radius)),
    limit: '1',
    sort: 'DISTANCE',
    fields: 'fsq_place_id,name,location,latitude,longitude',
  })

  const res = await fetch(`${BASE_URL}?${params}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'X-Places-Api-Version': API_VERSION,
      Accept: 'application/json',
    },
  })
  if (!res.ok) throw new Error(`Foursquare ${res.status}`)

  const data = await res.json()
  const place = data.results?.[0]
  if (!place) return null

  // Savunmacı alan okuma: yeni API top-level latitude/longitude verir,
  // eski v3 geocodes.main.* verirdi — ikisini de karşıla.
  const lat = place.latitude ?? place.geocodes?.main?.latitude
  const lng = place.longitude ?? place.geocodes?.main?.longitude
  if (lat == null || lng == null) return null

  const address =
    place.location?.formatted_address ??
    place.location?.address ??
    [place.location?.locality, place.location?.region]
      .filter(Boolean)
      .join(', ')

  return {
    name: place.name,
    address: address ?? '',
    lat,
    lng,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  }
}
