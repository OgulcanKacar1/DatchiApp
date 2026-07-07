// Guest formu — magic link ile açılır — CLAUDE.md §10 adım 4
// sessionId doğrula → (dolduruyor bayrağı) → guestAnswers+isim yaz → /result'a git.
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import PreferenceForm from '../components/PreferenceForm.jsx'
import {
  getSessionMeta,
  submitGuestAnswers,
  markGuestActive,
} from '../lib/session.js'

export default function Join() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [meta, setMeta] = useState({ loading: true })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    getSessionMeta(sessionId)
      .then((m) => {
        if (!active) return
        setMeta({ loading: false, ...m })
        // Form gösterilecekse creator'a "dolduruyor" sinyali gönder
        if (m.exists && !m.alreadyAnswered) markGuestActive(sessionId)
      })
      .catch(() => active && setMeta({ loading: false, exists: false }))
    return () => {
      active = false
    }
  }, [sessionId])

  async function handleSubmit({ name, answer }) {
    setBusy(true)
    setError(null)
    try {
      await submitGuestAnswers(sessionId, answer, name)
      navigate(`/s/${sessionId}/result`)
    } catch (e) {
      console.error(e)
      setError('Cevap gönderilemedi. Bağlantını kontrol et.')
      setBusy(false)
    }
  }

  if (meta.loading) {
    return (
      <main className="mx-auto flex min-h-svh max-w-md items-center justify-center px-6 text-muted">
        Yükleniyor…
      </main>
    )
  }

  // Yanlış / süresi dolmuş link
  if (!meta.exists) {
    return (
      <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Link geçersiz
        </h1>
        <p className="text-muted">
          Bu date oturumu bulunamadı veya süresi dolmuş (linkler 24 saat
          geçerli).
        </p>
      </main>
    )
  }

  // Guest zaten cevaplamış → sonuca yönlendir
  if (meta.alreadyAnswered) {
    return (
      <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-muted">Bu oturuma zaten cevap verilmiş.</p>
        <button
          type="button"
          onClick={() => navigate(`/s/${sessionId}/result`)}
          className="rounded-full bg-brand-500 px-5 py-3 font-bold text-white transition hover:bg-brand-600"
        >
          Sonucu gör
        </button>
      </main>
    )
  }

  // Kişisel davet metni (creatorName varsa)
  const inviteLine = meta.creatorName
    ? `${meta.creatorName} seni bir buluşma planına davet etti`
    : 'Bir buluşma planına davet edildin'

  return (
    <main className="relative mx-auto flex min-h-svh max-w-md flex-col gap-6 overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute -top-20 left-0 h-64 w-64 rounded-full bg-brand-200/35 blur-3xl" />

      <header className="relative">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-600">
          <Heart size={14} fill="currentColor" strokeWidth={0} />
          {inviteLine}
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Sıra sende
        </h1>
        <p className="mt-1 text-sm text-muted">
          Tercihlerini gir, ortak date rotanız birlikte belirsin.
        </p>
      </header>

      {error && (
        <div className="relative rounded-2xl border border-brand-200 bg-brand-50 p-3 text-sm font-semibold text-brand-700">
          {error}
        </div>
      )}

      <div className="relative">
        <PreferenceForm
          nameLabel="Adın"
          submitLabel={busy ? 'Gönderiliyor…' : 'Gönder'}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  )
}
