// Oturum oluştur / katıl yardımcıları — CLAUDE.md §6.3, §10 adım 3-4
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase.js'

const SESSIONS = 'sessions'
const TTL_HOURS = 24

// Magic link'i domain'den bağımsız üret (§3: koda domain gömme)
export function magicLinkFor(sessionId) {
  return `${window.location.origin}/s/${sessionId}`
}

// İsim: opsiyonel, herkese açık okunur (adalet kuralını bozmaz — cevap değil).
// Kısa tut, boşsa null yaz.
function cleanName(name) {
  const n = (name ?? '').trim()
  return n ? n.slice(0, 24) : null
}

// A kişisi: oturum aç, creatorAnswers yaz, status "waiting"
// result'ı CLIENT YAZMAZ (§5) — sadece null olarak başlatılır.
export async function createSession(creatorAnswers, creatorName) {
  const expireAt = Timestamp.fromDate(
    new Date(Date.now() + TTL_HOURS * 60 * 60 * 1000),
  )
  const ref = await addDoc(collection(db, SESSIONS), {
    createdAt: serverTimestamp(),
    expireAt, // TTL policy bu alana bağlanır (§6.3)
    status: 'waiting',
    creatorName: cleanName(creatorName), // opsiyonel, gösterim için
    guestName: null,
    guestActive: false, // guest formu açtı mı ("dolduruyor" göstergesi)
    creatorAnswers,
    guestAnswers: null,
    result: null,
  })
  return { sessionId: ref.id, magicLink: magicLinkFor(ref.id) }
}

// Oturumun var/geçerli olup olmadığını kontrol et (Join açılışında)
// creatorName'i de döndür → "Ayşe seni davet etti" kişisel metni için.
export async function getSessionMeta(sessionId) {
  const snap = await getDoc(doc(db, SESSIONS, sessionId))
  if (!snap.exists()) return { exists: false }
  const data = snap.data()
  return {
    exists: true,
    status: data.status,
    alreadyAnswered: data.guestAnswers != null,
    creatorName: data.creatorName ?? null,
  }
}

// Guest formu AÇTIĞINDA çağrılır (henüz göndermeden) → creator "dolduruyor" görür.
// Cevap yazmaz, sadece presence bayrağı (§5 adaletini bozmaz).
export async function markGuestActive(sessionId) {
  try {
    await updateDoc(doc(db, SESSIONS, sessionId), { guestActive: true })
  } catch {
    // presence kritik değil; hata sessizce yut
  }
}

// B kişisi: guestAnswers + guestName yaz. status'u Function "ready" yapar (§5).
export async function submitGuestAnswers(sessionId, guestAnswers, guestName) {
  await updateDoc(doc(db, SESSIONS, sessionId), {
    guestAnswers,
    guestName: cleanName(guestName),
  })
}
