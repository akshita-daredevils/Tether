import { createContext } from 'react'
import type { RoomContextValue } from './roomTypes'

export const RoomContext = createContext<RoomContextValue | null>(null)
