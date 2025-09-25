"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { AptitudeQuiz } from "@/components/quiz/aptitude-quiz"

export default function QuizPage() {
  return (
    <AuthGuard requiredType="student">
      <AptitudeQuiz />
    </AuthGuard>
  )
}
