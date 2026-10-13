import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import LanguageSwitch from './LanguageSwitch'
import logo from '../../assets/amrut-logo.png'
import { CONTACT, NAV_ITEMS } from '../../data/site'
import { useLanguage } from '../../i18n/LanguageContext'
import './Header.css'

const TEXT_SCALES = [0.9, 1, 1.125]
const SCALE_KEY = 'amrut_text_scale'

const readScale = () => {
  try {
    const saved = localStorage.getItem(SCALE_KEY)
    const i = saved === null ? NaN : Number(saved)
    return Number.isInteger(i) && TEXT_SCALES[i] ? i : 1
  } catch {
    return 1
  }
}

// Scrolls to a home-page section, navigating home first when needed.
export function useSectionNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return id => {
    if (pathname !== '/') {
      navigate({ pathname: '/', hash: `#${id}` })
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(window.history.state, '', `#${id}`)
  }
}

export default function Header() {
  const { t } = useLanguage()
  const goTo = useSectionNav()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [scale, setScale] = useState(readScale)
  const onHome = pathname === '/'

  useEffect(() => {
    document.documentElement.style.fontSize = `${TEXT_SCALES[scale] * 100}%`
    try {
      localStorage.setItem(SCALE_KEY, String(scale))
    } catch {
      /* ignore */
    }
  }, [scale])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Sliding pill behind the active link, measured so it fits either language.
  const listRef = useRef(null)
  const [pill, setPill] = useState(null)
  const activeId = onHome ? active : null
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return undefined
    const place = () => {
      const link = activeId && list.querySelector(`[data-nav="${activeId}"]`)
      setPill(link ? { x: link.offsetLeft, w: link.offsetWidth } : null)
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(list)
    return () => ro.disconnect()
  }, [activeId, t])

  // Highlight the nav item for the section currently in view.
  useEffect(() => {
    if (!onHome || !('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [onHome])

  useEffect(() => {
    if (!open) return undefined
    const onKey = e => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth >= 1100 && setOpen(false)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    document.body.classList.add('menu-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      document.body.classList.remove('menu-open')
    }
  }, [open])

  const onNav = (e, id) => {
    e.preventDefault()
    if (!open) {
      goTo(id)
      return
    }
    // The open menu sits inside the sticky header and pushes the page down;
    // scroll only after it has closed so the target position is correct.
    setOpen(false)
    requestAnimationFrame(() => requestAnimationFrame(() => goTo(id)))
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t.a11y.skip}
      </a>
      <div className="govbar">
        <div className="container govbar__inner">
          <p className="govbar__id">
            <span className="govbar__state">{t.gov.state}</span>
            <span className="govbar__sep" aria-hidden="true" />
            <span className="govbar__org">{t.gov.org}</span>
          </p>
          <div className="govbar__tools">
            <p className="govbar__preview" title={t.preview.banner}>
              <Icon name="info" size={14} />
              <span className="govbar__preview-long">{t.preview.banner}</span>
              <span className="govbar__preview-short" aria-hidden="true">
                {t.preview.short}
              </span>
            </p>
            <div className="textsize" role="group" aria-label={t.a11y.textSize}>
              {[
                ['A−', t.a11y.smaller],
                ['A', t.a11y.reset],
                ['A+', t.a11y.larger],
              ].map(([label, aria], i) => (
                <button
                  key={label}
                  type="button"
                  className="textsize__btn"
                  aria-label={aria}
                  aria-pressed={scale === i}
                  onClick={() => setScale(i)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
        <div className="container site-header__inner">
          <Link to="/" className="brand" onClick={e => onHome && onNav(e, 'home')}>
            <img src={logo} alt={t.a11y.logoAlt} width="383" height="86" className="brand__logo" />
            <span className="brand__divider" aria-hidden="true" />
            <span className="brand__name">{t.brand.name}</span>
          </Link>

          <nav className="nav" aria-label={t.a11y.mainNav}>
            <ul className="nav__list" ref={listRef}>
              <li
                className={`nav__pill${pill ? ' is-on' : ''}`}
                aria-hidden="true"
                style={pill ? { transform: `translateX(${pill.x}px)`, width: pill.w } : undefined}
              />
              {NAV_ITEMS.map(({ id, key }) => (
                <li key={id}>
                  <a
                    href={`/#${id}`}
                    data-nav={id}
                    className={`nav__link${activeId === id ? ' is-active' : ''}`}
                    aria-current={activeId === id ? 'true' : undefined}
                    onClick={e => onNav(e, id)}
                  >
                    {t.nav[key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__actions">
            <LanguageSwitch />
            <a href="/#register" className="btn btn--primary btn--sm site-header__cta" onClick={e => onNav(e, 'register')}>
              {t.nav.cta}
              <Icon name="arrowRight" size={15} />
            </a>
            <button
              type="button"
              className="icon-btn menu-toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
              onClick={() => setOpen(o => !o)}
            >
              <Icon name={open ? 'close' : 'menu'} size={20} />
            </button>
          </div>
        </div>

        <div id="mobile-menu" className="mobile-menu" hidden={!open}>
          <nav className="container" aria-label={t.a11y.mainNav}>
            <ul className="mobile-menu__list">
              {NAV_ITEMS.map(({ id, key }, i) => (
                <li key={id} style={{ '--i': i }}>
                  <a href={`/#${id}`} className="mobile-menu__link" onClick={e => onNav(e, id)}>
                    {t.nav[key]}
                    <Icon name="arrowRight" size={18} />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mobile-menu__foot">
              <a href="/#register" className="btn btn--primary" onClick={e => onNav(e, 'register')}>
                {t.nav.cta}
              </a>
              <a className="mobile-menu__admin" href={`tel:${CONTACT.phone}`}>
                <Icon name="phone" size={16} />
                {CONTACT.phoneLabel}
              </a>
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
