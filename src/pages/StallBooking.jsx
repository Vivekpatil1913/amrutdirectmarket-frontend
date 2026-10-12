import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import StepIndicator from '../components/ui/StepIndicator'
import { EXHIBITIONS, getExhibition } from '../data/exhibitions'
import './StallBooking.css'

const STEPS = ['Select Exhibition', 'Your Details', 'Business Info', 'Review & Confirm']

const CATEGORIES_LIST = ['Food & Agriculture', 'Processed Food', 'Handicrafts & Art', 'Clothing & Textiles', 'Home & Lifestyle', 'Health & Wellness', 'Footwear & Leather', 'Jewelry & Accessories', 'Other']

const INITIAL_FORM = {
  // Step 1
  exhibitionId: '',
  // Step 2
  fullName: '', email: '', phone: '', aadhaar: '', address: '', district: '',
  // Step 3
  businessName: '', businessType: '', category: '', products: '', experience: '', stallsBooked: 1,
  // Step 4
  agreeTerms: false, agreeEntry: false,
}

function validate(step, form) {
  const errors = {}
  if (step === 0) {
    if (!form.exhibitionId) errors.exhibitionId = 'Please select an exhibition.'
  }
  if (step === 1) {
    if (!form.fullName.trim()) errors.fullName = 'Full name is required.'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Valid email is required.'
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) errors.phone = 'Valid 10-digit Indian mobile number required.'
    if (!form.address.trim()) errors.address = 'Address is required.'
    if (!form.district.trim()) errors.district = 'District is required.'
  }
  if (step === 2) {
    if (!form.businessName.trim()) errors.businessName = 'Business name is required.'
    if (!form.category) errors.category = 'Please select a product category.'
    if (!form.products.trim()) errors.products = 'Describe your products.'
  }
  if (step === 3) {
    if (!form.agreeTerms) errors.agreeTerms = 'You must agree to the terms.'
    if (!form.agreeEntry) errors.agreeEntry = 'You must confirm the entry criteria.'
  }
  return errors
}

export default function StallBooking() {
  const { exhibitionId } = useParams()
  const [step, setStep] = useState(exhibitionId ? 1 : 0)
  const [form, setForm] = useState({ ...INITIAL_FORM, exhibitionId: exhibitionId || '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (exhibitionId) {
      setForm(f => ({ ...f, exhibitionId }))
      setStep(1)
    }
  }, [exhibitionId])

  const selectedExhibition = form.exhibitionId ? getExhibition(form.exhibitionId) : null

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  function next() {
    const errs = validate(step, form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function back() {
    setErrors({})
    setStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function submit() {
    const errs = validate(3, form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <div className="booking-success">
        <div className="container">
          <div className="booking-success__card">
            <div className="booking-success__icon">✅</div>
            <h2>Booking Request Submitted!</h2>
            <p className="booking-success__sub">
              Thank you, <strong>{form.fullName}</strong>! Your stall booking request for <strong>{selectedExhibition?.name}</strong> has been received.
            </p>
            <div className="booking-success__note">
              <strong>⚠️ Demo Note:</strong> This is a frontend demonstration using mock data. No actual booking has been made in the official AMRUT system. To complete an official stall booking, please contact your AMRUT district office directly at <a href="tel:+919730151450">+91 97301 51450</a> or email <a href="mailto:info@mahaamrut.org.in">info@mahaamrut.org.in</a>.
            </div>
            <div className="booking-success__ref">
              <span>Reference ID (Demo):</span>
              <strong>AMR-{Date.now().toString().slice(-6)}</strong>
            </div>
            <div className="booking-success__summary">
              <h4>Booking Summary</h4>
              <dl>
                <div><dt>Name</dt><dd>{form.fullName}</dd></div>
                <div><dt>Email</dt><dd>{form.email}</dd></div>
                <div><dt>Phone</dt><dd>+91 {form.phone}</dd></div>
                <div><dt>Exhibition</dt><dd>{selectedExhibition?.name}</dd></div>
                <div><dt>Business</dt><dd>{form.businessName}</dd></div>
                <div><dt>Category</dt><dd>{form.category}</dd></div>
              </dl>
            </div>
            <div className="booking-success__actions">
              <Link to="/exhibitions" className="btn btn--outline">View More Exhibitions</Link>
              <Link to="/" className="btn btn--primary">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <p className="page-hero-label">Stall Booking · स्टॉल बुकिंग</p>
          <h1>Book Your Stall</h1>
          <p>Reserve your space at the next AMRUT Peth Direct Market exhibition. Just ₹950 per stall.</p>
        </div>
      </section>

      <div className="container booking-container">
        {/* Steps */}
        <div className="booking-steps">
          <StepIndicator steps={STEPS} current={step} />
        </div>

        <div className="booking-layout">
          {/* Form */}
          <div className="booking-form-wrap">
            {/* Step 0: Select Exhibition */}
            {step === 0 && (
              <div className="booking-step">
                <h2 className="booking-step__title">Select an Exhibition</h2>
                <p className="booking-step__sub">Choose the AMRUT Peth exhibition where you want to book a stall.</p>
                <div className="exh-select-grid">
                  {EXHIBITIONS.filter(e => e.status !== 'completed').map(exh => {
                    const isFull = exh.stallsFilled >= exh.stallsTotal
                    return (
                      <label
                        key={exh.id}
                        className={`exh-select-card${form.exhibitionId === exh.id ? ' selected' : ''}${isFull ? ' disabled' : ''}`}
                      >
                        <input
                          type="radio"
                          name="exhibition"
                          value={exh.id}
                          checked={form.exhibitionId === exh.id}
                          onChange={() => !isFull && set('exhibitionId', exh.id)}
                          disabled={isFull}
                          className="sr-only"
                        />
                        <img src={exh.image} alt={exh.name} />
                        <div className="exh-select-card__body">
                          <div className="exh-select-card__header">
                            <h3>{exh.name}</h3>
                            {isFull && <span className="badge badge--warning">Full</span>}
                          </div>
                          <p>{exh.district} · {new Date(exh.dateFrom).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}</p>
                          <p style={{color:'var(--muted)', fontSize:'var(--text-xs)'}}>
                            {exh.stallsTotal - exh.stallsFilled} stalls remaining · ₹{exh.stallFee}
                          </p>
                        </div>
                        <div className="exh-select-check">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                      </label>
                    )
                  })}
                </div>
                {errors.exhibitionId && <p className="field-error">{errors.exhibitionId}</p>}
              </div>
            )}

            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="booking-step">
                <h2 className="booking-step__title">Your Personal Details</h2>
                <p className="booking-step__sub">Enter your contact information. All fields marked with * are required.</p>
                <div className="form-grid">
                  <div className="field" style={{gridColumn:'span 2'}}>
                    <label className="label">Full Name <span className="required">*</span></label>
                    <input className={`input${errors.fullName ? ' error' : ''}`} type="text" placeholder="As per Aadhaar card" value={form.fullName} onChange={e => set('fullName', e.target.value)} />
                    {errors.fullName && <p className="field-error">⚠ {errors.fullName}</p>}
                  </div>
                  <div className="field">
                    <label className="label">Email Address <span className="required">*</span></label>
                    <input className={`input${errors.email ? ' error' : ''}`} type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                    {errors.email && <p className="field-error">⚠ {errors.email}</p>}
                  </div>
                  <div className="field">
                    <label className="label">Mobile Number <span className="required">*</span></label>
                    <input className={`input${errors.phone ? ' error' : ''}`} type="tel" placeholder="10-digit mobile number" maxLength={10} value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g,''))} />
                    {errors.phone && <p className="field-error">⚠ {errors.phone}</p>}
                  </div>
                  <div className="field" style={{gridColumn:'span 2'}}>
                    <label className="label">Full Address <span className="required">*</span></label>
                    <textarea className={`textarea${errors.address ? ' error' : ''}`} placeholder="House / Flat No., Street, Taluka" rows={3} value={form.address} onChange={e => set('address', e.target.value)} />
                    {errors.address && <p className="field-error">⚠ {errors.address}</p>}
                  </div>
                  <div className="field">
                    <label className="label">District <span className="required">*</span></label>
                    <input className={`input${errors.district ? ' error' : ''}`} type="text" placeholder="Your district" value={form.district} onChange={e => set('district', e.target.value)} />
                    {errors.district && <p className="field-error">⚠ {errors.district}</p>}
                  </div>
                  <div className="field">
                    <label className="label">Aadhaar Number <span style={{color:'var(--muted)', fontWeight:400}}>(optional)</span></label>
                    <input className="input" type="text" placeholder="12-digit Aadhaar" maxLength={12} value={form.aadhaar} onChange={e => set('aadhaar', e.target.value.replace(/\D/g,''))} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Business Info */}
            {step === 2 && (
              <div className="booking-step">
                <h2 className="booking-step__title">Business Information</h2>
                <p className="booking-step__sub">Tell us about your business and the products you will display.</p>
                <div className="form-grid">
                  <div className="field" style={{gridColumn:'span 2'}}>
                    <label className="label">Business / Shop Name <span className="required">*</span></label>
                    <input className={`input${errors.businessName ? ' error' : ''}`} type="text" placeholder="Name of your business" value={form.businessName} onChange={e => set('businessName', e.target.value)} />
                    {errors.businessName && <p className="field-error">⚠ {errors.businessName}</p>}
                  </div>
                  <div className="field">
                    <label className="label">Business Type</label>
                    <select className="select" value={form.businessType} onChange={e => set('businessType', e.target.value)}>
                      <option value="">Select type</option>
                      <option>Individual Entrepreneur</option>
                      <option>Self-Help Group (SHG)</option>
                      <option>Farmer</option>
                      <option>Artisan / Craftsperson</option>
                      <option>Small Business</option>
                      <option>AMRUT Training Graduate</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="label">Product Category <span className="required">*</span></label>
                    <select className={`select${errors.category ? ' error' : ''}`} value={form.category} onChange={e => set('category', e.target.value)}>
                      <option value="">Select category</option>
                      {CATEGORIES_LIST.map(c => <option key={c}>{c}</option>)}
                    </select>
                    {errors.category && <p className="field-error">⚠ {errors.category}</p>}
                  </div>
                  <div className="field" style={{gridColumn:'span 2'}}>
                    <label className="label">Products You Will Display <span className="required">*</span></label>
                    <textarea className={`textarea${errors.products ? ' error' : ''}`} placeholder="Describe your products in detail (e.g. Handmade pickles, organic vegetables, Warli paintings...)" rows={4} value={form.products} onChange={e => set('products', e.target.value)} />
                    {errors.products && <p className="field-error">⚠ {errors.products}</p>}
                  </div>
                  <div className="field">
                    <label className="label">Previous Exhibition Experience</label>
                    <select className="select" value={form.experience} onChange={e => set('experience', e.target.value)}>
                      <option value="">Select</option>
                      <option>First Time</option>
                      <option>1–2 exhibitions</option>
                      <option>3–5 exhibitions</option>
                      <option>6+ exhibitions</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="booking-step">
                <h2 className="booking-step__title">Review & Confirm</h2>
                <p className="booking-step__sub">Please review your booking details before submitting.</p>

                <div className="review-card">
                  <h4>Exhibition</h4>
                  <p><strong>{selectedExhibition?.name}</strong></p>
                  <p>{selectedExhibition?.location} · {selectedExhibition && new Date(selectedExhibition.dateFrom).toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric'})}</p>
                  <p>Stall Fee: <strong>₹{selectedExhibition?.stallFee}</strong></p>
                </div>

                <div className="review-card">
                  <h4>Personal Details</h4>
                  <dl className="review-dl">
                    <div><dt>Name</dt><dd>{form.fullName}</dd></div>
                    <div><dt>Email</dt><dd>{form.email}</dd></div>
                    <div><dt>Phone</dt><dd>+91 {form.phone}</dd></div>
                    <div><dt>District</dt><dd>{form.district}</dd></div>
                    <div><dt>Address</dt><dd>{form.address}</dd></div>
                  </dl>
                </div>

                <div className="review-card">
                  <h4>Business Details</h4>
                  <dl className="review-dl">
                    <div><dt>Business Name</dt><dd>{form.businessName}</dd></div>
                    <div><dt>Type</dt><dd>{form.businessType || 'Not specified'}</dd></div>
                    <div><dt>Category</dt><dd>{form.category}</dd></div>
                    <div><dt>Products</dt><dd>{form.products}</dd></div>
                  </dl>
                </div>

                <div className="booking-agreements">
                  <label className={`checkbox-field${errors.agreeTerms ? ' error' : ''}`}>
                    <input type="checkbox" checked={form.agreeTerms} onChange={e => set('agreeTerms', e.target.checked)} />
                    <span>I confirm that the information provided is accurate and I agree to AMRUT Peth's terms for exhibitors. <span className="required">*</span></span>
                  </label>
                  {errors.agreeTerms && <p className="field-error">⚠ {errors.agreeTerms}</p>}

                  <label className={`checkbox-field${errors.agreeEntry ? ' error' : ''}`}>
                    <input type="checkbox" checked={form.agreeEntry} onChange={e => set('agreeEntry', e.target.checked)} />
                    <span>I understand this is a demonstration booking and I will contact the AMRUT district office to complete the official registration. <span className="required">*</span></span>
                  </label>
                  {errors.agreeEntry && <p className="field-error">⚠ {errors.agreeEntry}</p>}
                </div>

                <div className="booking-demo-note">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p><strong>Demo Notice:</strong> This form demonstrates the booking interface using mock data. No official booking is processed. Contact <a href="tel:+919730151450">+91 97301 51450</a> for real bookings.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="booking-nav">
              {step > 0 && (
                <button className="btn btn--ghost" onClick={back}>
                  ← Back
                </button>
              )}
              <div style={{flex:1}} />
              {step < STEPS.length - 1 ? (
                <button className="btn btn--primary" onClick={next}>
                  Continue →
                </button>
              ) : (
                <button className="btn btn--secondary" onClick={submit}>
                  Submit Booking Request
                </button>
              )}
            </div>
          </div>

          {/* Sidebar summary */}
          {selectedExhibition && (
            <aside className="booking-sidebar">
              <div className="booking-sidebar__card">
                <img src={selectedExhibition.image} alt={selectedExhibition.name} />
                <div className="booking-sidebar__info">
                  <h4>{selectedExhibition.name}</h4>
                  <p>📍 {selectedExhibition.district}</p>
                  <p>📅 {new Date(selectedExhibition.dateFrom).toLocaleDateString('en-IN', {day:'numeric', month:'short'})} – {new Date(selectedExhibition.dateTo).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}</p>
                  <p>⏰ {selectedExhibition.time}</p>
                  <div className="booking-sidebar__fee">
                    Stall Fee: <strong>₹{selectedExhibition.stallFee}</strong>
                  </div>
                </div>
              </div>
              <div className="booking-sidebar__tips">
                <h4>💡 Tips</h4>
                <ul>
                  <li>Arrive 1 hour before opening time to set up.</li>
                  <li>Bring your product samples and display materials.</li>
                  <li>Keep your registration confirmation handy.</li>
                  <li>Payment collection is your responsibility.</li>
                </ul>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
