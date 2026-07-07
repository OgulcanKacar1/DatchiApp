// Creator formu — CLAUDE.md §10 adım 3
// Form → createSession → magic link göster (paylaşılacak).
import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, Copy, PartyPopper } from 'lucide-react'
import PreferenceForm from '../components/PreferenceForm.jsx'
import { createSession } from '../lib/session.js'
import { isFirebaseConfigured } from '../lib/firebase.js'

export default function Create() {
  const [link, setLink] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(answer) {
    setBusy(true)
    setError(null)
    try {
      const { magicLink } = await createSession(answer)
      setLink(magicLink)
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

  async function copyLink() {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <main className="relative mx-auto flex min-h-svh max-w-md flex-col gap-6 overflow-hidden px-6 py-10">
      {/* Sıcak arka plan derinliği */}
      <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-brand-200/35 blur-3xl" />

      <header className="relative">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Tercihlerini gir
        </h1>
        <p className="mt-1 text-sm text-muted">
          Sonra oluşacak linki karşı tarafa gönderirsin.
        </p>
      </header>

      {error && (
        <div className="relative rounded-2xl border border-brand-200 bg-brand-50 p-3 text-sm font-semibold text-brand-700">
          {error}
        </div>
      )}

      {link ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col gap-4 rounded-[var(--radius-xl)] border border-brand-200 bg-white/80 p-6 shadow-[var(--shadow-soft)] backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white">
              <PartyPopper size={22} />
            </span>
            <p className="font-display text-xl font-semibold text-ink">
              Linkin hazır
            </p>
            <p className="text-sm text-muted">
              Bunu buluşacağın kişiye gönder. O da tercihlerini girince rotanız
              birlikte belirecek.
            </p>
          </div>

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

          <p className="text-center text-xs text-muted">
            Link 24 saat geçerli. Karşı taraf gönderene kadar bekleyebilirsin.
          </p>
        </motion.div>
      ) : (
        <div className="relative">
          <PreferenceForm
            submitLabel={busy ? 'Oluşturuluyor…' : 'Link oluştur'}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </main>
  )
}
