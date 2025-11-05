import MediaSection from '../MediaSection'
import NavigationSections from '../NavigationSections'
import FooterSection from '../FooterSection'
import TimeSection from '../TimeSection'
import TopRibon from '../TopRibon'
import NavigationBar from '../NavigationBar'
import HeroSection from '../HeroSection'
import SouvenirSection from '../SouvenirSection'
import HomeContext from './context'
import ScriptureSlideShow from './ScriptureSlideShow'

interface HomeProps {
  homePageData: any
}

export default function Home({ homePageData }: HomeProps) {
  return (
    <HomeContext.Provider value={{ homePageData }}>
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TopRibon />
        <NavigationBar />
        <div
          id="main-scroll-container"
          style={{
            flex: 1,
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
        >
          <ScriptureSlideShow slides={homePageData?.scripture_slides} />
          <HeroSection />
          <TimeSection />
          <NavigationSections />
          <SouvenirSection />
          <MediaSection />
          <FooterSection />
        </div>
      </div>
    </HomeContext.Provider>
  )
}
