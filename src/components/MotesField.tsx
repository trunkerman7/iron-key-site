import { createMotes, type BuiltinEffect, type MotesInstance } from '@lucasmarkes/motes'
import { useEffect, useRef } from 'react'

type MotesFieldProps = {
  effect: BuiltinEffect
  ink: string
  accent: string
  className?: string
  density?: number
}

export default function MotesField({ effect, ink, accent, className = '', density = 11 }: MotesFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const instanceRef = useRef<MotesInstance | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let instance: MotesInstance
    try {
      instance = createMotes(canvas, {
        effect,
        pointer: true,
        radius: 150,
        force: 1.55,
        speed: 0.48,
        density,
        charset: ' .:-=+*#%@',
        background: 'transparent',
        ink,
        accent,
        contrast: 1.08,
        brightness: -0.06,
        trail: 0.24,
        respectMotionPreference: true,
      })
    } catch {
      canvas.dataset.unavailable = 'true'
      return
    }

    instanceRef.current = instance
    let visible = false
    const sync = () => {
      if (visible && document.visibilityState === 'visible') instance.start()
      else instance.stop()
    }
    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false
      sync()
    }, { rootMargin: '80px' })
    const onVisibility = () => sync()
    observer.observe(canvas)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      instance.destroy()
      instanceRef.current = null
    }
  }, [accent, density, effect, ink])

  return <canvas ref={canvasRef} className={`motes-field ${className}`.trim()} aria-hidden="true" />
}
