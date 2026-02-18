import { useEffect, useState } from 'react'
import { listenToMessages, sendMessage } from '../services/chat'
import type { Message } from '../types/models'
import { useAuth } from './useAuth.ts'

export const useChat = (roomId: string | null) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) {
      setMessages([])
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = listenToMessages(roomId, (nextMessages) => {
      setMessages(nextMessages)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [roomId])

  const send = async (text: string) => {
    if (!roomId || !user) {
      return
    }
    await sendMessage(roomId, user.uid, text)
  }

  return { messages, loading, sendMessage: send }
}
