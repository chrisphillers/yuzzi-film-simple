'use client';
import { useState, useEffect, useRef, useCallback, useSyncExternalStore, useMemo } from 'react';

/**
 * Custom hook for tracking scroll position with advanced features like
 * throttling, direction detection, and threshold tracking.
 */

interface ScrollTriggerOptions {
  /**
   * Time in ms to throttle scroll events (default: 100ms)
   */
  throttleTime?: number;

  /**
   * Whether to log scroll data for debugging (default: false)
   */
  debug?: boolean;

  /**
   * Default footer height (for isNearBottom calculation)
   */
  footerHeight?: number;
}

/**
 * Simple, optimized scroll detection hook
 * Uses proper useCallback for stable event handlers
 */
export const useScrollTrigger = (options: ScrollTriggerOptions = {}) => {
  const { throttleTime = 100, debug = false, footerHeight = 60 } = options;

  // State values
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [documentHeight, setDocumentHeight] = useState(0);

  // Refs for tracking values between renders
  const ticking = useRef(false);

  // Stable scroll handler with useCallback
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      // Use requestAnimationFrame for smoother updates
      window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        ticking.current = false;

        if (debug) {
          console.log('📜 SCROLL:', window.scrollY);
        }
      });

      ticking.current = true;
    }
  }, [debug]);

  // Stable resize handler with useCallback
  const handleResize = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        setViewportHeight(window.innerHeight);
        setDocumentHeight(document.documentElement.scrollHeight);
        ticking.current = false;

        if (debug) {
          console.log('🔄 RESIZE:', {
            viewportHeight: window.innerHeight,
            documentHeight: document.documentElement.scrollHeight,
          });
        }
      });

      ticking.current = true;
    }
  }, [debug]);

  // Set up event listeners with stable handlers
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get initial values
    setScrollY(window.scrollY);
    setViewportHeight(window.innerHeight);
    setDocumentHeight(document.documentElement.scrollHeight);

    if (debug) {
      console.log('🔍 SCROLL HOOK INITIALIZED:', {
        initialScrollY: window.scrollY,
        viewportHeight: window.innerHeight,
        documentHeight: document.documentElement.scrollHeight,
      });
    }

    // Set up throttled event handler
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const throttledScrollHandler = () => {
      if (!timeoutId && throttleTime > 0) {
        timeoutId = setTimeout(() => {
          handleScroll();
          timeoutId = null;
        }, throttleTime);
      } else {
        handleScroll();
      }
    };

    // Add event listeners
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('resize', handleResize);
      if (timeoutId) clearTimeout(timeoutId);

      if (debug) {
        console.log('🛑 SCROLL HOOK CLEANUP');
      }
    };
  }, [handleScroll, handleResize, throttleTime, debug]);

  // Calculate derived values
  const isHalfwayDown = scrollY >= viewportHeight / 2;
  const isNearBottom = scrollY + viewportHeight >= documentHeight - footerHeight;

  // Return the needed values and calculations
  return {
    scrollY,
    viewportHeight,
    documentHeight,
    isHalfwayDown,
    isNearBottom,
  };
};

/**
 * Simple hook that directly monitors window scroll with no fancy features
 * This should work regardless of component positioning
 */
export const useDirectScroll = () => {
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [documentHeight, setDocumentHeight] = useState(0);

  // Update dimensions in a separate useEffect to ensure they're current
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial measurement
    setViewportHeight(window.innerHeight);
    setDocumentHeight(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));

    // Update on resize
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setDocumentHeight(
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
      );
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle scroll events directly
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get initial scroll position
    setScrollY(window.scrollY);

    // Direct scroll handler without throttling
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Log initial state for debugging
    console.log('INITIAL SCROLL STATE:', {
      scrollY: window.scrollY,
      viewportHeight: window.innerHeight,
      documentHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
    });

    // Add event listener directly to window
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate derived values
  const isHalfwayDown = scrollY >= viewportHeight / 2;
  const isNearBottom = scrollY + viewportHeight >= documentHeight - 60; // 60px = footer

  return {
    scrollY,
    viewportHeight,
    documentHeight,
    isHalfwayDown,
    isNearBottom,
  };
};

/**
 * Ultra simple scroll hook that uses the exact same approach as the working override
 * No throttling, no fancy features - just direct window scroll monitoring
 */
export const useUltraSimpleScroll = () => {
  // Track all values in state
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [documentHeight, setDocumentHeight] = useState(0);

  // Initialize and set up listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get initial measurements
    setScrollY(window.scrollY);
    setViewportHeight(window.innerHeight);
    setDocumentHeight(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));

    // Direct event handlers - no throttling, no RAF
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setDocumentHeight(
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
      );
    };

    // Add listeners with passive option
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Log initial state
    console.log('SCROLL HOOK INITIALIZED:', {
      scrollY: window.scrollY,
      viewportHeight: window.innerHeight,
      documentHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
    });

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate derived values directly
  const isHalfwayDown = scrollY >= viewportHeight / 2;
  const isNearBottom = scrollY + viewportHeight >= documentHeight - 60;

  // Log every render
  console.log('SCROLL HOOK UPDATE:', {
    scrollY,
    viewportHeight,
    documentHeight,
    halfwayPoint: viewportHeight / 2,
    isHalfwayDown,
    isNearBottom,
  });

  return {
    scrollY,
    viewportHeight,
    documentHeight,
    isHalfwayDown,
    isNearBottom,
  };
};

/**
 * Hook that uses window.onscroll instead of addEventListener
 * Sometimes this works better with certain frameworks
 */
export const useOnScrollHook = () => {
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [documentHeight, setDocumentHeight] = useState(0);

  useEffect(() => {
    // Initial values
    setScrollY(window.scrollY);
    setViewportHeight(window.innerHeight);
    setDocumentHeight(document.documentElement.scrollHeight);

    // Store the previous handler if any
    const prevOnScroll = window.onscroll;

    // Define our handler
    window.onscroll = () => {
      setScrollY(window.scrollY);
      console.log('ONSCROLL EVENT:', window.scrollY);

      // Call previous handler if it existed
      if (prevOnScroll) prevOnScroll.call(window);
    };

    // Define resize handler
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setDocumentHeight(document.documentElement.scrollHeight);
    };

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.onscroll = prevOnScroll;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate derived values
  const isHalfwayDown = scrollY >= viewportHeight / 2;
  const isNearBottom = scrollY + viewportHeight >= documentHeight - 60;

  return {
    scrollY,
    viewportHeight,
    documentHeight,
    isHalfwayDown,
    isNearBottom,
  };
};

/**
 * Ultra-simple hook that only focuses on detecting real scroll events
 * No calculations, no throttling - just event detection
 */
export const useRealScrollDetector = () => {
  const [scrollCount, setScrollCount] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Get initial value
    setScrollY(window.scrollY);

    // Log initialization
    console.log('🔍 SCROLL DETECTOR INITIALIZED', {
      initialScrollY: window.scrollY,
      location: window.location.href,
      documentHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
    });

    // Super simple handler - just count events and update scrollY
    const handleScroll = () => {
      setScrollCount((prev) => prev + 1);
      setScrollY(window.scrollY);
      console.log('📜 SCROLL EVENT DETECTED', {
        scrollY: window.scrollY,
        timestamp: new Date().toISOString(),
      });
    };

    // Add event listener with all options explicitly stated
    window.addEventListener('scroll', handleScroll, {
      passive: true,
      capture: false,
    });

    // Force a detection every second as backup
    const intervalId = setInterval(() => {
      const currentScrollY = window.scrollY;
      if (currentScrollY !== scrollY) {
        console.log('⏰ INTERVAL DETECTED SCROLL CHANGE', {
          previous: scrollY,
          current: currentScrollY,
        });
        setScrollY(currentScrollY);
        setScrollCount((prev) => prev + 1);
      }
    }, 1000);

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
      console.log('🛑 SCROLL DETECTOR CLEANUP');
    };
  }, [scrollY]); // Include scrollY in deps to properly detect changes in the interval

  return {
    scrollCount,
    scrollY,
    isScrolling: scrollCount > 0,
  };
};

// Fixed default values for server
const DEFAULT_SCROLL_DATA = {
  scrollY: 0,
  viewportHeight: 0,
  documentHeight: 0,
  isHalfwayDown: false,
  isNearBottom: false,
};

/**
 * Hook for tracking scroll position without hydration mismatches
 */
export function useScrollPosition() {
  // Use simple useState for tracking, avoiding useSyncExternalStore for better SSR
  const [scrollData, setScrollData] = useState(DEFAULT_SCROLL_DATA);
  const [isClient, setIsClient] = useState(false);

  // Use ref to track if we're mounted
  const mountedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // Setup scroll tracking only on client side
  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    mountedRef.current = true;

    // Function to update scroll data
    const updateScrollData = () => {
      if (!mountedRef.current) return;

      // Only run on client
      if (typeof window === 'undefined') return;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate derived values
      const isHalfwayDown = scrollY >= viewportHeight / 2;
      const isNearBottom = scrollY + viewportHeight >= documentHeight - 60;

      setScrollData({
        scrollY,
        viewportHeight,
        documentHeight,
        isHalfwayDown,
        isNearBottom,
      });
    };

    // Handle scroll events with requestAnimationFrame for performance
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(updateScrollData);
    };

    // Initial update
    updateScrollData();

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Clean up on unmount
    return () => {
      mountedRef.current = false;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Only return actual scroll data when on client
  return isClient ? scrollData : DEFAULT_SCROLL_DATA;
}
