import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Heart, PencilLine, Link2, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui.jsx'

const STEPS = [
  { Icon: PencilLine, label: 'Tercihini gir' },
  { Icon: Link2, label: 'Linki gönder' },
  { Icon: Sparkles, label: 'Rota belirsin' },
]

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className="relative mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-8 overflow-hidden px-6 py-12 text-center">
      {/* Sıcak arka plan derinliği */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-brand-100/50 blur-3xl" />

      {/* Marka işareti */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        className="flex items-center gap-2"
      >
        <span className="float-slow inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-[var(--shadow-soft)]">
          <Heart size={18} fill="currentColor" strokeWidth={0} />
        </span>
        <span className="font-display text-2xl font-semibold text-ink">
          Datchi
        </span>
      </motion.div>

      {/* Hero */}
      <motion.div variants={fade} custom={1} initial="hidden" animate="show">
        <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          İlk buluşma,
          <br />
          <span className="text-brand-500">karar yormadan.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-[15px] leading-relaxed text-muted">
          “Nereye gidelim?” derdine son. İkiniz tercihlerinizi girin, ortak date
          rotanız birlikte belirsin.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        variants={fade}
        custom={2}
        initial="hidden"
        animate="show"
        className="flex w-full flex-col items-center gap-3"
      >
        <Button
          className="group w-full text-lg"
          onClick={() => navigate('/create')}
        >
          Date oturumu başlat
          <ArrowRight
            size={20}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Button>
        <p className="text-xs font-semibold text-muted">
          Hesap yok · 24 saatte silinir · Ücretsiz
        </p>
      </motion.div>

      {/* 3 adım */}
      <motion.div
        variants={fade}
        custom={3}
        initial="hidden"
        animate="show"
        className="grid w-full grid-cols-3 gap-3"
      >
        {STEPS.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-2 rounded-2xl border border-sand-200 bg-white/70 px-2 py-4 backdrop-blur-sm"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <s.Icon size={18} strokeWidth={2.2} />
            </span>
            <span className="text-xs font-bold text-muted">{s.label}</span>
          </div>
        ))}
      </motion.div>
    </main>
  )
}
