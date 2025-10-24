import { useEffect, useRef, useState, useMemo } from 'react';

interface ShowCaseImageProps {
  percentHeight: number
  minHeightPx: number
  url?: string
  lookaheadSeconds?: number
}

function ShowCaseImage({
  percentHeight = 100,
  minHeightPx,
  url,
  lookaheadSeconds = 2,
}: ShowCaseImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Generate a stable random seed for this component instance
  const imageSeed = useMemo(() => Math.floor(Math.random() * 1000), []);
  const imageUrl = url || `https://picsum.photos/seed/${imageSeed}/800/450`;

  useEffect(() => {
    const element = imageRef.current;
    if (!element) return;

    // Calculate the scroll speed to determine lookahead distance
    // Assuming 10% scroll per second, we need to calculate viewport-based threshold
    const scrollSpeed = 0.025; // This should match AutoScrollColumn's scrollSpeed

    // Calculate how far ahead to load based on lookahead time
    // For 2 seconds lookahead at 10% scroll speed, we need about 20% viewport margin
    const lookaheadPercentage = scrollSpeed * 100 * lookaheadSeconds;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            setIsLoaded(true);
          }
        });
      },
      {
        // Load images when they're within lookahead distance of viewport
        rootMargin: `${lookaheadPercentage}% 0px ${lookaheadPercentage}% 0px`,
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isLoaded, lookaheadSeconds]);

  return (
    <div
      ref={imageRef}
      style={{
        height: `${percentHeight}%`,
        minHeight: `${minHeightPx}px`,
        width: '100%',
        backgroundImage: isLoaded ? `url("${imageUrl}")` : 'none',
        backgroundColor: isLoaded ? 'transparent' : '#e0e0e0',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginBottom: '5px',
        transition: 'background-color 0.3s ease',
      }}
    />
  )
}

interface AutoScrollColumnProps {
  scrollDirection: 'down' | 'up';
  children: React.ReactNode;
}

function AutoScrollColumn({ scrollDirection, children }: AutoScrollColumnProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    // Set initial scroll position based on direction
    if (scrollDirection === 'up') {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }

    const scrollSpeed = 0.025; // 10% per second
    let animationFrameId: number;
    let lastTimestamp = Date.now();

    const scroll = () => {
      const now = Date.now();
      const deltaTime = (now - lastTimestamp) / 1000; // Convert to seconds
      lastTimestamp = now;

      if (scrollElement) {
        const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight;
        const scrollAmount = maxScroll * scrollSpeed * deltaTime;

        if (scrollDirection === 'down') {
          scrollElement.scrollTop += scrollAmount;

          // Reset to top when reaching bottom
          if (scrollElement.scrollTop >= maxScroll) {
            scrollElement.scrollTop = 0;
          }
        } else {
          scrollElement.scrollTop -= scrollAmount;

          // Reset to bottom when reaching top
          if (scrollElement.scrollTop <= 0) {
            scrollElement.scrollTop = maxScroll;
          }
        }
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollDirection]);

  return (
    <div
      ref={scrollRef}
      className="hidden-scrollbar"
      style={{
        flex: 1,
        gap: '10px',
        overflowY: 'scroll',
      }}
    >
      {children}
    </div>
  );
}

export default function ShowcaseGallery() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        overflowY: 'hidden',
        gap: '5px',
      }}
    >
      <AutoScrollColumn scrollDirection="down">
        <ShowCaseImage percentHeight={50} minHeightPx={100} />
        <ShowCaseImage percentHeight={80} minHeightPx={100} />
        <ShowCaseImage percentHeight={50} minHeightPx={100} />
        <ShowCaseImage percentHeight={70} minHeightPx={100} />
        <ShowCaseImage percentHeight={50} minHeightPx={100} />
        <ShowCaseImage percentHeight={80} minHeightPx={100} />
        <ShowCaseImage percentHeight={50} minHeightPx={100} />
        <ShowCaseImage percentHeight={70} minHeightPx={100} />
        <ShowCaseImage percentHeight={50} minHeightPx={100} />
        <ShowCaseImage percentHeight={80} minHeightPx={100} />
        <ShowCaseImage percentHeight={50} minHeightPx={100} />
        <ShowCaseImage percentHeight={70} minHeightPx={100} />
        <ShowCaseImage percentHeight={50} minHeightPx={100} />
        <ShowCaseImage percentHeight={80} minHeightPx={100} />
        <ShowCaseImage percentHeight={50} minHeightPx={100} />
        <ShowCaseImage percentHeight={70} minHeightPx={100} />
      </AutoScrollColumn>
      <AutoScrollColumn scrollDirection="up">
        <ShowCaseImage percentHeight={70} minHeightPx={100} />
        <ShowCaseImage percentHeight={50} minHeightPx={100} />
        <ShowCaseImage percentHeight={80} minHeightPx={100} />
        <ShowCaseImage percentHeight={50} minHeightPx={100} />
        <ShowCaseImage percentHeight={50} minHeightPx={100} />
        <ShowCaseImage percentHeight={80} minHeightPx={100} />
        <ShowCaseImage percentHeight={50} minHeightPx={100} />
        <ShowCaseImage percentHeight={70} minHeightPx={100} />
        <ShowCaseImage percentHeight={50} minHeightPx={100} />
        <ShowCaseImage percentHeight={80} minHeightPx={100} />
        <ShowCaseImage percentHeight={50} minHeightPx={100} />
        <ShowCaseImage percentHeight={70} minHeightPx={100} />
        <ShowCaseImage percentHeight={50} minHeightPx={100} />
        <ShowCaseImage percentHeight={80} minHeightPx={100} />
        <ShowCaseImage percentHeight={50} minHeightPx={100} />
        <ShowCaseImage percentHeight={70} minHeightPx={100} />
      </AutoScrollColumn>
    </div>
  )
}
