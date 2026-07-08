// Manuel konum araması — OpenStreetMap Nominatim (ücretsiz, anahtarsız).
// Foursquare anahtarı server-only kaldığı için (§5) manuel arama client'tan
// bunu kullanır. Sadece semt/mekân → lat/lng çevirir; oturuma koordinat yazılır.
//
// Nominatim kullanım politikası: hafif kullanım, saniyede ~1 istek. Form zaten
// debounce'lu (min 3 karakter, 450ms) çağırıyor.

const ENDPOINT = 'https://nominatim.openstreetmap.org/search'

export async function searchPlaces(query) {
  const params = new URLSearchParams({
    format: 'jsonv2',
    q: query,
    limit: '5',
    countrycodes: 'tr', // birincil kitle Türkiye (§11)
    'accept-language': 'tr',
  })
  const res = await fetch(`${ENDPOINT}?${params}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.map((p) => ({
    id: p.place_id,
    label: shortenLabel(p.display_name),
    lat: Number(p.lat),
    lng: Number(p.lon),
  }))
}

// "Kadıköy, İstanbul, Marmara Bölgesi, Türkiye" → "Kadıköy, İstanbul"
function shortenLabel(displayName) {
  const parts = displayName.split(',').map((s) => s.trim())
  return parts.slice(0, 2).join(', ')
}
