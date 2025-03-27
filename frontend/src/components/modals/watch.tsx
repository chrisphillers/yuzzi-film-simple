'use client';
import { useEffect, useState } from 'react';
import { Box, Anchor, Button, Text, RangeInput } from 'grommet';
import {
  useScrollTrigger,
  useDirectScroll,
  useUltraSimpleScroll,
  useRealScrollDetector,
  useScrollPosition,
} from '../../app/hooks/useScrollTrigger';

export const Watch = () => {
  // Use our fixed scroll hook
  const { isHalfwayDown, isNearBottom } = useScrollPosition();

  // Only enable on client side to avoid hydration mismatches
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only show when halfway down or at bottom (and we're on the client)
  const shouldShow = isMounted && (isHalfwayDown || isNearBottom);

  // Don't render if not visible
  if (!shouldShow) {
    return null;
  }

  // Render with appropriate positioning
  return (
    <Box
      pad="large"
      justify="center"
      data-testid="watch-button"
      style={{
        textAlign: 'center',
        position: isNearBottom ? 'absolute' : 'fixed',
        left: '0',
        width: '100vw',
        zIndex: '2',
        transition: 'all 0.4s ease-out',
        height: '80px',
        bottom: isNearBottom ? '60px' : '24px',
        backgroundColor: '#2300ff',
        color: 'white',
        display: 'flex',
      }}
    >
      <Anchor alignSelf="center" label="WATCH" size="xxlarge" href="#" id="watch" color="white" />
    </Box>
  );
};

/**
 * Component to use during development that lets you manually
 * override scroll position for testing UI elements like the Watch button
 * Modified to avoid hydration mismatches
 */
export const ScrollTestOverride = () => {
  // Use state to track client-side rendering
  const [mounted, setMounted] = useState(false);

  // Don't render anything during SSR/hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only set up scroll overrides after component has mounted
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [documentHeight, setDocumentHeight] = useState(0);

  // Update measurements after component mounts
  useEffect(() => {
    if (!mounted) return;

    setViewportHeight(window.innerHeight);
    setDocumentHeight(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
  }, [mounted]);

  // Calculate derived values
  const maxScroll = documentHeight - viewportHeight;
  const scrollPercentage = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;

  const isHalfwayDown = scrollY >= viewportHeight / 2;
  const isNearBottom = scrollY + viewportHeight >= documentHeight - 60;

  // Don't render anything during SSR/hydration
  if (!mounted) {
    return null;
  }

  // Function to apply the override
  const applyOverride = () => {
    // Save real scroll position for restoration
    const realScrollY = window.scrollY;

    // Override window.scrollY for testing
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      get: () => scrollY,
    });

    // Dispatch scroll event to trigger hooks
    window.dispatchEvent(new Event('scroll'));

    // Log the override for debugging
    console.log('Scroll position overridden:', {
      scrollY,
      realScrollY,
      viewportHeight,
      documentHeight,
      isHalfwayDown,
      isNearBottom,
    });

    // Restore after 5 seconds
    setTimeout(() => {
      // Restore original scrollY
      Object.defineProperty(window, 'scrollY', {
        configurable: true,
        get: () => realScrollY,
      });

      // Dispatch scroll event again
      window.dispatchEvent(new Event('scroll'));

      console.log('Scroll position restored:', {
        scrollY: realScrollY,
      });
    }, 5000);
  };

  return (
    <Box
      background="light-2"
      pad="medium"
      margin="small"
      round
      elevation="small"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 1000,
        width: '300px',
      }}
    >
      <Text weight="bold">Scroll Position Tester</Text>

      <Box margin={{ top: 'small' }}>
        <Text>
          Scroll Y: {scrollY}px ({scrollPercentage.toFixed(1)}%)
        </Text>
        <RangeInput
          value={scrollY}
          onChange={(event) => setScrollY(parseInt(event.target.value))}
          min={0}
          max={maxScroll > 0 ? maxScroll : 1000}
        />
      </Box>

      <Box direction="row" gap="small" margin={{ top: 'small' }}>
        <Button
          label="Halfway"
          onClick={() => setScrollY(Math.ceil(viewportHeight / 2))}
          size="small"
        />
        <Button
          label="Bottom"
          onClick={() => setScrollY(maxScroll > 0 ? maxScroll - 100 : 1000)}
          size="small"
        />
      </Box>

      <Box margin={{ top: 'medium' }}>
        <Button label="Apply Override (5s)" onClick={applyOverride} primary />
      </Box>

      <Box margin={{ top: 'small' }}>
        <Text size="small">
          isHalfwayDown: {isHalfwayDown ? 'true' : 'false'}
          <br />
          isNearBottom: {isNearBottom ? 'true' : 'false'}
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Component that shows basic scroll information to help debug scroll issues
 * Properly handles SSR with client-side only rendering
 */
export const ScrollDebugger = () => {
  // Use our fixed scroll hook
  const { scrollY, viewportHeight, documentHeight, isHalfwayDown, isNearBottom } =
    useScrollPosition();

  // Only render on client side
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything during SSR or initial hydration
  if (!isMounted) {
    return null;
  }

  // Fixed rendering of numeric values to avoid hydration mismatches
  const formatNumber = (num: number) => {
    return isNaN(num) ? '0' : num.toFixed(0);
  };

  return (
    <Box
      background="light-2"
      pad="medium"
      round="small"
      elevation="small"
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        zIndex: 1000,
        minWidth: '250px',
        opacity: 0.9,
      }}
    >
      <Text weight="bold">Scroll Debug Info</Text>

      <Box margin={{ top: 'small' }}>
        <Text size="small">Scroll position: {formatNumber(scrollY)}px</Text>
        <Text size="small">Viewport height: {formatNumber(viewportHeight)}px</Text>
        <Text size="small">Document height: {formatNumber(documentHeight)}px</Text>
        <Text size="small">Halfway point: {formatNumber(viewportHeight / 2)}px</Text>
        <Text size="small" color={isHalfwayDown ? 'green' : 'red'}>
          Past halfway: {isHalfwayDown ? 'YES' : 'NO'}
        </Text>
        <Text size="small" color={isNearBottom ? 'green' : 'red'}>
          Near bottom: {isNearBottom ? 'YES' : 'NO'}
        </Text>
      </Box>
    </Box>
  );
};
