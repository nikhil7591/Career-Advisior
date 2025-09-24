"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { ParentPortal } from "@/components/parent/parent-portal"

export default function ParentPortalPage() {
  return (
    <AuthGuard requiredType="parent">
      <ParentPortal />
    </AuthGuard>
  )
}
