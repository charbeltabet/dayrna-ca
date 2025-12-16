import { useEffect, useRef, useState } from "react"
import { HomeSectionLayout } from "../../../components/HomeSectionLayout"

export default function BibleSection() {
  const iframeContainerRef = useRef<any>(null)
  const [width, setWidth] = useState(0)
  const height = 800

  useEffect(() => {
    if (width) return

    const currentWidth = iframeContainerRef.current?.offsetWidth || 0
    setWidth(currentWidth)
  }, [iframeContainerRef.current])

  return (
    <HomeSectionLayout.Container
      style={{
        backgroundImage: 'url("https://c8.alamy.com/comp/E1M8AD/arabic-bible-in-maronite-church-E1M8AD.jpg")',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      }}
      ref={iframeContainerRef}
    >
      <div
        className="liquid-glass"
        style={{
          padding: '10px',
          textAlign: 'center'
        }}>
        <HomeSectionLayout.Header>Bible</HomeSectionLayout.Header>
        <HomeSectionLayout.Content
        >
          {width > 0 && (
            <iframe
              src="https://maronitehub.org/bible/GNA/john/1"
              style={{
                border: '1px solid var(--color-base-300)',
                height: '700px'
              }}
              width={`${width * 0.8}px`}
              height={`${height * 0.8}px`}
              tabIndex={-1}
              loading="lazy"
            />
          )}
        </HomeSectionLayout.Content>
      </div>
    </HomeSectionLayout.Container>
  )
}
