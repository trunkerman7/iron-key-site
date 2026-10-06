import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Apply from './pages/Apply'
import FishNetwork from './pages/FishNetwork'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'

function ScrollAndTitle() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView())
    } else {
      window.scrollTo(0, 0)
    }
    const params = new URLSearchParams(window.location.search)
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      const value = params.get(key)
      if (value) sessionStorage.setItem(key, value)
    }
    const labels: Record<string, string> = {
      '/': 'Iron Key | Capital needs new managers',
      '/apply': 'Start a conversation | Iron Key',
      '/fish-network': 'The Neofund Thesis | Iron Key',
      '/privacy': 'Privacy | Iron Key',
      '/terms': 'Terms | Iron Key',
    }
    document.title = labels[pathname] ?? 'Iron Key'
    const base = 'https://www.ironkeycapital.com'
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${base}${pathname === '/' ? '' : pathname}`
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollAndTitle />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="program" element={<Navigate to="/#programme" replace />} />
          <Route path="about" element={<Navigate to="/#firm" replace />} />
          <Route path="guide" element={<Navigate to="/apply" replace />} />
          <Route path="apply" element={<Apply />} />
          <Route path="fish-network" element={<FishNetwork />} />
          <Route path="privacy" element={<Legal type="privacy" />} />
          <Route path="terms" element={<Legal type="terms" />} />
          <Route path="emerging-manager" element={<Navigate to="/program" replace />} />
          <Route path="vc-pro" element={<Navigate to="/program" replace />} />
          <Route path="air" element={<Navigate to="/program" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
