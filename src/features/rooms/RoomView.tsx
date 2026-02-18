import { Badge } from '../../components/Badge'
import { Panel } from '../../components/Panel'
import { StatusDot } from '../../components/StatusDot'
import { useAuth } from '../../hooks/useAuth.ts'
import { usePresence } from '../../hooks/usePresence'
import { useRoom } from '../../hooks/useRoom'
import { ChatPanel } from '../chat/ChatPanel'
import { YouTubeSyncPanel } from '../youtubeSync/YouTubeSyncPanel'

type RoomViewProps = {
  roomId: string
}

export const RoomView = ({ roomId }: RoomViewProps) => {
  const { user } = useAuth()
  const { room, loading } = useRoom(roomId)
  const members = usePresence(room?.members ?? [])

  if (loading || !room) {
    return (
      <Panel title="Room" description="Loading room details..." className="neo-card">
        <div className="h-40 animate-pulse rounded-xl bg-white/5" />
      </Panel>
    )
  }

  return (
    <div className="grid gap-6">
      <Panel title="Room overview" description="Share this code with your partner." className="neo-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">Room code</p>
            <p className="mt-2 text-lg font-semibold text-accent">{room.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="border-accent/30 text-accent">{room.members.length}/2 members</Badge>
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Presence</p>
          <div className="flex flex-wrap gap-2">
            {room.members.map((memberId) => {
              const profile = members.find((member) => member.uid === memberId)
              const isSelf = memberId === user?.uid
              return (
                <div
                  key={memberId}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                >
                  <StatusDot online={profile?.online ?? false} />
                  <span className="text-xs text-white/80">
                    {isSelf ? 'You' : profile?.displayName ?? 'Partner'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ChatPanel key={roomId} roomId={roomId} />
        <YouTubeSyncPanel roomId={roomId} />
      </div>
    </div>
  )
}
