// Firestore real-time listener — CLAUDE.md §10 adım 6
// status "ready" olunca result Function tarafından yazılır ve buraya anında düşer.
import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase.js'

// Dönen değer:
//   loading  — ilk snapshot henüz gelmedi
//   notFound — böyle bir oturum yok (yanlış/expired link)
//   status   — "waiting" | "ready"
//   result   — sadece status "ready" olunca dolu (Function yazar)
export function useSession(sessionId) {
  const [state, setState] = useState({ loading: true })

  useEffect(() => {
    if (!sessionId) {
      setState({ loading: false, notFound: true })
      return
    }
    const unsub = onSnapshot(
      doc(db, 'sessions', sessionId),
      (snap) => {
        if (!snap.exists()) {
          setState({ loading: false, notFound: true })
          return
        }
        const data = snap.data()
        setState({
          loading: false,
          notFound: false,
          status: data.status,
          result: data.result ?? null,
          hasGuest: data.guestSubmitted === true,
          creatorName: data.creatorName ?? null,
          guestName: data.guestName ?? null,
          guestActive: data.guestActive ?? false,
        })
      },
      (err) => setState({ loading: false, error: err }),
    )
    return unsub
  }, [sessionId])

  return state
}
