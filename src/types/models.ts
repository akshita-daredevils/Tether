import type { Timestamp } from 'firebase/firestore'

export type UserProfile = {
  uid: string
  displayName: string | null
  photoURL: string | null
  online: boolean
}

export type Room = {
  id: string
  members: string[]
  createdAt: Timestamp | null
}

export type Message = {
  id: string
  senderId: string
  text: string
  createdAt: Timestamp | null
}

export type PlayerState = {
  videoId: string
  isPlaying: boolean
  timestamp: number
  updatedBy: string
  updatedAt: Timestamp | null
}

export type TypingState = {
  uid: string
  isTyping: boolean
  updatedAt: Timestamp | null
}
