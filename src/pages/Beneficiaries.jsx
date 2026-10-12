import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BENEFICIARIES, DISTRICTS_BEN, CATEGORIES_BEN } from '../data/beneficiaries'
import './Beneficiaries.css'

export default function Beneficiaries() {
  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState('')
  const [category, setCategory] = useState('')

  const filtered = useMemo(() => {
    return BENEFICIARIES.filter(b => {
      const s = search.toLowerCase()
      const matchSearch = !s || b.name.toLowerCase().includes(s) || b.business.toLowerCase().includes(s) || b.district.toLowerCase().includes(s)
      const matchDistrict = !district || b.district === district
      const matchCategory = !category || b.category === category
      return matchSearch && matchDistrict && matchCategory
    })
  }, [search, district, category])

  return (
    <div className="ben-page">
      <section className="page-hero">
        <div className="container">
          <p className="page-hero-label">Registered Exhibitors · नोंदणीकृत प्रदर्शक</p>
          <h1>AMRUT Peth Exhibitors</h1>
          <p>Verified local entrepreneurs, artisans, and farmers registered with AMRUT Peth.</p>
        </div>
      </section>

      {/* Note */}
      <div className="container" style={{paddingTop:'var(--sp-6)'}}>
        <div className="ben-note">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p>
            <strong>Demo Data:</strong> This directory shows sample exhibitor profiles for demonstration. The actual registered beneficiary database is managed by AMRUT's official system at <a href="https://mahaamrut.org.in" target="_blank" rel="noopener noreferrer">mahaamrut.org.in</a>. No private information of real applicants is displayed.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="ben-filters-bar">
        <div className="container">
          <div className="exh-filters">
            <div className="field exh-filter-search">
              <div className="input-icon-wrap">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="search"
                  className="input"
                  placeholder="Search by name or business..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{paddingLeft:'2.5rem'}}
                />
              </div>
            </div>
            <select className="select exh-filter-select" value={district} onChange={e => setDistrict(e.target.value)}>
              <option value="">All Districts</option>
              {DISTRICTS_BEN.map(d => <option key={d}>{d}</option>)}
            </select>
            <select className="select exh-filter-select" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES_BEN.map(c => <option key={c}>{c}</option>)}
            </select>
            {(search || district || category) && (
              <button className="btn btn--ghost btn--sm" onClick={() => { setSearch(''); setDistrict(''); setCategory('') }}>
                Clear ✕
              </button>
            )}
          </div>
          <p style={{fontSize:'var(--text-sm)', color:'var(--muted)', marginTop:'var(--sp-3)'}}>
            Showing {filtered.length} of {BENEFICIARIES.length} exhibitors (sample data)
          </p>
        </div>
      </div>

      {/* Grid */}
      <section className="section section--alt">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="exh-empty">
              <div className="exh-empty__icon">👤</div>
              <h3>No exhibitors found</h3>
              <p>Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="ben-grid">
              {filtered.map(ben => (
                <div key={ben.id} className="ben-card card">
                  <div className="ben-card__header">
                    <img src={ben.image} alt={ben.name} className="ben-card__avatar" loading="lazy" />
                    <div className="ben-card__header-info">
                      <div className="tag-strip">
                        {ben.verified && <span className="badge badge--success">✓ Verified</span>}
                        <span className="badge badge--secondary">{ben.district}</span>
                      </div>
                      <h3 className="ben-card__name">{ben.name}</h3>
                      <p className="ben-card__name-mr">{ben.nameMarathi}</p>
                    </div>
                  </div>
                  <div className="ben-card__body">
                    <div className="ben-card__business">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      {ben.business}
                    </div>
                    <span className="badge badge--primary" style={{alignSelf:'flex-start'}}>{ben.category}</span>
                    <p className="ben-card__products">{ben.productDescription}</p>
                    <div className="ben-card__stats">
                      <div className="ben-card__stat">
                        <span className="ben-card__stat-val">{ben.exhibitionsParticipated}</span>
                        <span className="ben-card__stat-label">Exhibitions</span>
                      </div>
                      <div className="ben-card__stat">
                        <span className="ben-card__stat-val ben-card__stat-val--reg">{ben.registrationNo.split('/').pop()}</span>
                        <span className="ben-card__stat-label">Reg. No.</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="ben-cta">
            <h2>Want to Join as an Exhibitor?</h2>
            <p>Register your business and book a stall at an upcoming AMRUT Peth exhibition to be listed as a verified exhibitor.</p>
            <div className="ben-cta__actions">
              <Link to="/stall-booking" className="btn btn--primary btn--lg">Book a Stall</Link>
              <Link to="/contact" className="btn btn--outline btn--lg">Contact AMRUT</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
