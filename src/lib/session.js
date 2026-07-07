// Oturum oluştur / katıl yardımcıları — CLAUDE.md §6.3, §10 adım 3-4, §5
//
// GİZLİLİK MİMARİSİ (§5): Ham cevaplar ana dokümanda TUTULMAZ. Firestore doküman
// okuması alan-bazlı gizlenemediği için cevaplar `sessions/{id}/private/{creator|guest}`
// alt-koleksiyonuna yazılır; güvenlik kuralları bunları client okumasına kapatır.
// Ana doküman yalnızca herkese açık alanları taşır (durum, isimler, presence, result).
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase.js'

const SESSIONS = 'sessions'
const TTL_HOURS = 24

export function magicLinkFor(sessionId) {
  return `${window.location.origin}/s/${sessionId}`
}

// İsim: opsiyonel, herkese açık okunur (adalet kuralını bozmaz — cevap değil).
function cleanName(name) {
  const n = (name ?? '').trim()
  return n ? n.slice(0, 24) : null
}

// Özel cevap dokümanı referansı: sessions/{id}/private/{who}
function answerRef(sessionId, who) {
  return doc(db, SESSIONS, sessionId, 'private', who)
}

// A kişisi: herkese açık oturum + özel creator cevabı. Cevap ana dokümanda DEĞİL.
export async function createSession(creatorAnswers, creatorName) {
  const expireAt = Timestamp.fromDate(
    new Date(Date.now() + TTL_HOURS * 60 * 60 * 1000),
  )
  // 1) Herkese açık oturum dokümanı
  const ref = await addDoc(collection(db, SESSIONS), {
    createdAt: serverTimestamp(),
    expireAt, // TTL policy bu alana bağlanır (§6.3)
    status: 'waiting',
    creatorName: cleanName(creatorName),
    guestName: null,
    guestActive: false, // guest formu açtı mı ("dolduruyor" göstergesi)
    guestSubmitted: false, // guest cevabını gönderdi mi
    result: null, // yalnızca Cloud Function yazar (§5)
  })
  // 2) Creator cevabı — özel, client okuyamaz
  await setDoc(answerRef(ref.id, 'creator'), { answer: creatorAnswers })
  return { sessionId: ref.id, magicLink: magicLinkFor(ref.id) }
}

// Join açılışında: oturum var/geçerli mi + creatorName (kişisel davet metni için)
export async function getSessionMeta(sessionId) {
  const snap = await getDoc(doc(db, SESSIONS, sessionId))
  if (!snap.exists()) return { exists: false }
  const data = snap.data()
  return {
    exists: true,
    status: data.status,
    alreadyAnswered: data.guestSubmitted === true,
    creatorName: data.creatorName ?? null,
  }
}

// Guest formu AÇTIĞINDA (henüz göndermeden) → creator "dolduruyor" görür.
export async function markGuestActive(sessionId) {
  try {
    await updateDoc(doc(db, SESSIONS, sessionId), { guestActive: true })
  } catch {
    // presence kritik değil; hata sessizce yut
  }
}

// B kişisi: özel guest cevabı + herkese açık isim/gönderildi bayrağı.
// Cevabın yazılması Cloud Function'ı tetikler; status'u Function "ready" yapar (§5).
export async function submitGuestAnswers(sessionId, guestAnswers, guestName) {
  await setDoc(answerRef(sessionId, 'guest'), { answer: guestAnswers })
  await updateDoc(doc(db, SESSIONS, sessionId), {
    guestName: cleanName(guestName),
    guestSubmitted: true,
  })
}
