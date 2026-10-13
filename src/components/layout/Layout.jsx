import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useLanguage } from '../../i18n/LanguageContext'

export default function Layout() {
  const { pathname, hash } = useLocation()
  const { lang, switching } = useLanguage()

  // Honour section links such as /#register (including redirects from the
  // old multi-page URLs); otherwise start each page at the top.
  useEffect(() => {
    const id = hash.slice(1)
    if (!id) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return undefined
    }
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 60)
    return () => window.clearTimeout(timer)
  }, [pathname, hash])

  return (
    <div className={`app lang-${lang}${switching ? ' is-switching' : ''}`}>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
