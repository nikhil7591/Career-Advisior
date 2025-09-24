"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GraduationCap, Menu, X } from "lucide-react"
import Link from "next/link"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { useUser } from "@/contexts/user-context"
import { usePathname } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useUser()
  const pathname = usePathname()

  const isProtectedRoute = pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/parent-portal") ||
    pathname?.startsWith("/career-mapping") ||
    pathname?.startsWith("/colleges") ||
    pathname?.startsWith("/quiz") ||
    pathname?.startsWith("/chatbot") ||
    pathname?.startsWith("/profile")

  return (
    <header className="glass">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary drop-shadow-sm" />
          <span className="text-xl font-bold tracking-tight">CareerPath</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </a>
          <Link href="/colleges" className="text-sm font-medium hover:text-primary transition-colors">
            Colleges
          </Link>
          <Link href="/chatbot" className="text-sm font-medium hover:text-primary transition-colors">
            AI Counselor
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user && isProtectedRoute ? (
            <>
              <NotificationBell />
              <Link href={user.type === "student" ? "/dashboard" : "/parent-portal"}>
                <Button size="sm" className="shadow-sm hover:shadow-md">
                  Go to Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                  Log in
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="sm" className="shadow-sm hover:shadow-md">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden glass p-4">
          <nav className="flex flex-col space-y-4">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <Link href="/colleges" className="text-sm font-medium hover:text-primary transition-colors">
              Colleges
            </Link>
            <Link href="/chatbot" className="text-sm font-medium hover:text-primary transition-colors">
              AI Counselor
            </Link>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              {user && isProtectedRoute ? (
                <>
                  <div className="flex justify-center pb-2">
                    <NotificationBell />
                  </div>
                  <Link href={user.type === "student" ? "/dashboard" : "/parent-portal"}>
                    <Button size="sm" className="w-full shadow-sm hover:shadow-md">
                      Go to Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <Button variant="ghost" size="sm" className="w-full hover:bg-primary/10">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button size="sm" className="w-full shadow-sm hover:shadow-md">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
