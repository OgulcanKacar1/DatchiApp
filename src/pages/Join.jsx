// Guest formu — magic link ile açılır — CLAUDE.md §10 adım 4 (henüz iskele)
// TODO: sessionId'yi doğrula, PreferenceForm göster, guestAnswers yaz
import { useParams } from 'react-router-dom'

export default function Join() {
  const { sessionId } = useParams()

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold text-neutral-900">
        Sıra sende
      </h1>
      <p className="text-neutral-600">
        (İskele) Oturum: <code className="text-sm">{sessionId}</code>
      </p>
    </main>
  )
}
