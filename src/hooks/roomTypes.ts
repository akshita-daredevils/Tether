import type { Room } from '../types/models'

export type RoomContextValue = {
  rooms: Room[]
  activeRoomId: string | null
  loading: boolean
  error: string | null
  createNewRoom: () => Promise<void>
  joinRoom: (roomId: string) => Promise<void>
  selectRoom: (roomId: string | null) => void
}
