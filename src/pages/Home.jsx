import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui.jsx'

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-8 px-6 py-12 text-center">
      {/* Marka işareti */}
      <div className="flex items-center gap-2">
        <span className="float-slow text-3xl">💌</span>
        <span className="font-display text-2xl font-semibold text-ink">
          Datchi
        </span>
      </div>

      {/* Hero */}
      <div className="reveal" style={{ animationDelay: '60ms' }}>
        <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          İlk buluşma,
          <br />
          <span className="text-brand-500">karar yormadan.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-[15px] leading-relaxed text-muted">
          “Nereye gidelim?” derdine son. İkiniz tercihlerinizi girin, ortak date
          rotanız birlikte belirsin.
        </p>
      </div>

      {/* CTA */}
      <div
        className="reveal flex w-full flex-col items-center gap-3"
        style={{ animationDelay: '140ms' }}
      >
        <Button className="w-full text-lg" onClick={() => navigate('/create')}>
          Date oturumu başlat 💕
        </Button>
        <p className="text-xs font-medium text-muted">
          Hesap yok · 24 saatte silinir · Ücretsiz
        </p>
      </div>

      {/* 3 adım mini anlatım */}
      <div
        className="reveal mt-2 grid w-full grid-cols-3 gap-3"
        style={{ animationDelay: '220ms' }}
      >
        {[
          { icon: '📝', label: 'Tercihini gir' },
          { icon: '🔗', label: 'Linki gönder' },
          { icon: '✨', label: 'Rota belirsin' },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-sand-200 bg-white/60 px-2 py-4"
          >
            <span className="text-2xl">{s.icon}</span>
            <span className="text-xs font-semibold text-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
