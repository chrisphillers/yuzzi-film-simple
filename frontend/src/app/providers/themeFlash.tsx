'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';

// Define props with transient $ prefix
interface FlashyTransitionProps {
  $randomColor?: string;
  $isActive: boolean;
}

// Move styled component outside
const FlashyTransition = styled.div<FlashyTransitionProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ $randomColor }) => $randomColor || '#ffcc00'};
  z-index: 9999;
  pointer-events: none;
  transition: opacity 0.3s ease;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
`;

export const ThemeFlasher = () => {
  const colourPicks = ['#ffcc00', 'hotpink', 'red', 'var(--color-blue)'];
  const pathname = usePathname();
  const [flash, setFlash] = useState(false);
  const [color, setColor] = useState(getRandomItem(colourPicks));

  useEffect(() => {
    setFlash(true);
    setColor(getRandomItem(colourPicks));
    const timer = setTimeout(() => setFlash(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  function getRandomItem(array: string[]) {
    if (!Array.isArray(array)) throw new Error('Input must be an array');
    if (array.length === 0) throw new Error('Array cannot be empty');
    return array[Math.floor(Math.random() * array.length)];
  }

  if (flash) {
    return (
      <FlashyTransition data-testid="flashy-transition" $isActive={flash} $randomColor={color} />
    );
  }

  return null;
};
