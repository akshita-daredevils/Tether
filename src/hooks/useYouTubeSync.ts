import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from './useAuth.ts'
import {
  ensureYouTubeIframeApi,
  extractVideoId,
  listenToPlayerState,
  updatePlayerState,
  type YouTubePlayer,
} from '../services/youtube'
import type { PlayerState } from '../types/models'

const SYNC_INTERVAL_MS = 3000
const DRIFT_THRESHOLD_SECONDS = 0.5

export const useYouTubeSync = (roomId: string | null) => {
  const { user } = useAuth()
  const [remoteState, setRemoteState] = useState<PlayerState | null>(null)
  const [playerReady, setPlayerReady] = useState(false)
  const [videoInput, setVideoInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [activeVideoId, setActiveVideoId] = useState('')

  const playerRef = useRef<YouTubePlayer | null>(null)
  const currentVideoIdRef = useRef('')
  const suppressUpdateRef = useRef(false)

  useEffect(() => {
    if (!roomId) {
      return
    }

    const unsubscribe = listenToPlayerState(roomId, (state) => {
      setRemoteState(state)
      setActiveVideoId(state?.videoId ?? '')
    })
    return () => unsubscribe()
  }, [roomId])

  useEffect(() => {
    if (!roomId || !user) {
      return
    }

    let mounted = true
    void ensureYouTubeIframeApi().then(() => {
      if (!mounted || playerRef.current) {
        return
      }

      const containerId = 'tether-player'
      playerRef.current = new window.YT!.Player(containerId, {
        videoId: currentVideoIdRef.current || undefined,
        playerVars: {
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            if (mounted) {
              setPlayerReady(true)
            }
          },
          onStateChange: (event) => {
            if (suppressUpdateRef.current || !roomId || !user) {
              return
            }
            const nextPlaying = event.data === window.YT!.PlayerState.PLAYING
            const currentTime = event.target.getCurrentTime()
            const currentVideoId = currentVideoIdRef.current
            if (!currentVideoId) {
              return
            }
            void updatePlayerState(roomId, {
              videoId: currentVideoId,
              isPlaying: nextPlaying,
              timestamp: currentTime,
              updatedBy: user.uid,
            })
          },
        },
      })
    })

    return () => {
      mounted = false
    }
  }, [roomId, user])

  useEffect(() => {
    if (!playerReady || !roomId || !user) {
      return
    }

    const interval = window.setInterval(() => {
      const player = playerRef.current
      if (!player || !currentVideoIdRef.current) {
        return
      }
      const state = player.getPlayerState()
      if (state === window.YT!.PlayerState.PLAYING) {
        void updatePlayerState(roomId, {
          videoId: currentVideoIdRef.current,
          isPlaying: true,
          timestamp: player.getCurrentTime(),
          updatedBy: user.uid,
        })
      }
    }, SYNC_INTERVAL_MS)

    return () => window.clearInterval(interval)
  }, [playerReady, roomId, user])

  useEffect(() => {
    const player = playerRef.current
    if (!playerReady || !player || !remoteState || !user) {
      return
    }

    if (remoteState.updatedBy === user.uid) {
      return
    }

    suppressUpdateRef.current = true

    if (remoteState.videoId && remoteState.videoId !== currentVideoIdRef.current) {
      currentVideoIdRef.current = remoteState.videoId
      player.loadVideoById(remoteState.videoId, remoteState.timestamp)
    }

    if (remoteState.isPlaying) {
      player.playVideo()
    } else {
      player.pauseVideo()
    }

    const drift = Math.abs(player.getCurrentTime() - remoteState.timestamp)
    if (drift > DRIFT_THRESHOLD_SECONDS) {
      player.seekTo(remoteState.timestamp, true)
    }

    window.setTimeout(() => {
      suppressUpdateRef.current = false
    }, 500)
  }, [playerReady, remoteState, user])

  const applyVideo = async () => {
    if (!roomId || !user) {
      return
    }
    const nextId = extractVideoId(videoInput)
    if (!nextId) {
      setError('Enter a valid YouTube video URL or ID.')
      return
    }
    setError(null)
    currentVideoIdRef.current = nextId
    setActiveVideoId(nextId)
    if (playerRef.current) {
      playerRef.current.loadVideoById(nextId, 0)
    }
    await updatePlayerState(roomId, {
      videoId: nextId,
      isPlaying: false,
      timestamp: 0,
      updatedBy: user.uid,
    })
  }

  const togglePlay = async () => {
    const player = playerRef.current
    if (!player || !roomId || !user || !currentVideoIdRef.current) {
      return
    }
    const currentIsPlaying = remoteState?.isPlaying ?? false
    if (currentIsPlaying) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
    await updatePlayerState(roomId, {
      videoId: currentVideoIdRef.current,
      isPlaying: !currentIsPlaying,
      timestamp: player.getCurrentTime(),
      updatedBy: user.uid,
    })
  }

  const status = useMemo(() => {
    if (!roomId) {
      return 'No room selected.'
    }
    if (!playerReady) {
      return 'Loading player...'
    }
    if (!activeVideoId) {
      return 'Paste a video link to start.'
    }
    return (remoteState?.isPlaying ?? false) ? 'Syncing playback.' : 'Paused and synced.'
  }, [roomId, playerReady, activeVideoId, remoteState])

  return {
    playerContainerId: 'tether-player',
    videoInput,
    setVideoInput,
    applyVideo,
    togglePlay,
    playerReady,
    status,
    error,
    isPlaying: remoteState?.isPlaying ?? false,
  }
}
