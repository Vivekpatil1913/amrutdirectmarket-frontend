import Icon from '../ui/Icon'
import Mandala from '../ui/Mandala'
import { useParallax } from '../../hooks/useParallax'
import { useCollection, useSection } from '../../content/SiteContent'
import { mediaUrl } from '../../services/config'
import './AboutSection.css'

export default function AboutSection() {
  const a = useSection('about')
  const categories = useCollection('categories')
  const photoRef = useParallax(0.04)

  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container about__grid">
        <figure className="about__media" data-reveal ref={photoRef}>
          <Mandala className="about__mandala" points={20} />
          <div className="about__frame">
            {a.image && <img src={mediaUrl(a.image)} alt={a.image_alt} width="960" height="720" loading="lazy" />}
            <div className="about__shade" aria-hidden="true" />
            {a.caption && (
              <figcaption className="about__quote">
                <span className="about__quote-mark" aria-hidden="true">
                  “
                </span>
                {a.caption}
              </figcaption>
            )}
          </div>
        </figure>

        <div className="about__content">
          <header data-reveal>
            {a.badge && (
              <p className="eyebrow">
                <span className="eyebrow__dot" aria-hidden="true" />
                {a.badge}
              </p>
            )}
            <h2 id="about-title" className="section__title">
              {a.title}
            </h2>
          </header>

          <div className="about__text" data-reveal style={{ '--d': 1 }}>
            {a.p1 && <p>{a.p1}</p>}
            {a.p2 && <p>{a.p2}</p>}
          </div>

          {categories.length > 0 && (
            <div className="about__highlights" data-reveal style={{ '--d': 2 }}>
              <h3 className="about__hl-title">
                <Icon name="sparkle" size={16} />
                {a.find_title}
              </h3>
              <ul className="about__tags">
                {categories.map((c, i) => (
                  <li key={c.id} style={{ '--i': i }} title={c.description || undefined}>
                    {c.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
