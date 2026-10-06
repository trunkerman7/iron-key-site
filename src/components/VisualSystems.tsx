import { useEffect, useMemo, useRef, useState } from 'react'
import MotesField from './MotesField'

type DitherVariant = 'hero' | 'footer'
type VehicleType = 'club' | 'deal' | 'spv' | 'fund'

const stageContent = [
  {
    index: '01',
    status: 'Strategy defined',
    title: 'Investment judgment',
    rows: [['Mandate', 'Defined'], ['Vehicle criteria', 'Established'], ['Operating standard', 'Established']],
  },
  {
    index: '02',
    status: 'Vehicle active',
    title: 'Capital in motion',
    rows: [['Mandate', 'Defined'], ['Vehicle', 'Right-sized'], ['Record', 'Live']],
  },
  {
    index: '03',
    status: 'Record building',
    title: 'Evidence compounds',
    rows: [['Decisions', 'Dated'], ['Reporting', 'Current'], ['Governance', 'Recorded']],
  },
  {
    index: '04',
    status: 'Fund preparation',
    title: 'A firm takes shape',
    rows: [['Mandate', 'Proven'], ['Record', 'Diligence-ready'], ['Next vehicle', 'Fund']],
  },
]

function seeded(index: number) {
  const value = Math.sin(index * 91.733) * 43758.5453
  return value - Math.floor(value)
}

export function DitherField({ variant = 'hero', className = '' }: { variant?: DitherVariant; className?: string }) {
  const points = useMemo(() => {
    const width = variant === 'footer' ? 1200 : 720
    const height = variant === 'footer' ? 620 : 560
    const columns = variant === 'footer' ? 74 : 46
    const rows = variant === 'footer' ? 34 : 30
    const gapX = width / columns
    const gapY = height / rows
    const result: Array<{ x: number; y: number; radius: number; opacity: number }> = []

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column
        const x = column * gapX + (seeded(index) - 0.5) * gapX * 0.5
        const y = row * gapY + (seeded(index + 17) - 0.5) * gapY * 0.5
        const wave = height * 0.5 + Math.sin(x / (variant === 'footer' ? 150 : 92)) * height * 0.18
        const distance = Math.abs(y - wave) / (height * 0.28)
        const band = Math.max(0, 1 - distance)
        const field = (Math.sin(x * 0.021 + y * 0.013) + 1) * 0.2
        const density = Math.min(1, band * 0.78 + field)
        if (density < seeded(index + 49) * 0.58) continue
        result.push({
          x,
          y,
          radius: 0.45 + density * (variant === 'footer' ? 2.15 : 1.8),
          opacity: 0.18 + density * 0.72,
        })
      }
    }
    return { width, height, points: result }
  }, [variant])

  return (
    <svg className={`dither-field dither-field--${variant} ${className}`} viewBox={`0 0 ${points.width} ${points.height}`} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <g className="dither-field__drift">
        {points.points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r={point.radius} opacity={point.opacity} />)}
      </g>
    </svg>
  )
}

export function ManagerRecord({ stage = 0, compact = false }: { stage?: number; compact?: boolean }) {
  const content = stageContent[Math.min(Math.max(stage, 0), stageContent.length - 1)]
  return (
    <div className={`manager-record manager-record--stage-${stage} ${compact ? 'is-compact' : ''}`}>
      <DitherField />
      <div className="record-shadow record-shadow--one" />
      <div className="record-shadow record-shadow--two" />
      <article className="record-folio" aria-label={`Manager record: ${content.status}`}>
        <div className="record-folio__topline"><span>Iron Key / Manager Record</span><span>{content.index} / 04</span></div>
        <div className="record-seal" aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" />
            <circle cx="50" cy="50" r="28" />
            <path d="M27 58 50 27l23 31M33 67h34M50 27v40" />
          </svg>
        </div>
        <div className="record-folio__status"><span>Status</span><strong>{content.status}</strong></div>
        <h3>{content.title}</h3>
        <div className="record-folio__rows">
          {content.rows.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
        </div>
        <div className="record-folio__serial"><span>IK / 2026 / EM</span></div>
      </article>
    </div>
  )
}

const vehicleFields = {
  club: { effect: 'flow', ink: '#729789', accent: '#183f33' },
  deal: { effect: 'waves', ink: '#9b895d', accent: '#5b481e' },
  spv: { effect: 'contour', ink: '#7d83b4', accent: '#333c83' },
  fund: { effect: 'moire', ink: '#557e70', accent: '#0d3329' },
} as const

const archiveEffects = ['flow', 'waves', 'contour', 'moire', 'aurora', 'smoke'] as const

export function VehicleArtwork({ type, patternIndex }: { type: VehicleType; patternIndex?: number }) {
  const field = vehicleFields[type]
  const effect = patternIndex === undefined ? 'flow' : archiveEffects[patternIndex % archiveEffects.length]
  return <MotesField className={`vehicle-art vehicle-art--${type}`} effect={effect} ink={field.ink} accent={field.accent} />
}

const pathStages = [
  ['01', 'Define the strategy', 'Turn experience and conviction into a mandate with edges.'],
  ['02', 'Choose the vehicle', 'Use the structure that matches the capital, the strategy and where you are now.'],
  ['03', 'Run the record', 'Deploy, decide, govern and report in a way another investor can inspect.'],
  ['04', 'Build the firm', 'Take a body of work to market instead of asking LPs to fund a blank page.'],
]

export function PathSequence() {
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return
    const sections = Array.from(root.current.querySelectorAll<HTMLElement>('[data-path-stage]'))
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.pathStage ?? 0))
    }, { rootMargin: '-30% 0px -42% 0px', threshold: [0.15, 0.45, 0.75] })
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="path-sequence" ref={root}>
      <div className="path-sequence__visual"><ManagerRecord stage={active} compact /></div>
      <div className="path-sequence__steps">
        {pathStages.map(([number, title, body], index) => (
          <article key={number} data-path-stage={index} className={active === index ? 'is-active' : ''}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

const archiveItems = [
  ['Mandate', 'What the manager will own, where they will act and where they will not.'],
  ['Decisions', 'The reasoning behind each action, captured when the decision is made.'],
  ['Capital', 'Calls, allocations and movements tied to the vehicle and its investors.'],
  ['Governance', 'Approvals, responsibilities and exceptions made visible over time.'],
  ['Reporting', 'A consistent account of portfolio activity, performance and material change.'],
  ['Readiness', 'The body of evidence taken into fund design and future LP diligence.'],
]

export function RecordArchive() {
  const [active, setActive] = useState(0)
  const [title, body] = archiveItems[active]

  return (
    <div className="record-archive">
      <div className="record-archive__index" aria-label="Record components">
        {archiveItems.map(([item], index) => (
          <button key={item} type="button" aria-pressed={active === index} onClick={() => setActive(index)} onPointerEnter={() => setActive(index)} onFocus={() => setActive(index)}>
            <span>0{index + 1}</span><strong>{item}</strong><i aria-hidden="true">↗</i>
          </button>
        ))}
      </div>
      <div className="record-archive__preview">
        <div className="archive-preview__meta"><span>Operating record</span><span>0{active + 1} / 06</span></div>
        <div className="archive-preview__mark">
          <MotesField
            className="vehicle-art vehicle-art--record"
            effect={archiveEffects[active]}
            ink="#729789"
            accent="#195d4e"
          />
        </div>
        <p className="mini-label">{title}</p>
        <h3>{body}</h3>
        <div className="archive-preview__lines"><span /><span /><span /><span /></div>
      </div>
    </div>
  )
}
