import { useState, useRef, useEffect } from 'react'
import iconSrc from './our-lady-icon.png'

export default function OurLadyIcon() {
  const [activeLabel, setActiveLabel] = useState(null)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const imageRef = useRef(null)
  const containerRef = useRef(null)

  const labels = [
    {
      id: 1,
      xRatio: 0.5,
      yRatio: 0.2,
      title: 'Title 1',
      description: 'Description for label 1',
    },
    {
      id: 2,
      xRatio: 0.3,
      yRatio: 0.6,
      title: 'Title 2',
      description: 'Description for label 2',
    },
    {
      id: 3,
      xRatio: 0.7,
      yRatio: 0.4,
      title: 'Title 3',
      description: 'Description for label 3',
    },
    {
      id: 4,
      xRatio: 0.68,
      yRatio: 0.7,
      title: 'Title 4',
      description: 'Description for label 4',
    }
  ]

  useEffect(() => {
    const updateDimensions = () => {
      if (imageRef.current) {
        setImageDimensions({
          width: imageRef.current.offsetWidth,
          height: imageRef.current.offsetHeight
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    // Update dimensions when image loads
    if (imageRef.current?.complete) {
      updateDimensions()
    }

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const handleDotClick = (label) => {
    setActiveLabel(activeLabel?.id === label.id ? null : label)
  }

  const getInfoBoxPosition = (label) => {
    const dotX = label.xRatio * imageDimensions.width
    const dotY = label.yRatio * imageDimensions.height

    // Position info box to the right or left based on dot position
    const boxWidth = 200
    const boxHeight = 100
    const offset = 80 // Distance from dot

    let boxX, boxY

    // Determine horizontal position
    if (dotX < imageDimensions.width / 2) {
      // Dot is on left side, place box to the right
      boxX = dotX + offset
    } else {
      // Dot is on right side, place box to the left
      boxX = dotX - offset - boxWidth
    }

    // Center vertically relative to dot, but keep within bounds
    boxY = Math.max(0, Math.min(dotY - boxHeight / 2, imageDimensions.height - boxHeight))

    return { x: boxX, y: boxY }
  }

  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          display: 'inline-block',
          userSelect: 'none',
        }}
      >
        <img
          ref={imageRef}
          src={iconSrc}
          alt="Our Lady Icon"
          style={{ maxWidth: '500px', display: 'block' }}
          onLoad={() => {
            if (imageRef.current) {
              setImageDimensions({
                width: imageRef.current.offsetWidth,
                height: imageRef.current.offsetHeight
              })
            }
          }}
        />

        {/* SVG for lines */}
        {activeLabel && (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1
            }}
          >
            <line
              x1={activeLabel.xRatio * imageDimensions.width}
              y1={activeLabel.yRatio * imageDimensions.height}
              x2={getInfoBoxPosition(activeLabel).x + (activeLabel.xRatio < 0.5 ? 0 : 200)}
              y2={getInfoBoxPosition(activeLabel).y + 50}
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.8"
            />
          </svg>
        )}

        {/* Breathing dots */}
        {labels.map((label) => (
          <button
            key={label.id}
            onClick={() => handleDotClick(label)}
            className="breathing-dot"
            style={{
              position: 'absolute',
              left: `${label.xRatio * 100}%`,
              top: `${label.yRatio * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: activeLabel?.id === label.id ? '#3b82f6' : '#ef4444',
              border: '2px solid white',
              cursor: 'pointer',
              zIndex: 2,
              padding: 0,
              outline: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          />
        ))}

        {/* Info boxes */}
        {activeLabel && (
          <div
            className="info-box"
            style={{
              position: 'absolute',
              left: `${getInfoBoxPosition(activeLabel).x}px`,
              top: `${getInfoBoxPosition(activeLabel).y}px`,
              width: '200px',
              padding: '16px',
              backgroundColor: 'white',
              border: '2px solid #3b82f6',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              zIndex: 3,
              animation: 'fadeIn 0.3s ease-out'
            }}
          >
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#1f2937'
            }}>
              {activeLabel.title}
            </h3>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#6b7280',
              lineHeight: '1.4'
            }}>
              {activeLabel.description}
            </p>
          </div>
        )}

        <style jsx>{`
        @keyframes breathing {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.9;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.6;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .breathing-dot {
          animation: breathing 2s ease-in-out infinite;
        }
        
        .breathing-dot:hover {
          animation-play-state: paused;
          transform: translate(-50%, -50%) scale(1.4) !important;
        }
        
        .info-box {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      </div>
    </div>
  )
}