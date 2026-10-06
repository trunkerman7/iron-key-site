import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const nav = [
  ['/#firm', 'The Firm'],
  ['/#vehicles', 'Advisory'],
  ['/fish-network', 'Thesis'],
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const lightHeader = location.pathname === '/privacy' || location.pathname === '/terms'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${lightHeader && !scrolled ? 'on-light' : ''}`}>
        <Link className="wordmark" to="/" aria-label="Iron Key home">
          <img className="key-logo" src="/iron-key-mark.svg" alt="" aria-hidden="true" />
          <span>Iron Key</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([href, label]) => href.startsWith('/#') ? <a key={href} href={href}>{label}</a> : <NavLink key={href} to={href}>{label}</NavLink>)}
        </nav>
        <Link className="header-cta" to="/apply">Start a conversation <span aria-hidden="true">↗</span></Link>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}><span /><span /></button>
        {open && <div className="mobile-nav" id="mobile-nav"><nav aria-label="Mobile navigation">{nav.map(([href, label]) => href.startsWith('/#') ? <a key={href} href={href}>{label}</a> : <Link key={href} to={href}>{label}</Link>)}<Link to="/apply">Start a conversation</Link></nav></div>}
      </header>
      <main id="main"><Outlet /></main>
      <footer className="site-footer" id="site-footer">
        <div className="footer-grid">
          <div className="footer-intro">
            <Link className="wordmark footer-wordmark" to="/"><img className="key-logo" src="/iron-key-mark.svg" alt="" aria-hidden="true" /><span>Iron Key</span></Link>
            <p>Ushering in the new era of fund managers.</p>
          </div>
          <nav aria-label="The firm">
            <p>The Firm</p>
            <a href="/#firm">The Firm</a>
            <a href="/#vehicles">Advisory</a>
            <Link to="/fish-network">Thesis</Link>
          </nav>
          <nav aria-label="Program">
            <p>Program</p>
            <a href="/#programme">Incubator Program</a>
            <Link to="/apply">Start a conversation</Link>
          </nav>
          <nav aria-label="Social media">
            <p>Connect</p>
            <a href="https://x.com/ironkeycapital" target="_blank" rel="noreferrer">Twitter / X</a>
            <a href="https://www.linkedin.com/company/iron-key/" target="_blank" rel="noreferrer">LinkedIn</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>Iron Key provides education. Nothing on this site is investment, legal or tax advice, an offer of securities, or a promise of results.</p>
          <div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><span>© 2026 Iron Key Ventures LLC</span></div>
        </div>
      </footer>
    </div>
  )
}
