// Sahte (stub) mekân sağlayıcı — CLAUDE.md §7.3
// API anahtarı OLMADAN tüm akışı uçtan uca test edebilmek için.
// Gerçek sağlayıcı (foursquare.js) devreye girene kadar findVenue bunu kullanır.
// Dönen tip gerçek sağlayıcılarla AYNI olmalı: { name, address, lat, lng, mapsUrl }

export async function findVenueStub(midpoint, queries /*, radius */) {
  const label = queries?.[0] ?? 'mekan'
  // Orta noktaya çok yakın, deterministik sahte bir nokta üret
  const lat = midpoint.lat + 0.0008
  const lng = midpoint.lng + 0.0008
  return {
    name: `Örnek ${label} mekanı`,
    address: 'Test adresi (stub sağlayıcı)',
    lat,
    lng,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    _stub: true,
  }
}
