// Creator formu — CLAUDE.md §10 adım 3
// TODO(Firebase): onSubmit içinde oturum oluştur (lib/session.js) + magic link üret,
// creatorAnswers yaz, status: "waiting". Şimdilik Answer'ı ekranda gösteriyoruz.
import { useState } from 'react'
import PreferenceForm from '../components/PreferenceForm.jsx'

export default function Create() {
  const [answer, setAnswer] = useState(null)

  function handleSubmit(a) {
    // Firebase bağlanınca burası oturum oluşturmaya dönecek
    console.log('creatorAnswers:', a)
    setAnswer(a)
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

      {answer ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <p className="font-semibold">Tercihlerin alındı ✓</p>
          <p className="mt-1 text-emerald-700">
            (İskele) Firebase bağlanınca burada oturum + magic link üretilecek.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-white/60 p-3 text-xs text-neutral-700">
            {JSON.stringify(answer, null, 2)}
          </pre>
        </div>
      ) : (
        <PreferenceForm submitLabel="Devam et" onSubmit={handleSubmit} />
      )}
    </main>
  )
}
