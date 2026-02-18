import { useContext } from 'react'
import { AuthContext } from './authContext'
import type { AuthContextValue } from './authTypes'

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
