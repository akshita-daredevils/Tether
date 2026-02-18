import { useState } from 'react'
import { useAuth } from './useAuth.ts'

export const useAuthForm = () => {
  const { signIn, signUp, signInWithGoogle, error, loading } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [busy, setBusy] = useState(false)

  const toggleMode = () => setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'))

  const submit = async () => {
    setBusy(true)
    if (mode === 'signup') {
      await signUp(email.trim(), password, displayName.trim())
    } else {
      await signIn(email.trim(), password)
    }
    setBusy(false)
  }

  const submitGoogle = async () => {
    setBusy(true)
    await signInWithGoogle()
    setBusy(false)
  }

  return {
    mode,
    email,
    password,
    displayName,
    setEmail,
    setPassword,
    setDisplayName,
    toggleMode,
    submit,
    submitGoogle,
    busy: busy || loading,
    error,
  }
}
