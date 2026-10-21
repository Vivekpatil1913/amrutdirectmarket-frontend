import Icon from '../ui/Icon'
import { useLanguage } from '../../i18n/LanguageContext'
import { useCollection, useSection } from '../../content/SiteContent'
import './ParticipationSection.css'

export default function ParticipationSection({ onNavigate }) {
  const { t, num } = useLanguage()
  const p = useSection('participate')
  const who = useCollection('eligibilityGroups')
  const steps = useCollection('participationSteps')

  return (
    <section id="participate" className="section participate" aria-labelledby="participate-title">
      <div className="container participate__grid">
        <div className="participate__intro" data-reveal>
          {p.badge && (
            <p className="eyebrow">
              <span className="eyebrow__dot" aria-hidden="true" />
              {p.badge}
            </p>
          )}
          <h2 id="participate-title" className="section__title">
            {p.title}
          </h2>
          {p.lead && <p className="section__lead">{p.lead}</p>}
          {who.length > 0 && (
            <ul className="participate__who" aria-label={p.who_label}>
              {who.map(w => (
                <li key={w.id}>{w.name}</li>
              ))}
            </ul>
          )}
          {p.cta && (
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
          )}
        </div>

        {steps.length > 0 && (
          <ol className="steps" data-reveal style={{ '--d': 1 }} aria-label={p.steps_label}>
            {steps.map((s, i) => (
              <li key={s.id} className="steps__item" style={{ '--i': i }}>
                <span className="steps__node" aria-hidden="true">
                  <Icon name={s.icon} size={18} />
                </span>
                <div>
                  <p className="steps__n">
                    {t.participate.step} {num(String(i + 1).padStart(2, '0'))}
                  </p>
                  <h3 className="steps__title">{s.title}</h3>
                  {s.desc && <p className="steps__desc">{s.desc}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
