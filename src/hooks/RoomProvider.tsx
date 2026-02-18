import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { RoomContext } from './roomContext'
import type { RoomContextValue } from './roomTypes'
import { createRoom, joinRoomByCode, listenToUserRooms } from '../services/rooms'
import type { Room } from '../types/models'
import { useAuth } from './useAuth.ts'

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [rooms, setRooms] = useState<Room[]>([])
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      return
    }

    queueMicrotask(() => setLoading(true))
    const unsubscribe = listenToUserRooms(user.uid, (nextRooms) => {
      setRooms(nextRooms)
      setLoading(false)
      setActiveRoomId((current) => {
        if (current && nextRooms.some((room) => room.id === current)) {
          return current
        }
        return nextRooms[0]?.id ?? null
      })
    })

    return () => unsubscribe()
  }, [user])

  const value = useMemo<RoomContextValue>(
    () => ({
      rooms: user ? rooms : [],
      activeRoomId: user ? activeRoomId : null,
      loading: user ? loading : false,
      error: user ? error : null,
      createNewRoom: async () => {
        if (!user) {
          return
        }
        setError(null)
        try {
          const roomId = await createRoom(user.uid)
          setActiveRoomId(roomId)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unable to create room.')
        }
      },
      joinRoom: async (roomId: string) => {
        if (!user) {
          return
        }
        setError(null)
        try {
          await joinRoomByCode(user.uid, roomId)
          setActiveRoomId(roomId)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unable to join room.')
        }
      },
      selectRoom: (roomId: string | null) => setActiveRoomId(roomId),
    }),
    [rooms, activeRoomId, loading, error, user],
  )

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
}
