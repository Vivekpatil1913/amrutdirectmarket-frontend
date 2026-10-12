import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Header.css'

const NAV_LINKS = [
  { to: '/', label: 'Home', labelMr: 'मुख्यपृष्ठ' },
  { to: '/about', label: 'About', labelMr: 'आमच्याबद्दल' },
  { to: '/exhibitions', label: 'Exhibitions', labelMr: 'प्रदर्शने' },
  { to: '/stall-booking', label: 'Book a Stall', labelMr: 'स्टॉल बुकिंग' },
  { to: '/categories', label: 'Categories', labelMr: 'श्रेणी' },
  { to: '/gallery', label: 'Gallery', labelMr: 'गॅलरी' },
  { to: '/contact', label: 'Contact', labelMr: 'संपर्क' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [lang, setLang] = useState('en')
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  return (
    <>
      <div className="site-header">
      <div className="top-bar">
        <div className="container top-bar__inner">
          <span className="top-bar__text">
            <span className="top-bar__dot" />
            महाराष्ट्र शासन पुरस्कृत | Government of Maharashtra Initiative
          </span>
          <div className="top-bar__actions">
            <a href="tel:+919730151450" className="top-bar__link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
              +91 97301 51450
            </a>
            <a href="mailto:info@mahaamrut.org.in" className="top-bar__link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              info@mahaamrut.org.in
            </a>
            <button
              className="top-bar__lang"
              onClick={() => setLang(l => l === 'en' ? 'mr' : 'en')}
              aria-label="Toggle language"
            >
              {lang === 'en' ? 'मराठी' : 'English'}
            </button>
          </div>
        </div>
      </div>

      <header className={`header${scrolled ? ' header--scrolled' : ''}`} role="banner">
        <div className="container header__inner">
          <Link to="/" className="header__logo" aria-label="AMRUT Peth Home">
            <div className="header__logo-icon">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="18" fill="#b4501d"/>
                <text x="18" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="serif">अ</text>
              </svg>
            </div>
            <div className="header__logo-text">
              <span className="header__logo-title">AMRUT Peth</span>
              <span className="header__logo-sub">थेट बाजार | Direct Market</span>
            </div>
          </Link>

          <nav className="header__nav" aria-label="Main navigation">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `header__nav-link${isActive ? ' active' : ''}`}
              >
                {lang === 'en' ? link.label : link.labelMr}
              </NavLink>
            ))}
          </nav>

          <div className="header__cta">
            <Link to="/beneficiaries" className="btn btn--ghost btn--sm hide-mobile">
              Exhibitors
            </Link>
            <Link to="/stall-booking" className="btn btn--primary btn--sm">
              Book a Stall
            </Link>
            <button
              className="header__burger"
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <span className={`burger-icon${open ? ' open' : ''}`}>
                <span/><span/><span/>
              </span>
            </button>
          </div>
        </div>
      </header>
      </div>{/* /site-header */}

      {/* Mobile drawer */}
      <div className={`mobile-nav${open ? ' mobile-nav--open' : ''}`} aria-hidden={!open}>
        <div className="mobile-nav__header">
          <span className="mobile-nav__brand">AMRUT Peth</span>
          <button onClick={() => setOpen(false)} className="mobile-nav__close" aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <nav className="mobile-nav__links">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `mobile-nav__link${isActive ? ' active' : ''}`}
            >
              {link.label}
              <span className="mobile-nav__label-mr">{link.labelMr}</span>
            </NavLink>
          ))}
          <NavLink to="/beneficiaries" className="mobile-nav__link">
            Registered Exhibitors
            <span className="mobile-nav__label-mr">नोंदणीकृत प्रदर्शक</span>
          </NavLink>
        </nav>
        <div className="mobile-nav__footer">
          <Link to="/stall-booking" className="btn btn--primary" style={{width:'100%', justifyContent:'center'}}>
            Book a Stall — ₹950
          </Link>
        </div>
      </div>
      {open && <div className="mobile-nav__overlay" onClick={() => setOpen(false)} />}
    </>
  )
}
