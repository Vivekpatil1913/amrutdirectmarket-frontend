import Icon from '../ui/Icon'
import Mandala from '../ui/Mandala'
import { useCollection, useSection } from '../../content/SiteContent'
import { mediaUrl } from '../../services/config'
import { useLanguage } from '../../i18n/LanguageContext'
import { useSectionNav } from './Header'
import './Footer.css'

export default function Footer() {
  const { t, num } = useLanguage()
  const f = useSection('footer')
  const settings = useSection('settings')
  const contact = useSection('contact')
  const navItems = useCollection('navItems').filter(n => n.show_in_footer)
  const official = useCollection('socialLinks')
  const goTo = useSectionNav()

  return (
    <footer className="footer">
      <div className="footer__ring" aria-hidden="true" />
      {f.quote && (
        <div className="container">
          <blockquote className="footer__quote">
            <Mandala className="footer__mandala" points={16} />
            <p>{f.quote}</p>
          </blockquote>
        </div>
      )}

      <div className="container footer__grid">
        <div className="footer__brand">
          {settings.logo && (
            <img src={mediaUrl(settings.logo)} alt={settings.logo_alt} width="383" height="86" className="footer__logo" loading="lazy" />
          )}
          <p className="footer__title">
            {settings.brand_name}{' '}
            {settings.brand_sub && !settings.brand_name?.includes(settings.brand_sub) && (
              <span className="footer__title-mr">{settings.brand_sub}</span>
            )}
          </p>
          {f.about && <p className="footer__about">{f.about}</p>}
          {settings.gov_state && <p className="footer__gov">{settings.gov_state}</p>}
        </div>

        {navItems.length > 0 && (
          <nav className="footer__col" aria-label={t.a11y.footerNav}>
            <h2 className="footer__heading">{f.explore_heading}</h2>
            <ul className="footer__links">
              {navItems.map(({ id, section, label }) => (
                <li key={id}>
                  <a
                    href={`/#${section}`}
                    onClick={e => {
                      e.preventDefault()
                      goTo(section)
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {official.length > 0 && (
          <div className="footer__col">
            <h2 className="footer__heading">{f.official_heading}</h2>
            <ul>
              {official.map(({ id, url, label, icon }) => (
                <li key={id}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <Icon name={icon} size={16} />
                    {label}
                    <span className="sr-only"> {t.a11y.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(contact.phone || contact.email) && (
          <div className="footer__col footer__col--contact">
            <h2 className="footer__heading">{f.contact_heading}</h2>
            {contact.phone && (
              <a className="footer__phone" href={`tel:${contact.phone}`}>
                <Icon name="phone" size={18} />
                {contact.phone_label || contact.phone}
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`}>
                <Icon name="mail" size={16} />
                {contact.email}
              </a>
            )}
          </div>
        )}
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
