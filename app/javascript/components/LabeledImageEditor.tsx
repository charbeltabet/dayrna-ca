import React, { useState, useRef, useEffect } from 'react';

interface PolygonCoordinates {
  x: number;
  y: number;
}

interface ImageLabel {
  text: string;
  coordinates: PolygonCoordinates[];
}

export default function LabelEditor() {
  const [imageUrl, setImageUrl] = useState('https://dayrnadevassets.tabet.tech/attachments/97/our_lady_of_the_diaspora.png');
  const [labels, setLabels] = useState<ImageLabel[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<PolygonCoordinates | null>(null);
  const [currentRect, setCurrentRect] = useState<PolygonCoordinates[] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Log labels to console whenever they change
  useEffect(() => {
    if (labels.length > 0) {
      console.log('--- LabeledImage Props ---');
      console.log('labels={' + JSON.stringify(labels, null, 2) + '}');
      console.log('--------------------------');
    }
  }, [labels]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    setImageSize({ width: img.clientWidth, height: img.clientHeight });
  };

  const getMousePos = (e: React.MouseEvent): PolygonCoordinates => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };

    const scaleX = naturalSize.width / imageSize.width || 1;
    const scaleY = naturalSize.height / imageSize.height || 1;

    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top) * scaleY),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== imageRef.current) return;
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPoint(pos);
    setCurrentRect([pos, pos]);
    setSelectedIndex(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPoint) return;
    const pos = getMousePos(e);
    setCurrentRect([startPoint, pos]);
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentRect) return;

    const [p1, p2] = currentRect;
    const width = Math.abs(p2.x - p1.x);
    const height = Math.abs(p2.y - p1.y);

    // Only add if the rectangle is big enough
    if (width > 10 && height > 10) {
      const newLabel: ImageLabel = {
        text: '',
        coordinates: [
          { x: Math.min(p1.x, p2.x), y: Math.min(p1.y, p2.y) },
          { x: Math.max(p1.x, p2.x), y: Math.max(p1.y, p2.y) },
        ],
      };
      setLabels([...labels, newLabel]);
      setSelectedIndex(labels.length);
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentRect(null);
  };

  const updateLabelText = (index: number, text: string) => {
    const newLabels = [...labels];
    newLabels[index] = { ...newLabels[index], text };
    setLabels(newLabels);
  };

  const deleteLabel = (index: number) => {
    setLabels(labels.filter((_, i) => i !== index));
    setSelectedIndex(null);
  };

  const scaleX = imageSize.width / naturalSize.width || 1;
  const scaleY = imageSize.height / naturalSize.height || 1;

  const getRectStyle = (coordinates: PolygonCoordinates[]) => {
    const [p1, p2] = coordinates;
    return {
      left: Math.min(p1.x, p2.x) * scaleX,
      top: Math.min(p1.y, p2.y) * scaleY,
      width: Math.abs(p2.x - p1.x) * scaleX,
      height: Math.abs(p2.y - p1.y) * scaleY,
    };
  };

  const copyToClipboard = () => {
    const output = `labels={${JSON.stringify(labels, null, 2)}}`;
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-amber-400">Image Label Editor</h1>

        {/* URL Input */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL..."
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex gap-6">
          {/* Image Canvas */}
          <div className="flex-1">
            <div className="bg-slate-800 rounded-lg p-4 mb-4">
              <p className="text-slate-400 text-sm mb-2">
                🖱️ Click and drag on the image to draw regions
              </p>
              <div
                ref={containerRef}
                className="relative inline-block select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Label target"
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxHeight: '70vh' }}
                  onLoad={handleImageLoad}
                  draggable={false}
                />

                {/* Existing labels */}
                {labels.map((label, index) => {
                  const style = getRectStyle(label.coordinates);
                  const isSelected = selectedIndex === index;

                  return (
                    <div
                      key={index}
                      className={`absolute cursor-pointer transition-all ${isSelected ? 'z-20' : 'z-10'
                        }`}
                      style={{
                        left: style.left,
                        top: style.top,
                        width: style.width,
                        height: style.height,
                        border: isSelected
                          ? '2px solid #fbbf24'
                          : '2px solid rgba(251, 191, 36, 0.6)',
                        boxShadow: isSelected
                          ? '0 0 15px rgba(251, 191, 36, 0.5), inset 0 0 15px rgba(251, 191, 36, 0.1)'
                          : '0 0 8px rgba(251, 191, 36, 0.3)',
                        background: isSelected
                          ? 'rgba(251, 191, 36, 0.15)'
                          : 'rgba(251, 191, 36, 0.05)',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIndex(index);
                      }}
                    >
                      <span className="absolute -top-6 left-0 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                        {index + 1}
                      </span>
                    </div>
                  );
                })}

                {/* Current drawing rectangle */}
                {currentRect && (
                  <div
                    className="absolute pointer-events-none z-30"
                    style={{
                      ...getRectStyle(currentRect),
                      border: '2px dashed #fbbf24',
                      background: 'rgba(251, 191, 36, 0.2)',
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Labels Panel */}
          <div className="w-80">
            <div className="bg-slate-800 rounded-lg p-4 sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-amber-400">
                  Labels ({labels.length})
                </h2>
                {labels.length > 0 && (
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-amber-500 text-black text-sm font-medium rounded hover:bg-amber-400 transition-colors"
                  >
                    Copy Props
                  </button>
                )}
              </div>

              {labels.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  No labels yet. Draw on the image to create regions.
                </p>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                  {labels.map((label, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg transition-all cursor-pointer ${selectedIndex === index
                          ? 'bg-slate-700 ring-2 ring-amber-400'
                          : 'bg-slate-700/50 hover:bg-slate-700'
                        }`}
                      onClick={() => setSelectedIndex(index)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                          {index + 1}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLabel(index);
                          }}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                      <textarea
                        value={label.text}
                        onChange={(e) => updateLabelText(index, e.target.value)}
                        placeholder="Enter label text..."
                        className="w-full px-2 py-1.5 bg-slate-600 border border-slate-500 rounded text-sm resize-none focus:outline-none focus:border-amber-400"
                        rows={2}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="text-xs text-slate-500 mt-1">
                        ({label.coordinates[0].x}, {label.coordinates[0].y}) → ({label.coordinates[1].x}, {label.coordinates[1].y})
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Output Preview */}
              {labels.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">
                    Console Output (check DevTools)
                  </h3>
                  <pre className="text-xs bg-slate-900 p-2 rounded overflow-auto max-h-40 text-green-400">
                    {`labels={${JSON.stringify(labels, null, 2)}}`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}