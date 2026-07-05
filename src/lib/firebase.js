// Firebase client init — CLAUDE.md §4
// Config .env'den okunur (VITE_ önekli), repoya girmez (§5).
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// .env eksikse erken ve anlaşılır uyarı ver (sessiz hata yerine)
export const isFirebaseConfigured = Boolean(firebaseConfig.projectId)

if (!isFirebaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[Datchi] Firebase config eksik. .env.example → .env kopyalayıp doldur.',
  )
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
