// Ortak tercih formu — CLAUDE.md §6.1 (Answer) — iki taraf da bunu doldurur.
// Firebase'den bağımsız: onSubmit(answer) ile toplanan Answer'ı dışarı verir.
import { useState } from 'react'
import { motion } from 'motion/react'
import { MapPin, Loader2, Plus, Check } from 'lucide-react'
import { ACTIVITIES } from '../data/activities.js'
import { ACTIVITY_ICON, ENERGY_ICON, TIME_ICON } from '../data/icons.jsx'

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

// Seçili duruma göre pill stili — seçilmeyen "krem", seçili "coral"
function pill(active) {
  return [
    'flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition-colors',
    active
      ? 'border-brand-400 bg-brand-50 text-brand-700 shadow-[0_4px_14px_-6px_rgba(255,77,109,0.5)]'
      : 'border-sand-200 bg-sand-100/70 text-ink hover:border-brand-200 hover:bg-white',
  ].join(' ')
}

// Sırayla belirme (stagger) için motion varyantları
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

// Tıklanınca hafif "zıpla"
const tap = { scale: 0.95 }

export default function PreferenceForm({
  submitLabel = 'Gönder',
  nameLabel,
  namePlaceholder = 'Adın',
  onSubmit,
}) {
  const [name, setName] = useState('')
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
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocState('idle')
      },
      () => setLocState('error'),
      { enableHighAccuracy: false, timeout: 10000 },
    )
  }

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
    onSubmit({
      name: name.trim() || null,
      answer: { budget, activities, energy, timeOfDay, location, joker },
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
      {/* İsim (opsiyonel) — sadece nameLabel verilirse */}
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
        <Legend>Bütçe</Legend>
        <div className="grid grid-cols-3 gap-2.5">
          {BUDGETS.map((b) => (
            <motion.button
              key={b.value}
              type="button"
              whileTap={tap}
              onClick={() => setBudget(b.value)}
              className={pill(budget === b.value) + ' flex-col !gap-0.5 py-3.5'}
            >
              <span className="text-base">{b.label}</span>
              <span className="text-xs font-semibold text-muted">{b.hint}</span>
            </motion.button>
          ))}
        </div>
      </motion.fieldset>

      {/* Aktiviteler (çoklu) */}
      <motion.fieldset variants={item}>
        <Legend hint="(birden fazla)">Ne yapmak istersin?</Legend>
        <div className="flex flex-wrap gap-2.5">
          {ACTIVITIES.map((a) => {
            const Icon = ACTIVITY_ICON[a.id]
            const active = activities.includes(a.id)
            return (
              <motion.button
                key={a.id}
                type="button"
                whileTap={tap}
                onClick={() => toggleActivity(a.id)}
                className={pill(active)}
              >
                {Icon && <Icon size={16} strokeWidth={2.2} />}
                {a.label}
              </motion.button>
            )
          })}
        </div>
      </motion.fieldset>

      {/* Enerji */}
      <motion.fieldset variants={item}>
        <Legend>Enerji</Legend>
        <div className="grid grid-cols-2 gap-2.5">
          {ENERGY.map((e) => {
            const Icon = ENERGY_ICON[e.value]
            return (
              <motion.button
                key={e.value}
                type="button"
                whileTap={tap}
                onClick={() => setEnergy(e.value)}
                className={pill(energy === e.value)}
              >
                <Icon size={16} strokeWidth={2.2} />
                {e.label}
              </motion.button>
            )
          })}
        </div>
      </motion.fieldset>

      {/* Zaman */}
      <motion.fieldset variants={item}>
        <Legend>Ne zaman?</Legend>
        <div className="grid grid-cols-2 gap-2.5">
          {TIME_OF_DAY.map((t) => {
            const Icon = TIME_ICON[t.value]
            return (
              <motion.button
                key={t.value}
                type="button"
                whileTap={tap}
                onClick={() => setTimeOfDay(t.value)}
                className={pill(timeOfDay === t.value)}
              >
                <Icon size={16} strokeWidth={2.2} />
                {t.label}
              </motion.button>
            )
          })}
        </div>
      </motion.fieldset>

      {/* Konum */}
      <motion.fieldset variants={item}>
        <Legend>Konum</Legend>
        <motion.button
          type="button"
          whileTap={tap}
          onClick={requestLocation}
          className={pill(location !== null) + ' w-full py-4'}
        >
          {locState === 'loading' ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Konum alınıyor…
            </>
          ) : location ? (
            <>
              <Check size={16} strokeWidth={2.5} /> Konum alındı
            </>
          ) : (
            <>
              <MapPin size={16} strokeWidth={2.2} /> Konumumu kullan
            </>
          )}
        </motion.button>
        {locState === 'error' && (
          <p className="mt-2 text-xs font-semibold text-brand-500">
            Konuma erişilemedi. Tarayıcı iznini kontrol et.
          </p>
        )}
        <p className="mt-2 text-xs text-muted">
          Konumun sadece orta noktayı bulmak için kullanılır, kaydedilmez.
        </p>
      </motion.fieldset>

      {/* Joker (opsiyonel) */}
      <motion.fieldset variants={item}>
        {!jokerOpen ? (
          <button
            type="button"
            onClick={() => setJokerOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            <Plus size={16} strokeWidth={2.5} /> Joker soru ekle (opsiyonel)
          </button>
        ) : (
          <div className="flex flex-col gap-2.5">
            <Legend hint="(sadece eğlence, sonucu etkilemez)">Joker</Legend>
            <input
              value={jokerQ}
              onChange={(e) => setJokerQ(e.target.value)}
              placeholder="Soru: Ananaslı pizza?"
              className="rounded-2xl border border-sand-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400"
            />
            <input
              value={jokerA}
              onChange={(e) => setJokerA(e.target.value)}
              placeholder="Senin cevabın: Evet"
              className="rounded-2xl border border-sand-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400"
            />
          </div>
        )}
      </motion.fieldset>

      <motion.button
        variants={item}
        type="submit"
        disabled={!isValid}
        whileTap={isValid ? { scale: 0.98 } : undefined}
        className="mt-1 w-full rounded-full bg-brand-500 px-6 py-4 text-lg font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-sand-300 disabled:text-muted disabled:shadow-none"
      >
        {submitLabel}
      </motion.button>
      {!isValid && (
        <p className="-mt-3 text-center text-xs text-muted">
          Bütçe, en az bir aktivite, enerji, zaman ve konum gerekli.
        </p>
      )}
    </motion.form>
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
