import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NavBar } from '@/components/nav-bar';
import { Footer } from '@/components/footer';
import { Grommet } from 'grommet';
import StyledComponentsRegistry from './registry';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Grommet theme
const theme = {
  global: {
    font: {
      family: 'var(--font-geist-sans)',
      size: '14px',
      height: '20px',
    },
    colors: {
      brand: '#000000',
      'accent-1': '#333333',
      'accent-2': '#666666',
      'neutral-1': '#EEEEEE',
      'neutral-2': '#DDDDDD',
      'link-hover': '#2300ff', // Added blue color for link hover
      text: {
        light: '#333333',
      },
      background: {
        light: '#FFFFFF',
      },
    },
  },
  anchor: {
    color: 'text.light',
    textDecoration: 'none',
    hover: {
      textDecoration: 'underline',
      extend: `color: #2300ff;`, // Apply blue color on hover via CSS
    },
  },
};

export const metadata: Metadata = {
  title: 'Le Cinéma Club',
  description: 'Discover and watch exceptional short films presented by Le Cinéma Club',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StyledComponentsRegistry>
          <Grommet theme={theme} full>
            <NavBar />
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
              {children}
            </main>
            <Footer />
          </Grommet>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
