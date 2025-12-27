import { useState, useEffect } from 'react';

// Define breakpoints (you can adjust these based on your framework, e.g., Bootstrap)
const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

// Custom hook to get screen size category and comparison function
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState(getScreenSize);

  // Function to determine the current screen size category
  function getScreenSize() {
    const width = window.innerWidth;
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  }

  // Function to check if current screen size is larger than a specified breakpoint
  function screenLargerThan(breakpoint) {
    const width = window.innerWidth;
    return width > breakpoints[breakpoint] || false;
  }

  // Update screen size on window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { screenSize, screenLargerThan };
}
