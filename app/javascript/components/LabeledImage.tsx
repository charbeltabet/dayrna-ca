import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faClose, faFingerprint } from '@fortawesome/free-solid-svg-icons';
import { truncateText } from '../utils/strings';

interface PolygonCoordinates {
  x: number;
  y: number;
}

interface ImageLabel {
  text: string;
  coordinates: PolygonCoordinates[]; // [topLeft, bottomRight] corners
}

interface LabeledImageProps {
  src: string;
  labels?: ImageLabel[];
}

function LabeledImage({ src, labels = [] }: LabeledImageProps) {
  const [activeLabel, setActiveLabel] = useState<number | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [hasUserClicked, setHasUserClicked] = useState(false);
  const [showClickHint, setShowClickHint] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Demo labels if none provided
  const demoLabels: ImageLabel[] = labels.length > 0 ? labels : [
    {
      text: "The Virgin Mary holds the Christ Child, depicted with divine golden halos symbolizing their sacred nature.",
      coordinates: [{ x: 180, y: 80 }, { x: 420, y: 320 }]
    },
    {
      text: "Intricate golden embroidery adorns the robes, reflecting Byzantine artistic traditions.",
      coordinates: [{ x: 200, y: 320 }, { x: 400, y: 480 }]
    },
    {
      text: "The deep blue maphorion (veil) represents heavenly grace and Mary's role as Queen of Heaven.",
      coordinates: [{ x: 120, y: 150 }, { x: 200, y: 350 }]
    }
  ];

  useEffect(() => {
    const updateSize = () => {
      if (imageRef.current) {
        setImageSize({
          width: imageRef.current.clientWidth,
          height: imageRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Click hint animation - show every 3s until user clicks
  useEffect(() => {
    if (hasUserClicked) return;

    const interval = setInterval(() => {
      setShowClickHint(true);
      setTimeout(() => setShowClickHint(false), 2000); // Fade out after 2s
    }, 3000);

    return () => clearInterval(interval);
  }, [hasUserClicked]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLabel === null) return;

      if (e.key === 'Escape') {
        setActiveLabel(null);
      } else if (e.key === 'ArrowLeft') {
        setActiveLabel(activeLabel === 0 ? demoLabels.length - 1 : activeLabel - 1);
      } else if (e.key === 'ArrowRight') {
        setActiveLabel(activeLabel === demoLabels.length - 1 ? 0 : activeLabel + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLabel, demoLabels.length]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    setImageSize({ width: img.clientWidth, height: img.clientHeight });
    setImageLoaded(true);
  };

  const scaleX = imageSize.width / naturalSize.width || 1;
  const scaleY = imageSize.height / naturalSize.height || 1;

  const getSquareStyle = (coordinates: PolygonCoordinates[]) => {
    if (coordinates.length < 2) return {};

    const [p1, p2] = coordinates;
    const left = Math.min(p1.x, p2.x) * scaleX;
    const top = Math.min(p1.y, p2.y) * scaleY;
    const width = Math.abs(p2.x - p1.x) * scaleX;
    const height = Math.abs(p2.y - p1.y) * scaleY;

    return { left, top, width, height };
  };

  const handleSquareClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveLabel(index);
    setHasUserClicked(true);
  };

  const handleContainerClick = () => {
    // Don't close modal when clicking container
  };

  const handleCloseModal = () => {
    setActiveLabel(null);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLabel !== null) {
      setActiveLabel(activeLabel === 0 ? demoLabels.length - 1 : activeLabel - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLabel !== null) {
      setActiveLabel(activeLabel === demoLabels.length - 1 ? 0 : activeLabel + 1);
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div
          ref={containerRef}
          className="relative inline-block cursor-pointer max-w-2xl"
          onClick={handleContainerClick}
        >
          <img
            ref={imageRef}
            src={src}
            alt="Labeled image"
            className="max-w-full h-auto shadow-2xl"
            onLoad={handleImageLoad}
          />

          {imageLoaded && demoLabels.map((label, index) => {
            const style = getSquareStyle(label.coordinates);
            const isActive = activeLabel === index;
            const showHintOnThis = showClickHint;

            return (
              <div key={index}>
                {/* Glowing square region */}
                <div
                  className={`tooltip tooltip-bottom absolute cursor-pointer transition-all duration-300 hover:z-50 ${isActive ? 'z-20' : 'z-10'
                    }`}
                  data-tip={truncateText(label.text, 100)}
                  style={{
                    left: style.left,
                    top: style.top,
                    width: style.width,
                    height: style.height,
                  }}
                  onClick={(e) => handleSquareClick(index, e)}
                >
                  {/* Outer glow */}
                  <div
                    className="absolute inset-0 rounded-sm animate-pulse"
                    style={{
                      boxShadow: isActive
                        ? '0 0 20px 8px rgba(251, 191, 36, 0.6), 0 0 40px 16px rgba(251, 191, 36, 0.3), inset 0 0 20px rgba(251, 191, 36, 0.2)'
                        : '0 0 12px 4px rgba(251, 191, 36, 0.4), 0 0 24px 8px rgba(251, 191, 36, 0.2)',
                      border: isActive
                        ? '2px solid rgba(251, 191, 36, 0.9)'
                        : '2px solid rgba(251, 191, 36, 0.6)',
                      background: isActive
                        ? 'rgba(251, 191, 36, 0.15)'
                        : 'rgba(251, 191, 36, 0.05)',
                    }}
                  />

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-400" />

                  {/* Click hint indicator */}
                  {showHintOnThis && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-clickHint">
                      <div className="relative">
                        {/* Click icon */}
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px'
                        }}>
                          <FontAwesomeIcon
                            icon={faFingerprint}
                            style={{
                              fontSize: '26px',
                              color: 'rgba(251, 191, 36, 0.9)',
                              filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))',
                            }}
                          />
                          Click
                        </div>
                        {/* Pulsing background */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: 'rgba(251, 191, 36, 0.3)',
                            filter: 'blur(12px)',
                            transform: 'scale(1.5)',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Modal */}
        {activeLabel !== null && (
          <div
            className="fixed inset-0 flex items-center justify-center animate-fadeIn"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              zIndex: 1000,
            }}
            onClick={handleCloseModal}
          >
            <div
              className="liquid-glass relative"
              style={{
                width: '700px',
                maxWidth: '90vw',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                boxShadow: '0 0 40px rgba(251, 191, 36, 0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(251, 191, 36, 0.6)',
                  color: '#f5f5f5',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <FontAwesomeIcon icon={faClose} />
              </button>

              <div className="p-8">
                {/* Full image with highlighted square */}
                <div className="mb-6 flex justify-center">
                  {(() => {
                    const currentLabel = demoLabels[activeLabel];
                    const [p1, p2] = currentLabel.coordinates;

                    // Calculate dimensions for display (max 500px)
                    const maxSize = 500;
                    const imgAspect = naturalSize.width / naturalSize.height;
                    let displayWidth = maxSize;
                    let displayHeight = maxSize;

                    if (imgAspect > 1) {
                      // Wider than tall
                      displayHeight = maxSize / imgAspect;
                    } else {
                      // Taller than wide
                      displayWidth = maxSize * imgAspect;
                    }

                    // Scale factor from natural to display size
                    const scale = displayWidth / naturalSize.width;

                    // Calculate square position in display coordinates
                    const left = Math.min(p1.x, p2.x) * scale;
                    const top = Math.min(p1.y, p2.y) * scale;
                    const width = Math.abs(p2.x - p1.x) * scale;
                    const height = Math.abs(p2.y - p1.y) * scale;

                    return (
                      <div
                        style={{
                          position: 'relative',
                          width: `${displayWidth}px`,
                          height: `${displayHeight}px`,
                        }}
                      >
                        <img
                          src={src}
                          alt="Full image"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />

                        {/* Highlighted square overlay */}
                        <div
                          style={{
                            position: 'absolute',
                            left: `${left}px`,
                            top: `${top}px`,
                            width: `${width}px`,
                            height: `${height}px`,
                            border: '3px solid rgba(251, 191, 36, 0.9)',
                            borderRadius: '0.25rem',
                            boxShadow: '0 0 20px 8px rgba(251, 191, 36, 0.6), 0 0 40px 16px rgba(251, 191, 36, 0.3), inset 0 0 20px rgba(251, 191, 36, 0.2)',
                            background: 'rgba(251, 191, 36, 0.15)',
                            pointerEvents: 'none',
                          }}
                        >
                          {/* Corner accents */}
                          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
                          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
                          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
                          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-400" />
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Description text */}
                <div
                  className="text-center px-4 py-3"
                  style={{
                    color: '#f5f5f5',
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                  }}
                >
                  {demoLabels[activeLabel].text || 'No description available'}
                </div>

                {/* Navigation arrows */}
                <div className="flex justify-between items-center mt-6 px-4">
                  <button
                    onClick={handlePrevious}
                    className="w-12 h-12 flex items-center justify-center rounded-full transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '2px solid rgba(251, 191, 36, 0.6)',
                      color: '#f5f5f5',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </button>

                  <span style={{ color: '#f5f5f5' }}>
                    {activeLabel + 1} / {demoLabels.length}
                  </span>

                  <button
                    onClick={handleNext}
                    className="w-12 h-12 flex items-center justify-center rounded-full transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '2px solid rgba(251, 191, 36, 0.6)',
                      color: '#f5f5f5',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }

        @keyframes clickHint {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 0;
            transform: scale(0.9);
          }
        }
        .animate-clickHint {
          animation: clickHint 1.5s ease-in-out forwards;
        }
      `}</style>
      </div>
      {/* Instructions overlay */}
      <div className="bottom-4 left-4 right-4 text-center">
        Click on squares for details
      </div>
    </div>
  );
}

// Demo wrapper
function App() {
  return (
    <LabeledImage
      labels={[
        {
          "text": "",
          "coordinates": [
            {
              "x": 451,
              "y": 100
            },
            {
              "x": 796,
              "y": 317
            }
          ]
        },
        {
          "text": "",
          "coordinates": [
            {
              "x": 799,
              "y": 505
            },
            {
              "x": 973,
              "y": 587
            }
          ]
        },
        {
          "text": "",
          "coordinates": [
            {
              "x": 900,
              "y": 896
            },
            {
              "x": 1122,
              "y": 1085
            }
          ]
        },
        {
          "text": "",
          "coordinates": [
            {
              "x": 369,
              "y": 1020
            },
            {
              "x": 704,
              "y": 1228
            }
          ]
        },
        {
          "text": "",
          "coordinates": [
            {
              "x": 926,
              "y": 1130
            },
            {
              "x": 1198,
              "y": 1386
            }
          ]
        },
        {
          "text": "",
          "coordinates": [
            {
              "x": 35,
              "y": 1442
            },
            {
              "x": 240,
              "y": 1645
            }
          ]
        },
        {
          "text": "",
          "coordinates": [
            {
              "x": 957,
              "y": 1468
            },
            {
              "x": 1193,
              "y": 1676
            }
          ]
        },
        {
          "text": "",
          "coordinates": [
            {
              "x": 1004,
              "y": 18
            },
            {
              "x": 1162,
              "y": 229
            }
          ]
        },
        {
          "text": "",
          "coordinates": [
            {
              "x": 49,
              "y": 49
            },
            {
              "x": 240,
              "y": 212
            }
          ]
        }
      ]}
      src={"https://dayrnadevassets.tabet.tech/attachments/97/our_lady_of_the_diaspora.png"}
    />
  );
}

// Export the demo as default for rendering
export { LabeledImage };
export default App;