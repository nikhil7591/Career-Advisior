"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { AIChatbot } from "@/components/chatbot/ai-chatbot"

export default function ChatbotPage() {
  return (
    <AuthGuard requiredType="student">
      <AIChatbot />
    </AuthGuard>
  )
}
