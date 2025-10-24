import MediaSection from './MediaSection'
import NavigationSections from './NavigationSections'
import FooterSection from './FooterSection'
import TimeSection from './TimeSection'
import TopRibon from './TopRibon'
import NavigationBar from './NavigationBar'
import HeroSection from './HeroSection'
import SouvenirSection from './SouvenirSection'

interface HomeProps {

}

export default function Home({ }: HomeProps) {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <TopRibon />
      <NavigationBar />
      <HeroSection />
      <TimeSection />
      <NavigationSections />
      <SouvenirSection />
      <MediaSection />
      <FooterSection />
    </div>
  )
}
