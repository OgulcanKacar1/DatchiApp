// Ortak tercih formu — CLAUDE.md §6.1 (Answer) — iki taraf da bunu doldurur.
// Firebase'den bağımsız: onSubmit({name, answer}) ile toplanan Answer'ı dışarı verir.
// "Farketmez" desteği: bütçe/enerji/zaman/aktivite boş bırakılabilir (null/[]);
// matcher bunları wildcard sayar (tercihi olan tarafa bırakır). Sadece konum zorunlu.
import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { MapPin, Loader2, Plus, Check, Search, Navigation } from 'lucide-react'
import { ACTIVITIES } from '../data/activities.js'
import { ACTIVITY_ICON, ENERGY_ICON, TIME_ICON } from '../data/icons.jsx'
import { searchPlaces } from '../lib/geocode.js'

const BUDGETS = [
  { value: 1, label: '₺', hint: 'Uygun' },
  { value: 2, label: '₺₺', hint: 'Orta' },
  { value: 3, label: '₺₺₺', hint: 'Şık' },
]
const ENERGY = [
  { value: 'sakin', label: 'Sakin' },
  { value: 'hareketli', label: 'Hareketli' },
]
const TIME_OF_DAY = [
  { value: 'gündüz', label: 'Gündüz' },
  { value: 'akşam', label: 'Akşam' },
]

function pill(active) {
  return [
    'flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition-colors',
    active
      ? 'border-brand-400 bg-brand-50 text-brand-700 shadow-[0_4px_14px_-6px_rgba(255,77,109,0.5)]'
      : 'border-sand-200 bg-sand-100/70 text-ink hover:border-brand-200 hover:bg-white',
  ].join(' ')
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } }
const tap = { scale: 0.95 }

export default function PreferenceForm({
  submitLabel = 'Gönder',
  nameLabel,
  namePlaceholder = 'Adın',
  onSubmit,
}) {
  const [name, setName] = useState('')
  const [budget, setBudget] = useState(null) // 1|2|3|'any'|null
  const [activities, setActivities] = useState([])
  const [energy, setEnergy] = useState(null) // '...'|'any'|null
  const [timeOfDay, setTimeOfDay] = useState(null)
  const [location, setLocation] = useState(null) // { lat, lng }
  const [locLabel, setLocLabel] = useState(null)
  const [jokerOpen, setJokerOpen] = useState(false)
  const [jokerQ, setJokerQ] = useState('')
  const [jokerA, setJokerA] = useState('')

  function toggleActivity(id) {
    setActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    )
  }

  // "Farketmez" bütçe/enerji/zaman → 'any' sentinel'i null'a çevir
  const clean = (v) => (v === 'any' ? null : v)

  const isValid = location !== null // yalnızca konum zorunlu

  function handleSubmit(e) {
    e.preventDefault()
    if (!isValid) return
    const joker =
      jokerOpen && jokerQ.trim() && jokerA.trim()
        ? { question: jokerQ.trim(), answer: jokerA.trim() }
        : null
    onSubmit({
      name: name.trim() || null,
      answer: {
        budget: clean(budget),
        activities, // boş = farketmez
        energy: clean(energy),
        timeOfDay: clean(timeOfDay),
        location,
        joker,
      },
    })
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {nameLabel && (
        <motion.fieldset variants={item}>
          <Legend hint="(opsiyonel)">{nameLabel}</Legend>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            placeholder={namePlaceholder}
            className="w-full rounded-2xl border border-sand-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400"
          />
        </motion.fieldset>
      )}

      {/* Bütçe */}
      <motion.fieldset variants={item}>
        <Legend hint="(farketmezse boş bırak)">Bütçe</Legend>
        <div className="grid grid-cols-3 gap-2.5">
          {BUDGETS.map((b) => (
            <motion.button key={b.value} type="button" whileTap={tap}
              onClick={() => setBudget(budget === b.value ? null : b.value)}
              className={pill(budget === b.value) + ' flex-col !gap-0.5 py-3.5'}>
              <span className="text-base">{b.label}</span>
              <span className="text-xs font-semibold text-muted">{b.hint}</span>
            </motion.button>
          ))}
        </div>
        <Farketmez active={budget === 'any'} onClick={() => setBudget(budget === 'any' ? null : 'any')} />
      </motion.fieldset>

      {/* Aktiviteler (çoklu, opsiyonel) */}
      <motion.fieldset variants={item}>
        <Legend hint="(birden fazla · boş = farketmez)">Ne yapmak istersin?</Legend>
        <div className="flex flex-wrap gap-2.5">
          {ACTIVITIES.map((a) => {
            const Icon = ACTIVITY_ICON[a.id]
            const active = activities.includes(a.id)
            return (
              <motion.button key={a.id} type="button" whileTap={tap}
                onClick={() => toggleActivity(a.id)} className={pill(active)}>
                {Icon && <Icon size={16} strokeWidth={2.2} />}
                {a.label}
              </motion.button>
            )
          })}
          <motion.button type="button" whileTap={tap}
            onClick={() => setActivities([])}
            className={pill(activities.length === 0)}>
            Farketmez
          </motion.button>
        </div>
      </motion.fieldset>

      {/* Enerji */}
      <motion.fieldset variants={item}>
        <Legend hint="(farketmezse boş bırak)">Enerji</Legend>
        <div className="grid grid-cols-2 gap-2.5">
          {ENERGY.map((e) => {
            const Icon = ENERGY_ICON[e.value]
            return (
              <motion.button key={e.value} type="button" whileTap={tap}
                onClick={() => setEnergy(energy === e.value ? null : e.value)}
                className={pill(energy === e.value)}>
                <Icon size={16} strokeWidth={2.2} /> {e.label}
              </motion.button>
            )
          })}
        </div>
        <Farketmez active={energy === 'any'} onClick={() => setEnergy(energy === 'any' ? null : 'any')} />
      </motion.fieldset>

      {/* Zaman */}
      <motion.fieldset variants={item}>
        <Legend hint="(farketmezse boş bırak)">Ne zaman?</Legend>
        <div className="grid grid-cols-2 gap-2.5">
          {TIME_OF_DAY.map((t) => {
            const Icon = TIME_ICON[t.value]
            return (
              <motion.button key={t.value} type="button" whileTap={tap}
                onClick={() => setTimeOfDay(timeOfDay === t.value ? null : t.value)}
                className={pill(timeOfDay === t.value)}>
                <Icon size={16} strokeWidth={2.2} /> {t.label}
              </motion.button>
            )
          })}
        </div>
        <Farketmez active={timeOfDay === 'any'} onClick={() => setTimeOfDay(timeOfDay === 'any' ? null : 'any')} />
      </motion.fieldset>

      {/* Konum (zorunlu) — GPS veya semt/mekân araması */}
      <motion.fieldset variants={item}>
        <Legend>Konum</Legend>
        <LocationPicker
          location={location}
          label={locLabel}
          onPick={(loc, label) => {
            setLocation(loc)
            setLocLabel(label)
          }}
        />
      </motion.fieldset>

      {/* Joker (opsiyonel) */}
      <motion.fieldset variants={item}>
        {!jokerOpen ? (
          <button type="button" onClick={() => setJokerOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700">
            <Plus size={16} strokeWidth={2.5} /> Joker soru ekle (opsiyonel)
          </button>
        ) : (
          <div className="flex flex-col gap-2.5">
            <Legend hint="(sadece eğlence, sonucu etkilemez)">Joker</Legend>
            <input value={jokerQ} onChange={(e) => setJokerQ(e.target.value)}
              placeholder="Soru: Ananaslı pizza?"
              className="rounded-2xl border border-sand-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400" />
            <input value={jokerA} onChange={(e) => setJokerA(e.target.value)}
              placeholder="Senin cevabın: Evet"
              className="rounded-2xl border border-sand-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400" />
          </div>
        )}
      </motion.fieldset>

      <motion.button variants={item} type="submit" disabled={!isValid}
        whileTap={isValid ? { scale: 0.98 } : undefined}
        className="mt-1 w-full rounded-full bg-brand-500 px-6 py-4 text-lg font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-sand-300 disabled:text-muted disabled:shadow-none">
        {submitLabel}
      </motion.button>
      {!isValid && (
        <p className="-mt-3 text-center text-xs text-muted">
          Devam etmek için konum gerekli. Diğerlerini boş bırakırsan “farketmez” sayılır.
        </p>
      )}
    </motion.form>
  )
}

// Tam genişlikte "Farketmez" seçeneği (tek-seçimli alanlar için)
function Farketmez({ active, onClick }) {
  return (
    <motion.button type="button" whileTap={tap} onClick={onClick}
      className={pill(active) + ' mt-2.5 w-full !py-2.5 text-xs'}>
      Farketmez
    </motion.button>
  )
}

// Konum seçici — GPS veya Nominatim semt/mekân araması
function LocationPicker({ location, label, onPick }) {
  const [mode, setMode] = useState('choose') // choose | gps | search
  const [gpsState, setGpsState] = useState('idle') // idle | loading | error
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef(null)

  function useGps() {
    if (!('geolocation' in navigator)) return setGpsState('error')
    setGpsState('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onPick({ lat: pos.coords.latitude, lng: pos.coords.longitude }, 'Konumum')
        setGpsState('idle')
      },
      () => setGpsState('error'),
      { enableHighAccuracy: false, timeout: 10000 },
    )
  }

  // Debounced arama
  useEffect(() => {
    if (mode !== 'search') return
    if (query.trim().length < 3) {
      setResults([])
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        setResults(await searchPlaces(query.trim()))
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 450)
    return () => clearTimeout(debounceRef.current)
  }, [query, mode])

  // Seçili konum varsa özet + değiştir
  if (location) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-brand-300 bg-brand-50 px-4 py-3.5">
        <Check size={18} strokeWidth={2.5} className="shrink-0 text-brand-600" />
        <span className="min-w-0 flex-1 truncate text-sm font-bold text-brand-700">
          {label ?? 'Konum seçildi'}
        </span>
        <button type="button"
          onClick={() => { onPick(null, null); setMode('choose'); setQuery(''); setResults([]) }}
          className="shrink-0 text-xs font-bold text-brand-600 underline">
          Değiştir
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        <motion.button type="button" whileTap={tap}
          onClick={() => { setMode('gps'); useGps() }}
          className={pill(mode === 'gps')}>
          {gpsState === 'loading'
            ? <><Loader2 size={16} className="animate-spin" /> Alınıyor…</>
            : <><Navigation size={16} strokeWidth={2.2} /> Konumum</>}
        </motion.button>
        <motion.button type="button" whileTap={tap}
          onClick={() => setMode('search')}
          className={pill(mode === 'search')}>
          <Search size={16} strokeWidth={2.2} /> Semt ara
        </motion.button>
      </div>

      {gpsState === 'error' && (
        <p className="text-xs font-semibold text-brand-500">
          Konuma erişilemedi — “Semt ara” ile de seçebilirsin.
        </p>
      )}

      {mode === 'search' && (
        <div>
          <div className="flex items-center gap-2 rounded-2xl border border-sand-200 bg-white px-3">
            <Search size={16} className="shrink-0 text-muted" />
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Örn. Kadıköy, Beşiktaş, Bağdat Cad."
              className="w-full bg-transparent py-3 text-sm outline-none" />
            {searching && <Loader2 size={15} className="shrink-0 animate-spin text-muted" />}
          </div>
          {results.length > 0 && (
            <ul className="mt-2 overflow-hidden rounded-2xl border border-sand-200 bg-white">
              {results.map((r) => (
                <li key={r.id}>
                  <button type="button"
                    onClick={() => onPick({ lat: r.lat, lng: r.lng }, r.label)}
                    className="flex w-full items-start gap-2 border-b border-sand-100 px-4 py-2.5 text-left text-sm last:border-0 hover:bg-brand-50">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-brand-500" />
                    <span className="text-ink">{r.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <p className="text-xs text-muted">
        Konumun sadece orta noktayı bulmak için kullanılır, kaydedilmez.
      </p>
    </div>
  )
}

function Legend({ children, hint }) {
  return (
    <legend className="mb-2.5 text-sm font-bold text-ink">
      {children}
      {hint && <span className="ml-1 font-medium text-muted">{hint}</span>}
    </legend>
  )
}
