import { useEffect, useMemo, useState } from 'react'
import { useTyping } from './useTyping'

export const useChatComposer = (
  roomId: string | null,
  sendMessage: (text: string) => Promise<void>,
) => {
  const { typing, setSelfTyping } = useTyping(roomId)
  const [text, setText] = useState('')

  useEffect(() => {
    if (!roomId) {
      return
    }

    const trimmed = text.trim()
    const isTyping = trimmed.length > 0
    void setSelfTyping(isTyping)

    const timeout = window.setTimeout(() => {
      if (trimmed.length === 0) {
        void setSelfTyping(false)
      }
    }, 2000)

    return () => window.clearTimeout(timeout)
  }, [text, roomId, setSelfTyping])

  const submit = async () => {
    const trimmed = text.trim()
    if (!trimmed) {
      return
    }
    await sendMessage(trimmed)
    setText('')
    void setSelfTyping(false)
  }

  const typingLabel = useMemo(() => {
    if (typing.length === 0) {
      return ''
    }
    if (typing.length === 1) {
      return 'Partner is typing...'
    }
    return 'Both typing...'
  }, [typing.length])

  return {
    text,
    setText,
    submit,
    typingLabel,
  }
}
