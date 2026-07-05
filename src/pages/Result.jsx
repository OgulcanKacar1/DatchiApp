// Real-time reveal — CLAUDE.md §10 adım 6 (henüz iskele)
// TODO: useSession listener'ı status: "ready" olunca sonucu + DateCard göster
import { useParams } from 'react-router-dom'

export default function Result() {
  const { sessionId } = useParams()

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold text-neutral-900">Date Rotanız</h1>
      <p className="text-neutral-600">
        (İskele) Oturum <code className="text-sm">{sessionId}</code> için sonuç
        burada real-time belirecek.
      </p>
    </main>
  )
}
