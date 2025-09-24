"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { CollegeDirectory } from "@/components/colleges/college-directory"

export default function CollegesPage() {
  return (
    <AuthGuard requiredType="student">
      <CollegeDirectory />
    </AuthGuard>
  )
}
