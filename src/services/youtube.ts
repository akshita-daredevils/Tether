import { doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from 'firebase/firestore'
import { db } from './firebase'
import type { PlayerState } from '../types/models'

const playerStateRef = (roomId: string) => doc(db, 'rooms', roomId, 'playerState', 'state')

let youTubeApiPromise: Promise<void> | null = null

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          videoId?: string
          playerVars?: Record<string, number | string>
          events?: {
            onReady?: (event: { target: YouTubePlayer }) => void
            onStateChange?: (event: { data: number; target: YouTubePlayer }) => void
          }
        },
      ) => YouTubePlayer
      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

export type YouTubePlayer = {
  getCurrentTime: () => number
  getPlayerState: () => number
  loadVideoById: (videoId: string, startSeconds?: number) => void
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
}

export const ensureYouTubeIframeApi = (): Promise<void> => {
  if (window.YT?.Player) {
    return Promise.resolve()
  }
  if (youTubeApiPromise) {
    return youTubeApiPromise
  }

  youTubeApiPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[data-yt-iframe]')
    if (!existing) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      script.dataset.ytIframe = 'true'
      document.body.appendChild(script)
    }
    window.onYouTubeIframeAPIReady = () => resolve()
  })

  return youTubeApiPromise
}

export const listenToPlayerState = (
  roomId: string,
  handler: (state: PlayerState | null) => void,
): Unsubscribe =>
  onSnapshot(playerStateRef(roomId), (snapshot) => {
    if (!snapshot.exists()) {
      handler(null)
      return
    }
    const data = snapshot.data()
    handler({
      videoId: typeof data.videoId === 'string' ? data.videoId : '',
      isPlaying: Boolean(data.isPlaying),
      timestamp: typeof data.timestamp === 'number' ? data.timestamp : 0,
      updatedBy: typeof data.updatedBy === 'string' ? data.updatedBy : '',
      updatedAt: data.updatedAt ?? null,
    })
  })

export const updatePlayerState = async (
  roomId: string,
  state: Omit<PlayerState, 'updatedAt'>,
): Promise<void> => {
  await setDoc(
    playerStateRef(roomId),
    {
      ...state,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const extractVideoId = (input: string): string | null => {
  const trimmed = input.trim()
  if (!trimmed) {
    return null
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }

  try {
    const url = new URL(trimmed)
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.split('/').filter(Boolean)[0]
      return id && id.length === 11 ? id : null
    }
    if (url.hostname.includes('youtube.com')) {
      const id = url.searchParams.get('v')
      return id && id.length === 11 ? id : null
    }
  } catch {
    return null
  }

  return null
}
