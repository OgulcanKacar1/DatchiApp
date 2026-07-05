// Creator formu — CLAUDE.md §10 adım 3
// Form → createSession → magic link göster (paylaşılacak).
import { useState } from 'react'
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
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-6 px-6 py-10">
      <header>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Tercihlerini gir
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Sonra oluşacak linki karşı tarafa gönderirsin.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {link ? (
        <div className="flex flex-col gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div>
            <p className="font-semibold text-emerald-800">Linkin hazır 🎉</p>
            <p className="mt-1 text-sm text-emerald-700">
              Bunu buluşacağın kişiye gönder. O da tercihlerini girince rotanız
              birlikte belirecek.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white p-2">
            <input
              readOnly
              value={link}
              className="min-w-0 flex-1 truncate bg-transparent px-2 text-sm text-neutral-700 outline-none"
            />
            <button
              type="button"
              onClick={copyLink}
              className="shrink-0 rounded-md bg-rose-500 px-3 py-2 text-sm font-medium text-white hover:bg-rose-600"
            >
              {copied ? 'Kopyalandı ✓' : 'Kopyala'}
            </button>
          </div>
          <p className="text-xs text-emerald-700">
            Link 24 saat geçerli. Karşı taraf gönderene kadar burada
            bekleyebilirsin.
          </p>
        </div>
      ) : (
        <PreferenceForm
          submitLabel={busy ? 'Oluşturuluyor…' : 'Link oluştur'}
          onSubmit={handleSubmit}
        />
      )}
    </main>
  )
}
