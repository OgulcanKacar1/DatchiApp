// Foursquare Places adaptörü — CLAUDE.md §4, §7.3
// Anahtar: FOURSQUARE_API_KEY (Functions env, asla client'a düşmez — §5).
// findVenue arayüzünü uygular; dönen tip stub ile AYNI olmalı.
//
// NOT: Foursquare API uçları zaman zaman değişiyor. Anahtarı alınca
// gerçek istekle bir kez doğrula (baseUrl / header sürümü).

const BASE_URL = 'https://api.foursquare.com/v3/places/search'

export async function findVenueFoursquare(midpoint, queries, radius) {
  const apiKey = process.env.FOURSQUARE_API_KEY
  if (!apiKey) throw new Error('FOURSQUARE_API_KEY tanımlı değil')

  // venueQuery bir dizi; ilk terimle ara (matcher en uygun terimi başa koyar)
  const query = Array.isArray(queries) ? queries[0] : queries
  const params = new URLSearchParams({
    query,
    ll: `${midpoint.lat},${midpoint.lng}`,
    radius: String(Math.round(radius)),
    limit: '1',
    sort: 'DISTANCE',
  })

  const res = await fetch(`${BASE_URL}?${params}`, {
    headers: { Authorization: apiKey, Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Foursquare ${res.status}`)

  const data = await res.json()
  const place = data.results?.[0]
  if (!place) return null

  const lat = place.geocodes?.main?.latitude
  const lng = place.geocodes?.main?.longitude
  return {
    name: place.name,
    address: place.location?.formatted_address ?? '',
    lat,
    lng,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  }
}
