import { useContext } from 'react'
import { RoomContext } from './roomContext'
import type { RoomContextValue } from './roomTypes'

export const useRooms = (): RoomContextValue => {
  const context = useContext(RoomContext)
  if (!context) {
    throw new Error('useRooms must be used within RoomProvider')
  }
  return context
}
