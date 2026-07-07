// Creator formu + canlı bekleme odası — CLAUDE.md §10 adım 3, § risk 1
// Form → createSession → bekleme odası (link paylaş + canlı durum) → hazır olunca reveal.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Check, Copy, PenLine } from 'lucide-react'
import PreferenceForm from '../components/PreferenceForm.jsx'
import { createSession } from '../lib/session.js'
import { isFirebaseConfigured } from '../lib/firebase.js'
import { useSession } from '../hooks/useSession.js'

export default function Create() {
  const [session, setSession] = useState(null) // { id, link }
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit({ name, answer }) {
    setBusy(true)
    setError(null)
    try {
      const { sessionId, magicLink } = await createSession(answer, name)
      setSession({ id: sessionId, link: magicLink })
    } catch (e) {
      console.error(e)
      setError(
        isFirebaseConfigured
          ? 'Oturum oluşturulamadı. Bağlantını kontrol et.'
          : 'Firebase yapılandırılmamış. .env dosyasını doldur.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="relative mx-auto flex min-h-svh max-w-md flex-col gap-6 overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-brand-200/35 blur-3xl" />

      {!session && (
        <header className="relative">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Tercihlerini gir
          </h1>
          <p className="mt-1 text-sm text-muted">
            Sonra oluşacak linki karşı tarafa gönderirsin.
          </p>
        </header>
      )}

      {error && (
        <div className="relative rounded-2xl border border-brand-200 bg-brand-50 p-3 text-sm font-semibold text-brand-700">
          {error}
        </div>
      )}

      {session ? (
        <WaitingRoom sessionId={session.id} link={session.link} />
      ) : (
        <div className="relative">
          <PreferenceForm
            nameLabel="Adın"
            submitLabel={busy ? 'Oluşturuluyor…' : 'Link oluştur'}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </main>
  )
}

// Bekleme odası — canlı durum + paylaşılabilir link. Hazır olunca reveal'e geçer.
function WaitingRoom({ sessionId, link }) {
  const navigate = useNavigate()
  const s = useSession(sessionId)
  const [copied, setCopied] = useState(false)

  // Sonuç hazır olunca ikisi de aynı anda reveal'i görsün
  useEffect(() => {
    if (s.status === 'ready') navigate(`/s/${sessionId}/result`)
  }, [s.status, sessionId, navigate])

  async function copyLink() {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // Canlı durum metni
  let statusText = 'Karşı taraf bekleniyor…'
  if (s.hasGuest) statusText = 'İkiniz de doldurdunuz — rota hazırlanıyor…'
  else if (s.guestActive) statusText = 'Karşı taraf şu an dolduruyor…'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col gap-6"
    >
      <header className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-[var(--shadow-soft)]">
          <PenLine size={24} />
        </div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Linkin hazır
        </h1>
        <p className="mt-1 text-sm text-muted">
          Bunu buluşacağın kişiye gönder. Cevabı gelince rotanız burada
          belirecek.
        </p>
      </header>

      {/* Paylaşılabilir link */}
      <div className="flex items-center gap-2 rounded-2xl border border-sand-200 bg-sand-100/70 p-2">
        <input
          readOnly
          value={link}
          className="min-w-0 flex-1 truncate bg-transparent px-2 text-sm text-ink outline-none"
        />
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Kopyalandı' : 'Kopyala'}
        </button>
      </div>

      {/* Canlı durum */}
      <div className="flex items-center justify-center gap-3 rounded-2xl border border-sand-200 bg-white/70 px-4 py-4 backdrop-blur-sm">
        <span className="relative flex h-3 w-3">
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
              s.guestActive ? 'animate-ping bg-brand-400' : 'bg-sand-300'
            }`}
          />
          <span
            className={`relative inline-flex h-3 w-3 rounded-full ${
              s.guestActive ? 'bg-brand-500' : 'bg-sand-300'
            }`}
          />
        </span>
        <span className="text-sm font-semibold text-ink">{statusText}</span>
      </div>

      <p className="text-center text-xs text-muted">
        Link 24 saat geçerli. Bu sayfayı açık bırakabilirsin.
      </p>
    </motion.div>
  )
}
