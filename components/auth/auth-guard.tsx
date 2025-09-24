"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"

interface AuthGuardProps {
  children: React.ReactNode
  requiredType?: "student" | "parent"
}

export function AuthGuard({ children, requiredType }: AuthGuardProps) {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push("/auth")
      return
    }

    if (requiredType && user.type !== requiredType) {
      router.push("/auth")
      return
    }
  }, [user, loading, requiredType, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || (requiredType && user.type !== requiredType)) {
    return null
  }

  return <>{children}</>
}

// Backward compatibility - now uses the user context
export { useCurrentUser } from "@/contexts/user-context"
