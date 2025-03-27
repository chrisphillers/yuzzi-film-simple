'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the types for our global state
type GlobalState = {
  [key: string]: any;
};

// Define the context type
type AppContextType = {
  // Scroll state
  isSticky: boolean;
  isAbsolute: boolean;

  // Global state management
  globalState: GlobalState;
  setGlobalValue: (key: string, value: any) => void;
  getGlobalValue: (key: string) => any;

  // Common state values with direct accessors
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  user: any;
  setUser: (user: any) => void;
  logout: () => void;
};

// Create context with default values
export const AppContext = createContext<AppContextType>({
  // Scroll defaults
  isSticky: false,
  isAbsolute: false,

  // Global state defaults
  globalState: {},
  setGlobalValue: () => null,
  getGlobalValue: () => null,

  // Common state values
  theme: 'light',
  setTheme: () => null,

  user: null,
  setUser: () => null,
  logout: () => null,
});

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Scroll state
  const [isSticky, setIsSticky] = useState(false);
  const [isAbsolute, setIsAbsolute] = useState(false);

  // Global state using a single object
  const [globalState, setGlobalState] = useState<GlobalState>({
    theme: 'light',
    user: null,
  });

  // Convenience accessors for common state
  const theme = globalState.theme as 'light' | 'dark';
  const user = globalState.user;

  // Function to set a global state value
  const setGlobalValue = (key: string, value: any) => {
    setGlobalState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Function to get a global state value
  const getGlobalValue = (key: string) => globalState[key];

  // Theme setter
  const setTheme = (theme: 'light' | 'dark') => {
    setGlobalValue('theme', theme);
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  };

  // User setters
  const setUser = (user: any) => {
    setGlobalValue('user', user);
  };

  const logout = () => {
    setGlobalValue('user', null);
  };

  // Scroll effect
  useEffect(() => {
    console.warn('📍 AppContext mounted');

    const handleScroll = () => {
      // Get measurements
      const scrollY = document?.scrollingElement?.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const triggerPoint = viewportHeight / 2; // 50% of viewport height
      const footerHeight = 60;

      console.warn('📜 SCROLL:', { scrollY });

      // Determine position states
      if (scrollY > triggerPoint) {
        if (scrollY + viewportHeight >= documentHeight - footerHeight) {
          // At bottom
          console.warn('📌 POSITION: ABSOLUTE');
          setIsSticky(false);
          setIsAbsolute(true);
        } else {
          // Past midpoint but not at bottom
          console.warn('📌 POSITION: STICKY');
          setIsSticky(true);
          setIsAbsolute(false);
        }
      } else {
        // Before midpoint
        console.warn('📌 POSITION: NORMAL');
        setIsSticky(false);
        setIsAbsolute(false);
      }
    };

    // Initial calculation
    handleScroll();

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Create context value
  const contextValue: AppContextType = {
    // Scroll state
    isSticky,
    isAbsolute,

    // Global state
    globalState,
    setGlobalValue,
    getGlobalValue,

    // Common state values
    theme,
    setTheme,

    user,
    setUser,
    logout,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// Custom hooks
export const useAppContext = () => {
  return useContext(AppContext);
};

// Separate hook for just scroll position
export const useScrollPosition = () => {
  const { isSticky, isAbsolute } = useContext(AppContext);
  return { isSticky, isAbsolute };
};

// Separate hook for getting/setting global state
export const useGlobalState = () => {
  const { globalState, setGlobalValue, getGlobalValue } = useContext(AppContext);
  return { globalState, setGlobalValue, getGlobalValue };
};

// Separate hook for theme
export const useTheme = () => {
  const { theme, setTheme } = useContext(AppContext);
  return { theme, setTheme };
};

// Separate hook for user
export const useUser = () => {
  const { user, setUser, logout } = useContext(AppContext);
  return { user, setUser, logout };
};
