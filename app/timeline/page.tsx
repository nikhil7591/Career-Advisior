"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { TimelineTracker } from "@/components/timeline/timeline-tracker"

export default function TimelinePage() {
  return (
    <AuthGuard requiredType="student">
      <TimelineTracker />
    </AuthGuard>
  )
}
