// Paylaşılabilir Date Kartı — CLAUDE.md §8 (büyüme motoru, birinci sınıf özellik)
// Markalı, screenshot'lanabilir, Instagram story oranında (9:16) bir kart.
// html-to-image ile PNG olarak indirilebilir.
import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { activityLabel } from '../data/activities.js'

const BUDGET_LABEL = { 1: '₺', 2: '₺₺', 3: '₺₺₺' }

export default function DateCard({ result }) {
  const cardRef = useRef(null)
  const [busy, setBusy] = useState(false)

  const { template, venue, sharedPref } = result

  async function download() {
    if (!cardRef.current) return
    setBusy(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2, // net, retina kalite
        cacheBust: true,
      })
      const link = document.createElement('a')
      link.download = 'datchi-date.png'
      link.href = dataUrl
      link.click()
    } catch (e) {
      console.error('Kart indirilemedi:', e)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Kartın kendisi — dışa aktarılan düğüm */}
      <div
        ref={cardRef}
        className="relative flex h-[560px] w-[315px] flex-col overflow-hidden rounded-[28px] p-7 text-white"
        style={{
          background:
            'linear-gradient(160deg, #f43f5e 0%, #e11d48 45%, #9f1239 100%)',
        }}
      >
        {/* Marka */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">💘</span>
          <span className="text-lg font-semibold tracking-tight">Datchi</span>
        </div>

        <p className="mt-8 text-sm font-medium uppercase tracking-widest text-white/70">
          İlk buluşma rotamız
        </p>

        <h2 className="mt-2 text-[34px] font-bold leading-[1.05] tracking-tight">
          {template.title}
        </h2>

        <p className="mt-4 text-[15px] leading-snug text-white/85">
          {template.copy}
        </p>

        {/* Mekân */}
        {venue && (
          <div className="mt-6 rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wide text-white/60">
              Mekân
            </p>
            <p className="mt-1 text-base font-semibold">📍 {venue.name}</p>
          </div>
        )}

        {/* Ortak tercih rozetleri */}
        {sharedPref && (
          <div className="mt-4 flex flex-wrap gap-2">
            <CardChip>{BUDGET_LABEL[sharedPref.budget]}</CardChip>
            {sharedPref.energy && <CardChip>{sharedPref.energy}</CardChip>}
            {sharedPref.timeOfDay && <CardChip>{sharedPref.timeOfDay}</CardChip>}
            {sharedPref.activities?.slice(0, 2).map((a) => (
              <CardChip key={a}>{activityLabel(a)}</CardChip>
            ))}
          </div>
        )}

        {/* Alt bilgi — büyüme için domain */}
        <p className="mt-auto pt-6 text-center text-sm font-medium text-white/70">
          datchi.app
        </p>
      </div>

      <button
        type="button"
        onClick={download}
        disabled={busy}
        className="w-full max-w-[315px] rounded-xl bg-neutral-900 px-6 py-3 font-medium text-white transition hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-60"
      >
        {busy ? 'Hazırlanıyor…' : '📸 Kartı indir & paylaş'}
      </button>
    </div>
  )
}

function CardChip({ children }) {
  return (
    <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
      {children}
    </span>
  )
}
