CLAUDE.md — Datchi
Bu dosya projenin tek referans kaynağıdır. Claude Code her session başında bunu okumalı ve buradaki kararlara sadık kalmalıdır. Kararlar bir sohbette birlikte netleştirildi; keyfi olarak değiştirme, değişiklik gerekiyorsa önce gerekçesini açıkla.
1. Proje Nedir
Datchi, sosyal medya veya flört uygulamalarından tanışmış iki kişinin ilk buluşma öncesi yaşadığı "nereye gidelim / ne yapalım" karar yorgunluğunu ortadan kaldıran, oturumsuz (login yok), tek kullanımlık magic-link üzerinden çalışan bir web mikro-uygulamasıdır.
Akış:

1. A kişisi siteye girer, tek tıkla bir "date oturumu" başlatır ve kendi tercihlerini girer.
2. Sistem 24 saat geçerli, anonim, benzersiz bir link üretir.
3. A bu linki B kişisine gönderir.
4. B linke tıklar, kendi tercihlerini girer.
5. İki taraf da gönderince, eşzamanlı (real-time) olarak ortak bir "Date Rotası" belirir.
Bu bir dating app DEĞİL. Eşleştirme/tanışma başka yerde olmuş. Datchi sadece bir buz kırıcı + karar aracı. Bu ayrımı her tasarım kararında koru.
2. Temel Felsefe (bunları ihlal etme)

* Frictionless: Hesap yok, mail onayı yok, uygulama indirme yok. Her ekstra adım düşmandır.
* Zero-maintenance / "yap ve unut": Çöp veri birikmemeli. Her oturum 24 saatte kendini silmeli (TTL).
* Sunucu maliyeti ~0: Ağır mimari yok, LLM API'si yok. Serverless + statik şablonlar.
* Bu bir indie / portföy projesi. Milyar dolarlık ölçek hedefi yok. Basit ve zarif tut.
3. İsim & Marka

* İsim: Datchi
* Domain: `datchi.app` (satın alınacak; kod domain'e bağımlı yazılmamalı)
* SEO notu: Ham "Datchi" araması bir Steam oyunuyla (King Datchi) dolu. İsmi metadata/SEO'da asla tek başına bırakma; hep tanımlayıcıyla eşleştir: "Datchi – ilk buluşma", "Datchi buluşma rotası".
* `.app` uzantısı zorunlu HTTPS ister; Firebase Hosting'in ücretsiz SSL'i bunu zaten karşılıyor.
4. Tech Stack (kesinleşti)
Frontend

* React 19 + Vite
* Tailwind CSS + shadcn/ui
* Client-side routing (react-router)
Backend / Altyapı — hepsi Firebase

* Cloud Firestore (NoSQL) — real-time reveal'in kalbi
* Cloud Functions (Node.js) — eşleştirme algoritması + mekân seçimi burada çalışır
* Firebase Hosting — deploy
* Firestore TTL — 24 saatlik otomatik silme
* reCAPTCHA (görünmez) + rate limiting — abuse koruması
Harici API — Mekân sağlayıcısı (provider soyutlanmış)

* Orta noktaya göre gerçek mekân bulmak için bir "Places provider" kullanılır. Sağlayıcı SOYUTLANIR: kod tek bir `findVenue(midpoint, query, radius)` arayüzüne bağlanır, altındaki sağlayıcı değiştirilebilir olmalı (bkz. 7.3). Kod hiçbir sağlayıcının SDK'sına doğrudan kilitlenmez.
* Varsayılan (MVP): Foursquare Places veya Yandex Places — ikisi de Türkiye'de iyi veri + cömert free tier verir, fatura sürprizi yoktur. Google Places kalite lideridir ama ücretlidir; ölçek gelince soyutlama sayesinde tek dosya değişimiyle geçilir.
* Hangi sağlayıcı olursa olsun: yalnızca Cloud Functions içinden çağrılır, API anahtarı asla client'a düşmez.
Supabase/başka DB'ye geçme. Firestore'un real-time listener'ı bu projenin çekirdek özelliği için bilinçli seçildi.
5. Güvenlik & Adalet Kuralları (kritik)

* Eşleştirme algoritması yalnızca Cloud Function içinde çalışır. Client'ta çalıştırma.
* İkinci kişi göndermeden hiçbir taraf karşının cevabını görememeli. `creatorAnswers` ve `guestAnswers` client'a ham olarak servis edilmez; sonuç (`result`) ancak iki cevap da geldiğinde Function tarafından yazılır. "Reveal" anının büyüsü ve adaleti buna bağlı.
* Places provider API anahtarı (Foursquare/Yandex/Google — hangisi seçilirse) Functions ortam değişkeninde tutulur, repoya veya client'a girmez. Anahtar sağlayıcıdan bağımsız olarak tek bir env değişkeni üzerinden okunur.
* Firestore Security Rules: bir oturuma sadece ilgili taraflar yazabilmeli, `result` alanını client yazamaz (sadece Function).
6. Veri Modeli
6.1 Kullanıcı tercih vektörü (her iki taraf da bunu doldurur)

```
Answer {
  budget:     1 | 2 | 3            // ₺ / ₺₺ / ₺₺₺
  location:   { lat: number, lng: number }
  activities: string[]             // sabit havuzdan çoklu seçim (bkz. 6.2)
  energy:     "sakin" | "hareketli"
  timeOfDay:  "gündüz" | "akşam"
  joker:      { question: string, answer: string } | null   // opsiyonel
}

```

6.2 Sabit aktivite havuzu (`src/data/activities.js`)
Havuzu SABİT tut — matris eşleştirme buna dayanıyor ve kullanıcıyı yormamak için: `kahve`, `yemek`, `tatlı`, `bar/kokteyl`, `yürüyüş`, `aktivite/oyun`, `kültür-sanat`
6.3 Firestore doküman yapısı

```
sessions/{sessionId} {
  createdAt:      Timestamp
  expireAt:       Timestamp        // createdAt + 24h  → TTL policy bu alana bağlanır
  status:         "waiting" | "ready"
  creatorAnswers: Answer
  guestAnswers:   Answer | null
  result:         Result | null    // yalnızca Cloud Function yazar
}

```

6.4 Date şablonu (statik, `src/data/dateTemplates.js` veya functions içi)

```
DateTemplate {
  id:              string
  title:           string
  activities:      string[]        // 6.2 havuzundan etiketler
  minBudget:       1 | 2 | 3
  energy:          "sakin" | "hareketli"
  timeOfDay:       ("gündüz" | "akşam")[]
  venueQuery:      string[]        // Places provider için arama terimleri (ör. "specialty coffee")
  weatherSensitive:boolean         // açık hava ise ileride hava kontrolü eklenebilir
  copy:            string          // reveal ekranında gösterilecek senaryo metni
}

```

Başlangıç için 20-30 şablon yeterli; az sayıda şablonla bile puanlama çok kombinasyon üretir.
6.5 Sonuç (`Result`)

```
Result {
  template:    DateTemplate
  venue:       { name, address, lat, lng, mapsUrl } | null
  midpoint:    { lat, lng }
  jokerReveal: { creator: {q,a}, guest: {q,a} } | null   // sadece gösterim, puanlamaya girmez
}

```

7. Eşleştirme Algoritması (LLM YOK)
İki cevabı tek ortak tercihe indirge, sonra şablonları puanla. Tamamı Cloud Function içinde.
7.1 İki cevabı ortak tercihe indirgeme

* budget → MIN(a, b). Kimseyi bütçesini aşan yere sürükleme (düşünceli olan bu).
* activities → önce KESİŞİM. Ortak etiketler en yüksek puanı alır. Kesişim boşsa birleşime düş.
* energy → aynıysa bonus, farklıysa nötr şablona kay.
* location → coğrafi orta nokta (bkz. 7.3 — ham ortalama tuzağı).
7.2 Puanlama (basit ağırlıklı skorlama)
Her şablon için:

```
if (template.minBudget > ortakBudget) -> ele (skor = 0)
skor  = 0
skor += 3 * (ortak aktivite etiketi sayısı)
skor += (template.energy === ortakEnergy) ? 2 : 0
skor += (template.timeOfDay içeriyorsa ortakTimeOfDay) ? 1 : 0

```

En yüksek skorlu ilk 2-3 şablon arasından rastgele birini seç. Böylece aynı girdiler her seferinde birebir aynı sonucu vermez; tekrar gelenlerde çeşitlilik olur.
7.3 Coğrafi orta nokta tuzağı + Places provider soyutlaması (unutma)
İki lat/lng'nin ham ortalaması sık sık ıssız bir yere düşer (viyadük, deniz, kafesiz mahalle). Çözüm:

1. Orta noktayı hesapla.
2. O noktaya X km yarıçapta, seçilen şablonun `venueQuery`'siyle mekân araması yap.
3. En uygun gerçek mekânı seç.
4. İyi mekân yoksa yarıçapı genişlet ya da daha yoğun tarafa kaydır.

Sağlayıcı soyutlaması (KRİTİK): Tüm mekân arama mantığı `functions/lib/places.js` içinde **tek bir arayüzün** arkasında durur:

```
// functions/lib/places.js
// Sağlayıcı-bağımsız arayüz. Dönen tip her sağlayıcıda AYNI olmalı.
async function findVenue(midpoint, queries, radius)
  -> { name, address, lat, lng, mapsUrl } | null
```

* Matcher ve Function kodu SADECE `findVenue`'yu bilir; Foursquare/Yandex/Google'ın SDK'sını, response şeklini ASLA doğrudan görmez.
* Her sağlayıcı için küçük bir adaptör (`providers/foursquare.js`, `providers/yandex.js`, ...) yaz; `findVenue` içinde aktif olanı `PLACES_PROVIDER` env değişkenine göre seç.
* Böylece MVP'de Foursquare/Yandex ile başlar, ölçek gelince Google'a tek dosya değiştirerek geçersin; çağıran kod hiç bozulmaz.
7.4 Joker
Joker puanlamaya girmez. Sadece reveal ekranındaki eğlence: "Ananaslı pizza? → Sen: Evet 🍍 / O: Asla ❌". Yan yana göster. Eşleştirme mantığını kirletme.
8. Büyüme Motoru: Paylaşılabilir Date Kartı (ihmal etme)
Tek kullanımlık anonim link kendiliğinden viral DEĞİL. Bu yüzden reveal ekranındaki sonuç güzel, markalı, screenshot'lanabilir bir "Date Kartı" olmalı (`components/DateCard.jsx`): Instagram story'ye atılası, üstünde küçük Datchi logosu olan bir kart. Organik büyüme buna bağlı. Bunu "sonradan eklenecek süs" değil, birinci sınıf özellik olarak ele al.
9. Önerilen Klasör Yapısı

```
datchi/
├── CLAUDE.md
├── firebase.json
├── .firebaserc
├── firestore.rules
├── firestore.indexes.json
├── vite.config.js
├── index.html
├── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── lib/
│   │   ├── firebase.js        // Firebase init (client config)
│   │   └── session.js         // oturum oluştur / katıl yardımcıları
│   ├── data/
│   │   ├── activities.js      // sabit aktivite havuzu
│   │   └── dateTemplates.js   // statik şablon havuzu (client kopyası, gösterim için)
│   ├── hooks/
│   │   └── useSession.js      // Firestore real-time listener
│   ├── pages/
│   │   ├── Home.jsx           // "Date oturumu başlat"
│   │   ├── Create.jsx         // creator formu + opsiyonel joker
│   │   ├── Join.jsx           // guest formu (magic link ile açılır)
│   │   └── Result.jsx         // real-time reveal + DateCard
│   └── components/
│       ├── PreferenceForm.jsx // iki tarafın da doldurduğu ortak form
│       ├── DateCard.jsx       // paylaşılabilir kart
│       └── JokerReveal.jsx
└── functions/
    ├── index.js               // matchDate (Firestore trigger veya callable)
    ├── lib/
    │   ├── matcher.js         // 7. bölümdeki puanlama
    │   └── places.js          // findVenue arayüzü (sağlayıcı-bağımsız, bkz. 7.3)
    ├── providers/
    │   ├── foursquare.js      // Foursquare adaptörü
    │   └── yandex.js          // Yandex adaptörü (alternatif)
    └── package.json
```

10. İlk Görevler (bu sırayla)

1. İskele: Vite + React + Tailwind + shadcn/ui kur. Firebase projesi bağla (Firestore, Functions, Hosting).
2. Veri katmanı: `activities.js` ve `dateTemplates.js` dosyalarını 6.2 ve 6.4'e göre oluştur; başlangıçta ~15-20 şablon yaz.
3. Oturum akışı: Home → Create (creator formu, oturum + magic link üretimi) → Firestore'a `creatorAnswers` yaz, `status: "waiting"`.
4. Join akışı: Magic link `Join.jsx`'i açar; guest formu → `guestAnswers` yazılır.
5. Cloud Function: İki cevap da gelince tetiklenen `matchDate`; 7. bölümdeki algoritma + `findVenue` ile `result` yazar, `status: "ready"`.
6. Real-time reveal: `useSession` listener'ı `status: "ready"` olunca `Result.jsx`'i eşzamanlı günceller.
7. DateCard: Paylaşılabilir kartı tasarla (8. bölüm).
8. Sertleştirme: Firestore Security Rules, TTL policy (`expireAt`), reCAPTCHA + rate limiting.
11. Yapma / Dikkat Listesi

* ❌ Login, hesap, kalıcı kullanıcı verisi ekleme.
* ❌ Eşleştirmeyi client'ta çalıştırma.
* ❌ Places provider anahtarını client'a koyma.
* ❌ Matcher/Function kodunu bir sağlayıcının SDK'sına doğrudan kilitleme — hep `findVenue` arayüzünden geç (7.3).
* ❌ Ham lat/lng ortalamasını mekân olarak sunma (7.3).
* ❌ Joker'i puanlamaya karıştırma.
* ❌ LLM API'sine bağımlılık ekleme.
* ✅ Her oturum `expireAt` ile 24 saatte silinsin.
* ✅ Mobile-first, responsive tasarla (kullanıcılar linke telefondan tıklar).
* ✅ Türkçe arayüz (birincil kitle Türkiye).
* ✅ A tarafına "cevap bekleniyor" ekranı + linki tekrar gönderme kolaylığı koy.
