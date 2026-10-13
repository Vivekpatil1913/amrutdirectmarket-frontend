import Icon from '../ui/Icon'
import Mandala from '../ui/Mandala'
import { useParallax } from '../../hooks/useParallax'
import { useLanguage } from '../../i18n/LanguageContext'
import photoMain from '../../assets/market-produce.jpg'
import photoSmall from '../../assets/market-spices.jpg'
import './HeroSection.css'

export default function HeroSection({ onNavigate }) {
  const { t } = useLanguage()
  const h = t.hero
  const visualRef = useParallax(0.05)

  const go = (e, id) => {
    e.preventDefault()
    onNavigate(id)
  }

  const quick = [
    { id: 'about', icon: 'info', title: t.nav.about, desc: h.quick.about },
    { id: 'highlights', icon: 'sparkle', title: t.nav.highlights, desc: h.quick.highlights },
    { id: 'participate', icon: 'store', title: t.nav.participate, desc: h.quick.participate },
    { id: 'register', icon: 'phone', title: t.nav.contact, desc: h.quick.contact },
  ]

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero__backdrop" aria-hidden="true">
        <Mandala className="hero__mandala" />
        <span className="hero__glow" />
      </div>

      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow hero__in" style={{ '--d': 0 }}>
            <span className="eyebrow__dot" aria-hidden="true" />
            {h.eyebrow}
          </p>
          <h1 id="hero-title" className="hero__title hero__in" style={{ '--d': 1 }}>
            {h.title}
          </h1>
          <p className="hero__tagline hero__in" style={{ '--d': 2 }}>
            {h.tagline}
          </p>
          <p className="hero__desc hero__in" style={{ '--d': 3 }}>
            {h.desc}
          </p>
          <div className="hero__actions hero__in" style={{ '--d': 4 }}>
            <a href="#register" className="btn btn--primary btn--lg" onClick={e => go(e, 'register')}>
              <Icon name="userPlus" size={18} />
              {h.primary}
            </a>
            <a href="#about" className="btn btn--ghost btn--lg" onClick={e => go(e, 'about')}>
              {h.secondary}
              <Icon name="arrowRight" size={18} />
            </a>
          </div>
          <dl className="hero__facts hero__in" style={{ '--d': 5 }}>
            {h.facts.map(f => (
              <div key={f.label} className="hero__fact">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero__visual" ref={visualRef}>
          <figure className="hero__photo hero__photo--main">
            <img src={photoMain} alt={h.photoAlts[0]} width="1100" height="733" fetchpriority="high" />
          </figure>
          <figure className="hero__photo hero__photo--small">
            <img src={photoSmall} alt={h.photoAlts[1]} width="640" height="427" loading="lazy" />
          </figure>
          <div className="hero__chip" aria-hidden="true">
            <Icon name="store" size={18} />
            <span>{h.chip}</span>
          </div>
          <div className="hero__ring" aria-hidden="true" />
        </div>
      </div>

      <div className="container">
        <nav className="quick hero__in" style={{ '--d': 6 }} aria-label={h.quickLabel}>
          {quick.map(q => (
            <a key={q.id} href={`#${q.id}`} className="quick__item" onClick={e => go(e, q.id)}>
              <span className="quick__icon">
                <Icon name={q.icon} size={20} />
              </span>
              <span className="quick__text">
                <span className="quick__title">{q.title}</span>
                <span className="quick__desc">{q.desc}</span>
              </span>
              <Icon name="arrowRight" size={18} className="quick__arrow" />
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}
