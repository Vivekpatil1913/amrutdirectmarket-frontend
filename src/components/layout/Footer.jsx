import Icon from '../ui/Icon'
import Mandala from '../ui/Mandala'
import logo from '../../assets/amrut-logo.png'
import { CONTACT, NAV_ITEMS } from '../../data/site'
import { useLanguage } from '../../i18n/LanguageContext'
import { useSectionNav } from './Header'
import './Footer.css'

const OFFICIAL = [
  { href: CONTACT.website, label: 'mahaamrut.org.in', icon: 'globe' },
  { href: CONTACT.facebook, label: 'Facebook', icon: 'facebook' },
  { href: CONTACT.instagram, label: 'Instagram', icon: 'instagram' },
]

export default function Footer() {
  const { t, num } = useLanguage()
  const f = t.footer
  const goTo = useSectionNav()

  return (
    <footer className="footer">
      <div className="footer__ring" aria-hidden="true" />
      <div className="container">
        <blockquote className="footer__quote">
          <Mandala className="footer__mandala" points={16} />
          <p>{f.quote}</p>
        </blockquote>
      </div>

      <div className="container footer__grid">
        <div className="footer__brand">
          <img src={logo} alt={t.a11y.logoAlt} width="383" height="86" className="footer__logo" loading="lazy" />
          <p className="footer__title">
            {t.brand.name} <span className="footer__title-mr">{t.brand.sub}</span>
          </p>
          <p className="footer__about">{f.about}</p>
          <p className="footer__gov">{t.gov.state}</p>
        </div>

        <nav className="footer__col" aria-label={t.a11y.footerNav}>
          <h2 className="footer__heading">{f.explore}</h2>
          <ul className="footer__links">
            {NAV_ITEMS.map(({ id, key }) => (
              <li key={id}>
                <a
                  href={`/#${id}`}
                  onClick={e => {
                    e.preventDefault()
                    goTo(id)
                  }}
                >
                  {t.nav[key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__heading">{f.official}</h2>
          <ul>
            {OFFICIAL.map(({ href, label, icon }) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <Icon name={icon} size={16} />
                  {label}
                  <span className="sr-only"> {t.a11y.newTab}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col footer__col--contact">
          <h2 className="footer__heading">{f.contact}</h2>
          <a className="footer__phone" href={`tel:${CONTACT.phone}`}>
            <Icon name="phone" size={18} />
            {CONTACT.phoneLabel}
          </a>
          <a href={`mailto:${CONTACT.email}`}>
            <Icon name="mail" size={16} />
            {CONTACT.email}
          </a>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>
          © {num(new Date().getFullYear())} {f.copyright}
        </p>
        <button type="button" className="footer__top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          {t.a11y.backToTop}
          <Icon name="arrowUp" size={16} />
        </button>
      </div>
    </footer>
  )
}
