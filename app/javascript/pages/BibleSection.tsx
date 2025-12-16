import { useEffect, useRef, useState } from "react"

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
    <div
      ref={iframeContainerRef}
      style={{
        width: '100%',
        display: 'flex',
        gap: '10px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 100px',
        backgroundImage: 'url("https://c8.alamy.com/comp/E1M8AD/arabic-bible-in-maronite-church-E1M8AD.jpg")',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        color: 'white'
      }}
    >
      <div className="liquid-glass text-center">
        <h1 className="text-4xl font-bold px-4 py-2">
          Bible
        </h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
          className="px-2 pb-2"
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
        </div>
      </div>
    </div>
  )
}
