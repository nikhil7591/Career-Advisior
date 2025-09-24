"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { CareerMapping } from "@/components/career/career-mapping"

export default function CareerMappingPage() {
  return (
    <AuthGuard requiredType="student">
      <CareerMapping />
    </AuthGuard>
  )
}
