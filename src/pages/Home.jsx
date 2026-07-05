import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          Datchi
        </h1>
        <p className="mt-3 text-neutral-600">
          İlk buluşma için “nereye gidelim?” derdine son. Tercihlerini gir,
          linki gönder, ortak rotanız belirsin.
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate('/create')}
        className="w-full rounded-xl bg-rose-500 px-6 py-4 text-lg font-medium text-white shadow-sm transition hover:bg-rose-600 active:scale-[0.99]"
      >
        Date oturumu başlat
      </button>

      <p className="text-xs text-neutral-400">
        Hesap yok · 24 saat sonra silinir · Ücretsiz
      </p>
    </main>
  )
}
