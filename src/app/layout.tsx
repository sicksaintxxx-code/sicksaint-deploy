import type { Metadata, Viewport } from 'next';
import './globals.css';
import Masthead from '../components/Masthead';
import HighSignalTicker from '../components/HighSignalTicker';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

export const viewport: Viewport = {
  themeColor: '#08090D',
};

export const metadata: Metadata = {
  title: 'SICKSAINT — The World, Without The Noise',
  description: 'An independent international digital editorial publication covering global statecraft, sovereign compute enclaves, capital, and tactile culture.',
  keywords: [
    'SICKSAINT',
    'journalism',
    'editorial publication',
    'technology',
    'culture',
    'world affairs',
    'fashion',
    'business',
    'investigative dossiers',
  ],
  authors: [{ name: 'SICKSAINT Editorial Collective' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sicksaint.club'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'SICKSAINT — The World, Without The Noise',
    description: 'An independent international digital editorial publication covering global statecraft, sovereign compute enclaves, capital, and tactile culture.',
    siteName: 'SICKSAINT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SICKSAINT — The World, Without The Noise',
    description: 'The World, Without The Noise. High-signal international digital publication.',
    site: '@sicksaint',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        {/* NewsMediaOrganization structured schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NewsMediaOrganization',
              name: 'SICKSAINT',
              slogan: 'THE WORLD, WITHOUT THE NOISE.',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sicksaint.club',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sicksaint.club'}/logo.png`,
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-brand-bg text-brand-text antialiased selection:bg-brand-accent selection:text-brand-bg" suppressHydrationWarning>
        <AuthProvider>
          {/* Editorial Top Telemetry & Brand Masthead */}
          <Masthead />
          {/* Animated High Signal & Breaking News Ticker */}
          <HighSignalTicker />
          {/* Sticky Editorial Navigation with Expandable Search Overlay & Mobile Drawer */}
          <Navigation />
          <main className="flex-1">{children}</main>
          {/* Distinctive Editorial Footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
