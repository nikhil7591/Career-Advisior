"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"

interface RedirectHandlerProps {
  children: React.ReactNode
}

export function RedirectHandler({ children }: RedirectHandlerProps) {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Only redirect if we're on auth page and user is logged in
    // Don't interfere with other pages (like homepage after logout)
    if (user && typeof window !== 'undefined' && window.location.pathname === "/auth") {
      if (user.type === "student") {
        router.replace("/dashboard")
      } else {
        router.replace("/parent-portal")
      }
    }
  }, [user, loading, router])

  return <>{children}</>
}
