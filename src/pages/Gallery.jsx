import { useState } from 'react'
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from '../data/gallery'
import { useReveal } from '../hooks/useReveal'
import './Gallery.css'

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState(null)
  const ref = useReveal()

  const filtered = activeCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(g => g.category === activeCategory)

  function openLightbox(item) { setLightbox(item) }
  function closeLightbox() { setLightbox(null) }

  function navigateLightbox(dir) {
    const idx = filtered.findIndex(g => g.id === lightbox.id)
    const next = filtered[(idx + dir + filtered.length) % filtered.length]
    setLightbox(next)
  }

  return (
    <div className="gallery-page">
      <section className="page-hero">
        <div className="container">
          <p className="page-hero-label">Photo Gallery · फोटो गॅलरी</p>
          <h1>AMRUT Peth in Pictures</h1>
          <p>Authentic moments from our exhibitions across Maharashtra — artisans, products, and vibrant market scenes.</p>
        </div>
      </section>

      {/* Filters */}
      <div className="gallery-filter-bar">
        <div className="container">
          <div className="gallery-filters">
            {GALLERY_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`gallery-filter-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="section section--alt" ref={ref}>
        <div className="container">
          <div className="gallery-grid">
            {filtered.map((item, i) => (
              <button
                key={item.id}
                className={`gallery-item reveal reveal-delay-${(i % 4) + 1} gallery-item--${item.aspectRatio}`}
                onClick={() => openLightbox(item)}
                aria-label={`View: ${item.title}`}
              >
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="gallery-item__overlay">
                  <div className="gallery-item__info">
                    <h3>{item.title}</h3>
                    <p>{item.district}</p>
                  </div>
                  <div className="gallery-item__zoom">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="gallery-empty">
              <div>📷</div>
              <p>No photos in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={closeLightbox} role="dialog" aria-modal="true" aria-label={lightbox.title}>
          <button className="lightbox__close" onClick={closeLightbox} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <button className="lightbox__nav lightbox__nav--prev" onClick={e => { e.stopPropagation(); navigateLightbox(-1) }} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="lightbox__inner" onClick={e => e.stopPropagation()}>
            <img src={lightbox.image} alt={lightbox.title} />
            <div className="lightbox__caption">
              <h4>{lightbox.title}</h4>
              <p>{lightbox.caption}</p>
              <span className="badge badge--secondary">{lightbox.district}</span>
            </div>
          </div>
          <button className="lightbox__nav lightbox__nav--next" onClick={e => { e.stopPropagation(); navigateLightbox(1) }} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      )}
    </div>
  )
}
