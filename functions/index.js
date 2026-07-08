// Datchi Cloud Functions — CLAUDE.md §10 adım 5, §5
// matchDate: guest özel cevabı yazılınca tetiklenir; result'ı yazan TEK yer (§5).
// Cevaplar sessions/{id}/private/{creator|guest} altında; SADECE admin (bu Function)
// okur, client okuyamaz. Sonuç ana dokümana yazılır.
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { defineSecret } from 'firebase-functions/params'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

// Places sağlayıcı anahtarı — Secret Manager'da tutulur, koda/cliente girmez (§5).
// Tanımlıysa places.js otomatik Foursquare'e geçer; yoksa stub'a düşer.
const foursquareKey = defineSecret('FOURSQUARE_API_KEY')

import { matchTemplate } from './lib/matcher.js'
import { computeMidpoint, findVenue } from './lib/places.js'
import { DATE_TEMPLATES } from './lib/dateTemplates.js'

initializeApp()

export const matchDate = onDocumentCreated(
  {
    document: 'sessions/{sessionId}/private/guest',
    region: 'europe-west3',
    secrets: [foursquareKey],
  },
  async (event) => {
    const sessionId = event.params.sessionId
    const db = getFirestore()

    const sessionRef = db.doc(`sessions/${sessionId}`)
    const session = (await sessionRef.get()).data()
    if (!session) return
    // Idempotent: zaten hesaplandıysa çık
    if (session.status === 'ready' || session.result) return

    // Her iki özel cevabı da oku (client bunları okuyamaz)
    const [creatorSnap, guestSnap] = await Promise.all([
      db.doc(`sessions/${sessionId}/private/creator`).get(),
      db.doc(`sessions/${sessionId}/private/guest`).get(),
    ])
    const creator = creatorSnap.data()?.answer
    const guest = guestSnap.data()?.answer
    if (!creator || !guest) return

    // 1) Eşleştir (§7.1/§7.2)
    const { shared, picked } = matchTemplate(creator, guest, DATE_TEMPLATES)
    if (!picked) {
      console.warn('[matchDate] uygun şablon bulunamadı', sessionId)
      return
    }

    // 2) Orta nokta + gerçek mekân (§7.3)
    const midpoint = computeMidpoint(creator.location, guest.location)
    const venue = await findVenue(midpoint, picked.template.venueQuery)

    // 3) Joker reveal (sadece gösterim, puanlamaya girmez — §7.4)
    const jokerReveal =
      creator.joker || guest.joker
        ? { creator: creator.joker ?? null, guest: guest.joker ?? null }
        : null

    // 4) Result yaz + status "ready" (real-time reveal buna tetiklenir)
    await sessionRef.update({
      result: { template: picked.template, venue, midpoint, jokerReveal, sharedPref: shared },
      status: 'ready',
      matchedAt: FieldValue.serverTimestamp(),
    })
  },
)
