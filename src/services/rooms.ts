import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Room } from '../types/models'

const toRoom = (id: string, data: { members?: unknown; createdAt?: unknown }): Room => ({
  id,
  members: Array.isArray(data.members) ? data.members.filter((member): member is string => typeof member === 'string') : [],
  createdAt: data.createdAt instanceof Timestamp ? data.createdAt : null,
})

export const createRoom = async (uid: string): Promise<string> => {
  const roomRef = await addDoc(collection(db, 'rooms'), {
    members: [uid],
    createdAt: serverTimestamp(),
  })
  return roomRef.id
}

export const joinRoomByCode = async (uid: string, roomId: string): Promise<void> => {
  const roomRef = doc(db, 'rooms', roomId)
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(roomRef)
    if (!snapshot.exists()) {
      throw new Error('Room not found.')
    }
    const data = snapshot.data()
    const members = Array.isArray(data.members) ? data.members.filter((member) => typeof member === 'string') : []
    if (members.includes(uid)) {
      return
    }
    if (members.length >= 2) {
      throw new Error('Room already has two members.')
    }
    transaction.update(roomRef, { members: [...members, uid] })
  })
}

export const listenToUserRooms = (uid: string, handler: (rooms: Room[]) => void): Unsubscribe => {
  const roomsQuery = query(collection(db, 'rooms'), where('members', 'array-contains', uid))
  return onSnapshot(roomsQuery, (snapshot) => {
    const rooms = snapshot.docs.map((roomDoc) => toRoom(roomDoc.id, roomDoc.data()))
    handler(rooms)
  })
}

export const listenToRoom = (roomId: string, handler: (room: Room | null) => void): Unsubscribe => {
  const roomRef = doc(db, 'rooms', roomId)
  return onSnapshot(roomRef, (snapshot) => {
    if (!snapshot.exists()) {
      handler(null)
      return
    }
    handler(toRoom(snapshot.id, snapshot.data()))
  })
}

export const getRoom = async (roomId: string): Promise<Room | null> => {
  const snapshot = await getDoc(doc(db, 'rooms', roomId))
  if (!snapshot.exists()) {
    return null
  }
  return toRoom(snapshot.id, snapshot.data())
}
