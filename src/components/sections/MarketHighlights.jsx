import Icon from '../ui/Icon'
import { useLanguage } from '../../i18n/LanguageContext'
import { useCollection, useSection } from '../../content/SiteContent'
import './MarketHighlights.css'

export default function MarketHighlights() {
  const { num } = useLanguage()
  const h = useSection('highlights')
  const items = useCollection('highlights')

  return (
    <section id="highlights" className="section highlights" aria-labelledby="highlights-title">
      <div className="container">
        <header className="section__head section__head--split" data-reveal>
          <div>
            {h.badge && (
              <p className="eyebrow">
                <span className="eyebrow__dot" aria-hidden="true" />
                {h.badge}
              </p>
            )}
            <h2 id="highlights-title" className="section__title">
              {h.title}
            </h2>
          </div>
          {h.lead && <p className="section__lead">{h.lead}</p>}
        </header>

        <ul className="hl-grid">
          {items.map((item, i) => (
            <li key={item.id} data-reveal style={{ '--d': i }}>
              <article className="hl-card">
                <div className="hl-card__top">
                  <span className="hl-card__icon">
                    <Icon name={item.icon} size={22} />
                  </span>
                  <span className="hl-card__step" aria-hidden="true">
                    {num(String(i + 1).padStart(2, '0'))}
                  </span>
                </div>
                <h3 className="hl-card__title">{item.title}</h3>
                {item.desc && <p className="hl-card__desc">{item.desc}</p>}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
