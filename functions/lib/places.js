// Mekân katmanı — CLAUDE.md §7.3 (orta nokta tuzağı + sağlayıcı soyutlaması)
// Çağıran kod SADECE findVenue() ve computeMidpoint()'i bilir; hangi sağlayıcının
// kullanıldığını (stub / foursquare / yandex) bilmez. Sağlayıcı PLACES_PROVIDER
// env değişkeniyle seçilir → ölçek gelince tek satır değişir.
import { findVenueStub } from '../providers/stub.js'
import { findVenueFoursquare } from '../providers/foursquare.js'

// İki koordinatın coğrafi orta noktası.
// Yakın şehir-içi noktalar için düz ortalama yeterince doğru; ham ortalamayı
// MEKÂN olarak sunmuyoruz (tuzak bu, §7.3) — sadece arama merkezi olarak.
export function computeMidpoint(a, b) {
  return {
    lat: (a.lat + b.lat) / 2,
    lng: (a.lng + b.lng) / 2,
  }
}

// Aktif sağlayıcıyı seç (varsayılan: stub → anahtarsız çalışır)
function resolveProvider() {
  switch (process.env.PLACES_PROVIDER) {
    case 'foursquare':
      return findVenueFoursquare
    // case 'yandex': return findVenueYandex  // ileride
    default:
      return findVenueStub
  }
}

// Orta nokta çevresinde gerçek mekân bul. İyi mekân yoksa yarıçapı genişlet (§7.3).
// queries: seçilen şablonun venueQuery dizisi.
export async function findVenue(midpoint, queries, opts = {}) {
  const provider = resolveProvider()
  const radii = opts.radii ?? [1000, 2500, 5000] // metre: genişleyen halkalar

  for (const radius of radii) {
    try {
      const venue = await provider(midpoint, queries, radius)
      if (venue) return venue
    } catch (err) {
      // Bir sağlayıcı hatası tüm reveal'i kırmasın; logla ve null ile devam et
      console.error('[places] sağlayıcı hatası:', err.message)
      return null
    }
  }
  return null // hiçbir yarıçapta uygun mekân yok
}
