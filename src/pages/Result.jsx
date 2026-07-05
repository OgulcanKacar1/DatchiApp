// Real-time reveal — CLAUDE.md §10 adım 6
// useSession listener'ı status "ready" olunca result'ı anında düşürür.
// result'ı Cloud Function yazar (§5); o bölüm bitene kadar "ready"de ham JSON gösterilir.
import { useParams } from 'react-router-dom'
import { useSession } from '../hooks/useSession.js'

export default function Result() {
  const { sessionId } = useParams()
  const s = useSession(sessionId)

  if (s.loading) {
    return (
      <main className="mx-auto flex min-h-svh max-w-md items-center justify-center px-6 text-neutral-500">
        Yükleniyor…
      </main>
    )
  }

  if (s.notFound) {
    return (
      <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Oturum bulunamadı
        </h1>
        <p className="text-neutral-500">Link geçersiz veya süresi dolmuş.</p>
      </main>
    )
  }

  // Henüz sonuç yok → bekleme ekranı (§ risk 1: A tarafı burada bekler)
  if (s.status !== 'ready' || !s.result) {
    return (
      <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-rose-500" />
        <h1 className="text-xl font-semibold text-neutral-900">
          {s.hasGuest ? 'Rotanız hazırlanıyor…' : 'Karşı taraf bekleniyor…'}
        </h1>
        <p className="text-sm text-neutral-500">
          {s.hasGuest
            ? 'İki cevap da geldi, ortak rota hesaplanıyor.'
            : 'Diğer kişi tercihlerini girince sonuç burada anında belirecek. Bu sayfayı açık bırakabilirsin.'}
        </p>
      </main>
    )
  }

  // status "ready" — Cloud Function result yazdı.
  // TODO(§3 reveal + §8 DateCard): burası güzel reveal ekranına dönecek.
  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-4 px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Date Rotanız</h1>
      <pre className="overflow-x-auto rounded-xl bg-neutral-100 p-4 text-xs text-neutral-700">
        {JSON.stringify(s.result, null, 2)}
      </pre>
    </main>
  )
}
