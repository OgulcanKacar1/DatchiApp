// Emülatöre karşı uçtan uca pipeline testi (admin SDK).
// Yeni gizlilik yapısını + matchDate fonksiyonunu doğrular.
// Çalıştır: FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node test/e2e-emulator.mjs
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

initializeApp({ projectId: 'datchiapp' })
const db = getFirestore()

const creator = {
  budget: 2, activities: ['bar', 'kahve'], energy: 'hareketli',
  timeOfDay: 'akşam', location: { lat: 41.04, lng: 29.0 }, joker: { question: 'Ananaslı pizza?', answer: 'Evet' },
}
const guest = {
  budget: 3, activities: ['bar'], energy: 'hareketli',
  timeOfDay: 'akşam', location: { lat: 41.05, lng: 29.02 }, joker: null,
}

// 1) Herkese açık oturum + creator özel cevabı
const ref = await db.collection('sessions').add({
  createdAt: new Date(), expireAt: new Date(Date.now() + 86400000),
  status: 'waiting', creatorName: 'Ayşe', guestName: null,
  guestActive: false, guestSubmitted: false, result: null,
})
await db.doc(`sessions/${ref.id}/private/creator`).set({ answer: creator })
console.log('oturum:', ref.id)

// 2) Guest özel cevabı → fonksiyonu tetikler
await db.doc(`sessions/${ref.id}/private/guest`).set({ answer: guest })
await db.doc(`sessions/${ref.id}`).update({ guestName: 'Mehmet', guestSubmitted: true })

// 3) result yazılana kadar bekle
let data
for (let i = 0; i < 30; i++) {
  data = (await db.doc(`sessions/${ref.id}`).get()).data()
  if (data.status === 'ready' && data.result) break
  await new Promise((r) => setTimeout(r, 400))
}

if (data.status === 'ready' && data.result) {
  console.log('✅ SONUÇ YAZILDI')
  console.log('  şablon :', data.result.template.title)
  console.log('  mekân  :', data.result.venue?.name)
  console.log('  çift   :', data.creatorName, '&', data.guestName)
  console.log('  joker  :', JSON.stringify(data.result.jokerReveal))
} else {
  console.log('❌ result yazılmadı — status:', data?.status)
  process.exit(1)
}
process.exit(0)
