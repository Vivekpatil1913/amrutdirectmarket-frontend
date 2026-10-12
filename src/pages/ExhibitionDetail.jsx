import { useParams, Link } from 'react-router-dom'
import { getExhibition, EXHIBITIONS } from '../data/exhibitions'
import ExhibitionCard from '../components/ui/ExhibitionCard'
import './ExhibitionDetail.css'

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const STATUS_MAP = {
  upcoming:       { label: 'Upcoming', cls: 'info' },
  'booking-open': { label: 'Booking Open', cls: 'success' },
  completed:      { label: 'Completed', cls: 'warning' },
}

export default function ExhibitionDetail() {
  const { id } = useParams()
  const exhibition = getExhibition(id)

  if (!exhibition) {
    return (
      <div className="section" style={{textAlign:'center', minHeight:'50vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'var(--sp-6)'}}>
        <div style={{fontSize:'3rem'}}>🔍</div>
        <h2>Exhibition Not Found</h2>
        <p style={{color:'var(--muted)'}}>This exhibition doesn't exist or may have been removed.</p>
        <Link to="/exhibitions" className="btn btn--primary">View All Exhibitions</Link>
      </div>
    )
  }

  const { name, district, location, venue, dateFrom, dateTo, time, status, stallsFilled, stallsTotal, stallFee, image, description, categories, organizer, contactName, contactPhone, facilities, highlights } = exhibition
  const pct = Math.round((stallsFilled / stallsTotal) * 100)
  const isFull = stallsFilled >= stallsTotal
  const st = STATUS_MAP[status] || STATUS_MAP.upcoming
  const related = EXHIBITIONS.filter(e => e.id !== id && (e.district === district || e.status === status)).slice(0, 3)

  return (
    <div className="exh-detail">
      {/* Breadcrumb */}
      <div className="container" style={{paddingTop:'var(--sp-5)', paddingBottom:'var(--sp-3)'}}>
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to="/exhibitions">Exhibitions</Link>
          <span className="breadcrumb-sep">›</span>
          <span>{name}</span>
        </nav>
      </div>

      {/* Header */}
      <div className="exh-detail__header">
        <div className="container">
          <div className="exh-detail__header-inner">
            <div className="exh-detail__header-content">
              <div className="tag-strip" style={{marginBottom:'var(--sp-4)'}}>
                <span className={`badge badge--${st.cls}`}>{st.label}</span>
                {isFull && <span className="badge badge--warning">Fully Booked</span>}
                {categories.slice(0, 2).map(c => <span key={c} className="badge badge--secondary">{c}</span>)}
              </div>
              <h1>{name}</h1>
              <div className="exh-detail__meta">
                <div className="exh-detail__meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>{location}</span>
                </div>
                <div className="exh-detail__meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span>{formatDate(dateFrom)} – {formatDate(dateTo)}</span>
                </div>
                <div className="exh-detail__meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{time}</span>
                </div>
              </div>
            </div>
            {status !== 'completed' && (
              <div className="exh-detail__booking-card">
                <div className="exh-detail__fee">
                  <span className="exh-detail__fee-label">Stall Fee</span>
                  <span className="exh-detail__fee-price">₹{stallFee.toLocaleString('en-IN')}</span>
                  <span className="exh-detail__fee-note">per exhibition</span>
                </div>
                <div className="exh-detail__availability">
                  <div className="exh-detail__avail-header">
                    <span>Availability</span>
                    <span className={isFull ? 'danger' : 'success'}>{stallsTotal - stallsFilled} / {stallsTotal} stalls remaining</span>
                  </div>
                  <div style={{height:'8px', background:'var(--line)', borderRadius:'var(--r-full)', overflow:'hidden', marginTop:'var(--sp-2)'}}>
                    <div style={{width:`${pct}%`, height:'100%', background:`linear-gradient(90deg, var(--secondary), var(--primary))`, borderRadius:'var(--r-full)'}} />
                  </div>
                </div>
                <Link
                  to={`/stall-booking/${id}`}
                  className="btn btn--primary btn--lg"
                  style={{width:'100%', justifyContent:'center'}}
                  aria-disabled={isFull}
                >
                  {isFull ? 'Join Waitlist' : 'Book a Stall Now'}
                </Link>
                <div className="exh-detail__organizer">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>Organiser: {organizer}</span>
                </div>
                <a href={`tel:+91${contactPhone}`} className="exh-detail__contact-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                  Contact {contactName}: +91 {contactPhone}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{paddingBlock:'var(--sp-12)'}}>
        <div className="exh-detail__body">
          {/* Left */}
          <div className="exh-detail__main">
            <img src={image} alt={name} className="exh-detail__img" />

            <div className="exh-detail__section">
              <h2>About This Exhibition</h2>
              <p>{description}</p>
            </div>

            <div className="exh-detail__section">
              <h2>Highlights</h2>
              <ul className="exh-detail__highlights">
                {highlights.map((h, i) => (
                  <li key={i}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="exh-detail__section">
              <h2>Product Categories</h2>
              <div className="tag-strip" style={{gap:'var(--sp-2)'}}>
                {categories.map(c => <span key={c} className="badge badge--secondary" style={{fontSize:'var(--text-sm)', padding:'6px 14px'}}>{c}</span>)}
              </div>
            </div>

            <div className="exh-detail__section">
              <h2>Facilities</h2>
              <div className="exh-detail__facilities">
                {facilities.map((f, i) => (
                  <div key={i} className="exh-detail__facility">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar on desktop */}
          <aside className="exh-detail__sidebar">
            <div className="exh-detail__info-card">
              <h3>Exhibition Details</h3>
              <dl>
                <div><dt>District</dt><dd>{district}</dd></div>
                <div><dt>Venue</dt><dd>{venue}</dd></div>
                <div><dt>Dates</dt><dd>{formatDate(dateFrom)} to {formatDate(dateTo)}</dd></div>
                <div><dt>Timings</dt><dd>{time}</dd></div>
                <div><dt>Total Stalls</dt><dd>{stallsTotal}</dd></div>
                <div><dt>Stall Fee</dt><dd className="accent">₹{stallFee}</dd></div>
                <div><dt>Organiser</dt><dd>{organizer}</dd></div>
              </dl>
            </div>
          </aside>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <h2 style={{marginBottom:'var(--sp-8)'}}>More Exhibitions</h2>
            <div className="grid-3">
              {related.map(e => <ExhibitionCard key={e.id} exhibition={e} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
