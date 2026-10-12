import { useState } from 'react'
import './Contact.css'

const SUBJECTS = ['Stall Booking Query', 'Exhibition Information', 'Seller Registration', 'Technical Support', 'General Enquiry', 'Other']

const INITIAL = { name: '', email: '', phone: '', subject: '', message: '', consent: false }

function validate(form) {
  const e = {}
  if (!form.name.trim()) e.name = 'Name is required.'
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required.'
  if (form.phone && !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g,''))) e.phone = 'Enter a valid 10-digit mobile number.'
  if (!form.subject) e.subject = 'Please select a subject.'
  if (!form.message.trim() || form.message.trim().length < 20) e.message = 'Message must be at least 20 characters.'
  if (!form.consent) e.consent = 'Please agree to continue.'
  return e
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }))
  }

  function submit(ev) {
    ev.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitted(true)
  }

  return (
    <div className="contact-page">
      <section className="page-hero">
        <div className="container">
          <p className="page-hero-label">Contact · संपर्क</p>
          <h1>Get in Touch</h1>
          <p>Have questions about AMRUT Peth exhibitions or stall booking? We're here to help.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-layout">
            {/* Info */}
            <div className="contact-info">
              <h2>Contact AMRUT</h2>
              <p className="contact-info__sub">Reach out to us through any of the following channels. We respond within 1–2 business days.</p>

              <div className="contact-cards">
                <a href="tel:+919730151450" className="contact-card">
                  <div className="contact-card__icon" style={{background:'var(--primary-soft)', color:'var(--primary)'}}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                  </div>
                  <div>
                    <div className="contact-card__label">Phone</div>
                    <div className="contact-card__value">+91 97301 51450</div>
                  </div>
                </a>
                <a href="mailto:info@mahaamrut.org.in" className="contact-card">
                  <div className="contact-card__icon" style={{background:'var(--secondary-soft)', color:'var(--secondary)'}}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div>
                    <div className="contact-card__label">Email</div>
                    <div className="contact-card__value">info@mahaamrut.org.in</div>
                  </div>
                </a>
                <div className="contact-card contact-card--address">
                  <div className="contact-card__icon" style={{background:'var(--gold-soft)', color:'var(--gold)'}}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <div className="contact-card__label">Office Address</div>
                    <div className="contact-card__value">Maharaja Sayajirao Gaikwad Udyog Bhavan, 5th Floor, Aundh, Pune – 411067, Maharashtra</div>
                  </div>
                </div>
                <a href="https://mahaamrut.org.in" target="_blank" rel="noopener noreferrer" className="contact-card">
                  <div className="contact-card__icon" style={{background:'var(--info-bg)', color:'var(--info)'}}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                  </div>
                  <div>
                    <div className="contact-card__label">Website</div>
                    <div className="contact-card__value">mahaamrut.org.in ↗</div>
                  </div>
                </a>
              </div>

              <div className="contact-timing">
                <h4>Office Hours</h4>
                <p>Monday – Saturday: 10:00 AM – 6:00 PM</p>
                <p>Sunday: Closed</p>
                <p style={{marginTop:'var(--sp-3)', fontSize:'var(--text-xs)', color:'var(--muted)'}}>For urgent stall booking queries, please call directly.</p>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-wrap">
              {submitted ? (
                <div className="contact-success">
                  <div className="contact-success__icon">✅</div>
                  <h3>Message Sent!</h3>
                  <p>Thank you, <strong>{form.name}</strong>. Your enquiry has been recorded.</p>
                  <div className="contact-success__note">
                    <strong>Demo Notice:</strong> This is a frontend demonstration. No message has been delivered to AMRUT. Please contact them directly at <a href="tel:+919730151450">+91 97301 51450</a> or <a href="mailto:info@mahaamrut.org.in">info@mahaamrut.org.in</a>.
                  </div>
                  <button className="btn btn--outline" onClick={() => { setForm(INITIAL); setSubmitted(false) }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={submit} noValidate>
                  <h3>Send an Enquiry</h3>
                  <p className="contact-form__sub">Fill in the form below and we'll get back to you shortly.</p>

                  <div className="form-grid">
                    <div className="field" style={{gridColumn:'span 2'}}>
                      <label className="label">Full Name <span className="required">*</span></label>
                      <input className={`input${errors.name ? ' error' : ''}`} type="text" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} />
                      {errors.name && <p className="field-error">⚠ {errors.name}</p>}
                    </div>
                    <div className="field">
                      <label className="label">Email Address <span className="required">*</span></label>
                      <input className={`input${errors.email ? ' error' : ''}`} type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                      {errors.email && <p className="field-error">⚠ {errors.email}</p>}
                    </div>
                    <div className="field">
                      <label className="label">Mobile Number</label>
                      <input className={`input${errors.phone ? ' error' : ''}`} type="tel" placeholder="10-digit number" maxLength={10} value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g,''))} />
                      {errors.phone && <p className="field-error">⚠ {errors.phone}</p>}
                    </div>
                    <div className="field" style={{gridColumn:'span 2'}}>
                      <label className="label">Subject <span className="required">*</span></label>
                      <select className={`select${errors.subject ? ' error' : ''}`} value={form.subject} onChange={e => set('subject', e.target.value)}>
                        <option value="">Select a subject</option>
                        {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                      </select>
                      {errors.subject && <p className="field-error">⚠ {errors.subject}</p>}
                    </div>
                    <div className="field" style={{gridColumn:'span 2'}}>
                      <label className="label">Message <span className="required">*</span></label>
                      <textarea
                        className={`textarea${errors.message ? ' error' : ''}`}
                        placeholder="Describe your query in detail (minimum 20 characters)..."
                        rows={5}
                        value={form.message}
                        onChange={e => set('message', e.target.value)}
                      />
                      <div style={{display:'flex', justifyContent:'space-between', marginTop:'4px'}}>
                        {errors.message ? <p className="field-error">⚠ {errors.message}</p> : <span />}
                        <span style={{fontSize:'11px', color:'var(--muted)'}}>{form.message.length} chars</span>
                      </div>
                    </div>
                    <div className="field" style={{gridColumn:'span 2'}}>
                      <label className="checkbox-field">
                        <input type="checkbox" checked={form.consent} onChange={e => set('consent', e.target.checked)} />
                        <span>I agree that my contact information may be used to respond to this enquiry. <span className="required">*</span></span>
                      </label>
                      {errors.consent && <p className="field-error">⚠ {errors.consent}</p>}
                    </div>
                  </div>

                  <button type="submit" className="btn btn--primary btn--lg" style={{marginTop:'var(--sp-4)'}}>
                    Send Message
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
