import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Message, TypingState } from '../types/models'

const toMessage = (id: string, data: { senderId?: unknown; text?: unknown; createdAt?: unknown }): Message => ({
  id,
  senderId: typeof data.senderId === 'string' ? data.senderId : '',
  text: typeof data.text === 'string' ? data.text : '',
  createdAt: data.createdAt instanceof Timestamp ? data.createdAt : null,
})

const toTypingState = (uid: string, data: { isTyping?: unknown; updatedAt?: unknown }): TypingState => ({
  uid,
  isTyping: Boolean(data.isTyping),
  updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : null,
})

export const sendMessage = async (roomId: string, senderId: string, text: string): Promise<void> => {
  await addDoc(collection(db, 'rooms', roomId, 'messages'), {
    senderId,
    text,
    createdAt: serverTimestamp(),
  })
}

export const listenToMessages = (roomId: string, handler: (messages: Message[]) => void): Unsubscribe => {
  const messagesQuery = query(
    collection(db, 'rooms', roomId, 'messages'),
    orderBy('createdAt', 'asc'),
  )
  return onSnapshot(messagesQuery, (snapshot) => {
    handler(snapshot.docs.map((docSnapshot) => toMessage(docSnapshot.id, docSnapshot.data())))
  })
}

export const setTyping = async (roomId: string, uid: string, isTyping: boolean): Promise<void> => {
  await setDoc(
    doc(db, 'rooms', roomId, 'typing', uid),
    {
      isTyping,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const listenToTyping = (roomId: string, handler: (typing: TypingState[]) => void): Unsubscribe => {
  return onSnapshot(collection(db, 'rooms', roomId, 'typing'), (snapshot) => {
    handler(snapshot.docs.map((typingDoc) => toTypingState(typingDoc.id, typingDoc.data())))
  })
}
