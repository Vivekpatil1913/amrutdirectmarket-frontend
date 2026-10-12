import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import ExhibitionCard from '../components/ui/ExhibitionCard'
import Accordion from '../components/ui/Accordion'
import { EXHIBITIONS } from '../data/exhibitions'
import { CATEGORIES } from '../data/categories'
import './Home.css'

const STATS = [
  { value: '5,000+', label: 'Verified Sellers', labelMr: 'नोंदणीकृत विक्रेते', icon: '👤' },
  { value: '36', label: 'Districts Covered', labelMr: 'जिल्हे समाविष्ट', icon: '📍' },
  { value: '120+', label: 'Exhibitions Held', labelMr: 'प्रदर्शने आयोजित', icon: '🏟️' },
  { value: '₹950', label: 'Stall Fee Only', labelMr: 'केवळ स्टॉल शुल्क', icon: '🏷️' },
]

const HOW_STEPS = [
  {
    step: '01',
    title: 'Discover an Exhibition',
    titleMr: 'प्रदर्शन शोधा',
    desc: 'Browse upcoming AMRUT Peth exhibitions near you. Filter by district, date, or product category.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Reserve Your Stall',
    titleMr: 'स्टॉल बुक करा',
    desc: 'Select your preferred stall and complete the simple online booking form. Stall fee is just ₹950.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Set Up Your Stall',
    titleMr: 'स्टॉल लावा',
    desc: 'Arrive at the venue, set up your products, and showcase your work to thousands of direct customers.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Sell Directly & Grow',
    titleMr: 'थेट विका व वाढा',
    desc: 'Meet customers face-to-face, showcase your story, receive fair prices, and build lasting connections.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
]

const BENEFITS = [
  { title: 'Direct to Customer', desc: 'No middlemen. Sell directly to consumers and keep your full margins.', icon: '🤝' },
  { title: 'Government Support', desc: 'Backed by AMRUT, Maharashtra Government\'s autonomous institution.', icon: '🏛️' },
  { title: 'All Districts', desc: 'Exhibitions across all 36 Maharashtra districts, close to your home.', icon: '🗺️' },
  { title: 'Affordable Entry', desc: 'Just ₹950 for a stall — accessible to small entrepreneurs and farmers.', icon: '💰' },
  { title: 'Brand Building', desc: 'Build your brand identity, gather feedback, and grow your customer base.', icon: '⭐' },
  { title: 'Women Empowerment', desc: 'Special focus on women entrepreneurs and self-help groups.', icon: '💪' },
]

const FAQ_ITEMS = [
  { question: 'Who can apply for a stall at AMRUT Peth?', answer: 'Any local entrepreneur, artisan, farmer, or small business owner from Maharashtra can apply. Special priority is given to women entrepreneurs, self-help group members, and AMRUT training program graduates.' },
  { question: 'What is the stall fee?', answer: 'The stall fee is ₹950 per exhibition. This covers a dedicated display space at the venue for the duration of the exhibition, usually 3 days.' },
  { question: 'How do I book a stall?', answer: 'You can book a stall online through this website. Click "Book a Stall," select an upcoming exhibition, fill in your business details, and complete the booking form. Stalls are allocated on a first-come, first-served basis.' },
  { question: 'What products can I sell?', answer: 'All locally produced, authentic Maharashtra products are welcome — agricultural produce, processed food, handicrafts, clothing & textiles, home products, health items, footwear, jewelry, and more.' },
  { question: 'Can I participate in multiple exhibitions?', answer: 'Yes! Once registered, you can participate in multiple AMRUT Peth exhibitions across Maharashtra. Your registration and business details are retained for future bookings.' },
  { question: 'Is prior business registration required?', answer: 'It is recommended to have at least a basic business identification (Aadhaar, pan card, or business registration). For official government exhibitions, proper documentation may be required.' },
]

export default function Home() {
  const statsRef = useReveal()
  const howRef = useReveal()
  const benefitsRef = useReveal()
  const exhRef = useReveal()
  const catsRef = useReveal()
  const faqRef = useReveal()

  const upcoming = EXHIBITIONS.filter(e => e.status === 'upcoming' || e.status === 'booking-open').slice(0, 3)

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__bg-pattern" />
          <div className="hero__bg-overlay" />
        </div>
        <div className="container hero__inner">
          <div className="hero__content">
            <div className="hero__eyebrow">
              <span className="hero__eyebrow-dot" />
              <span>महाराष्ट्र शासन पुरस्कृत | Government of Maharashtra</span>
            </div>
            <h1 className="hero__title">
              <span className="hero__title-mr">थेट बाजार</span>
              <span className="hero__title-en">Direct Market for Maharashtra's Entrepreneurs</span>
            </h1>
            <p className="hero__desc">
              AMRUT Peth connects local farmers, artisans, and small business owners directly with customers — no middlemen, fair prices, authentic products.
            </p>
            <p className="hero__desc-mr">
              स्थानिक उद्योजक, कारागीर आणि शेतकऱ्यांसाठी थेट ग्राहकांपर्यंत पोहोचण्याचा सरकार-पुरस्कृत मंच.
            </p>
            <div className="hero__actions">
              <Link to="/exhibitions" className="btn btn--white btn--lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Explore Exhibitions
              </Link>
              <Link to="/stall-booking" className="btn btn--outline btn--lg" style={{borderColor:'rgba(255,255,255,.5)', color:'#fff'}}>
                Book a Stall — ₹950
              </Link>
            </div>
            <div className="hero__trust">
              <div className="hero__trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Govt. of Maharashtra Initiative
              </div>
              <div className="hero__trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                5,000+ Verified Sellers
              </div>
              <div className="hero__trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                36 Districts Covered
              </div>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__img-grid">
              <div className="hero__img hero__img--main">
                <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=800&fit=crop" alt="Fresh vegetarian food at AMRUT Peth" />
              </div>
              <div className="hero__img hero__img--sm hero__img--top">
                <img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=280&fit=crop" alt="Fresh vegetables and produce" />
              </div>
              <div className="hero__img hero__img--sm hero__img--bottom">
                <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=280&fit=crop" alt="Traditional Maharashtra food products" />
              </div>
            </div>
            <div className="hero__floating-badge">
              <span className="hero__badge-icon">🏆</span>
              <div>
                <div className="hero__badge-title">Trusted Platform</div>
                <div className="hero__badge-sub">Government of Maharashtra</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll">
          <div className="hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-bar" ref={statsRef}>
        <div className="container">
          <div className="stats-bar__grid">
            {STATS.map((s, i) => (
              <div key={i} className={`stat-item reveal reveal-delay-${i + 1}`}>
                <div className="stat-item__icon">{s.icon}</div>
                <div className="stat-item__value">{s.value}</div>
                <div className="stat-item__label">{s.label}</div>
                <div className="stat-item__label-mr">{s.labelMr}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About strip ── */}
      <section className="section about-strip">
        <div className="container">
          <div className="about-strip__inner">
            <div className="about-strip__content">
              <p className="section-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                About AMRUT Peth
              </p>
              <h2 className="section-head">Connecting Makers with Markets</h2>
              <p className="section-sub">
                AMRUT Peth (अमृत पेठ) is a government-backed direct market initiative by the Academy of Maharashtra Research, Upliftment &amp; Training (AMRUT). It organises curated exhibitions across all 36 Maharashtra districts, giving local entrepreneurs a physical platform to sell directly to consumers.
              </p>
              <p style={{marginTop:'var(--sp-4)', fontSize:'var(--text-sm)', color:'var(--muted)', lineHeight:1.7}}>
                The focus is on women entrepreneurs, self-help groups, farmers, artisans, and small businesspeople who completed AMRUT's vocational training programs — giving them a pathway to sustainable income and business growth.
              </p>
              <Link to="/about" className="btn btn--primary" style={{marginTop:'var(--sp-8)', display:'inline-flex'}}>
                Learn More About AMRUT Peth
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
            <div className="about-strip__visual">
              <img src="https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=600&h=500&fit=crop" alt="Local entrepreneurs at AMRUT Peth" />
              <div className="about-strip__badge">
                <div className="about-strip__badge-num">120+</div>
                <div className="about-strip__badge-text">Exhibitions Across Maharashtra</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Exhibitions ── */}
      <section className="section section--alt" ref={exhRef}>
        <div className="container">
          <div className="section-head-row">
            <div>
              <p className="section-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                Upcoming Exhibitions
              </p>
              <h2 className="section-head">Find an Exhibition Near You</h2>
            </div>
            <Link to="/exhibitions" className="btn btn--outline hide-mobile">
              View All Exhibitions
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
          <div className="grid-3" style={{marginTop:'var(--sp-10)'}}>
            {upcoming.map((exh, i) => (
              <div key={exh.id} className={`reveal reveal-delay-${i + 1}`}>
                <ExhibitionCard exhibition={exh} />
              </div>
            ))}
          </div>
          <div className="text-center" style={{marginTop:'var(--sp-8)'}}>
            <Link to="/exhibitions" className="btn btn--primary">
              View All Exhibitions
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section how-it-works" ref={howRef}>
        <div className="container">
          <div className="text-center">
            <p className="section-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
              Simple Process
            </p>
            <h2 className="section-head">How It Works</h2>
            <p className="section-sub" style={{marginInline:'auto'}}>
              From discovering an exhibition to selling directly to customers — the process is simple, transparent, and fully supported.
            </p>
          </div>
          <div className="how-it-works__grid" style={{marginTop:'var(--sp-12)'}}>
            {HOW_STEPS.map((step, i) => (
              <div key={i} className={`how-step reveal reveal-delay-${i + 1}`}>
                <div className="how-step__number">{step.step}</div>
                <div className="how-step__icon">{step.icon}</div>
                <h3 className="how-step__title">{step.title}</h3>
                <p className="how-step__title-mr">{step.titleMr}</p>
                <p className="how-step__desc">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center" style={{marginTop:'var(--sp-12)'}}>
            <Link to="/stall-booking" className="btn btn--primary btn--lg">
              Start Your Stall Booking
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section section--alt" ref={catsRef}>
        <div className="container">
          <div className="section-head-row">
            <div>
              <p className="section-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                Product Categories
              </p>
              <h2 className="section-head">What You'll Find at AMRUT Peth</h2>
            </div>
            <Link to="/categories" className="btn btn--outline hide-mobile">View All</Link>
          </div>
          <div className="cats-grid" style={{marginTop:'var(--sp-10)'}}>
            {CATEGORIES.slice(0, 6).map((cat, i) => (
              <Link
                key={cat.id}
                to="/categories"
                className={`cat-card reveal reveal-delay-${(i % 4) + 1}`}
                style={{'--cat-color': cat.color, '--cat-bg': cat.bg}}
              >
                <div className="cat-card__icon">{cat.icon}</div>
                <h3 className="cat-card__name">{cat.name}</h3>
                <p className="cat-card__name-mr">{cat.nameMarathi}</p>
                <div className="cat-card__count">{cat.count}+ sellers</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="section benefits-section" ref={benefitsRef}>
        <div className="container">
          <div className="text-center">
            <p className="section-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
              Why AMRUT Peth
            </p>
            <h2 className="section-head">Benefits for Entrepreneurs & Sellers</h2>
          </div>
          <div className="grid-3" style={{marginTop:'var(--sp-12)'}}>
            {BENEFITS.map((b, i) => (
              <div key={i} className={`benefit-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="benefit-card__icon">{b.icon}</div>
                <h3 className="benefit-card__title">{b.title}</h3>
                <p className="benefit-card__desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-banner__inner">
            <div className="cta-banner__content">
              <h2 className="cta-banner__title">Ready to Showcase Your Products?</h2>
              <p className="cta-banner__sub">Join 5,000+ verified sellers. Book your stall at the next AMRUT Peth exhibition for just ₹950.</p>
            </div>
            <div className="cta-banner__actions">
              <Link to="/stall-booking" className="btn btn--white btn--lg">Book a Stall — ₹950</Link>
              <Link to="/exhibitions" className="btn btn--outline btn--lg" style={{borderColor:'rgba(255,255,255,.5)', color:'#fff'}}>
                See Exhibitions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" ref={faqRef}>
        <div className="container container--sm">
          <div className="text-center">
            <p className="section-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
              Frequently Asked Questions
            </p>
            <h2 className="section-head">Common Questions</h2>
            <p className="section-sub" style={{marginInline:'auto'}}>Everything you need to know about AMRUT Peth, stall booking, and participating in exhibitions.</p>
          </div>
          <div className="reveal" style={{marginTop:'var(--sp-10)'}}>
            <Accordion items={FAQ_ITEMS} />
          </div>
          <div className="text-center" style={{marginTop:'var(--sp-8)'}}>
            <Link to="/contact" className="btn btn--outline">
              Still have questions? Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
