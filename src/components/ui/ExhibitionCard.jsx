import { Link } from 'react-router-dom'
import './ExhibitionCard.css'

function formatDate(from, to) {
  const opts = { day: 'numeric', month: 'short' }
  const f = new Date(from).toLocaleDateString('en-IN', opts)
  const t = new Date(to).toLocaleDateString('en-IN', { ...opts, year: 'numeric' })
  return `${f} – ${t}`
}

const STATUS_MAP = {
  upcoming:      { label: 'Upcoming', cls: 'info' },
  'booking-open':{ label: 'Booking Open', cls: 'success' },
  completed:     { label: 'Completed', cls: 'warning' },
}

export default function ExhibitionCard({ exhibition, className = '' }) {
  const { id, name, district, location, dateFrom, dateTo, status, stallsFilled, stallsTotal, stallFee, image, categories } = exhibition
  const pct = Math.round((stallsFilled / stallsTotal) * 100)
  const st = STATUS_MAP[status] || STATUS_MAP.upcoming
  const isFull = stallsFilled >= stallsTotal

  return (
    <article className={`exh-card card ${className}`}>
      <div className="exh-card__img-wrap">
        <img src={image} alt={name} className="exh-card__img" loading="lazy" />
        <div className="exh-card__badges">
          <span className={`badge badge--${st.cls}`}>{st.label}</span>
          {isFull && <span className="badge badge--warning">Fully Booked</span>}
        </div>
      </div>
      <div className="exh-card__body">
        <div className="exh-card__meta">
          <span className="exh-card__district">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {district}
          </span>
          <span className="exh-card__date">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {formatDate(dateFrom, dateTo)}
          </span>
        </div>
        <h3 className="exh-card__name">{name}</h3>
        <p className="exh-card__location clamp-2">{location}</p>

        <div className="exh-card__stalls">
          <div className="exh-card__stalls-header">
            <span>Stall Availability</span>
            <span className={isFull ? 'full' : ''}>{stallsTotal - stallsFilled} of {stallsTotal} remaining</span>
          </div>
          <div className="exh-card__stalls-bar">
            <div className="exh-card__stalls-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="exh-card__cats">
          {categories.slice(0, 3).map(cat => (
            <span key={cat} className="badge badge--secondary">{cat}</span>
          ))}
          {categories.length > 3 && <span className="badge badge--secondary">+{categories.length - 3}</span>}
        </div>
      </div>
      <div className="exh-card__footer">
        <div className="exh-card__fee">
          <span className="exh-card__fee-label">Stall Fee</span>
          <span className="exh-card__fee-price">₹{stallFee.toLocaleString('en-IN')}</span>
        </div>
        <div className="exh-card__actions">
          <Link to={`/exhibitions/${id}`} className="btn btn--ghost btn--sm">Details</Link>
          {status !== 'completed' && (
            <Link to={`/stall-booking/${id}`} className="btn btn--primary btn--sm" disabled={isFull}>
              {isFull ? 'Waitlist' : 'Book Stall'}
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
