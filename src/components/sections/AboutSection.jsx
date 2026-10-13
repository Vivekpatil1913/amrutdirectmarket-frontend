import Icon from '../ui/Icon'
import Mandala from '../ui/Mandala'
import { useParallax } from '../../hooks/useParallax'
import { useLanguage } from '../../i18n/LanguageContext'
import photo from '../../assets/market-stall.jpg'
import './AboutSection.css'

export default function AboutSection() {
  const { t } = useLanguage()
  const a = t.about
  const photoRef = useParallax(0.04)

  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container about__grid">
        <figure className="about__media" data-reveal ref={photoRef}>
          <Mandala className="about__mandala" points={20} />
          <div className="about__frame">
            <img src={photo} alt={a.photoAlt} width="960" height="720" loading="lazy" />
            <div className="about__shade" aria-hidden="true" />
            <figcaption className="about__quote">
              <span className="about__quote-mark" aria-hidden="true">
                “
              </span>
              {a.caption}
            </figcaption>
          </div>
        </figure>

        <div className="about__content">
          <header data-reveal>
            <p className="eyebrow">
              <span className="eyebrow__dot" aria-hidden="true" />
              {a.badge}
            </p>
            <h2 id="about-title" className="section__title">
              {a.title}
            </h2>
          </header>

          <div className="about__text" data-reveal style={{ '--d': 1 }}>
            <p>{a.p1}</p>
            <p>{a.p2}</p>
          </div>

          <div className="about__highlights" data-reveal style={{ '--d': 2 }}>
            <h3 className="about__hl-title">
              <Icon name="sparkle" size={16} />
              {a.findTitle}
            </h3>
            <ul className="about__tags">
              {a.categories.map((item, i) => (
                <li key={item} style={{ '--i': i }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
