import { initializeApp, type FirebaseOptions } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyDWnuX07X-S99iLB_PdPIEwfMPDGrZUsPM',
  authDomain: 'rentitis-88cd4.firebaseapp.com',
  projectId: 'rentitis-88cd4',
  storageBucket: 'rentitis-88cd4.firebasestorage.app',
  messagingSenderId: '1003256546892',
  appId: '1:1003256546892:web:29f8043a952cb48acf96e9',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true'

if (useEmulator) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099')
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}
