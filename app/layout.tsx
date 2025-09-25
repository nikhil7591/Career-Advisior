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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Career Path" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="mask-icon" href="/icon-192x192.png" color="#2563eb" />
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress ResizeObserver loop error - this is a harmless browser issue
              window.addEventListener('error', function(e) {
                if (e.message === 'ResizeObserver loop completed with undelivered notifications.' || 
                    e.message === 'ResizeObserver loop limit exceeded') {
                  e.stopImmediatePropagation();
                  return false;
                }
              });
              
              // Also handle unhandled promise rejections for ResizeObserver
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.message && 
                    (e.reason.message.includes('ResizeObserver') || 
                     e.reason.message.includes('loop completed'))) {
                  e.preventDefault();
                  return false;
                }
              });

              // Register Service Worker for PWA
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }

              // Handle install prompt
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                // Show install button or banner
                const installBanner = document.createElement('div');
                installBanner.innerHTML = \`
                  <div style="position: fixed; bottom: 20px; left: 20px; right: 20px; background: #2563eb; color: white; padding: 16px; border-radius: 8px; z-index: 1000; display: flex; justify-content: space-between; align-items: center;">
                    <span>Install Career Path for offline access!</span>
                    <button onclick="installApp()" style="background: white; color: #2563eb; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Install</button>
                    <button onclick="this.parentElement.remove()" style="background: transparent; color: white; border: 1px solid white; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-left: 8px;">×</button>
                  </div>
                \`;
                document.body.appendChild(installBanner);
              });

              window.installApp = function() {
                if (deferredPrompt) {
                  deferredPrompt.prompt();
                  deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                      console.log('User accepted the install prompt');
                    }
                    deferredPrompt = null;
                  });
                }
              };
            `,
          }}
        />
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
