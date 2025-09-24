"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"

export default function DashboardPage() {
  return (
    <AuthGuard requiredType="student">
      <StudentDashboard />
    </AuthGuard>
  )
}
