import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import SiteHead from './SiteHead'
import Icon from '../ui/Icon'
import { useLanguage } from '../../i18n/LanguageContext'
import { SiteContentProvider, useSite } from '../../content/SiteContent'

// Loading, failure and "showing cached content" states for the CMS content.
// Only a first visit with the API unreachable ends up on the error panel; any
// earlier successful load is shown instead with a small notice.
function Content() {
  const { status, reload } = useSite()
  const { t } = useLanguage()

  if (status === 'loading') {
    return (
      <div className="site-state" role="status" aria-live="polite">
        <div className="site-state__box">
          <span className="site-spinner" aria-hidden="true" />
          <p>{t.state.loading}</p>
        </div>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="site-state" role="alert">
        <div className="site-state__box">
          <span className="site-state__icon">
            <Icon name="alert" size={22} />
          </span>
          <h1 className="site-state__title">{t.state.loadError}</h1>
          <p>{t.state.loadErrorHint}</p>
          <button type="button" className="btn btn--primary" onClick={reload}>
            {t.state.retry}
          </button>
        </div>
      </div>
    )
  }
  return (
    <>
      {status === 'offline' && (
        <p className="site-offline" role="status">
          <Icon name="info" size={16} />
          {t.state.offline}
          <button type="button" onClick={reload}>
            {t.state.retry}
          </button>
        </p>
      )}
      <Outlet />
    </>
  )
}

function Shell() {
  const { pathname, hash } = useLocation()
  const { lang, switching } = useLanguage()
  const { status } = useSite()
  const ready = status !== 'loading' && status !== 'error'

  // Honour section links such as /#register (including redirects from the
  // old multi-page URLs) once the content has rendered; otherwise start each
  // page at the top.
  useEffect(() => {
    const id = hash.slice(1)
    if (!id) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return undefined
    }
    if (!ready) return undefined
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 60)
    return () => window.clearTimeout(timer)
  }, [pathname, hash, ready])

  return (
    <div className={`app lang-${lang}${switching ? ' is-switching' : ''}`}>
      <SiteHead />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Content />
      </main>
      <Footer />
    </div>
  )
}

export default function Layout() {
  return (
    <SiteContentProvider>
      <Shell />
    </SiteContentProvider>
  )
}
