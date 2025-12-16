import FooterSection from './sections/FooterSection'
import TimeSection from './sections/TimeSection'
import TopRibon from './sections/TopRibon'
import NavigationBar from './sections/NavigationBar'
import HeroSection from './sections/HeroSection'
import HomeContext from './context'
import ScriptureSlideShow from './sections/ScriptureSlideShow'
import MediaSection from './sections/MediaSection'
import ReferencesSection from './sections/ReferencesSection'
import BibleSection from './sections/BibleSection'
import OurLadyIconDescription from './sections/OurLadyIconDescription'

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
          <BibleSection />
          <OurLadyIconDescription />
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
