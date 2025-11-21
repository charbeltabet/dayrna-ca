import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

interface ShowCaseImageProps {
  height: number; // Using fixed pixel height
  url?: string;
}

const ShowCaseImage: React.FC<ShowCaseImageProps> = ({
  height,
  url,
}) => {
  const imageSeed = useMemo(() => Math.floor(Math.random() * 1000), []);
  const imageUrl = url || `https://picsum.photos/seed/${imageSeed}/800/450`;

  return (
    <div
      style={{
        height: `${height}px`, // Fixed pixel height
        width: '100%',
        backgroundImage: `url("${imageUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginBottom: '5px',
      }}
    />
  );
};

interface AutoScrollColumnProps {
  scrollDirection: 'down' | 'up';
  children: React.ReactNode;
  scrollSpeed?: number; // pixels per second
}

const AutoScrollColumn: React.FC<AutoScrollColumnProps> = ({
  scrollDirection,
  children,
  scrollSpeed = 30 // pixels per second
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    const contentElement = contentRef.current;
    if (!scrollElement || !contentElement) return;

    // Clone content for seamless infinite scroll
    const clonedContent = contentElement.cloneNode(true) as HTMLDivElement;
    clonedContent.setAttribute('aria-hidden', 'true'); // For accessibility
    scrollElement.appendChild(clonedContent);

    // Set initial position
    if (scrollDirection === 'up') {
      scrollElement.scrollTop = contentElement.offsetHeight;
    } else {
      scrollElement.scrollTop = 0;
    }

    const animate = (currentTime: number) => {
      if (!isPausedRef.current) {
        if (lastTimeRef.current === 0) {
          lastTimeRef.current = currentTime;
        }

        const deltaTime = (currentTime - lastTimeRef.current) / 1000; // Convert to seconds
        lastTimeRef.current = currentTime;

        if (scrollElement && contentElement) {
          const scrollIncrement = scrollSpeed * deltaTime;
          const contentHeight = contentElement.offsetHeight;

          if (scrollDirection === 'down') {
            scrollElement.scrollTop += scrollIncrement;

            // Reset to start when we've scrolled one full content height
            if (scrollElement.scrollTop >= contentHeight) {
              scrollElement.scrollTop -= contentHeight;
            }
          } else {
            scrollElement.scrollTop -= scrollIncrement;

            // Reset to end when we've scrolled to the top
            if (scrollElement.scrollTop <= 0) {
              scrollElement.scrollTop += contentHeight;
            }
          }
        }
      } else {
        // Keep updating lastTimeRef even when paused to avoid jumps
        lastTimeRef.current = currentTime;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      // Remove cloned content
      if (scrollElement && clonedContent.parentNode === scrollElement) {
        scrollElement.removeChild(clonedContent);
      }
    };
  }, [scrollDirection, scrollSpeed, children]);

  // Pause on hover for better UX
  const handleMouseEnter = useCallback(() => {
    isPausedRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isPausedRef.current = false;
    lastTimeRef.current = 0; // Reset to avoid time jump
  }, []);

  return (
    <div
      ref={scrollRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        flex: 1,
        overflowY: 'hidden', // Hide scrollbar
        position: 'relative',
        cursor: 'pointer', // Indicate interactivity
      }}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

interface ShowcaseGalleryProps {
  imageUrls?: string[];
  scrollSpeed?: number;
  baseHeight?: number; // Base height for calculating variations
}

const ShowcaseGallery: React.FC<ShowcaseGalleryProps> = ({
  imageUrls = [],
  scrollSpeed = 30,
  baseHeight = 150 // Base height in pixels
}) => {
  // Define height multipliers for visual variety
  // These will be multiplied by baseHeight
  const heightMultipliers = [0.8, 2.0, 1.5, 1.8, 1.2, 2.2, 1.3, 1.6];

  // Convert multipliers to actual pixel heights
  const heightsInPixels = useMemo(() =>
    heightMultipliers.map(multiplier => Math.round(baseHeight * multiplier)),
    [baseHeight]
  );

  // Generate placeholder images if none provided
  const images = useMemo(() => {
    if (imageUrls.length > 0) {
      return imageUrls;
    }
    // Generate 16 placeholder images for demo
    return Array.from({ length: 16 }, (_, i) =>
      `https://picsum.photos/seed/${i}/800/450`
    );
  }, [imageUrls]);

  // Split images into two columns
  const midpoint = Math.ceil(images.length / 2);
  const column1Images = images.slice(0, midpoint);
  const column2Images = images.slice(midpoint);

  // Ensure we have enough content for smooth scrolling
  const minImages = 4;
  const finalColumn1 = column1Images.length < minImages
    ? [...column1Images, ...column1Images, ...column1Images]
    : column1Images;
  const finalColumn2 = column2Images.length < minImages
    ? [...column2Images, ...column2Images, ...column2Images]
    : column2Images;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        gap: '5px',
      }}
    >
      <AutoScrollColumn scrollDirection="down" scrollSpeed={scrollSpeed}>
        {finalColumn1.map((url, index) => (
          <ShowCaseImage
            key={`col1-${index}`}
            height={heightsInPixels[index % heightsInPixels.length]}
            url={url}
          />
        ))}
      </AutoScrollColumn>
      <AutoScrollColumn scrollDirection="up" scrollSpeed={scrollSpeed}>
        {finalColumn2.map((url, index) => (
          <ShowCaseImage
            key={`col2-${index}`}
            height={heightsInPixels[(index + 2) % heightsInPixels.length]} // Offset for variety
            url={url}
          />
        ))}
      </AutoScrollColumn>
    </div>
  );
};

export default ShowcaseGallery;