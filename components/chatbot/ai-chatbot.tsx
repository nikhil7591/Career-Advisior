"use client"

import { useState, useRef, useEffect } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, Bot, User, Lightbulb, BookOpen } from "lucide-react"
import { useCurrentUser } from "@/components/auth/auth-guard"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  suggestions?: string[]
}

const predefinedResponses = [
  {
    keywords: ["course", "recommend", "suggestion", "what should i study"],
    response:
      "Based on your profile as a {stream} student from {location}, I'd recommend considering these courses:\n\n• **B.Tech Computer Science** - High demand, excellent placement rates\n• **B.Sc. Mathematics** - Strong foundation for various careers\n• **B.Com** - Great for business and finance careers\n\nWould you like detailed information about any of these courses?",
    suggestions: ["Tell me about B.Tech CS", "What are the career prospects?", "Show me colleges nearby"],
  },
  {
    keywords: ["college", "admission", "apply", "university"],
    response:
      "For college admissions, here's what you need to know:\n\n**Government College Benefits:**\n• Affordable fees (₹5,000 - ₹50,000/year)\n• Quality education with experienced faculty\n• Strong alumni networks\n• Research opportunities\n\n**Admission Process:**\n1. Check eligibility criteria\n2. Appear for entrance exams (JEE, NEET, etc.)\n3. Fill application forms\n4. Attend counseling sessions\n\nWould you like me to show you colleges in your area?",
    suggestions: ["Show colleges in Delhi", "What are the entrance exams?", "Tell me about fees"],
  },
  {
    keywords: ["fees", "cost", "expensive", "affordable", "money"],
    response:
      "Government colleges are significantly more affordable! Here's a comparison:\n\n**Government Colleges:**\n• Engineering: ₹25,000 - ₹50,000/year\n• Arts/Science: ₹5,000 - ₹15,000/year\n• Medical: ₹10,000 - ₹30,000/year\n\n**Private Colleges:**\n• Engineering: ₹2-10 lakhs/year\n• Arts/Science: ₹50,000 - ₹2 lakhs/year\n• Medical: ₹5-25 lakhs/year\n\n**Additional Benefits:**\n• Scholarships available\n• Hostel facilities at low cost\n• No donation required\n\nYou can save ₹2-8 lakhs by choosing government colleges!",
    suggestions: ["Show me scholarship options", "What about hostel fees?", "Compare specific colleges"],
  },
  {
    keywords: ["career", "job", "salary", "placement", "future"],
    response:
      "Career prospects from government colleges are excellent! Here's why:\n\n**Strong Placement Records:**\n• IITs: 95-100% placement\n• NITs: 85-95% placement\n• Other govt colleges: 70-85% placement\n\n**Top Recruiters:**\n• Tech: Google, Microsoft, Amazon\n• Finance: Goldman Sachs, JP Morgan\n• Consulting: McKinsey, BCG, Deloitte\n\n**Salary Ranges:**\n• Engineering: ₹8-50 LPA\n• Management: ₹10-40 LPA\n• Research: ₹6-25 LPA\n\nGovernment college graduates are highly valued by employers!",
    suggestions: ["Show me specific career paths", "What skills should I develop?", "Tell me about internships"],
  },
  {
    keywords: ["entrance", "exam", "jee", "neet", "preparation"],
    response:
      "Here are the main entrance exams for government colleges:\n\n**Engineering:**\n• JEE Main & Advanced (IITs, NITs)\n• State CETs (State govt colleges)\n\n**Medical:**\n• NEET (All medical colleges)\n\n**Other Courses:**\n• CUET (Central universities)\n• State entrance exams\n\n**Preparation Tips:**\n• Start early (Class 11)\n• Focus on NCERT books\n• Take mock tests regularly\n• Join coaching if needed\n\n**Important Dates 2024:**\n• JEE Main: January & April\n• NEET: May\n• CUET: May-June",
    suggestions: ["Show me preparation resources", "What's the syllabus?", "Find coaching centers nearby"],
  },
  {
    keywords: ["scholarship", "financial aid", "help", "support"],
    response:
      "Many scholarships are available for government college students:\n\n**Central Government Schemes:**\n• National Scholarship Portal\n• Merit-cum-Means Scholarship\n• Post Matric Scholarship\n• Inspire Scholarship (Science students)\n\n**State Government Schemes:**\n• State merit scholarships\n• Minority scholarships\n• SC/ST/OBC scholarships\n\n**College-specific Aid:**\n• Fee waivers for economically weak\n• Merit scholarships\n• Research assistantships\n\n**Eligibility:**\n• Academic performance\n• Family income criteria\n• Category-based reservations\n\nApply early as deadlines are strict!",
    suggestions: ["Check my eligibility", "How to apply for scholarships?", "Show application deadlines"],
  },
]

const quickQuestions = [
  "What courses should I choose?",
  "Show me colleges in my area",
  "How much do government colleges cost?",
  "What are the career prospects?",
  "Tell me about entrance exams",
  "Are scholarships available?",
]

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm your AI Career Counselor. I'm here to help you with course selection, college admissions, career guidance, and more. What would you like to know?",
      timestamp: new Date(),
      suggestions: quickQuestions.slice(0, 3),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const user = useCurrentUser()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()

    for (const response of predefinedResponses) {
      if (response.keywords.some((keyword) => lowerMessage.includes(keyword))) {
        let content = response.response

        // Replace placeholders with user data
        if (user) {
          content = content.replace("{stream}", user.stream || "Science")
          content = content.replace("{location}", user.location || "Delhi")
        }

        return {
          content,
          suggestions: response.suggestions,
        }
      }
    }

    // Default response
    return {
      content:
        "That's a great question! While I have information about courses, colleges, careers, and admissions, I might not have covered that specific topic yet. \n\nHere are some areas I can definitely help you with:\n• Course recommendations\n• College information and admissions\n• Career prospects and salary information\n• Entrance exam guidance\n• Scholarship opportunities\n\nFor more detailed guidance, I'd recommend speaking with one of our human counselors. What else would you like to know?",
      suggestions: ["Show me course options", "Find colleges nearby", "Tell me about careers"],
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const response = findResponse(message)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto p-6 max-w-4xl">
        <BackButton className="mb-6" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">AI Career Counselor</h1>
          <p className="text-muted-foreground">Get instant answers to your education and career questions</p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat with AI Counselor
            </CardTitle>
            <CardDescription>Ask me anything about courses, colleges, careers, or admissions</CardDescription>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  <div
                    className={`rounded-lg p-3 ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>

                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs opacity-75">Suggested questions:</div>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant="outline"
                              className="text-xs h-7 bg-transparent"
                              onClick={() => handleQuickQuestion(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me about courses, colleges, careers..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage(inputValue)
                  }
                }}
                className="flex-1"
              />
              <Button onClick={() => handleSendMessage(inputValue)} disabled={!inputValue.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-2">Quick questions to get started:</div>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      className="text-xs bg-transparent"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Features */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Smart Recommendations</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Get personalized course and college suggestions based on your profile
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Comprehensive Database</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Access information about 500+ government colleges and courses
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">24/7 Availability</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Get instant answers anytime, anywhere to your education queries
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
