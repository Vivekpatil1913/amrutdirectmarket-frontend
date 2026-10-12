import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ExhibitionCard from '../components/ui/ExhibitionCard'
import { EXHIBITIONS, DISTRICTS } from '../data/exhibitions'
import './Exhibitions.css'

const STATUSES = [
  { value: '', label: 'All Status' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'booking-open', label: 'Booking Open' },
  { value: 'completed', label: 'Completed' },
]

export default function Exhibitions() {
  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState('')
  const [status, setStatus] = useState('')

  const filtered = useMemo(() => {
    return EXHIBITIONS.filter(e => {
      const matchesSearch = !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.district.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase())
      const matchesDistrict = !district || e.district === district
      const matchesStatus = !status || e.status === status
      return matchesSearch && matchesDistrict && matchesStatus
    })
  }, [search, district, status])

  const upcoming = filtered.filter(e => e.status !== 'completed').length
  const completed = filtered.filter(e => e.status === 'completed').length

  return (
    <div className="exhibitions-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <p className="page-hero-label">Exhibitions · प्रदर्शने</p>
          <h1>AMRUT Peth Exhibitions</h1>
          <p>Discover upcoming direct market exhibitions across Maharashtra's 36 districts.</p>
        </div>
      </section>

      {/* Filters */}
      <section className="exh-filters-bar">
        <div className="container">
          <div className="exh-filters">
            <div className="field exh-filter-search">
              <div className="input-icon-wrap">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="search"
                  className="input"
                  placeholder="Search by exhibition name or city..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{paddingLeft:'2.5rem'}}
                />
              </div>
            </div>
            <select className="select exh-filter-select" value={district} onChange={e => setDistrict(e.target.value)}>
              <option value="">All Districts</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select className="select exh-filter-select" value={status} onChange={e => setStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            {(search || district || status) && (
              <button
                className="btn btn--ghost btn--sm"
                onClick={() => { setSearch(''); setDistrict(''); setStatus('') }}
              >
                Clear Filters ✕
              </button>
            )}
          </div>
          <div className="exh-filter-info">
            <span>Showing {filtered.length} exhibition{filtered.length !== 1 ? 's' : ''}</span>
            {upcoming > 0 && <span className="badge badge--success">{upcoming} Upcoming</span>}
            {completed > 0 && <span className="badge badge--warning">{completed} Completed</span>}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section section--alt">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="exh-empty">
              <div className="exh-empty__icon">🔍</div>
              <h3>No exhibitions found</h3>
              <p>Try adjusting your filters or search terms.</p>
              <button className="btn btn--primary" onClick={() => { setSearch(''); setDistrict(''); setStatus('') }}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map(exh => (
                <ExhibitionCard key={exh.id} exhibition={exh} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="exh-cta">
            <div>
              <h3>Can't find your district?</h3>
              <p>AMRUT Peth exhibitions are scheduled throughout the year across all 36 Maharashtra districts. New exhibitions are added regularly.</p>
            </div>
            <div className="exh-cta__actions">
              <Link to="/contact" className="btn btn--outline">Get Notified</Link>
              <Link to="/stall-booking" className="btn btn--primary">Book a Stall</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
