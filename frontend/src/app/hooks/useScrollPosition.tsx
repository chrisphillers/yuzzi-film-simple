// hooks/useScrollPosition.tsx
'use client';
import { useEffect, useState, useRef } from 'react';

export const useScrollPosition = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isAbsolute, setIsAbsolute] = useState(false);

  // Use refs to track current state values without triggering effect reruns
  const isStickyRef = useRef(isSticky);
  const isAbsoluteRef = useRef(isAbsolute);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Update refs when state changes
  useEffect(() => {
    isStickyRef.current = isSticky;
  }, [isSticky]);

  useEffect(() => {
    isAbsoluteRef.current = isAbsolute;
  }, [isAbsolute]);

  useEffect(() => {
    console.warn('🔍 useScrollPosition hook mounted');

    const handleScroll = () => {
      lastScrollY.current = window.scrollY;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const triggerPoint = windowHeight / 2; // 50% of viewport height
          const footerHeight = 60; // Adjust based on Footer height

          // Log current position
          console.warn('📜 SCROLL:', {
            scrollY,
            viewportHeight: windowHeight,
            documentHeight,
            triggerPoint,
            bottomZone: documentHeight - windowHeight - footerHeight,
          });

          // Determine new states
          let newIsSticky = false;
          let newIsAbsolute = false;

          if (scrollY > triggerPoint) {
            if (scrollY + windowHeight >= documentHeight - footerHeight) {
              // At bottom
              newIsAbsolute = true;
              console.warn('📌 POSITION: At bottom - ABSOLUTE');
            } else {
              // Past midpoint but not at bottom
              newIsSticky = true;
              console.warn('📌 POSITION: Past midpoint - STICKY');
            }
          } else {
            // Before midpoint
            console.warn('📌 POSITION: Before midpoint - NORMAL');
          }

          // Only update if there's a change
          if (newIsSticky !== isStickyRef.current) {
            setIsSticky(newIsSticky);
          }

          if (newIsAbsolute !== isAbsoluteRef.current) {
            setIsAbsolute(newIsAbsolute);
          }

          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    // Force an initial check
    handleScroll();

    console.warn('🔄 Adding scroll event listener');
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      console.warn('🛑 Removing scroll event listener');
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array - only run on mount/unmount

  return { isSticky, isAbsolute };
};
