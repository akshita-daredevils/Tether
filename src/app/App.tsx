import { AuthPanel } from '../features/auth/AuthPanel'
import { RoomsPanel } from '../features/rooms/RoomsPanel'
import { RoomView } from '../features/rooms/RoomView'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { useAuth } from '../hooks/useAuth.ts'
import { useRooms } from '../hooks/useRooms.ts'

const App = () => {
  const { user, loading, signOut } = useAuth()
  const { activeRoomId } = useRooms()

  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-10 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="frosted-dot absolute left-[-10%] top-[-20%] h-[360px] w-[360px] opacity-60" />
        <div className="frosted-dot absolute bottom-[-10%] right-[-5%] h-[280px] w-[280px] opacity-50" />
      </div>

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between">
        <div>
          <Badge className="border-accent/30 text-accent">Private for two</Badge>
          <h1 className="mt-3 text-3xl font-semibold">Tether</h1>
          <p className="mt-2 max-w-lg text-sm text-white/60">
            A shared room for real-time chat, presence, and synced music moments.
          </p>
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold">{user.displayName ?? 'You'}</p>
              <p className="text-xs text-white/50">{user.email}</p>
            </div>
            <Button variant="ghost" onClick={signOut}>
              Sign out
            </Button>
          </div>
        ) : null}
      </header>

      <main className="relative mx-auto mt-10 grid w-full max-w-6xl gap-6">
        {loading ? (
          <div className="glass-panel rounded-xl p-10 text-center">Loading your space...</div>
        ) : null}
        {!loading && !user ? (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <AuthPanel />
            <div className="glass-panel rounded-xl p-6 brutal-border">
              <h2>Stay tethered</h2>
              <p className="mt-2 text-sm text-white/70">
                Build a private room for two, see each other online, and stay synced through every track.
              </p>
              <div className="mt-6 grid gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold">Real-time presence</p>
                  <p className="mt-1 text-xs text-white/60">Instantly see when your partner is online.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold">Synchronized YouTube</p>
                  <p className="mt-1 text-xs text-white/60">Play, pause, and stay within 500ms.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold">Invite-only rooms</p>
                  <p className="mt-1 text-xs text-white/60">Share a room code with just one person.</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {user ? (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <RoomsPanel />
            {activeRoomId ? (
              <RoomView roomId={activeRoomId} />
            ) : (
              <div className="glass-panel rounded-xl p-8 brutal-border">
                <h2>No room selected</h2>
                <p className="mt-2 text-sm text-white/60">
                  Create or join a room to unlock chat and synced music.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </main>
    </div>
  )
}

export default App
