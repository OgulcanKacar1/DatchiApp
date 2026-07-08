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
- [x] `Result.jsx` — `useSession` ile `status: "ready"` olunca sonucu göster
- [x] Bekleme ekranı: A tarafına "cevap bekleniyor" (§ risk 1)
- [x] `JokerReveal.jsx` — iki tarafın joker cevabını yan yana göster (§7.4)
- [x] Reveal animasyonu / "büyü anı" (sırayla beliren kartlar)
- [ ] "Linki tekrar gönder" kolaylığı (bekleme ekranında — küçük ekleme)

## 4. Büyüme: Paylaşılabilir Date Kartı
Branch: `feat/date-card`
- [x] `DateCard.jsx` — markalı, screenshot'lanabilir kart (§8)
- [x] Görsel indir (html-to-image → PNG, retina)
- [x] Datchi logosu + Instagram story oranı (9:16) + datchi.app altbilgi
- [ ] (Opsiyonel, sonra) görsel ince ayar / renk-tipografi cilası

## 5. Tasarım & Marka Cilası  ← ŞU AN
Branch: `feat/design` · Yön: **sıcak & flörtöz** (rose/coral + krem, yuvarlak, samimi)
- [x] Tasarım sistemi: renk paleti + tipografi (Fraunces+Nunito) token'ları (index.css @theme)
- [x] Paylaşılan primitive'ler (Button, Card, Chip, Eyebrow)
- [x] Home (landing) — sıcak karşılama, marka, net CTA, 3 adım
- [x] PreferenceForm cilası — coral seçim durumları, yumuşak pill'ler
- [x] Reveal ekranı — display font başlık + warm palet
- [x] DateCard görsel cila — sıcak coral gradyan + display font
- [x] Marka wordmark (💌 Datchi, Fraunces)
- [x] Mobil ince ayar (mobile-first, 375px doğrulandı)
- [x] Create/link "hazır" ekranı warm tona geçti (bekleme odasına dönüştü)
- [ ] (Opsiyonel) dark mode
- [ ] Reveal ekranını canlı önizlemede bir kez görsel doğrula

## 5.5 İki Taraf Etkileşimi
Branch: `feat/interaction`
- [x] Opsiyonel isimler (creatorName / guestName) — hesap değil, 24s'te silinir
- [x] Canlı bekleme odası (creator) — link paylaş + durum + hazır olunca oto-reveal
- [x] "Karşı taraf dolduruyor" göstergesi (guestActive presence bayrağı)
- [x] Kişisel davet metni (Join: "[Ad] seni davet etti")
- [x] Reveal + DateCard'da çift ismi ("Ayşe & Mehmet")
- [ ] Emülatörle uçtan uca test (isim → bekleme → presence → reveal)

## 6. Sertleştirme & Deploy
Branch: `feat/hardening`
- [x] ⚠️ KRİTİK (§5 adalet): cevaplar `sessions/{id}/private/{creator|guest}`'e taşındı;
      ana doküman yalnızca herkese açık alanları taşır. Emülatörde doğrulandı.
- [x] `firestore.rules` — private client'a okuma kapalı, `result`/`status` client'a yazma
      kapalı, sadece presence/isim güncellenebilir (§5). 6/6 kural testi geçti.
- [x] Pipeline emülatör testi — özel cevaplar → matchDate → result (yeşil)
- [x] `firebase.json` Hosting + SPA rewrite yapılandırması
- [x] Güvenlik kuralları CANLIYA deploy edildi (test mode kapandı) ✓
- [x] TTL policy — `sessions`/`expireAt` (Building→Active)
- [x] Blaze planına geçildi
- [x] `firebase deploy` → **CANLI: https://datchiapp.web.app** (hosting + function + rules)
- [x] Canlı pipeline smoke test — matchDate tetiklendi, result yazıldı ✓
- [x] Artifact cleanup policy (maliyet kontrolü, europe-west3)
- [ ] Firebase App Check + reCAPTCHA — abuse koruması (KULLANICI: site key + kod)
- [ ] Gerçek Places sağlayıcı (stub → Foursquare/Yandex) — anahtar Functions env'e
- [ ] Domain `datchi.app` bağla (opsiyonel, sonra)
- [x] SEO/meta — başlık "Datchi – İlk buluşma rotası" (§3)

---

### Çalışma düzeni
- Her bölüm kendi feature branch'inde → `main`'e PR/merge.
- `main` her zaman build alabilir durumda kalır.
- Secret'lar asla commit edilmez (`.env`, API anahtarları).
