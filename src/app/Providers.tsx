import type { ReactNode } from 'react'
import { AuthProvider } from '../hooks/AuthProvider'
import { RoomProvider } from '../hooks/RoomProvider'

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <RoomProvider>{children}</RoomProvider>
  </AuthProvider>
)
