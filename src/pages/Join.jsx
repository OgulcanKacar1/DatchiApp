// Guest formu — magic link ile açılır — CLAUDE.md §10 adım 4
// TODO(Firebase): sessionId'yi doğrula (yoksa/expired ise uyar), guestAnswers yaz,
// sonra /s/:sessionId/result'a git. Şimdilik Answer'ı ekranda gösteriyoruz.
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PreferenceForm from '../components/PreferenceForm.jsx'

export default function Join() {
  const { sessionId } = useParams()
  const [answer, setAnswer] = useState(null)

  function handleSubmit(a) {
    console.log('guestAnswers:', a, 'session:', sessionId)
    setAnswer(a)
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-6 px-6 py-10">
      <header>
        <h1 className="text-2xl font-semibold text-neutral-900">Sıra sende</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Tercihlerini gir, ortak date rotanız birlikte belirsin.
        </p>
      </header>

      {answer ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <p className="font-semibold">Tercihlerin alındı ✓</p>
          <p className="mt-1 text-emerald-700">
            (İskele) Firebase bağlanınca sonuç ekranına yönlendirileceksin.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-white/60 p-3 text-xs text-neutral-700">
            {JSON.stringify(answer, null, 2)}
          </pre>
        </div>
      ) : (
        <PreferenceForm submitLabel="Gönder" onSubmit={handleSubmit} />
      )}
    </main>
  )
}
