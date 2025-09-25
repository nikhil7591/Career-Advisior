"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { StudyMaterials } from "@/components/study-materials/study-materials"

export default function StudyMaterialsPage() {
  return (
    <AuthGuard requiredType="student">
      <StudyMaterials />
    </AuthGuard>
  )
}
