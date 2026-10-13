import Icon from '../ui/Icon'
import { useLanguage } from '../../i18n/LanguageContext'
import './MarketHighlights.css'

const ICONS = ['users', 'building', 'store', 'trend']

export default function MarketHighlights() {
  const { t, num } = useLanguage()
  const h = t.highlights

  return (
    <section id="highlights" className="section highlights" aria-labelledby="highlights-title">
      <div className="container">
        <header className="section__head section__head--split" data-reveal>
          <div>
            <p className="eyebrow">
              <span className="eyebrow__dot" aria-hidden="true" />
              {h.badge}
            </p>
            <h2 id="highlights-title" className="section__title">
              {h.title}
            </h2>
          </div>
          <p className="section__lead">{h.lead}</p>
        </header>

        <ul className="hl-grid">
          {h.items.map((item, i) => (
            <li key={ICONS[i]} data-reveal style={{ '--d': i }}>
              <article className="hl-card">
                <div className="hl-card__top">
                  <span className="hl-card__icon">
                    <Icon name={ICONS[i]} size={22} />
                  </span>
                  <span className="hl-card__step" aria-hidden="true">
                    {num(`0${i + 1}`)}
                  </span>
                </div>
                <h3 className="hl-card__title">{item.title}</h3>
                <p className="hl-card__desc">{item.desc}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
