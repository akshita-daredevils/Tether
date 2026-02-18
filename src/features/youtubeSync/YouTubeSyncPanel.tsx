import { Panel } from '../../components/Panel'
import { TextInput } from '../../components/TextInput'
import { Button } from '../../components/Button'
import { useYouTubeSync } from '../../hooks/useYouTubeSync'

type YouTubeSyncPanelProps = {
  roomId: string
}

export const YouTubeSyncPanel = ({ roomId }: YouTubeSyncPanelProps) => {
  const {
    playerContainerId,
    videoInput,
    setVideoInput,
    applyVideo,
    togglePlay,
    playerReady,
    status,
    error,
    isPlaying,
  } = useYouTubeSync(roomId)

  return (
    <Panel title="YouTube sync" description="Drop a video ID and stay perfectly in sync." className="neo-card">
      <div className="grid gap-4">
        <div className="flex items-center gap-2">
          <TextInput
            placeholder="YouTube URL or ID"
            value={videoInput}
            onChange={(event) => setVideoInput(event.target.value)}
          />
          <Button variant="glass" onClick={applyVideo}>
            Load
          </Button>
        </div>
        {error ? <p className="text-xs text-accent3">{error}</p> : null}
        <div className="flex items-center gap-2">
          <Button onClick={togglePlay} disabled={!playerReady}>
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <p className="text-xs text-white/60">{status}</p>
        </div>
        <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/40">
          <div id={playerContainerId} className="h-full w-full" />
        </div>
      </div>
    </Panel>
  )
}
