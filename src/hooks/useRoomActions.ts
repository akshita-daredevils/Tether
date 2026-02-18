import { useMemo, useState } from 'react'
import { useRooms } from './useRooms.ts'

export const useRoomActions = () => {
  const { createNewRoom, joinRoom, error } = useRooms()
  const [roomCode, setRoomCode] = useState('')
  const [busy, setBusy] = useState(false)

  const create = async () => {
    setBusy(true)
    await createNewRoom()
    setBusy(false)
  }

  const join = async () => {
    const trimmed = roomCode.trim()
    if (!trimmed) {
      return
    }
    setBusy(true)
    await joinRoom(trimmed)
    setBusy(false)
  }

  return useMemo(
    () => ({
      roomCode,
      setRoomCode,
      busy,
      error,
      create,
      join,
    }),
    [roomCode, busy, error],
  )
}
