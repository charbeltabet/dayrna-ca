import { useRef } from "react"

export default function BibleSection() {
  const iframeContainerRef = useRef<any>(null)
  const width = iframeContainerRef.current?.offsetWidth || 0
  const height = 800

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
        backgroundColor: 'var(--color-base-100)',
        padding: '20px 100px',
      }}
    >
      <h1 className="text-4xl font-bold">
        Bible
      </h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {width > 0 && (
          <iframe
            src="https://maronitehub.org/bible/DRC/john/1"
            style={{
              border: '1px solid var(--color-base-300)',
            }}
            width={`${width * 0.8}px`}
            height={`${height * 0.8}px`}
          />
        )}
      </div>
    </div>
  )
}
