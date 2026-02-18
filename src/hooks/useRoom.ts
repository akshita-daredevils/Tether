import { useEffect, useState } from 'react'
import { listenToRoom } from '../services/rooms'
import type { Room } from '../types/models'

export const useRoom = (roomId: string | null) => {
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) {
      setRoom(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = listenToRoom(roomId, (nextRoom) => {
      setRoom(nextRoom)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [roomId])

  return { room, loading }
}
