'use client';
import { useState, useEffect, useRef } from 'react';

/**
 * Hook that detects user inactivity after a specified timeout period
 * @param timeout Timeout in milliseconds (default: 30000ms = 30 seconds)
 * @returns boolean indicating if user is inactive
 */
export function useInactivityDetector(timeout = 30000) {
  const [isInactive, setIsInactive] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const preventDetectionRef = useRef(false);

  useEffect(() => {
    // Function to handle user activity
    const handleUserActivity = (e: MouseEvent | TouchEvent | KeyboardEvent) => {
      // Only track trusted (non-synthetic) events
      if (e.isTrusted) {
        // Update the timestamp when activity occurs
        lastActivityRef.current = Date.now();

        // If we were inactive, set to active now
        if (isInactive) {
          setIsInactive(false);
        }
      }
    };

    // Add event listeners at window level with capture
    window.addEventListener('mousedown', handleUserActivity, { capture: true, passive: true });
    window.addEventListener('mousemove', handleUserActivity, { capture: true, passive: true });
    window.addEventListener('click', handleUserActivity, { capture: true, passive: true });
    window.addEventListener('keydown', handleUserActivity, { capture: true, passive: true });
    window.addEventListener('touchstart', handleUserActivity, { capture: true, passive: true });

    // Set up polling to check for inactivity
    pollingIntervalRef.current = setInterval(() => {
      // Skip if in prevention window
      if (preventDetectionRef.current) return;

      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;

      // Check if we've been inactive long enough to trigger
      if (!isInactive && timeSinceLastActivity >= timeout) {
        setIsInactive(true);
      }
    }, 1000);

    // Cleanup
    return () => {
      window.removeEventListener('mousedown', handleUserActivity, { capture: true });
      window.removeEventListener('mousemove', handleUserActivity, { capture: true });
      window.removeEventListener('click', handleUserActivity, { capture: true });
      window.removeEventListener('keydown', handleUserActivity, { capture: true });
      window.removeEventListener('touchstart', handleUserActivity, { capture: true });

      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [timeout, isInactive]); // isInactive added as a dependency to respond to state changes

  return isInactive;
}
