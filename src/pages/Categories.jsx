import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/categories'
import { useReveal } from '../hooks/useReveal'
import './Categories.css'

export default function Categories() {
  const ref = useReveal()

  return (
    <div className="categories-page">
      <section className="page-hero">
        <div className="container">
          <p className="page-hero-label">Product Categories · उत्पादन श्रेणी</p>
          <h1>What You'll Find at AMRUT Peth</h1>
          <p>Authentic Maharashtra products across 8+ categories, sold directly by verified local entrepreneurs.</p>
        </div>
      </section>

      <section className="section" ref={ref}>
        <div className="container">
          <div className="cats-page-grid">
            {CATEGORIES.map((cat, i) => (
              <div
                key={cat.id}
                className={`cat-page-card reveal reveal-delay-${(i % 4) + 1}`}
                style={{'--cat-color': cat.color, '--cat-bg': cat.bg}}
              >
                <div className="cat-page-card__top">
                  <div className="cat-page-card__icon-wrap">
                    <span className="cat-page-card__icon">{cat.icon}</span>
                  </div>
                  <div className="cat-page-card__count">{cat.count}+ sellers</div>
                </div>
                <h2 className="cat-page-card__name">{cat.name}</h2>
                <p className="cat-page-card__name-mr">{cat.nameMarathi}</p>
                <p className="cat-page-card__desc">{cat.description}</p>
                <div className="cat-page-card__subs">
                  {cat.subcategories.map(sub => (
                    <span key={sub} className="cat-sub-tag">{sub}</span>
                  ))}
                </div>
                <img src={cat.image} alt={cat.name} className="cat-page-card__img" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="cats-cta">
            <div>
              <h2>Sell Your Products at AMRUT Peth</h2>
              <p>If your products belong to any of these categories, you can book a stall and reach thousands of direct customers at our exhibitions.</p>
            </div>
            <div className="cats-cta__actions">
              <Link to="/exhibitions" className="btn btn--outline">View Exhibitions</Link>
              <Link to="/stall-booking" className="btn btn--primary">Book a Stall — ₹950</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
