import { Link } from 'react-router-dom'
import './Footer.css'

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About AMRUT Peth' },
  { to: '/exhibitions', label: 'Exhibitions' },
  { to: '/stall-booking', label: 'Book a Stall' },
  { to: '/categories', label: 'Product Categories' },
  { to: '/gallery', label: 'Gallery' },
]

const USEFUL_LINKS = [
  { to: '/beneficiaries', label: 'Registered Exhibitors' },
  { to: '/contact', label: 'Contact Us' },
  { href: 'https://mahaamrut.org.in', label: 'AMRUT Maharashtra', external: true },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="container footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <circle cx="22" cy="22" r="22" fill="rgba(180,80,29,.15)" />
                  <circle cx="22" cy="22" r="17" stroke="#b4501d" strokeWidth="1.5" fill="none"/>
                  <text x="22" y="29" textAnchor="middle" fill="#b4501d" fontSize="17" fontWeight="bold" fontFamily="serif">अ</text>
                </svg>
              </div>
              <div>
                <div className="footer__logo-title">AMRUT Peth</div>
                <div className="footer__logo-sub">थेट बाजार | Direct Market</div>
              </div>
            </div>
            <p className="footer__desc">
              Maharashtra's government-supported platform connecting local entrepreneurs, artisans, and farmers directly with customers through curated district exhibitions.
            </p>
            <p className="footer__desc-mr">
              महाराष्ट्रातील स्थानिक उद्योजक, कारागीर आणि शेतकऱ्यांना थेट ग्राहकांशी जोडणारा शासन-पुरस्कृत मंच.
            </p>
            <div className="footer__socials">
              <a href="https://www.facebook.com/MahaAmrutOfficial/" target="_blank" rel="noopener noreferrer" className="footer__social" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/mahaamrut_official/" target="_blank" rel="noopener noreferrer" className="footer__social" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h3 className="footer__col-title">Quick Links</h3>
            <ul className="footer__links">
              {QUICK_LINKS.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="footer__link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div className="footer__col">
            <h3 className="footer__col-title">Information</h3>
            <ul className="footer__links">
              {USEFUL_LINKS.map((link, i) => (
                <li key={i}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="footer__link">
                      {link.label} ↗
                    </a>
                  ) : (
                    <Link to={link.to} className="footer__link">{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h3 className="footer__col-title">Contact</h3>
            <ul className="footer__contact-list">
              <li className="footer__contact-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Maharaja Sayajirao Gaikwad Udyog Bhavan, 5th Floor, Aundh, Pune 411067</span>
              </li>
              <li className="footer__contact-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                <a href="tel:+919730151450">+91 97301 51450</a>
              </li>
              <li className="footer__contact-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a href="mailto:info@mahaamrut.org.in">info@mahaamrut.org.in</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            © {new Date().getFullYear()} AMRUT Peth – Direct Market. Academy Of Maharashtra Research, Upliftment &amp; Training. Govt. of Maharashtra.
          </p>
          <p className="footer__note">
            <em>Sample data shown for demonstration. Official information at <a href="https://mahaamrut.org.in" target="_blank" rel="noopener noreferrer">mahaamrut.org.in</a></em>
          </p>
        </div>
      </div>
    </footer>
  )
}
