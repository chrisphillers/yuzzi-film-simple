'use client';
import React, { useEffect } from 'react';

export default function MinimalScrollDetector() {
  useEffect(() => {
    // Log immediately when component mounts
    console.warn('🔴 SCROLL DETECTOR MOUNTED');

    // Super simple scroll handler - no throttling, no calculations
    const handleScroll = () => {
      console.warn('📜 SCROLL EVENT DETECTED:', {
        scrollY: document.documentElement.scrollTop,
        timestamp: new Date().toISOString(),
      });
    };

    // Try adding a scroll event in different ways
    console.warn('🔄 ADDING SCROLL LISTENER');

    // Method 1: Standard event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Method 2: Direct assignment as backup
    window.onscroll = () => {
      console.warn('🔶 ONSCROLL EVENT FIRED:', window.scrollY);
    };

    // Log initial scroll position
    console.warn('📊 INITIAL SCROLL POSITION:', window.scrollY);

    // Force a manual check every second as a fallback
    const intervalId = setInterval(() => {
      const currentScroll = window.scrollY;
      console.warn('⏱️ INTERVAL CHECK:', {
        scrollY: currentScroll,
        timestamp: new Date().toISOString(),
      });
    }, 1000);

    // Cleanup
    return () => {
      console.warn('🛑 REMOVING SCROLL DETECTOR');
      window.removeEventListener('scroll', handleScroll);
      window.onscroll = null;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <p>Scroll Detector Active (check console)</p>

      {/* Add extra content to ensure page is scrollable */}
      <div style={{ height: '300vh', background: 'linear-gradient(to bottom, #f0f8ff, #87ceeb)' }}>
        <h2 style={{ position: 'sticky', top: '20px', textAlign: 'center' }}>
          Scroll down to see events in console
        </h2>
      </div>
    </div>
  );
}
