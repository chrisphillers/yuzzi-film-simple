import type { Metadata } from 'next';
import './globals.css';
import { NavBar } from '@/components/nav-bar';
import { Footer } from '@/components/footer';
import { ThemeProvider } from './providers/ThemeProvider';
import { Geist, Geist_Mono } from 'next/font/google';
import { Box, Page, Paragraph, PageContent } from 'grommet';

export const metadata: Metadata = {
  title: 'Le Yuzzi',
  description: 'Discover and watch exceptional films presented by Le Yuzzi',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Le Yuzzi',
    description: 'Discover and watch exceptional films presented by Le Yuzzi',
    images: ['/path/to/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le Yuzzi',
    description: 'Discover and watch exceptional films presented by Le Yuzzi',
    images: ['/path/to/twitter-image.jpg'],
  },
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <NavBar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

export const CentreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Page kind="narrow">
      <PageContent background="light-3">
        <Paragraph>{children}</Paragraph>
      </PageContent>
    </Page>
  );
};

export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  return <Box>{children}</Box>;
};

// Layouts

// Homepage - The Center
// ABout us - The Center
// Journal - Sidebar and main
// Newsletter - text input form
