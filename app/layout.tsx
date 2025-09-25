import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/contexts/user-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { NotificationManager } from "@/components/notifications/notification-manager"
import { RedirectHandler } from "@/components/auth/redirect-handler"
import { ClientOnly } from "@/components/client-only"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "SIH Career Path - Government College Advisor",
  description: "Personalized career guidance platform for government college admissions. Find your perfect career path with AI-powered assessments.",
  generator: 'Next.js',
  applicationName: 'SIH Career Path',
  referrer: 'origin-when-cross-origin',
  keywords: ['career guidance', 'government colleges', 'education', 'aptitude test', 'college admission', 'SIH', 'Smart India Hackathon'],
  authors: [{ name: 'SIH Team' }],
  creator: 'SIH Career Path Team',
  publisher: 'SIH Career Path',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sih-career-path.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SIH Career Path - Government College Advisor',
    description: 'Discover your perfect career path with AI-powered guidance for government college admissions',
    url: 'https://sih-career-path.vercel.app',
    siteName: 'SIH Career Path',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SIH Career Path - Government College Advisor',
    description: 'Discover your perfect career path with AI-powered guidance',
    creator: '@sihcareerpath',
  },
  verification: {
    google: 'google-verification-code',
  },
  appleWebApp: {
    title: 'Career Path',
    statusBarStyle: 'default',
    capable: true,
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Career Path" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="mask-icon" href="/icon-192x192.png" color="#2563eb" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
        <Suspense fallback={null}>
          <ClientOnly>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <UserProvider>
                <NotificationProvider>
                  <RedirectHandler>
                    <NotificationManager />
                    {children}
                    <Toaster />
                  </RedirectHandler>
                </NotificationProvider>
              </UserProvider>
            </ThemeProvider>
          </ClientOnly>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
