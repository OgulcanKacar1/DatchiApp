// Real-time reveal — CLAUDE.md §10 adım 6, §3 (reveal büyüsü)
// useSession listener'ı status "ready" olunca result'ı anında düşürür.
import { useParams } from 'react-router-dom'
import { useSession } from '../hooks/useSession.js'
import { activityLabel } from '../data/activities.js'
import JokerReveal from '../components/JokerReveal.jsx'

const BUDGET_LABEL = { 1: '₺', 2: '₺₺', 3: '₺₺₺' }

export default function Result() {
  const { sessionId } = useParams()
  const s = useSession(sessionId)

  if (s.loading) {
    return <Centered>Yükleniyor…</Centered>
  }

  if (s.notFound) {
    return (
      <Centered>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Oturum bulunamadı
        </h1>
        <p className="mt-2 text-neutral-500">Link geçersiz veya süresi dolmuş.</p>
      </Centered>
    )
  }

  // Henüz sonuç yok → bekleme ekranı (§ risk 1: A tarafı burada bekler)
  if (s.status !== 'ready' || !s.result) {
    return (
      <Centered>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-rose-500" />
        <h1 className="mt-4 text-xl font-semibold text-neutral-900">
          {s.hasGuest ? 'Rotanız hazırlanıyor…' : 'Karşı taraf bekleniyor…'}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {s.hasGuest
            ? 'İki cevap da geldi, ortak rota hesaplanıyor.'
            : 'Diğer kişi tercihlerini girince sonuç burada anında belirecek. Bu sayfayı açık bırakabilirsin.'}
        </p>
      </Centered>
    )
  }

  const { template, venue, sharedPref, jokerReveal } = s.result

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-4 px-5 py-10">
      <header className="reveal text-center" style={{ animationDelay: '0ms' }}>
        <p className="text-sm font-medium uppercase tracking-wide text-rose-500">
          Date Rotanız
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900">
          {template.title}
        </h1>
      </header>

      {/* Senaryo metni */}
      <p
        className="reveal text-center text-neutral-600"
        style={{ animationDelay: '90ms' }}
      >
        {template.copy}
      </p>

      {/* Mekân kartı */}
      {venue && (
        <a
          href={venue.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="reveal block rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-rose-300 hover:shadow-sm"
          style={{ animationDelay: '180ms' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Önerilen mekân
          </p>
          <p className="mt-1 text-lg font-semibold text-neutral-900">
            📍 {venue.name}
          </p>
          {venue.address && (
            <p className="mt-0.5 text-sm text-neutral-500">{venue.address}</p>
          )}
          <p className="mt-3 text-sm font-medium text-rose-600">
            Haritada aç →
          </p>
          {venue._stub && (
            <p className="mt-2 text-xs text-amber-600">
              (Örnek mekân — gerçek Places sağlayıcısı henüz bağlı değil)
            </p>
          )}
        </a>
      )}

      {/* Neden bu? — ortak tercih özeti */}
      {sharedPref && (
        <div
          className="reveal rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
          style={{ animationDelay: '270ms' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Neden bu?
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <Chip>Bütçe {BUDGET_LABEL[sharedPref.budget]}</Chip>
            {sharedPref.energy && <Chip>{sharedPref.energy}</Chip>}
            {sharedPref.timeOfDay && <Chip>{sharedPref.timeOfDay}</Chip>}
            {sharedPref.activities?.map((a) => (
              <Chip key={a}>{activityLabel(a)}</Chip>
            ))}
          </div>
          <p className="mt-2 text-xs text-neutral-400">
            {sharedPref.activitiesMode === 'intersection'
              ? 'Ortak seçtiğiniz aktivitelere göre.'
              : 'Ortak nokta çıkmadı, ikinizin tercihlerini birleştirdik.'}
          </p>
        </div>
      )}

      {/* Joker */}
      <div className="reveal" style={{ animationDelay: '360ms' }}>
        <JokerReveal jokerReveal={jokerReveal} />
      </div>

      <p
        className="reveal mt-2 text-center text-xs text-neutral-400"
        style={{ animationDelay: '450ms' }}
      >
        İyi eğlenceler ✨ · Datchi
      </p>
    </main>
  )
}

function Centered({ children }) {
  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center px-6 text-center text-neutral-500">
      {children}
    </main>
  )
}

function Chip({ children }) {
  return (
    <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-neutral-700">
      {children}
    </span>
  )
}
