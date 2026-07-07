// Güvenlik kuralları testi — CLIENT SDK ile emülatöre karşı (§5).
// Kuralların client'ı doğru şekilde kısıtladığını doğrular.
// Çalıştır (Datchi kökünden): node functions/test/rules-check.mjs
import { initializeApp } from 'firebase/app'
import {
  getFirestore, connectFirestoreEmulator,
  collection, addDoc, setDoc, getDoc, updateDoc, doc, serverTimestamp, Timestamp,
} from 'firebase/firestore'

const app = initializeApp({ projectId: 'datchiapp' })
const db = getFirestore(app)
connectFirestoreEmulator(db, '127.0.0.1', 8080)

let pass = 0, fail = 0
const ok = (m) => { console.log('  ✅', m); pass++ }
const no = (m) => { console.log('  ❌', m); fail++ }

// 1) Client geçerli oturum oluşturabilmeli
const ref = await addDoc(collection(db, 'sessions'), {
  createdAt: serverTimestamp(),
  expireAt: Timestamp.fromDate(new Date(Date.now() + 86400000)),
  status: 'waiting', creatorName: 'Test', guestName: null,
  guestActive: false, guestSubmitted: false, result: null,
})
ok('client oturum oluşturabildi')

// 2) Client kendi özel cevabını yazabilmeli
await setDoc(doc(db, `sessions/${ref.id}/private/creator`), { answer: { budget: 1 } })
ok('client kendi özel cevabını yazabildi')

// 3) Client özel cevabı OKUYAMAMALI (adalet, §5)
try {
  await getDoc(doc(db, `sessions/${ref.id}/private/creator`))
  no('özel cevap client tarafından OKUNDU (kural açığı!)')
} catch {
  ok('özel cevap okuması reddedildi (beklenen)')
}

// 4) Client result yazAMAMALI
try {
  await updateDoc(doc(db, `sessions/${ref.id}`), { result: { hack: true } })
  no('client result yazabildi (kural açığı!)')
} catch {
  ok('client result yazımı reddedildi (beklenen)')
}

// 5) Client status yazAMAMALI
try {
  await updateDoc(doc(db, `sessions/${ref.id}`), { status: 'ready' })
  no('client status değiştirebildi (kural açığı!)')
} catch {
  ok('client status yazımı reddedildi (beklenen)')
}

// 6) Client presence/isim güncelleyebilmeli (izin verilen)
await updateDoc(doc(db, `sessions/${ref.id}`), { guestActive: true, guestName: 'X', guestSubmitted: true })
ok('client presence/isim güncelleyebildi (beklenen)')

console.log(`\nSonuç: ${pass} geçti, ${fail} kaldı`)
process.exit(fail ? 1 : 0)
