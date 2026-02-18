import { useEffect, useState } from 'react'
import { listenToUsers } from '../services/auth'
import type { UserProfile } from '../types/models'

export const usePresence = (memberIds: string[]) => {
  const [members, setMembers] = useState<UserProfile[]>([])

  useEffect(() => {
    if (memberIds.length === 0) {
      setMembers([])
      return
    }

    const unsubscribe = listenToUsers(memberIds, setMembers)
    return () => unsubscribe()
  }, [memberIds])

  return members
}
