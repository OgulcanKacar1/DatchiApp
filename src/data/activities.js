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
]

// Doğrulama / eşleştirme için sadece id listesi
export const ACTIVITY_IDS = ACTIVITIES.map((a) => a.id)
