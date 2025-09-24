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
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Career Advisor",
  description: "Career guidance platform",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
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
            `,
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <UserProvider>
              <NotificationProvider>
                <NotificationManager />
                {children}
                <Toaster />
              </NotificationProvider>
            </UserProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
