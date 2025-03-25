import { deepMerge } from 'grommet/utils';
import { grommet, ThemeType } from 'grommet/themes';

// Single source of truth: Define colors once
const colorDefinitions = {
  blue: '#2300ff',
  white: '#ffffff',
  offwhite: '#f8f8f8',
  grey: 'rgb(185, 179, 179)',
  brandPrimary: '#2300ff',
  brandSecondary: '#2300ff',
  background: 'white',
  backgroundLight: '#ffffff',
};

// Custom Grommet theme
const customTheme: ThemeType = {
  global: {
    hover: { color: colorDefinitions.blue },
    selected: { color: colorDefinitions.blue },
    colors: {
      brand: 'black',
      focus: 'white',
      blue: colorDefinitions.blue,
      white: colorDefinitions.white,
      offwhite: colorDefinitions.offwhite,
      grey: colorDefinitions.grey,
      'brand-primary': colorDefinitions.brandPrimary,
      'brand-secondary': colorDefinitions.brandSecondary,
    },
    font: {
      family: 'var(--font-geist-sans)',
      size: '14px',
      height: '20px',
    },
  },
  anchor: {
    color: { dark: 'white', light: 'black' },
    // size: { medium: { fontWeight: 3,  } },
    hover: {
      textDecoration: 'none',
      extend: 'color: blue;',
    },
  },
};

// Merge with default Grommet theme to retain Grommet's defaults
export const grommetTheme = deepMerge(grommet, customTheme);

// Optional: Keep cssVariables for non-Grommet use (can be removed if fully using Grommet)
export const cssVariables = `
  :root {
    --color-blue: ${colorDefinitions.blue};
    --color-white: ${colorDefinitions.white};
    --color-offwhite: ${colorDefinitions.offwhite};
    --color-grey: ${colorDefinitions.grey};
    --color-brand-primary: ${colorDefinitions.brandPrimary};
    --color-brand-secondary: ${colorDefinitions.brandSecondary};
    --color-background: ${colorDefinitions.background};
    --color-background-light: ${colorDefinitions.backgroundLight};
  }
`;
