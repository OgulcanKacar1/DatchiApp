// Joker reveal — CLAUDE.md §7.4
// İki tarafın joker cevabını YAN YANA gösterir. Puanlamaya girmez, sadece eğlence.
// jokerReveal: { creator: {question, answer}|null, guest: {question, answer}|null }

export default function JokerReveal({ jokerReveal }) {
  if (!jokerReveal) return null
  const { creator, guest } = jokerReveal

  // Soru ikisinden hangisi doluysa ondan alınır (genelde creator sorar)
  const question = creator?.question ?? guest?.question
  if (!question) return null

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Joker
      </p>
      <p className="mt-1 font-medium text-ink">{question}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-brand-50 p-3 text-center">
          <p className="text-xs text-rose-400">Sen</p>
          <p className="mt-1 font-semibold text-brand-700">
            {creator?.answer ?? '—'}
          </p>
        </div>
        <div className="rounded-xl bg-indigo-50 p-3 text-center">
          <p className="text-xs text-indigo-400">O</p>
          <p className="mt-1 font-semibold text-indigo-700">
            {guest?.answer ?? '—'}
          </p>
        </div>
      </div>
    </div>
  )
}
