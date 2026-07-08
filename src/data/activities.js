// Sabit aktivite havuzu — CLAUDE.md §6.2
// Bu havuz SABİTTİR. Matris eşleştirme (functions/lib/matcher.js) buna dayanır
// ve kullanıcıyı yormamak için kısa tutulur. Etiket eklersen/çıkarırsan
// dateTemplates.js içindeki `activities` alanlarını da güncellemen gerekir.

export const ACTIVITIES = [
  { id: 'kahve', label: 'Kahve', emoji: '☕' },
  { id: 'yemek', label: 'Yemek', emoji: '🍽️' },
  { id: 'tatli', label: 'Tatlı', emoji: '🍰' },
  { id: 'bar', label: 'Bar / Kokteyl', emoji: '🍸' },
  { id: 'yuruyus', label: 'Yürüyüş', emoji: '🚶' },
  { id: 'aktivite', label: 'Aktivite / Oyun', emoji: '🎯' },
  { id: 'kultur', label: 'Kültür-Sanat', emoji: '🎭' },
  { id: 'sinema', label: 'Sinema', emoji: '🎬' },
  { id: 'spor', label: 'Spor', emoji: '🚴' },
  { id: 'alisveris', label: 'Alışveriş', emoji: '🛍️' },
]

// Doğrulama / eşleştirme için sadece id listesi
export const ACTIVITY_IDS = ACTIVITIES.map((a) => a.id)

// id → { label, emoji } hızlı erişim (reveal ekranı için)
export const ACTIVITY_BY_ID = Object.fromEntries(
  ACTIVITIES.map((a) => [a.id, a]),
)

// "kahve" → "☕ Kahve" gibi etiket üret (bilinmeyen id kendini döner)
export function activityLabel(id) {
  const a = ACTIVITY_BY_ID[id]
  return a ? `${a.emoji} ${a.label}` : id
}
