import { Badge } from '../../components/Badge'
import { Button } from '../../components/Button'
import { Panel } from '../../components/Panel'
import { TextInput } from '../../components/TextInput'
import { useRoomActions } from '../../hooks/useRoomActions'
import { useRooms } from '../../hooks/useRooms.ts'

export const RoomsPanel = () => {
  const { rooms, activeRoomId, selectRoom, loading } = useRooms()
  const { roomCode, setRoomCode, busy, error, create, join } = useRoomActions()

  return (
    <Panel title="Private rooms" description="Create a space and invite your partner." className="neo-card">
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={create} disabled={busy}>
            Create room
          </Button>
          <div className="flex flex-1 items-center gap-2">
            <TextInput
              placeholder="Enter room code"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
            />
            <Button variant="glass" onClick={join} disabled={busy}>
              Join
            </Button>
          </div>
        </div>
        {error ? <p className="text-xs text-accent3">{error}</p> : null}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Your rooms</p>
            {loading ? <Badge>Syncing</Badge> : <Badge>{rooms.length} total</Badge>}
          </div>
          <div className="grid gap-2">
            {rooms.map((room) => (
              <button
                key={room.id}
                type="button"
                className={`flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-left transition ${
                  room.id === activeRoomId ? 'bg-white/10' : 'hover:border-white/40'
                }`}
                onClick={() => selectRoom(room.id)}
              >
                <div>
                  <p className="text-sm font-semibold">Room {room.id.slice(0, 6).toUpperCase()}</p>
                  <p className="text-xs text-white/50">Code: {room.id}</p>
                </div>
                <Badge className="border-accent/30 text-accent">{room.members.length}/2</Badge>
              </button>
            ))}
            {rooms.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-white/50">
                No rooms yet. Create one and invite your partner.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Panel>
  )
}
