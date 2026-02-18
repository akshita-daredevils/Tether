import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type Unsubscribe,
  type User,
} from 'firebase/auth'
import { doc, onSnapshot, setDoc, type DocumentData } from 'firebase/firestore'
import { auth, db } from './firebase'
import type { UserProfile } from '../types/models'

export type AuthUser = {
  uid: string
  displayName: string | null
  photoURL: string | null
  email: string | null
}

const mapAuthUser = (user: User): AuthUser => ({
  uid: user.uid,
  displayName: user.displayName,
  photoURL: user.photoURL,
  email: user.email,
})

const toUserProfile = (uid: string, data: DocumentData): UserProfile => ({
  uid,
  displayName: typeof data.displayName === 'string' ? data.displayName : null,
  photoURL: typeof data.photoURL === 'string' ? data.photoURL : null,
  online: Boolean(data.online),
})

export const observeAuthState = (handler: (user: AuthUser | null) => void): Unsubscribe =>
  onAuthStateChanged(auth, (user) => {
    handler(user ? mapAuthUser(user) : null)
  })

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string,
): Promise<AuthUser> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName.trim().length > 0) {
    await updateProfile(credential.user, { displayName })
  }
  await ensureUserProfile(credential.user, true)
  return mapAuthUser(credential.user)
}

export const signInWithEmail = async (email: string, password: string): Promise<AuthUser> => {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  await ensureUserProfile(credential.user, true)
  return mapAuthUser(credential.user)
}

export const signInWithGoogle = async (): Promise<AuthUser> => {
  const provider = new GoogleAuthProvider()
  const credential = await signInWithPopup(auth, provider)
  await ensureUserProfile(credential.user, true)
  return mapAuthUser(credential.user)
}

export const signOutUser = async (): Promise<void> => {
  const current = auth.currentUser
  if (current) {
    await setUserOnlineStatus(current.uid, false)
  }
  await signOut(auth)
}

export const ensureUserProfile = async (user: User, online: boolean): Promise<void> => {
  const displayName = user.displayName ?? user.email ?? 'Anonymous'
  await setDoc(
    doc(db, 'users', user.uid),
    {
      displayName,
      photoURL: user.photoURL ?? null,
      online,
    },
    { merge: true },
  )
}

export const setUserOnlineStatus = async (uid: string, online: boolean): Promise<void> => {
  await setDoc(
    doc(db, 'users', uid),
    {
      online,
    },
    { merge: true },
  )
}

export const listenToUsers = (
  uids: string[],
  handler: (users: UserProfile[]) => void,
): Unsubscribe => {
  if (uids.length === 0) {
    handler([])
    return () => undefined
  }

  const unique = Array.from(new Set(uids))
  const userMap = new Map<string, UserProfile>()
  const unsubscribers = unique.map((uid) =>
    onSnapshot(doc(db, 'users', uid), (snapshot) => {
      if (snapshot.exists()) {
        userMap.set(uid, toUserProfile(uid, snapshot.data()))
      } else {
        userMap.delete(uid)
      }
      handler(Array.from(userMap.values()))
    }),
  )

  return () => {
    unsubscribers.forEach((unsubscribe) => unsubscribe())
  }
}
