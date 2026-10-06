import { useEffect, useRef, useState } from 'react'
import NeofundLedgerFigure from './NeofundLedgerFigure'

const layers = [
  { title: 'Mandate', body: 'The intended ownership and field of action: what the manager will own, where they will act and where they will not.' },
  { title: 'Capital', body: 'Commitment, allocation, deployment and returns, connected to the vehicle and the people behind it.' },
  { title: 'Ownership', body: 'The rights, responsibilities and economic interests that define how the organization is held.' },
  { title: 'Decisions', body: 'The reasoning, approvals and exceptions that make the manager’s judgment observable over time.' },
  { title: 'Reputation', body: 'Observable judgment, communication and operating behavior that can compound into institutional trust.' },
]

export default function NeofundStory() {
  const storyRef = useRef<HTMLDivElement>(null)
  const [scrollIndex, setScrollIndex] = useState(0)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const activeIndex = previewIndex ?? scrollIndex

  useEffect(() => {
    const root = storyRef.current
    if (!root) return
    const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-neofund-layer]'))
    const intersecting = new Set<HTMLElement>()
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const row = entry.target as HTMLElement
        if (entry.isIntersecting) intersecting.add(row)
        else intersecting.delete(row)
      })
      const center = window.innerHeight / 2
      const visible = [...intersecting]
        .sort((a, b) => {
          const aRect = a.getBoundingClientRect()
          const bRect = b.getBoundingClientRect()
          const aCenter = aRect.top + aRect.height / 2
          const bCenter = bRect.top + bRect.height / 2
          return Math.abs(aCenter - center) - Math.abs(bCenter - center)
        })[0]
      if (visible) setScrollIndex(Number(visible.dataset.neofundLayer ?? 0))
    }, { rootMargin: '-38% 0px -38% 0px', threshold: [0, 0.01, 0.25, 0.5, 1] })
    rows.forEach(row => observer.observe(row))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="page-frame neofund-story" ref={storyRef}>
      <div className="neofund-copy">
        <p className="eyebrow">What the manager builds toward</p>
        <h2>The Neofund is what a prepared manager can build toward.</h2>
        <p className="neofund-bridge">Iron Key establishes the human foundation first: a focused mandate, an appropriate vehicle and an operating record that makes the manager’s judgment visible.</p>
        <p className="neofund-definition"><strong>A Neofund is the organization that can follow.</strong> As the record develops, its mandate, capital, ownership, decisions and reputation can progress on connected infrastructure rather than across disconnected documents and service providers.</p>
      </div>
      <div className="neofund-story__sequence">
        <div className="neofund-story__visual-rail">
          <div className="neofund-story__visual">
            <NeofundLedgerFigure activeIndex={activeIndex} labels={layers.map(layer => layer.title)} onPreviewChange={setPreviewIndex} />
          </div>
        </div>
        <div className="neofund-story__rows">
          {layers.map((layer, index) => (
            <article
              key={layer.title}
              data-neofund-layer={index}
              className={activeIndex === index ? 'is-active' : ''}
              tabIndex={0}
              onPointerEnter={() => setPreviewIndex(index)}
              onPointerLeave={() => setPreviewIndex(null)}
              onFocus={() => setPreviewIndex(index)}
              onBlur={() => setPreviewIndex(null)}
            >
              <span className="neofund-story__number">0{index + 1}</span>
              <div className="neofund-story__content">
                <h3>{layer.title}</h3>
                <p>{layer.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
