import { useEffect, useState } from 'react'
import { listenToTyping, setTyping } from '../services/chat'
import type { TypingState } from '../types/models'
import { useAuth } from './useAuth.ts'

export const useTyping = (roomId: string | null) => {
  const { user } = useAuth()
  const [typing, setTypingState] = useState<TypingState[]>([])

  useEffect(() => {
    if (!roomId) {
      return
    }

    const unsubscribe = listenToTyping(roomId, (nextTyping) => {
      setTypingState(nextTyping)
    })

    return () => unsubscribe()
  }, [roomId])

  useEffect(() => {
    if (!roomId || !user) {
      return
    }

    return () => {
      void setTyping(roomId, user.uid, false)
    }
  }, [roomId, user])

  const setSelfTyping = async (isTyping: boolean) => {
    if (!roomId || !user) {
      return
    }
    await setTyping(roomId, user.uid, isTyping)
  }

  const othersTyping = roomId
    ? typing.filter((state) => state.uid !== user?.uid && state.isTyping)
    : []

  return { typing: othersTyping, setSelfTyping }
}
