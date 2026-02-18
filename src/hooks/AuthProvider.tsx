import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthContext } from './authContext'
import type { AuthContextValue } from './authTypes'
import {
  observeAuthState,
  setUserOnlineStatus,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  signUpWithEmail,
  type AuthUser,
} from '../services/auth'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = observeAuthState((nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      return
    }

    const setPresenceFromVisibility = async () => {
      const isVisible = document.visibilityState === 'visible'
      await setUserOnlineStatus(user.uid, isVisible)
    }

    void setUserOnlineStatus(user.uid, true)
    void setPresenceFromVisibility()

    const handleVisibility = () => {
      void setPresenceFromVisibility()
    }
    const handleUnload = () => {
      void setUserOnlineStatus(user.uid, false)
    }

    window.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      window.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      signUp: async (email, password, displayName) => {
        setError(null)
        try {
          await signUpWithEmail(email, password, displayName)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unable to sign up.')
        }
      },
      signIn: async (email, password) => {
        setError(null)
        try {
          await signInWithEmail(email, password)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unable to sign in.')
        }
      },
      signInWithGoogle: async () => {
        setError(null)
        try {
          await signInWithGoogle()
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unable to sign in with Google.')
        }
      },
      signOut: async () => {
        setError(null)
        try {
          await signOutUser()
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unable to sign out.')
        }
      },
    }),
    [user, loading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
