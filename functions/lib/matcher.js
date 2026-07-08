// Eşleştirme algoritması — CLAUDE.md §7 (LLM YOK, saf fonksiyon)
// İki Answer'ı ortak tercihe indirger, şablonları puanlar, en iyi 2-3'ten seçer.
// Firebase'e bağımlı DEĞİL → node ile doğrudan test edilebilir.

// "Farketmez" (wildcard) desteği: bir alan null/boş ise o taraf esnektir,
// tercihi olan tarafa bırakılır. İkisi de esnekse alan nötrleşir.

// İki tek-değerli tercihi birleştir (energy, timeOfDay):
//  - ikisi de boş → null (nötr)
//  - biri boş → diğeri (tercihi olana bırak)
//  - ikisi dolu → aynıysa o, farklıysa null
function mergeSingle(x, y) {
  const vals = [x, y].filter(Boolean)
  if (vals.length === 0) return null
  if (vals.length === 1) return vals[0]
  return x === y ? x : null
}

// İki cevabı tek ortak tercihe indir — §7.1 (+ farketmez)
export function reduceToShared(a, b) {
  // budget → tercihi olanların MIN'i. İkisi de farketmezse orta (2) varsayılan.
  const budgets = [a.budget, b.budget].filter((v) => v != null)
  const budget = budgets.length === 0 ? 2 : Math.min(...budgets)

  // activities → farketmez (boş) olan taraf karışmaz; tercihi olana bırakılır.
  const aReal = Array.isArray(a.activities) && a.activities.length > 0
  const bReal = Array.isArray(b.activities) && b.activities.length > 0
  let activities
  let activitiesMode
  if (aReal && bReal) {
    const setA = new Set(a.activities)
    const intersection = b.activities.filter((x) => setA.has(x))
    if (intersection.length > 0) {
      activities = intersection
      activitiesMode = 'intersection'
    } else {
      activities = [...new Set([...a.activities, ...b.activities])]
      activitiesMode = 'union'
    }
  } else if (aReal) {
    activities = [...a.activities]
    activitiesMode = 'intersection' // tek taraf seçti, ona bırak
  } else if (bReal) {
    activities = [...b.activities]
    activitiesMode = 'intersection'
  } else {
    activities = [] // ikisi de farketmez → aktivite skorlamaya girmez
    activitiesMode = 'any'
  }

  return {
    budget,
    activities,
    activitiesMode,
    energy: mergeSingle(a.energy, b.energy),
    timeOfDay: mergeSingle(a.timeOfDay, b.timeOfDay),
  }
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
  // score null = bütçe elemesi (uygun değil). 0 dahil edilir: ikisi de "farketmez"
  // ise her şey 0 olur ama yine de bütçeye uygun bir öneri dönmeli (boş kalmasın).
  const scored = templates
    .map((t) => ({ template: t, score: scoreTemplate(t, shared) }))
    .filter((x) => x.score !== null)
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
