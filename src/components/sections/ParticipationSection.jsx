import Icon from '../ui/Icon'
import { useLanguage } from '../../i18n/LanguageContext'
import './ParticipationSection.css'

const STEP_ICONS = ['send', 'building', 'store']

export default function ParticipationSection({ onNavigate }) {
  const { t, num } = useLanguage()
  const p = t.participate

  return (
    <section id="participate" className="section participate" aria-labelledby="participate-title">
      <div className="container participate__grid">
        <div className="participate__intro" data-reveal>
          <p className="eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" />
            {p.badge}
          </p>
          <h2 id="participate-title" className="section__title">
            {p.title}
          </h2>
          <p className="section__lead">{p.lead}</p>
          <ul className="participate__who" aria-label={p.whoLabel}>
            {p.who.map(w => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <a
            href="#register"
            className="btn btn--primary participate__cta"
            onClick={e => {
              e.preventDefault()
              onNavigate('register')
            }}
          >
            {p.cta}
            <Icon name="arrowRight" size={18} />
          </a>
        </div>

        <ol className="steps" data-reveal style={{ '--d': 1 }} aria-label={p.stepsLabel}>
          {p.steps.map((s, i) => (
            <li key={STEP_ICONS[i]} className="steps__item" style={{ '--i': i }}>
              <span className="steps__node" aria-hidden="true">
                <Icon name={STEP_ICONS[i]} size={18} />
              </span>
              <div>
                <p className="steps__n">
                  {p.step} {num(`0${i + 1}`)}
                </p>
                <h3 className="steps__title">{s.title}</h3>
                <p className="steps__desc">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
