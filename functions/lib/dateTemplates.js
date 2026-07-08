// Date şablonları — FUNCTIONS KOPYASI (CLAUDE.md §6.4)
// ⚠️ src/data/dateTemplates.js'ten OTOMATİK üretildi (`npm run sync:templates` benzeri).
// Elle düzenleme; kaynağı src/data/dateTemplates.js'te güncelle. Puanlama bunu kullanır.

export const DATE_TEMPLATES = [
  {
    "id": "specialty-coffee",
    "title": "Üçüncü Nesil Kahve Molası",
    "activities": [
      "kahve"
    ],
    "minBudget": 1,
    "energy": "sakin",
    "timeOfDay": [
      "gündüz",
      "akşam"
    ],
    "venueQuery": [
      "specialty coffee",
      "third wave coffee",
      "kahveci"
    ],
    "weatherSensitive": false,
    "copy": "Sakin bir köşede, güzel demlenmiş bir kahve eşliğinde ilk sohbet. Acele yok."
  },
  {
    "id": "coffee-walk",
    "title": "Kahve Al, Yürüyelim",
    "activities": [
      "kahve",
      "yuruyus"
    ],
    "minBudget": 1,
    "energy": "hareketli",
    "timeOfDay": [
      "gündüz"
    ],
    "venueQuery": [
      "coffee to go",
      "kahveci",
      "park"
    ],
    "weatherSensitive": true,
    "copy": "Kahveleri kapıp yürüyüşe. Yan yana yürümek, göz göze oturmaktan daha az korkutucu."
  },
  {
    "id": "tea-garden",
    "title": "Çay Bahçesi",
    "activities": [
      "kahve",
      "yuruyus"
    ],
    "minBudget": 1,
    "energy": "sakin",
    "timeOfDay": [
      "gündüz"
    ],
    "venueQuery": [
      "tea garden",
      "çay bahçesi",
      "nargile"
    ],
    "weatherSensitive": true,
    "copy": "Manzaralı bir çay bahçesinde tavşan kanı çay. Klasik ve rahatlatıcı."
  },
  {
    "id": "dessert-date",
    "title": "Tatlı Kaçamağı",
    "activities": [
      "tatli",
      "kahve"
    ],
    "minBudget": 1,
    "energy": "sakin",
    "timeOfDay": [
      "gündüz",
      "akşam"
    ],
    "venueQuery": [
      "dessert",
      "pastane",
      "waffle",
      "dondurma"
    ],
    "weatherSensitive": false,
    "copy": "Bir dilim tatlı, iki çatal. Paylaşmak zorunda kalınca buz erir."
  },
  {
    "id": "fancy-dessert",
    "title": "Şık Tatlı & Kahve",
    "activities": [
      "tatli",
      "kahve"
    ],
    "minBudget": 2,
    "energy": "sakin",
    "timeOfDay": [
      "gündüz",
      "akşam"
    ],
    "venueQuery": [
      "patisserie",
      "butik pastane",
      "cheesecake"
    ],
    "weatherSensitive": false,
    "copy": "İyi bir patisserie, güzel sunum. Tatlı sevenler için tam isabet."
  },
  {
    "id": "brunch",
    "title": "Geç Kahvaltı / Brunch",
    "activities": [
      "yemek",
      "kahve"
    ],
    "minBudget": 2,
    "energy": "sakin",
    "timeOfDay": [
      "gündüz"
    ],
    "venueQuery": [
      "brunch",
      "kahvaltı",
      "breakfast"
    ],
    "weatherSensitive": false,
    "copy": "Uzun bir brunch masası. Yiyecek çok, konu bitmez."
  },
  {
    "id": "serpme-kahvalti",
    "title": "Serpme Kahvaltı",
    "activities": [
      "yemek"
    ],
    "minBudget": 2,
    "energy": "sakin",
    "timeOfDay": [
      "gündüz"
    ],
    "venueQuery": [
      "serpme kahvaltı",
      "köy kahvaltısı",
      "kahvaltı"
    ],
    "weatherSensitive": false,
    "copy": "Masanın taşacağı bir serpme kahvaltı. Sohbet için bol bol zaman."
  },
  {
    "id": "casual-dinner",
    "title": "Rahat Bir Akşam Yemeği",
    "activities": [
      "yemek"
    ],
    "minBudget": 2,
    "energy": "sakin",
    "timeOfDay": [
      "akşam"
    ],
    "venueQuery": [
      "restaurant",
      "bistro",
      "meze"
    ],
    "weatherSensitive": false,
    "copy": "Abartısız ama keyifli bir akşam yemeği. Klasik iyidir."
  },
  {
    "id": "street-food-crawl",
    "title": "Sokak Lezzetleri Turu",
    "activities": [
      "yemek",
      "yuruyus"
    ],
    "minBudget": 1,
    "energy": "hareketli",
    "timeOfDay": [
      "gündüz",
      "akşam"
    ],
    "venueQuery": [
      "street food",
      "sokak lezzetleri",
      "büfe"
    ],
    "weatherSensitive": true,
    "copy": "Bir tezgahtan diğerine. Küçük tabaklar, çok durak, hiç sıkılma."
  },
  {
    "id": "picnic",
    "title": "Piknik",
    "activities": [
      "yemek",
      "yuruyus"
    ],
    "minBudget": 1,
    "energy": "sakin",
    "timeOfDay": [
      "gündüz"
    ],
    "venueQuery": [
      "park",
      "piknik alanı",
      "botanik bahçe"
    ],
    "weatherSensitive": true,
    "copy": "Bir battaniye, birkaç atıştırmalık, yeşillik. En rahat tanışma zemini."
  },
  {
    "id": "cocktail-bar",
    "title": "Kokteyl Bar",
    "activities": [
      "bar"
    ],
    "minBudget": 2,
    "energy": "hareketli",
    "timeOfDay": [
      "akşam"
    ],
    "venueQuery": [
      "cocktail bar",
      "kokteyl bar"
    ],
    "weatherSensitive": false,
    "copy": "İyi bir kokteyl listesi ve loş ışık. Akşamın tonunu bu belirler."
  },
  {
    "id": "wine-cheese",
    "title": "Şarap & Meze",
    "activities": [
      "bar",
      "yemek"
    ],
    "minBudget": 3,
    "energy": "sakin",
    "timeOfDay": [
      "akşam"
    ],
    "venueQuery": [
      "wine bar",
      "şarap evi",
      "şarapçı"
    ],
    "weatherSensitive": false,
    "copy": "Bir kadeh şarap, birkaç meze. Konuşmanın yavaşça derinleştiği tür bir akşam."
  },
  {
    "id": "wine-tasting",
    "title": "Şarap Tadımı",
    "activities": [
      "bar"
    ],
    "minBudget": 3,
    "energy": "sakin",
    "timeOfDay": [
      "akşam"
    ],
    "venueQuery": [
      "wine tasting",
      "şarap tadımı",
      "vinoteca"
    ],
    "weatherSensitive": false,
    "copy": "Birlikte yeni şaraplar keşfetmek. Ortak bir favori bulmak güzel bir başlangıç."
  },
  {
    "id": "rooftop-drinks",
    "title": "Manzaralı İçki",
    "activities": [
      "bar"
    ],
    "minBudget": 3,
    "energy": "hareketli",
    "timeOfDay": [
      "akşam"
    ],
    "venueQuery": [
      "rooftop bar",
      "teras bar",
      "manzara bar"
    ],
    "weatherSensitive": true,
    "copy": "Yüksekten şehir manzarası ve elinizde birer kadeh. İddialı ama işe yarar."
  },
  {
    "id": "karaoke",
    "title": "Karaoke Gecesi",
    "activities": [
      "aktivite",
      "bar"
    ],
    "minBudget": 2,
    "energy": "hareketli",
    "timeOfDay": [
      "akşam"
    ],
    "venueQuery": [
      "karaoke",
      "karaoke bar"
    ],
    "weatherSensitive": false,
    "copy": "Kötü söylemek serbest. Birlikte rezil olmak buzları anında kırar."
  },
  {
    "id": "park-walk",
    "title": "Parkta Yürüyüş",
    "activities": [
      "yuruyus"
    ],
    "minBudget": 1,
    "energy": "hareketli",
    "timeOfDay": [
      "gündüz"
    ],
    "venueQuery": [
      "park",
      "sahil",
      "botanik bahçe"
    ],
    "weatherSensitive": true,
    "copy": "Açık hava, yeşil ve rahat bir tempo. Cüzdanı da rahatlatır."
  },
  {
    "id": "seaside-walk",
    "title": "Sahil Kenarı",
    "activities": [
      "yuruyus",
      "kahve"
    ],
    "minBudget": 1,
    "energy": "sakin",
    "timeOfDay": [
      "gündüz",
      "akşam"
    ],
    "venueQuery": [
      "sahil",
      "seaside",
      "liman"
    ],
    "weatherSensitive": true,
    "copy": "Su kenarında yürüyüş, arada bir kahve. Deniz her şeyi kolaylaştırır."
  },
  {
    "id": "beach-day",
    "title": "Sahil Günü",
    "activities": [
      "yuruyus",
      "yemek"
    ],
    "minBudget": 1,
    "energy": "hareketli",
    "timeOfDay": [
      "gündüz"
    ],
    "venueQuery": [
      "sahil",
      "plaj",
      "beach club"
    ],
    "weatherSensitive": true,
    "copy": "Güneş, deniz, biraz atıştırma. Rahat kıyafet, rahat sohbet."
  },
  {
    "id": "board-game-cafe",
    "title": "Oyun Kafe",
    "activities": [
      "aktivite",
      "kahve"
    ],
    "minBudget": 1,
    "energy": "hareketli",
    "timeOfDay": [
      "gündüz",
      "akşam"
    ],
    "venueQuery": [
      "board game cafe",
      "kutu oyunu kafe",
      "oyun kafe"
    ],
    "weatherSensitive": false,
    "copy": "Masada bir oyun varsa sessizlik olmaz. Rekabet buzları hızlı kırar."
  },
  {
    "id": "bowling-arcade",
    "title": "Bowling / Atari",
    "activities": [
      "aktivite"
    ],
    "minBudget": 2,
    "energy": "hareketli",
    "timeOfDay": [
      "gündüz",
      "akşam"
    ],
    "venueQuery": [
      "bowling",
      "arcade",
      "eğlence merkezi"
    ],
    "weatherSensitive": false,
    "copy": "Biraz tatlı rekabet, bol gülüşme. Kim kazanırsa bir sonrakini o ısmarlar."
  },
  {
    "id": "escape-room",
    "title": "Kaçış Odası",
    "activities": [
      "aktivite"
    ],
    "minBudget": 2,
    "energy": "hareketli",
    "timeOfDay": [
      "gündüz",
      "akşam"
    ],
    "venueQuery": [
      "escape room",
      "kaçış oyunu",
      "evden kaçış"
    ],
    "weatherSensitive": false,
    "copy": "Bir saat boyunca birlikte bulmaca çözmek — takım olabildiğinizi hemen gösterir."
  },
  {
    "id": "mini-golf",
    "title": "Mini Golf",
    "activities": [
      "aktivite",
      "spor"
    ],
    "minBudget": 2,
    "energy": "hareketli",
    "timeOfDay": [
      "gündüz",
      "akşam"
    ],
    "venueQuery": [
      "mini golf",
      "minyatür golf",
      "eğlence parkı"
    ],
    "weatherSensitive": true,
    "copy": "Rekabetin en tatlı hali. Kaybeden dondurma ısmarlar."
  },
  {
    "id": "art-gallery",
    "title": "Sergi / Galeri Turu",
    "activities": [
      "kultur",
      "yuruyus"
    ],
    "minBudget": 1,
    "energy": "sakin",
    "timeOfDay": [
      "gündüz"
    ],
    "venueQuery": [
      "art gallery",
      "sanat galerisi",
      "müze",
      "sergi"
    ],
    "weatherSensitive": false,
    "copy": "Duvarlarda konuşulacak bir sürü şey. Yorum yapmak, kendini anlatmanın kolay yolu."
  },
  {
    "id": "museum-coffee",
    "title": "Müze + Kahve",
    "activities": [
      "kultur",
      "kahve"
    ],
    "minBudget": 2,
    "energy": "sakin",
    "timeOfDay": [
      "gündüz"
    ],
    "venueQuery": [
      "museum",
      "müze",
      "kültür merkezi"
    ],
    "weatherSensitive": false,
    "copy": "Önce bir müze gezisi, sonra üstüne kahve. Kültürlü ve rahat."
  },
  {
    "id": "street-art-walk",
    "title": "Sokak Sanatı Yürüyüşü",
    "activities": [
      "kultur",
      "yuruyus"
    ],
    "minBudget": 1,
    "energy": "sakin",
    "timeOfDay": [
      "gündüz"
    ],
    "venueQuery": [
      "sokak sanatı",
      "mural",
      "tarihi sokak"
    ],
    "weatherSensitive": true,
    "copy": "Renkli duvarlar, eski sokaklar. Fotoğraf çeke çeke gezmelik bir rota."
  },
  {
    "id": "live-music",
    "title": "Canlı Müzik",
    "activities": [
      "kultur",
      "bar"
    ],
    "minBudget": 2,
    "energy": "hareketli",
    "timeOfDay": [
      "akşam"
    ],
    "venueQuery": [
      "live music",
      "canlı müzik",
      "sahne",
      "akustik"
    ],
    "weatherSensitive": false,
    "copy": "Arkada canlı müzik varken sohbetin baskısı azalır. Ortam sizin için konuşur."
  },
  {
    "id": "concert",
    "title": "Konser",
    "activities": [
      "kultur"
    ],
    "minBudget": 2,
    "energy": "hareketli",
    "timeOfDay": [
      "akşam"
    ],
    "venueQuery": [
      "concert venue",
      "konser salonu",
      "sahne"
    ],
    "weatherSensitive": false,
    "copy": "Ortak bir müzik zevki varsa bir konser en iyisi. Paylaşılan enerji bağ kurar."
  },
  {
    "id": "fancy-dinner",
    "title": "Şık Akşam Yemeği",
    "activities": [
      "yemek",
      "bar"
    ],
    "minBudget": 3,
    "energy": "sakin",
    "timeOfDay": [
      "akşam"
    ],
    "venueQuery": [
      "fine dining",
      "şık restoran",
      "fine dining restaurant"
    ],
    "weatherSensitive": false,
    "copy": "İddialı bir mekan, güzel bir masa. Özel hissettiren türden bir akşam."
  },
  {
    "id": "dessert-walk",
    "title": "Tatlı & Akşam Yürüyüşü",
    "activities": [
      "tatli",
      "yuruyus"
    ],
    "minBudget": 1,
    "energy": "hareketli",
    "timeOfDay": [
      "akşam"
    ],
    "venueQuery": [
      "dondurma",
      "gelato",
      "tatlıcı"
    ],
    "weatherSensitive": true,
    "copy": "Elimizde birer dondurma, akşam serinliğinde yürüyüş. Basit ama tam isabet."
  },
  {
    "id": "cinema-classic",
    "title": "Sinema Klasiği",
    "activities": [
      "sinema"
    ],
    "minBudget": 1,
    "energy": "sakin",
    "timeOfDay": [
      "gündüz",
      "akşam"
    ],
    "venueQuery": [
      "cinema",
      "sinema",
      "movie theater"
    ],
    "weatherSensitive": false,
    "copy": "Karanlık salon, paylaşılan patlamış mısır. Klasik bir ilk buluşma nedeni."
  },
  {
    "id": "cinema-dinner",
    "title": "Film + Yemek",
    "activities": [
      "sinema",
      "yemek"
    ],
    "minBudget": 2,
    "energy": "sakin",
    "timeOfDay": [
      "akşam"
    ],
    "venueQuery": [
      "cinema",
      "sinema",
      "restaurant"
    ],
    "weatherSensitive": false,
    "copy": "Önce güzel bir yemek, sonra film. Konuşacak konu da hazır gelir."
  },
  {
    "id": "cinema-dessert",
    "title": "Film Öncesi Tatlı",
    "activities": [
      "sinema",
      "tatli"
    ],
    "minBudget": 1,
    "energy": "sakin",
    "timeOfDay": [
      "akşam"
    ],
    "venueQuery": [
      "dondurma",
      "cafe",
      "sinema"
    ],
    "weatherSensitive": false,
    "copy": "Seanstan önce tatlı bir mola. Rahat ve tatlı bir akşam."
  },
  {
    "id": "shopping-coffee",
    "title": "Vitrin & Kahve",
    "activities": [
      "alisveris",
      "kahve"
    ],
    "minBudget": 1,
    "energy": "hareketli",
    "timeOfDay": [
      "gündüz"
    ],
    "venueQuery": [
      "shopping street",
      "çarşı",
      "cafe"
    ],
    "weatherSensitive": false,
    "copy": "Vitrinlere bakarak yürü, arada kahve. Zevkleri öğrenmenin rahat yolu."
  },
  {
    "id": "mall-day",
    "title": "AVM Günü",
    "activities": [
      "alisveris"
    ],
    "minBudget": 1,
    "energy": "hareketli",
    "timeOfDay": [
      "gündüz",
      "akşam"
    ],
    "venueQuery": [
      "shopping mall",
      "avm",
      "alışveriş merkezi"
    ],
    "weatherSensitive": false,
    "copy": "Hava nasıl olursa olsun çalışır: gez, dene, birer şey ye. Rahat plan."
  },
  {
    "id": "bike-ride",
    "title": "Bisiklet Turu",
    "activities": [
      "spor",
      "yuruyus"
    ],
    "minBudget": 1,
    "energy": "hareketli",
    "timeOfDay": [
      "gündüz"
    ],
    "venueQuery": [
      "bisiklet yolu",
      "sahil",
      "park"
    ],
    "weatherSensitive": true,
    "copy": "Rüzgârı hissederek birlikte pedallamak. Enerjik ve neşeli bir başlangıç."
  },
  {
    "id": "active-day",
    "title": "Aktif Gün",
    "activities": [
      "spor",
      "aktivite"
    ],
    "minBudget": 2,
    "energy": "hareketli",
    "timeOfDay": [
      "gündüz",
      "akşam"
    ],
    "venueQuery": [
      "climbing gym",
      "tırmanış",
      "paten",
      "trambolin park"
    ],
    "weatherSensitive": false,
    "copy": "Tırmanış, paten ya da trambolin — adrenalin buzları anında eritir."
  }
]
