import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Mandala from '../components/ui/Mandala'
import { useLanguage } from '../i18n/LanguageContext'
import photo from '../assets/market-produce.jpg'

export default function NotFound() {
  const { t, num } = useLanguage()
  return (
    <section className="standalone">
      <Mandala className="standalone__mandala" />
      <div className="standalone__card">
        <div className="standalone__media">
          <img src={photo} alt="" width="1100" height="733" />
        </div>
        <div className="standalone__body">
          <p className="standalone__code">{num(404)}</p>
          <h1 className="standalone__title">{t.notFound.title}</h1>
          <p className="standalone__desc">{t.notFound.desc}</p>
          <div className="standalone__actions">
            <Link to="/" className="btn btn--primary">
              {t.notFound.home}
              <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
