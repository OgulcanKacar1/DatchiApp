# Datchi — Yol Haritası & Checklist

Bu dosya ilerlemenin tek takip noktasıdır. Her adım bittiğinde işaretlenir.
Kararların gerekçesi ve mimari kurallar için → [CLAUDE.md](./CLAUDE.md).

Durum: `[ ]` yapılacak · `[~]` devam ediyor · `[x]` bitti

---

## 0. Kurulum & Altyapı
- [x] Vite + React 19 + Tailwind v4 iskelesi
- [x] react-router-dom rotaları (`/`, `/create`, `/s/:id`, `/s/:id/result`)
- [x] Sabit veri katmanı (`activities.js`, `dateTemplates.js` — 18 şablon)
- [x] Ortak `PreferenceForm` (§6.1 Answer) + Create/Join'e bağlama
- [x] GitHub reposu bağla, main'i push et
- [x] Branch akışına geç (feature branch'lerle ilerle)

## 1. Firebase Entegrasyon Katmanı  ← ŞU AN
Branch: `feat/firebase-integration`
- [x] `.env.example` + `.gitignore`'a `.env` (secret repoya girmez, §5)
- [x] `lib/firebase.js` — client init (config env'den okunur)
- [x] `lib/session.js` — `createSession(creatorAnswers)` → sessionId + magic link
- [x] `lib/session.js` — `submitGuestAnswers(sessionId, guestAnswers)`
- [x] `hooks/useSession.js` — Firestore real-time listener
- [x] Create akışı: form → oturum oluştur → `status: "waiting"` → link göster
- [x] Join akışı: sessionId doğrula → guestAnswers yaz
- [x] Firebase projesi oluştur + config'i `.env`'e koy (KULLANICI) — `datchiapp`, europe-west3
- [x] Uçtan uca test: Create→link→Join→Firestore'da iki cevap + waiting doğrulandı

## 2. Eşleştirme Motoru (Cloud Functions, LLM YOK)
Branch: `feat/matcher`
- [x] `functions/` init (ESM paket, firebase.json, .firebaserc)
- [x] `functions/lib/matcher.js` — iki Answer'ı ortak tercihe indir (§7.1)
- [x] Şablon puanlama + ilk 2-3'ten rastgele seçim (§7.2)
- [x] `functions/lib/places.js` — sağlayıcı-bağımsız `findVenue()` arayüzü (§7.3)
- [x] `functions/providers/` — stub (anahtarsız test) + Foursquare adaptörü
- [x] Orta nokta hesabı + yarıçap genişletme mantığı (§7.3 tuzağı)
- [x] `matchDate` trigger: iki cevap gelince `result` yaz, `status: "ready"`
- [x] Matcher + places birim testleri (10/10 geçiyor, Firebase'siz)
- [x] Yerel emülatör kurulumu (VITE_USE_EMULATOR) — Blaze'siz tam akış testi
- [x] Emülatörle uçtan uca test: waiting → ready + doğru şablon doğrulandı ✓
- [ ] Places sağlayıcı seç + API anahtarı (KULLANICI, deploy anında)
- [ ] Blaze'e geç + deploy (KULLANICI, canlıya çıkarken)

## 3. Real-time Reveal
Branch: `feat/reveal`
- [ ] `Result.jsx` — `useSession` ile `status: "ready"` olunca sonucu göster
- [ ] Bekleme ekranı: A tarafına "cevap bekleniyor" + linki tekrar gönder (§ risk 1)
- [ ] `JokerReveal.jsx` — iki tarafın joker cevabını yan yana göster (§7.4)
- [ ] Reveal animasyonu / "büyü anı"

## 4. Büyüme: Paylaşılabilir Date Kartı
Branch: `feat/date-card`
- [ ] `DateCard.jsx` — markalı, screenshot'lanabilir kart (§8)
- [ ] Görsel indir / paylaş (html-to-image veya canvas)
- [ ] Küçük Datchi logosu + Instagram story oranı

## 5. Sertleştirme & Deploy
Branch: `feat/hardening`
- [ ] `firestore.rules` — sadece ilgili taraflar yazar, `result` client'a kapalı (§5)
- [ ] TTL policy — `expireAt` alanına 24s otomatik silme (§2, §6.3)
- [ ] reCAPTCHA (görünmez) + rate limiting (§5)
- [ ] `firebase.json` + Hosting deploy
- [ ] Domain `datchi.app` bağla (opsiyonel, sonra)
- [ ] SEO/meta kontrolü ("Datchi" tek başına kalmasın, §3)

---

### Çalışma düzeni
- Her bölüm kendi feature branch'inde → `main`'e PR/merge.
- `main` her zaman build alabilir durumda kalır.
- Secret'lar asla commit edilmez (`.env`, API anahtarları).
