'use client';
// import type { Metadata } from 'next';
import './globals.css';
import { NavBar } from '@/components/nav-bar';
import { Footer } from '@/components/footer';
import { ThemeProvider } from './providers/ThemeProvider';
import { Geist, Geist_Mono } from 'next/font/google';
import { Box, Grid } from 'grommet';
import { NewsletterModal } from '../components/newsletter/newsletter';
import { useState } from 'react';

// TODO: return this logic from here - onces a server component again

// export const metadata: Metadata = {
//   title: 'Le Yuzzi',
//   description: 'Discover and watch exceptional films presented by Le Yuzzi',
//   robots: {
//     index: true,
//     follow: true,
//   },
//   openGraph: {
//     title: 'Le Yuzzi',
//     description: 'Discover and watch exceptional films presented by Le Yuzzi',
//     images: ['/path/to/og-image.jpg'],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Le Yuzzi',
//     description: 'Discover and watch exceptional films presented by Le Yuzzi',
//     images: ['/path/to/twitter-image.jpg'],
//   },
// };

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // TODO: strip out this logic from here - esp state this means the component is client - need to refactor to context to ensure it is a server component
  const [showNewsletterModal, setShowNewsletterModal] = useState<boolean>(false);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          {/*toggle newsletter modal */}
          {showNewsletterModal ? (
            <NewsletterModal setShowNewsletterModal={setShowNewsletterModal}></NewsletterModal>
          ) : null}
          <Grid
            rows={['xxsmall', 'auto', 'xxsmall']}
            columns={['auto']}
            areas={[['header'], ['main'], ['footer']]}
            gap="small"
            tabIndex={0}
          >
            <NavBar gridArea="header" setShowNewsletterModal={setShowNewsletterModal} />
            <Box gridArea="main" width="100%">
              <main>{children}</main>
            </Box>

            <Footer gridArea="footer" />
          </Grid>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid
      columns={['medium', 'auto']}
      areas={[['sidebar'], ['main']]}
      rows={['auto']}
      gap="small"
      tabIndex={0}
    >
      {/* TODO add grid naming to lower components? Not a solution below */}

      {/* <Box gridArea="sidebar">{children}</Box> */}
      <Box gridArea="main">{children}</Box>
    </Grid>
  );
};

// Layouts

// Homepage - The Center
// ABout us - The Center
// Journal - Sidebar and main
// Newsletter - text input form
