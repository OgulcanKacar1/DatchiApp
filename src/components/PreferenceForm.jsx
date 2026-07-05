// Ortak tercih formu — CLAUDE.md §6.1 (Answer) — iki taraf da bunu doldurur.
// Firebase'den bağımsız: onSubmit(answer) ile toplanan Answer'ı dışarı verir.
import { useState } from 'react'
import { ACTIVITIES } from '../data/activities.js'

const BUDGETS = [
  { value: 1, label: '₺', hint: 'Uygun' },
  { value: 2, label: '₺₺', hint: 'Orta' },
  { value: 3, label: '₺₺₺', hint: 'Şık' },
]

const ENERGY = [
  { value: 'sakin', label: 'Sakin', emoji: '🌙' },
  { value: 'hareketli', label: 'Hareketli', emoji: '⚡' },
]

const TIME_OF_DAY = [
  { value: 'gündüz', label: 'Gündüz', emoji: '☀️' },
  { value: 'akşam', label: 'Akşam', emoji: '🌆' },
]

// Küçük yardımcı: seçili duruma göre buton stilini üretir
function pill(active) {
  return [
    'rounded-xl border px-4 py-3 text-sm font-medium transition active:scale-[0.98]',
    active
      ? 'border-rose-500 bg-rose-50 text-rose-700'
      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300',
  ].join(' ')
}

export default function PreferenceForm({ submitLabel = 'Gönder', onSubmit }) {
  const [budget, setBudget] = useState(null)
  const [activities, setActivities] = useState([])
  const [energy, setEnergy] = useState(null)
  const [timeOfDay, setTimeOfDay] = useState(null)
  const [location, setLocation] = useState(null) // { lat, lng }
  const [locState, setLocState] = useState('idle') // idle | loading | error
  const [jokerOpen, setJokerOpen] = useState(false)
  const [jokerQ, setJokerQ] = useState('')
  const [jokerA, setJokerA] = useState('')

  function toggleActivity(id) {
    setActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    )
  }

  function requestLocation() {
    if (!('geolocation' in navigator)) {
      setLocState('error')
      return
    }
    setLocState('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        setLocState('idle')
      },
      () => setLocState('error'),
      { enableHighAccuracy: false, timeout: 10000 },
    )
  }

  // Zorunlu alanlar dolmadan gönderime izin verme
  const isValid =
    budget !== null &&
    activities.length > 0 &&
    energy !== null &&
    timeOfDay !== null &&
    location !== null

  function handleSubmit(e) {
    e.preventDefault()
    if (!isValid) return
    const joker =
      jokerOpen && jokerQ.trim() && jokerA.trim()
        ? { question: jokerQ.trim(), answer: jokerA.trim() }
        : null
    onSubmit({ budget, activities, energy, timeOfDay, location, joker })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      {/* Bütçe */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-neutral-900">
          Bütçe
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {BUDGETS.map((b) => (
            <button
              key={b.value}
              type="button"
              onClick={() => setBudget(b.value)}
              className={pill(budget === b.value)}
            >
              <span className="block text-base">{b.label}</span>
              <span className="mt-0.5 block text-xs text-neutral-400">
                {b.hint}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Aktiviteler (çoklu) */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-neutral-900">
          Ne yapmak istersin?{' '}
          <span className="font-normal text-neutral-400">(birden fazla)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {ACTIVITIES.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => toggleActivity(a.id)}
              className={pill(activities.includes(a.id))}
            >
              <span className="mr-1">{a.emoji}</span>
              {a.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Enerji */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-neutral-900">
          Enerji
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {ENERGY.map((e) => (
            <button
              key={e.value}
              type="button"
              onClick={() => setEnergy(e.value)}
              className={pill(energy === e.value)}
            >
              <span className="mr-1">{e.emoji}</span>
              {e.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Zaman */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-neutral-900">
          Ne zaman?
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {TIME_OF_DAY.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTimeOfDay(t.value)}
              className={pill(timeOfDay === t.value)}
            >
              <span className="mr-1">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Konum */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-neutral-900">
          Konum
        </legend>
        <button
          type="button"
          onClick={requestLocation}
          className={pill(location !== null) + ' w-full'}
        >
          {locState === 'loading'
            ? 'Konum alınıyor…'
            : location
              ? '📍 Konum alındı'
              : '📍 Konumumu kullan'}
        </button>
        {locState === 'error' && (
          <p className="mt-2 text-xs text-rose-500">
            Konuma erişilemedi. Tarayıcı iznini kontrol et.
          </p>
        )}
        <p className="mt-2 text-xs text-neutral-400">
          Konumun sadece orta noktayı bulmak için kullanılır, kaydedilmez.
        </p>
      </fieldset>

      {/* Joker (opsiyonel) */}
      <fieldset>
        {!jokerOpen ? (
          <button
            type="button"
            onClick={() => setJokerOpen(true)}
            className="text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            + Joker soru ekle (opsiyonel)
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <legend className="text-sm font-semibold text-neutral-900">
              Joker{' '}
              <span className="font-normal text-neutral-400">
                (sadece eğlence, sonucu etkilemez)
              </span>
            </legend>
            <input
              value={jokerQ}
              onChange={(e) => setJokerQ(e.target.value)}
              placeholder="Soru: Ananaslı pizza?"
              className="rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-rose-400"
            />
            <input
              value={jokerA}
              onChange={(e) => setJokerA(e.target.value)}
              placeholder="Senin cevabın: Evet 🍍"
              className="rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-rose-400"
            />
          </div>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={!isValid}
        className="mt-2 w-full rounded-xl bg-rose-500 px-6 py-4 text-lg font-medium text-white shadow-sm transition hover:bg-rose-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {submitLabel}
      </button>
      {!isValid && (
        <p className="-mt-4 text-center text-xs text-neutral-400">
          Bütçe, en az bir aktivite, enerji, zaman ve konum gerekli.
        </p>
      )}
    </form>
  )
}
