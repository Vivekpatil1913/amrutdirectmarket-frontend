import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import './About.css'

const PILLARS = [
  { icon: '🤝', title: 'Direct Market Access', desc: 'AMRUT Peth eliminates middlemen by hosting physical exhibitions where producers meet customers face-to-face. Sellers keep their full margin.' },
  { icon: '🏛️', title: 'Government Backed', desc: 'Organised by AMRUT — Academy of Maharashtra Research, Upliftment & Training — an autonomous body of the Maharashtra Government.' },
  { icon: '👩‍💼', title: 'Women Empowerment', desc: 'Special focus on women entrepreneurs and self-help group members, giving them a credible platform to build sustainable businesses.' },
  { icon: '🌾', title: 'Farmer Support', desc: 'Direct access for farmers to sell produce and value-added products at fair prices without any commission intermediary.' },
  { icon: '🎨', title: 'Artisan Livelihoods', desc: 'Traditional artisans, craftspeople, and tribal artists get a dignified platform to showcase their skills and earn from their craft.' },
  { icon: '🗺️', title: 'All 36 Districts', desc: 'Exhibitions are held across all 36 Maharashtra districts, making participation accessible to entrepreneurs from every corner of the state.' },
]

const TIMELINE = [
  { year: '2018', event: 'AMRUT Peth concept launched as a pilot direct market in Pune', milestone: false },
  { year: '2019', event: 'Expanded to 10 districts. Over 500 sellers participated in the first year', milestone: true },
  { year: '2021', event: 'Post-COVID revival — AMRUT Peth provided critical market access to entrepreneurs recovering from the pandemic', milestone: false },
  { year: '2023', event: 'Digital booking system launched. Reached 3,000+ registered sellers', milestone: true },
  { year: '2024', event: 'Expanded to all 36 districts. 5,000+ registered sellers on the platform', milestone: true },
  { year: '2026', event: 'Online stall booking, digital beneficiary registration, and enhanced exhibition discovery', milestone: true },
]

export default function About() {
  const reveal1 = useReveal()
  const reveal2 = useReveal()

  return (
    <div className="about-page">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <p className="page-hero-label">About Us · आमच्याबद्दल</p>
          <h1>AMRUT Peth – थेट बाजार</h1>
          <p>Maharashtra's government-supported direct market connecting local producers with customers since 2018.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div className="about-mission" ref={reveal1}>
            <div className="about-mission__content reveal">
              <p className="section-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                Our Mission
              </p>
              <h2 className="section-head">Bridging Maharashtra's Makers and Markets</h2>
              <p className="section-sub">
                AMRUT Peth (अमृत पेठ – Direct Indigenous Market) is a flagship programme of AMRUT — Academy of Maharashtra Research, Upliftment &amp; Training — an autonomous institution of the Government of Maharashtra.
              </p>
              <p style={{marginTop:'var(--sp-5)', color:'var(--muted)', lineHeight:1.8}}>
                The initiative organises curated physical exhibition-markets across Maharashtra's 36 districts, providing local entrepreneurs — especially women, farmers, artisans, and self-help group members — a direct platform to sell their products to consumers without any middlemen or commission charges.
              </p>
              <p style={{marginTop:'var(--sp-4)', color:'var(--muted)', lineHeight:1.8}}>
                Each exhibition creates a vibrant, curated marketplace celebrating Maharashtra's rich traditions of craftsmanship, agriculture, and entrepreneurship — while supporting sustainable livelihoods and regional economies.
              </p>
              <div className="about-mission__actions">
                <Link to="/exhibitions" className="btn btn--primary">Explore Exhibitions</Link>
                <Link to="/stall-booking" className="btn btn--outline">Book a Stall</Link>
              </div>
            </div>
            <div className="about-mission__visual reveal reveal-delay-2">
              <img src="https://images.unsplash.com/photo-1573655349936-de6bed86f839?w=600&h=500&fit=crop" alt="AMRUT Peth exhibition" />
              <div className="about-mission__quote">
                <blockquote>
                  "Empowering Maharashtra's local entrepreneurs through direct market access."
                </blockquote>
                <cite>— AMRUT, Govt. of Maharashtra</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="section section--alt" ref={reveal2}>
        <div className="container">
          <div className="text-center">
            <p className="section-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
              Our Pillars
            </p>
            <h2 className="section-head">What AMRUT Peth Stands For</h2>
          </div>
          <div className="grid-3" style={{marginTop:'var(--sp-12)'}}>
            {PILLARS.map((p, i) => (
              <div key={i} className={`pillar-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="pillar-card__icon">{p.icon}</div>
                <h3 className="pillar-card__title">{p.title}</h3>
                <p className="pillar-card__desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About AMRUT */}
      <section className="section">
        <div className="container container--sm">
          <div className="text-center">
            <p className="section-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
              The Organisation
            </p>
            <h2 className="section-head">About AMRUT</h2>
          </div>
          <div className="amrut-org">
            <p>
              <strong>AMRUT</strong> (Academy of Maharashtra Research, Upliftment &amp; Training) is an autonomous organisation of the Government of Maharashtra, headquartered at Maharaja Sayajirao Gaikwad Udyog Bhavan, 5th Floor, Aundh, Pune – 411067.
            </p>
            <p>
              AMRUT's core mandate is to research, design, and deliver vocational training, entrepreneurship development, and livelihood support programmes for Maharashtra's citizens — with special emphasis on women, economically weaker sections, farmers, and traditional artisans.
            </p>
            <p>
              AMRUT Peth is the flagship direct-market programme through which AMRUT's graduates and registered beneficiaries can access real customer markets, test their products, receive feedback, build their brands, and grow sustainable micro and small enterprises.
            </p>
            <div className="amrut-org__contact">
              <h4>Official Contact</h4>
              <ul>
                <li>📍 Maharaja Sayajirao Gaikwad Udyog Bhavan, 5th Floor, Aundh, Pune 411067</li>
                <li>📞 <a href="tel:+919730151450">+91 97301 51450</a></li>
                <li>📧 <a href="mailto:info@mahaamrut.org.in">info@mahaamrut.org.in</a></li>
                <li>🌐 <a href="https://mahaamrut.org.in" target="_blank" rel="noopener noreferrer">mahaamrut.org.in</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section section--alt">
        <div className="container container--sm">
          <div className="text-center">
            <p className="section-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
              Our Journey
            </p>
            <h2 className="section-head">AMRUT Peth Through the Years</h2>
          </div>
          <div className="timeline">
            {TIMELINE.map((item, i) => (
              <div key={i} className={`timeline-item${item.milestone ? ' milestone' : ''}`}>
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-dot" />
                <div className="timeline-content">{item.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="about-cta">
            <h2>Ready to Join AMRUT Peth?</h2>
            <p>Register as a seller, book a stall, and bring your products to Maharashtra's customers.</p>
            <div className="about-cta__actions">
              <Link to="/stall-booking" className="btn btn--primary btn--lg">Book a Stall — ₹950</Link>
              <Link to="/contact" className="btn btn--outline btn--lg">Contact AMRUT</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
