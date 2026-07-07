// Real-time reveal — CLAUDE.md §10 adım 6, §3 (reveal büyüsü)
// useSession listener'ı status "ready" olunca result'ı anında düşürür.
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, ArrowRight, Share2 } from 'lucide-react'
import { useSession } from '../hooks/useSession.js'
import { ACTIVITY_BY_ID } from '../data/activities.js'
import { ACTIVITY_ICON } from '../data/icons.jsx'
import JokerReveal from '../components/JokerReveal.jsx'
import DateCard from '../components/DateCard.jsx'

const BUDGET_LABEL = { 1: '₺', 2: '₺₺', 3: '₺₺₺' }

export default function Result() {
  const { sessionId } = useParams()
  const s = useSession(sessionId)
  const [showCard, setShowCard] = useState(false)

  if (s.loading) {
    return <Centered>Yükleniyor…</Centered>
  }

  if (s.notFound) {
    return (
      <Centered>
        <h1 className="text-2xl font-semibold text-ink">
          Oturum bulunamadı
        </h1>
        <p className="mt-2 text-muted">Link geçersiz veya süresi dolmuş.</p>
      </Centered>
    )
  }

  // Henüz sonuç yok → bekleme ekranı (§ risk 1: A tarafı burada bekler)
  if (s.status !== 'ready' || !s.result) {
    return (
      <Centered>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sand-200 border-t-brand-500" />
        <h1 className="mt-4 text-xl font-semibold text-ink">
          {s.hasGuest ? 'Rotanız hazırlanıyor…' : 'Karşı taraf bekleniyor…'}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {s.hasGuest
            ? 'İki cevap da geldi, ortak rota hesaplanıyor.'
            : 'Diğer kişi tercihlerini girince sonuç burada anında belirecek. Bu sayfayı açık bırakabilirsin.'}
        </p>
      </Centered>
    )
  }

  const { template, venue, sharedPref, jokerReveal } = s.result
  const couple =
    s.creatorName && s.guestName ? `${s.creatorName} & ${s.guestName}` : null

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col gap-4 px-5 py-10">
      <header className="reveal text-center" style={{ animationDelay: '0ms' }}>
        <p className="text-xs font-bold uppercase tracking-widest text-brand-500">
          {couple ? `${couple} için` : 'Date Rotanız'}
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight text-ink">
          {template.title}
        </h1>
      </header>

      {/* Senaryo metni */}
      <p
        className="reveal text-center text-muted"
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
          className="reveal block rounded-2xl border border-sand-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-sm"
          style={{ animationDelay: '180ms' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Önerilen mekân
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-lg font-semibold text-ink">
            <MapPin size={18} strokeWidth={2.4} className="text-brand-500" />
            {venue.name}
          </p>
          {venue.address && (
            <p className="mt-0.5 text-sm text-muted">{venue.address}</p>
          )}
          <p className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand-600">
            Haritada aç <ArrowRight size={15} />
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
          className="reveal rounded-2xl border border-sand-200 bg-sand-100 p-4"
          style={{ animationDelay: '270ms' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Neden bu?
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <Chip>Bütçe {BUDGET_LABEL[sharedPref.budget]}</Chip>
            {sharedPref.energy && <Chip>{sharedPref.energy}</Chip>}
            {sharedPref.timeOfDay && <Chip>{sharedPref.timeOfDay}</Chip>}
            {sharedPref.activities?.map((a) => {
              const Icon = ACTIVITY_ICON[a]
              return (
                <Chip key={a}>
                  {Icon && <Icon size={14} strokeWidth={2.2} />}
                  {ACTIVITY_BY_ID[a]?.label ?? a}
                </Chip>
              )
            })}
          </div>
          <p className="mt-2 text-xs text-muted">
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

      {/* Paylaşılabilir Date Kartı (§8) */}
      <div className="reveal mt-2" style={{ animationDelay: '450ms' }}>
        {showCard ? (
          <DateCard result={s.result} couple={couple} />
        ) : (
          <button
            type="button"
            onClick={() => setShowCard(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-6 py-3.5 font-bold text-brand-700 transition hover:bg-brand-100"
          >
            <Share2 size={17} strokeWidth={2.3} /> Bu rotayı kart olarak paylaş
          </button>
        )}
      </div>

      <p className="mt-2 flex items-center justify-center gap-1 text-center text-xs text-muted">
        İyi eğlenceler · Datchi
      </p>
    </main>
  )
}

function Centered({ children }) {
  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center px-6 text-center text-muted">
      {children}
    </main>
  )
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-sand-200 bg-white px-3 py-1 font-semibold text-ink">
      {children}
    </span>
  )
}
