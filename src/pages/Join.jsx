// Guest formu — magic link ile açılır — CLAUDE.md §10 adım 4
// sessionId doğrula → guestAnswers yaz → /result'a git (real-time reveal orada).
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PreferenceForm from '../components/PreferenceForm.jsx'
import { getSessionMeta, submitGuestAnswers } from '../lib/session.js'

export default function Join() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [meta, setMeta] = useState({ loading: true })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    getSessionMeta(sessionId)
      .then((m) => active && setMeta({ loading: false, ...m }))
      .catch(() => active && setMeta({ loading: false, exists: false }))
    return () => {
      active = false
    }
  }, [sessionId])

  async function handleSubmit(answer) {
    setBusy(true)
    setError(null)
    try {
      await submitGuestAnswers(sessionId, answer)
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
        <h1 className="text-2xl font-semibold text-ink">
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
          className="rounded-xl bg-brand-500 px-5 py-3 font-medium text-white hover:bg-rose-600"
        >
          Sonucu gör
        </button>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-6 px-6 py-10">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Sıra sende</h1>
        <p className="mt-1 text-sm text-muted">
          Tercihlerini gir, ortak date rotanız birlikte belirsin.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-700">
          {error}
        </div>
      )}

      <PreferenceForm
        submitLabel={busy ? 'Gönderiliyor…' : 'Gönder'}
        onSubmit={handleSubmit}
      />
    </main>
  )
}
