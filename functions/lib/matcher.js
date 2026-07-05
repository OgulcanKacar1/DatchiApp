// Eşleştirme algoritması — CLAUDE.md §7 (LLM YOK, saf fonksiyon)
// İki Answer'ı ortak tercihe indirger, şablonları puanlar, en iyi 2-3'ten seçer.
// Firebase'e bağımlı DEĞİL → node ile doğrudan test edilebilir.

// İki cevabı tek ortak tercihe indir — §7.1
export function reduceToShared(a, b) {
  // budget → MIN: kimseyi bütçesini aşan yere sürükleme
  const budget = Math.min(a.budget, b.budget)

  // activities → önce KESİŞİM; boşsa BİRLEŞİM'e düş
  const setA = new Set(a.activities)
  const intersection = b.activities.filter((x) => setA.has(x))
  const union = [...new Set([...a.activities, ...b.activities])]
  const activities = intersection.length > 0 ? intersection : union
  const activitiesMode = intersection.length > 0 ? 'intersection' : 'union'

  // energy → aynıysa o değer, farklıysa null (nötr; şablon bonusu almaz)
  const energy = a.energy === b.energy ? a.energy : null

  // timeOfDay → aynıysa o değer, farklıysa null (bonus yok)
  const timeOfDay = a.timeOfDay === b.timeOfDay ? a.timeOfDay : null

  return { budget, activities, activitiesMode, energy, timeOfDay }
}

// Tek şablonu ortak tercihe göre puanla — §7.2
// Bütçe aşılıyorsa ele (null döner = uygun değil).
export function scoreTemplate(template, shared) {
  if (template.minBudget > shared.budget) return null // ele

  const tmplActs = new Set(template.activities)
  const overlap = shared.activities.filter((x) => tmplActs.has(x)).length

  let score = 0
  score += 3 * overlap
  score += shared.energy && template.energy === shared.energy ? 2 : 0
  score +=
    shared.timeOfDay && template.timeOfDay.includes(shared.timeOfDay) ? 1 : 0

  return score
}

// En yüksek skorlu 2-3 şablondan rastgele birini seç — §7.2
// (Aynı girdiler her seferinde birebir aynı sonucu vermesin diye.)
export function pickTemplate(templates, shared, rng = Math.random) {
  const scored = templates
    .map((t) => ({ template: t, score: scoreTemplate(t, shared) }))
    .filter((x) => x.score !== null && x.score > 0)
    .sort((x, y) => y.score - x.score)

  if (scored.length === 0) return null

  // En yüksek skoru paylaşanları da dahil ederek ilk 3'lük havuzu al
  const pool = scored.slice(0, 3)
  const idx = Math.floor(rng() * pool.length)
  return { ...pool[idx], candidates: scored }
}

// Uçtan uca: iki cevaptan seçilmiş şablon + ortak tercih
export function matchTemplate(creatorAnswers, guestAnswers, templates, rng) {
  const shared = reduceToShared(creatorAnswers, guestAnswers)
  const picked = pickTemplate(templates, shared, rng)
  return { shared, picked }
}
