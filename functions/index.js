// Datchi Cloud Functions — CLAUDE.md §10 adım 5
// matchDate: iki cevap da gelince tetiklenir, result'ı yazan TEK yer (§5).
import { onDocumentUpdated } from 'firebase-functions/v2/firestore'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

import { matchTemplate } from './lib/matcher.js'
import { computeMidpoint, findVenue } from './lib/places.js'
import { DATE_TEMPLATES } from './lib/dateTemplates.js'

initializeApp()

export const matchDate = onDocumentUpdated(
  { document: 'sessions/{sessionId}', region: 'europe-west3' },
  async (event) => {
    const after = event.data?.after?.data()
    if (!after) return

    // Sadece: iki cevap da var, henüz sonuç yok. (Kendi yazımızla tekrar
    // tetiklenip sonsuz döngüye girmeyi de bu koşul engeller.)
    if (!after.creatorAnswers || !after.guestAnswers) return
    if (after.status === 'ready' || after.result) return

    const creator = after.creatorAnswers
    const guest = after.guestAnswers

    // 1) Eşleştir (§7.1/§7.2)
    const { shared, picked } = matchTemplate(creator, guest, DATE_TEMPLATES)
    if (!picked) {
      // Teorik olarak nadir (birleşime düşünce hep bir eşleşme olur) ama garanti
      console.warn('[matchDate] uygun şablon bulunamadı', event.params.sessionId)
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
    const result = {
      template: picked.template,
      venue,
      midpoint,
      jokerReveal,
      sharedPref: shared, // reveal ekranında "neden bu?" göstermek için
    }

    await getFirestore()
      .doc(`sessions/${event.params.sessionId}`)
      .update({
        result,
        status: 'ready',
        matchedAt: FieldValue.serverTimestamp(),
      })
  },
)
