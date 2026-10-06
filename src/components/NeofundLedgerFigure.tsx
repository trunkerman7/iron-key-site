import { useEffect, useRef, useState } from 'react'
import { Cam, facing, fit, poly, prism, proj, ringAt, rrect } from '../vendor/hairline/iso'
import { retargetTween, setReducedMotion, tween, tweenDone, tweenValue } from '../vendor/hairline/motion'

type NeofundLedgerFigureProps = {
  activeIndex: number
  labels: string[]
  onPreviewChange?: (index: number | null) => void
}

const LAYER_THICKNESS = 66
const LAYER_GAP = 19
const LAYER_STEP = LAYER_THICKNESS + LAYER_GAP
const STACK_TOP = 18 + 4 * LAYER_STEP + LAYER_THICKNESS

const camera = Cam(45, 0.5, 1.72)
fit(camera, [
  [-110, -82, 0], [110, -82, 0], [110, 82, 0], [-110, 82, 0],
  [-110, -82, STACK_TOP + 8], [110, -82, STACK_TOP + 8], [110, 82, STACK_TOP + 8], [-110, 82, STACK_TOP + 8],
], 220, 280)
const project = proj(camera)
const front = facing(camera)
const plateRing = rrect(-96, -68, 96, 68, 11, 5)
const plateInset = rrect(-86, -58, 86, 58, 7.5, 5)
const layerHeight = (index: number) => 18 + (4 - index) * LAYER_STEP

function targetLift(index: number, activeIndex: number, staticComposition: boolean): number {
  if (staticComposition) return 0
  return index === activeIndex ? 4.5 : 0
}

function pathsForLayer(index: number, lift: number) {
  const bottom = layerHeight(index) + lift
  const top = bottom + LAYER_THICKNESS
  const label = project(96, 0, bottom + LAYER_THICKNESS / 2)
  return {
    ...prism(project, front, plateRing, plateInset, bottom, top),
    top: poly(ringAt(project, plateRing, top)),
    label,
  }
}

export default function NeofundLedgerFigure({ activeIndex, labels, onPreviewChange }: NeofundLedgerFigureProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const clocks = useRef(labels.map((_, index) => tween(targetLift(index, 0, false))))
  const frame = useRef(0)
  const [lifts, setLifts] = useState(() => labels.map((_, index) => targetLift(index, 0, false)))
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === 'visible')
  const [reducedMotion, setReduced] = useState(false)
  const [staticComposition, setStaticComposition] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)')
    const compactQuery = matchMedia('(max-width: 899px)')
    const sync = () => {
      setReduced(reducedQuery.matches)
      setStaticComposition(compactQuery.matches)
    }
    sync()
    reducedQuery.addEventListener('change', sync)
    compactQuery.addEventListener('change', sync)
    return () => {
      reducedQuery.removeEventListener('change', sync)
      compactQuery.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new IntersectionObserver(entries => setInView(entries[0]?.isIntersecting ?? false), { rootMargin: '80px' })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const sync = () => setPageVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  useEffect(() => {
    setReducedMotion(reducedMotion)
    const now = performance.now()
    const targets = labels.map((_, index) => targetLift(index, activeIndex, staticComposition))
    clocks.current.forEach((clock, index) => {
      retargetTween(clock, targets[index], now, reducedMotion || staticComposition ? 0 : Math.abs(index - activeIndex) * 45)
    })
    if (reducedMotion || staticComposition) {
      setLifts(targets)
      setAnimating(false)
    } else {
      setAnimating(true)
    }
  }, [activeIndex, labels, reducedMotion, staticComposition])

  useEffect(() => {
    cancelAnimationFrame(frame.current)
    if (!animating || !inView || !pageVisible) return

    const draw = (now: number) => {
      const next = clocks.current.map(clock => tweenValue(clock, now))
      setLifts(next)
      if (clocks.current.some(clock => !tweenDone(clock, now))) frame.current = requestAnimationFrame(draw)
      else setAnimating(false)
    }
    frame.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame.current)
  }, [animating, inView, pageVisible])

  const paintOrder = labels.map((_, index) => index).reverse()

  return (
    <div
      ref={stageRef}
      className={`neofund-ledger${staticComposition ? ' is-static' : ''}`}
      aria-label={`Neofund ledger. Active layer ${activeIndex + 1}: ${labels[activeIndex]}.`}
      onPointerLeave={() => onPreviewChange?.(null)}
    >
      <svg viewBox="0 -115 440 790" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="neofund-complete-top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a8c2b7" />
            <stop offset="1" stopColor="#527f70" />
          </linearGradient>
          <linearGradient id="neofund-active-top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d1dfd8" />
            <stop offset=".48" stopColor="#6d9788" />
            <stop offset="1" stopColor="#315e50" />
          </linearGradient>
        </defs>
        {paintOrder.map(index => {
          const label = labels[index]
          const paths = pathsForLayer(index, lifts[index] ?? 0)
          const state = index === activeIndex ? ' is-complete is-active' : index < activeIndex ? ' is-complete is-traversed' : ''
          return (
            <g className={`neofund-ledger__layer${state}`} key={label}>
              <path className="neofund-ledger__solid" d={paths.sil} />
              <path className="neofund-ledger__top" d={paths.top} />
              <path className="neofund-ledger__crease" d={paths.crease} />
              <text
                className="neofund-ledger__label"
                x={paths.label[0]}
                y={paths.label[1]}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(-26.565 ${paths.label[0]} ${paths.label[1]})`}
              >{label}</text>
            </g>
          )
        })}
        {labels.map((label, index) => {
          const hitPath = poly(ringAt(project, plateRing, layerHeight(index) + LAYER_THICKNESS))
          return <path key={label} className="neofund-ledger__hit" d={hitPath} onPointerEnter={() => onPreviewChange?.(index)} />
        })}
      </svg>
    </div>
  )
}
