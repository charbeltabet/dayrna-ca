import { useState, useEffect } from "react"

interface ScriptureSlide {
  imageUrl: string;
  scriptureText: string;
  reference: string;
}

interface ScriptureSlideShowProps {
  slides?: ScriptureSlide[];
}

export default function ScriptureSlideShow({ slides }: ScriptureSlideShowProps) {
  const data = slides || [];

  const [currentIndex, setCurrentIndex] = useState(0)

  // increment index every 5 seconds
  useEffect(() => {
    if (data.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [data.length])

  // Don't render if there are no slides
  if (data.length === 0) {
    return null;
  }

  const height = '90vh'

  const handleScrollDown = () => {
    // Find the scrollable parent container by ID
    const scrollContainer = document.getElementById('main-scroll-container')
    if (scrollContainer) {
      scrollContainer.scrollBy({
        top: scrollContainer.clientHeight,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div
      style={{
        height,
        backgroundImage: `url(${data[currentIndex].imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'panBackground 3s ease-in-out infinite alternate',
      }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
      }} />
      <div style={{
        position: 'relative',
        zIndex: 1,
        color: 'white',
        textAlign: 'center',
        padding: '2rem',
        maxWidth: '90%',
      }}>
        <h1
          className="text-5xl"
          style={{
            fontStyle: 'italic',
            marginBottom: '1rem',
            lineHeight: '1.6',
          }}>
          "{data[currentIndex].scriptureText}"
        </h1>
        <p style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
        }}>
          — {data[currentIndex].reference}
        </p>
      </div>

      {/* Down Arrow Button */}
      <button
        onClick={handleScrollDown}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          background: 'rgba(255, 255, 255, 0.2)',
          border: '2px solid white',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.5rem',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
          e.currentTarget.style.transform = 'translateX(-50%) translateY(5px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
          e.currentTarget.style.transform = 'translateX(-50%) translateY(0)'
        }}
      >
        ↓
      </button>
    </div>
  )
}
