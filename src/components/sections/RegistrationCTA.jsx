import { useRef, useState } from 'react'
import Icon from '../ui/Icon'
import { CONTACT } from '../../data/site'
import { useLanguage } from '../../i18n/LanguageContext'
import './RegistrationCTA.css'

const SUBJECTS = ['stall', 'seller', 'exhibition', 'general', 'technical', 'other']

const INITIAL = { name: '', email: '', phone: '', subject: '', message: '', consent: false }

// Returns the keys of invalid fields; messages come from the active language.
function validate(form) {
  const e = {}
  if (!form.name.trim()) e.name = true
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = true
  if (form.phone && !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) e.phone = true
  if (!form.subject) e.subject = true
  if (!form.message.trim() || form.message.trim().length < 20) e.message = true
  if (!form.consent) e.consent = true
  return e
}

function Field({ id, label, required, optional, error, hint, children }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
        {required ? (
          <span className="field__req" aria-hidden="true">
            {' '}*
          </span>
        ) : (
          <span className="field__opt"> {optional}</span>
        )}
      </label>
      {children}
      {error ? (
        <p className="field__error" id={`${id}-error`}>
          <Icon name="alert" size={14} />
          {error}
        </p>
      ) : hint ? (
        <p className="field__hint">{hint}</p>
      ) : null}
    </div>
  )
}

export default function RegistrationCTA() {
  const { t, num } = useLanguage()
  const r = t.register
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef(null)
  const doneRef = useRef(null)

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: false }))
  }

  function submit(ev) {
    ev.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) {
      setErrors(errs)
      // Move focus to the first invalid field.
      const first = Object.keys(INITIAL).find(k => errs[k])
      formRef.current?.querySelector(`[name="${first}"]`)?.focus()
      return
    }
    setSubmitted(true)
    requestAnimationFrame(() => doneRef.current?.focus())
  }

  function reset() {
    setForm(INITIAL)
    setErrors({})
    setSubmitted(false)
  }

  const err = key => (errors[key] ? r.errors[key] : null)

  // Shared props for each control: name, validity and error link.
  const control = key => ({
    id: `reg-${key}`,
    name: key,
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? `reg-${key}-error` : undefined,
  })

  return (
    <section id="register" className="section register" aria-labelledby="register-title">
      <div className="container">
        <header className="section__head section__head--split" data-reveal>
          <div>
            <p className="eyebrow">
              <span className="eyebrow__dot" aria-hidden="true" />
              {r.badge}
            </p>
            <h2 id="register-title" className="section__title">
              {r.title}
            </h2>
          </div>
          <p className="section__lead">{r.lead}</p>
        </header>

        <div className="register__grid">
          <div className="register__panel" data-reveal style={{ '--d': 1 }}>
            {submitted ? (
              <div className="register__done" ref={doneRef} tabIndex={-1} role="status">
                <span className="register__done-icon">
                  <Icon name="checkCircle" size={28} />
                </span>
                <h3>{r.thanks.replace('{name}', form.name)}</h3>
                <p>{r.recorded}</p>
                <p className="register__notice">
                  <Icon name="info" size={16} />
                  <span>
                    <strong>{r.noticeTitle}</strong> {r.notice}{' '}
                    <a href={`tel:${CONTACT.phone}`}>{CONTACT.phoneLabel}</a> {r.or}{' '}
                    <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
                  </span>
                </p>
                <button type="button" className="btn btn--ghost" onClick={reset}>
                  {r.again}
                </button>
              </div>
            ) : (
              <form className="register__form" ref={formRef} onSubmit={submit} noValidate>
                <div className="register__fields">
                  <Field id="reg-name" label={r.fields.name} required error={err('name')}>
                    <input
                      {...control('name')}
                      className="input"
                      type="text"
                      autoComplete="name"
                      placeholder={r.placeholders.name}
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                    />
                  </Field>
                  <Field id="reg-email" label={r.fields.email} required error={err('email')}>
                    <input
                      {...control('email')}
                      className="input"
                      type="email"
                      autoComplete="email"
                      placeholder={r.placeholders.email}
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                    />
                  </Field>
                  <Field id="reg-phone" label={r.fields.phone} optional={r.optional} error={err('phone')}>
                    <input
                      {...control('phone')}
                      className="input"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder={r.placeholders.phone}
                      maxLength={10}
                      value={form.phone}
                      onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                    />
                  </Field>
                  <Field id="reg-subject" label={r.fields.subject} required error={err('subject')}>
                    <select
                      {...control('subject')}
                      className="input"
                      value={form.subject}
                      onChange={e => set('subject', e.target.value)}
                    >
                      <option value="">{r.selectSubject}</option>
                      {SUBJECTS.map(s => (
                        <option key={s} value={s}>
                          {r.subjects[s]}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <div className="register__wide">
                    <Field
                      id="reg-message"
                      label={r.fields.message}
                      required
                      error={err('message')}
                      hint={`${r.hint} · ${num(form.message.trim().length)}/${r.hintMin}`}
                    >
                      <textarea
                        {...control('message')}
                        className="input"
                        rows={4}
                        placeholder={r.placeholders.message}
                        value={form.message}
                        onChange={e => set('message', e.target.value)}
                      />
                    </Field>
                  </div>
                  <div className="register__wide">
                    <label className="check">
                      <input
                        {...control('consent')}
                        type="checkbox"
                        checked={form.consent}
                        onChange={e => set('consent', e.target.checked)}
                      />
                      <span>{r.consent}</span>
                    </label>
                    {errors.consent ? (
                      <p className="field__error" id="reg-consent-error">
                        <Icon name="alert" size={14} />
                        {r.errors.consent}
                      </p>
                    ) : null}
                  </div>
                </div>
                <button type="submit" className="btn btn--primary btn--lg register__submit">
                  {r.submit}
                  <Icon name="send" size={18} />
                </button>
              </form>
            )}
          </div>

          <aside className="register__contact" data-reveal style={{ '--d': 2 }} aria-labelledby="contact-title">
            <span className="register__contact-icon">
              <Icon name="phone" size={22} />
            </span>
            <h3 id="contact-title">{r.contactTitle}</h3>
            <p className="register__contact-desc">{r.contactDesc}</p>
            <a className="register__phone" href={`tel:${CONTACT.phone}`}>
              {CONTACT.phoneLabel}
            </a>
            <ul className="register__list">
              <li>
                <Icon name="mail" size={16} />
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </li>
              <li>
                <Icon name="mapPin" size={16} />
                <span>{CONTACT.address}</span>
              </li>
              <li>
                <Icon name="clock" size={16} />
                <span>{r.hours}</span>
              </li>
              <li>
                <Icon name="globe" size={16} />
                <a href={CONTACT.website} target="_blank" rel="noopener noreferrer">
                  mahaamrut.org.in
                  <span className="sr-only"> {t.a11y.newTab}</span>
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
