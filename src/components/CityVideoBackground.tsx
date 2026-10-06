import { useEffect, useRef, useState } from 'react'

const VIDEO_SRC = '/iron-key-nyc-hero-forward.mp4'
const TRANSITION_LEAD = 0.6
const SWAP_DELAY = 650

export default function CityVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const changingRef = useRef(false)
  const resetTimerRef = useRef<number | null>(null)
  const [ready, setReady] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => () => {
    if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current)
  }, [])

  function beginTransition() {
    const video = videoRef.current
    if (!video || changingRef.current) return

    changingRef.current = true
    setTransitioning(true)
    resetTimerRef.current = window.setTimeout(() => {
      video.src = VIDEO_SRC
      video.load()
      void video.play().catch(() => {
        changingRef.current = false
        setTransitioning(false)
      })
      resetTimerRef.current = null
    }, SWAP_DELAY)
  }

  function prepareReset() {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration)) return
    if (video.duration - video.currentTime <= TRANSITION_LEAD) beginTransition()
  }

  function revealVideo() {
    setReady(true)
    if (changingRef.current) {
      changingRef.current = false
      setTransitioning(false)
    }
  }

  return <>
    <video
      ref={videoRef}
      className={`hero-cinema__media${ready ? ' is-ready' : ''}${transitioning ? ' is-transitioning' : ''}`}
      src={VIDEO_SRC}
      autoPlay
      muted
      playsInline
      preload="auto"
      poster="/iron-key-nyc-poster.jpg"
      aria-hidden="true"
      onCanPlay={revealVideo}
      onTimeUpdate={prepareReset}
      onEnded={beginTransition}
    />
    <div className="hero-cinema__veil" aria-hidden="true" />
  </>
}
