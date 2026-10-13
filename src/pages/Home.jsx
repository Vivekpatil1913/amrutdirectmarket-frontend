import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import MarketHighlights from '../components/sections/MarketHighlights'
import ParticipationSection from '../components/sections/ParticipationSection'
import RegistrationCTA from '../components/sections/RegistrationCTA'
import { useSectionNav } from '../components/layout/Header'
import { useReveal } from '../hooks/useReveal'
import { useLanguage } from '../i18n/LanguageContext'

export default function Home() {
  const goTo = useSectionNav()
  const { lang } = useLanguage()
  useReveal([lang])

  return (
    <>
      <HeroSection onNavigate={goTo} />
      <AboutSection />
      <MarketHighlights />
      <ParticipationSection onNavigate={goTo} />
      <RegistrationCTA />
    </>
  )
}
