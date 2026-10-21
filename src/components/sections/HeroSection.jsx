import Icon from '../ui/Icon'
import Mandala from '../ui/Mandala'
import { useParallax } from '../../hooks/useParallax'
import { useCollection, useSection } from '../../content/SiteContent'
import { mediaUrl } from '../../services/config'
import './HeroSection.css'

export default function HeroSection({ onNavigate }) {
  const h = useSection('hero')
  const facts = useCollection('heroFacts')
  const quick = useCollection('quickLinks')
  const visualRef = useParallax(0.05)

  const go = (e, id) => {
    e.preventDefault()
    onNavigate(id)
  }

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero__backdrop" aria-hidden="true">
        <Mandala className="hero__mandala" />
        <span className="hero__glow" />
      </div>

      <div className="container hero__grid">
        <div className="hero__copy">
          {h.eyebrow && (
            <p className="eyebrow hero__in" style={{ '--d': 0 }}>
              <span className="eyebrow__dot" aria-hidden="true" />
              {h.eyebrow}
            </p>
          )}
          <h1 id="hero-title" className="hero__title hero__in" style={{ '--d': 1 }}>
            {h.title}
          </h1>
          {h.tagline && (
            <p className="hero__tagline hero__in" style={{ '--d': 2 }}>
              {h.tagline}
            </p>
          )}
          {h.desc && (
            <p className="hero__desc hero__in" style={{ '--d': 3 }}>
              {h.desc}
            </p>
          )}
          <div className="hero__actions hero__in" style={{ '--d': 4 }}>
            {h.primary_cta && (
              <a href="#register" className="btn btn--primary btn--lg" onClick={e => go(e, 'register')}>
                <Icon name="userPlus" size={18} />
                {h.primary_cta}
              </a>
            )}
            {h.secondary_cta && (
              <a href="#about" className="btn btn--ghost btn--lg" onClick={e => go(e, 'about')}>
                {h.secondary_cta}
                <Icon name="arrowRight" size={18} />
              </a>
            )}
          </div>
          {facts.length > 0 && (
            <dl className="hero__facts hero__in" style={{ '--d': 5 }}>
              {facts.map(f => (
                <div key={f.id} className="hero__fact">
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="hero__visual" ref={visualRef}>
          {h.main_image && (
            <figure className="hero__photo hero__photo--main">
              <img src={mediaUrl(h.main_image)} alt={h.main_image_alt} width="1100" height="733" fetchPriority="high" />
            </figure>
          )}
          {h.small_image && (
            <figure className="hero__photo hero__photo--small">
              <img src={mediaUrl(h.small_image)} alt={h.small_image_alt} width="640" height="427" loading="lazy" />
            </figure>
          )}
          {h.chip && (
            <div className="hero__chip" aria-hidden="true">
              <Icon name="store" size={18} />
              <span>{h.chip}</span>
            </div>
          )}
          <div className="hero__ring" aria-hidden="true" />
        </div>
      </div>

      {quick.length > 0 && (
        <div className="container">
          <nav className="quick hero__in" style={{ '--d': 6 }} aria-label={h.quick_label}>
            {quick.map(q => (
              <a key={q.id} href={`#${q.section}`} className="quick__item" onClick={e => go(e, q.section)}>
                <span className="quick__icon">
                  <Icon name={q.icon} size={20} />
                </span>
                <span className="quick__text">
                  <span className="quick__title">{q.title}</span>
                  {q.desc && <span className="quick__desc">{q.desc}</span>}
                </span>
                <Icon name="arrowRight" size={18} className="quick__arrow" />
              </a>
            ))}
          </nav>
        </div>
      )}
    </section>
  )
}
