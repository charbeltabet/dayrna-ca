import FooterSection from '../FooterSection'
import TimeSection from '../TimeSection'
import TopRibon from '../TopRibon'
import NavigationBar from '../NavigationBar'
import HeroSection from '../HeroSection'
import HomeContext from './context'
import ScriptureSlideShow from './ScriptureSlideShow'
import MediaSection from '../MediaSection'
import OurLadyIconDescription from './OurLadyIconDescription'
import ReferencesSection from '../ReferencesSection'

export default function Home({
  homePageData,
  attachment_groups: attachmentGroups
}: any) {
  console.log('attachment_groups', attachmentGroups)
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
          <TimeSection
            announcements={homePageData?.announcements}
          />
          {/* <OurLadyIconDescription /> */}
          <ReferencesSection />
          <MediaSection
            attachmentGroups={attachmentGroups}
          />
          {/* <SouvenirSection /> */}
          <FooterSection />
        </div>
      </div>
    </HomeContext.Provider>
  )
}
