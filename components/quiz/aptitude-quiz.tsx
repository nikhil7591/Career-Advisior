"use client"

import { useMemo, useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { BackButton } from "@/components/ui/back-button"
import { useNotifications } from "@/contexts/notification-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, CheckCircle, ArrowRight, ArrowLeft, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { QuizResults } from "./quiz-results"

type StudentClass = "10" | "12"
type Stream = "science" | "commerce" | "arts"

type QuizOption = { text: string; category: string; weight: number }
type QuizQuestion = { id: number; question: string; options: QuizOption[] }

const tenthQuestions: QuizQuestion[] = [
  { id: 1, question: "Which subjects do you enjoy the most?", options: [
    { text: "Math and Science", category: "science", weight: 3 },
    { text: "Accounts and Business", category: "commerce", weight: 3 },
    { text: "History and Literature", category: "arts", weight: 3 },
  ]},
  { id: 2, question: "What type of tasks do you prefer?", options: [
    { text: "Solving logical problems", category: "science", weight: 2 },
    { text: "Analyzing money/markets", category: "commerce", weight: 2 },
    { text: "Creative writing/design", category: "arts", weight: 2 },
  ]},
  { id: 3, question: "Which extracurricular sounds best?", options: [
    { text: "Robotics/Coding club", category: "science", weight: 2 },
    { text: "Entrepreneurship club", category: "commerce", weight: 2 },
    { text: "Drama/Arts club", category: "arts", weight: 2 },
  ]},
  { id: 4, question: "Your dream project would be...", options: [
    { text: "Build a mobile app", category: "science", weight: 3 },
    { text: "Start a small business", category: "commerce", weight: 3 },
    { text: "Publish a magazine", category: "arts", weight: 3 },
  ]},
  { id: 5, question: "Which careers feel exciting?", options: [
    { text: "Engineer/Scientist", category: "science", weight: 2 },
    { text: "CA/Analyst/Manager", category: "commerce", weight: 2 },
    { text: "Civil Services/Journalist", category: "arts", weight: 2 },
  ]},
  { id: 6, question: "Which skill feels strongest?", options: [
    { text: "Numbers and logic", category: "science", weight: 2 },
    { text: "Business sense", category: "commerce", weight: 2 },
    { text: "Communication & empathy", category: "arts", weight: 2 },
  ]},
  { id: 7, question: "Which school topic do you pick first?", options: [
    { text: "Physics problems", category: "science", weight: 2 },
    { text: "Economics case study", category: "commerce", weight: 2 },
    { text: "Essay & debate", category: "arts", weight: 2 },
  ]},
  { id: 8, question: "Preferred learning style?", options: [
    { text: "Experiments & logic", category: "science", weight: 2 },
    { text: "Real-world business", category: "commerce", weight: 2 },
    { text: "Stories & culture", category: "arts", weight: 2 },
  ]},
  { id: 9, question: "Which elective sounds best?", options: [
    { text: "Computer Science", category: "science", weight: 2 },
    { text: "Entrepreneurship", category: "commerce", weight: 2 },
    { text: "Fine Arts", category: "arts", weight: 2 },
  ]},
  { id: 10, question: "Pick a challenge you enjoy", options: [
    { text: "Tough math puzzle", category: "science", weight: 3 },
    { text: "Plan a budget", category: "commerce", weight: 3 },
    { text: "Write a short play", category: "arts", weight: 3 },
  ]},
]

const twelfthScience: QuizQuestion[] = [
  { id: 1, question: "Which topics feel more natural to you?", options: [
    { text: "Patterns, numbers, and how things work", category: "technical", weight: 3 },
    { text: "Living systems and how the body works", category: "medical", weight: 3 },
    { text: "Both are interesting", category: "technical", weight: 1 },
  ]},
  { id: 2, question: "What kind of problems do you enjoy tackling?", options: [
    { text: "Figuring out how to build or improve something", category: "technical", weight: 2 },
    { text: "Understanding health and helping people feel better", category: "medical", weight: 2 },
    { text: "Improving life for people around me", category: "humanities", weight: 2 },
  ]},
  { id: 3, question: "Where would you like to spend time learning?", options: [
    { text: "Workshop/lab with tools and devices", category: "technical", weight: 2 },
    { text: "Biology/chemistry lab with experiments", category: "medical", weight: 2 },
    { text: "Talking to people and understanding needs", category: "humanities", weight: 1 },
  ]},
  { id: 4, question: "What style of learning suits you more?", options: [
    { text: "Applying concepts to build practical things", category: "technical", weight: 3 },
    { text: "Learning about the human body and care", category: "medical", weight: 3 },
    { text: "Designing for people’s experiences", category: "creative", weight: 2 },
  ]},
  { id: 5, question: "Pick a weekend activity:", options: [
    { text: "Tinker with gadgets or apps", category: "technical", weight: 2 },
    { text: "Volunteer at a health/awareness camp", category: "medical", weight: 2 },
    { text: "Tell a story with visuals or data", category: "commerce", weight: 1 },
  ]},
  { id: 6, question: "How do you feel about using computers to solve problems?", options: [
    { text: "I enjoy it and want to do more", category: "technical", weight: 2 },
    { text: "I can use them but prefer biology", category: "medical", weight: 2 },
    { text: "I’m open to learn if needed", category: "technical", weight: 1 },
  ]},
  { id: 7, question: "In a team, you naturally become the:", options: [
    { text: "Planner who designs how things will work", category: "technical", weight: 2 },
    { text: "Caregiver who ensures everyone’s well-being", category: "medical", weight: 2 },
    { text: "Organizer who connects people and tasks", category: "commerce", weight: 1 },
  ]},
  { id: 8, question: "What kind of impact motivates you?", options: [
    { text: "Creating useful technology", category: "technical", weight: 2 },
    { text: "Improving health and safety", category: "medical", weight: 2 },
    { text: "Making daily life easier for people", category: "humanities", weight: 1 },
  ]},
  { id: 9, question: "Which project would you choose?", options: [
    { text: "Design a simple device or app for a problem", category: "technical", weight: 3 },
    { text: "Create a health awareness guide for students", category: "medical", weight: 3 },
    { text: "Design a student-friendly info poster", category: "creative", weight: 2 },
  ]},
  { id: 10, question: "Where do you see yourself learning more?", options: [
    { text: "Building and experimenting with tech", category: "technical", weight: 2 },
    { text: "Learning about medicine and care", category: "medical", weight: 2 },
    { text: "Understanding people and society", category: "humanities", weight: 1 },
  ]},
]

const twelfthCommerce: QuizQuestion[] = [
  { id: 1, question: "Which tasks feel easiest to you?", options: [
    { text: "Keeping track of money and value", category: "commerce", weight: 3 },
    { text: "Finding patterns in numbers", category: "technical", weight: 2 },
    { text: "Understanding rules and people", category: "humanities", weight: 2 },
  ]},
  { id: 2, question: "What kind of work sounds enjoyable?", options: [
    { text: "Planning budgets and business ideas", category: "commerce", weight: 3 },
    { text: "Understanding data to make decisions", category: "technical", weight: 2 },
    { text: "Organizing teams and processes", category: "humanities", weight: 2 },
  ]},
  { id: 3, question: "You enjoy most:", options: [
    { text: "Comparing costs, profit and value", category: "commerce", weight: 2 },
    { text: "Making simple charts to explain ideas", category: "technical", weight: 2 },
    { text: "Explaining laws/steps in simple words", category: "humanities", weight: 2 },
  ]},
  { id: 4, question: "What do you want to learn more about?", options: [
    { text: "Business and finance basics", category: "commerce", weight: 3 },
    { text: "Using data for business decisions", category: "technical", weight: 2 },
    { text: "Economy and society", category: "humanities", weight: 2 },
  ]},
  { id: 5, question: "Your interest in markets is:", options: [
    { text: "Very high", category: "commerce", weight: 2 },
    { text: "Curious", category: "technical", weight: 1 },
    { text: "Not much", category: "humanities", weight: 1 },
  ]},
  { id: 6, question: "Working with tools/computers for business tasks:", options: [
    { text: "I enjoy trying new tools", category: "technical", weight: 2 },
    { text: "I prefer finance basics first", category: "commerce", weight: 2 },
    { text: "I prefer reading and writing", category: "humanities", weight: 2 },
  ]},
  { id: 7, question: "Starting something of your own?", options: [
    { text: "I'd love to try", category: "commerce", weight: 2 },
    { text: "If it's a useful product", category: "technical", weight: 2 },
    { text: "Maybe a social project", category: "humanities", weight: 2 },
  ]},
  { id: 8, question: "Where would you like to intern?", options: [
    { text: "Bank or finance team", category: "commerce", weight: 2 },
    { text: "Business/analysis team", category: "technical", weight: 2 },
    { text: "Organization that helps people", category: "humanities", weight: 2 },
  ]},
  { id: 9, question: "Pick a mini-project:", options: [
    { text: "Plan a budget for a fest", category: "commerce", weight: 3 },
    { text: "Make a simple sales dashboard", category: "technical", weight: 2 },
    { text: "Create a guide for student club rules", category: "humanities", weight: 2 },
  ]},
  { id: 10, question: "What role suits you?", options: [
    { text: "Money/operations planner", category: "commerce", weight: 2 },
    { text: "Numbers/insights finder", category: "technical", weight: 2 },
    { text: "Coordinator/organizer", category: "humanities", weight: 2 },
  ]},
]

const twelfthArts: QuizQuestion[] = [
  { id: 1, question: "Which topics excite you more?", options: [
    { text: "People, society, and behavior", category: "humanities", weight: 3 },
    { text: "Money, trends, and economy", category: "commerce", weight: 2 },
    { text: "Design, media, and creativity", category: "creative", weight: 2 },
  ]},
  { id: 2, question: "What impact do you want to create?", options: [
    { text: "Help society and improve systems", category: "humanities", weight: 3 },
    { text: "Improve how money/business works", category: "commerce", weight: 2 },
    { text: "Influence culture and ideas", category: "creative", weight: 2 },
  ]},
  { id: 3, question: "Your natural strength is:", options: [
    { text: "Explaining ideas clearly", category: "humanities", weight: 2 },
    { text: "Understanding numbers", category: "commerce", weight: 2 },
    { text: "Designing/creating content", category: "creative", weight: 2 },
  ]},
  { id: 4, question: "What do you want to explore more?", options: [
    { text: "Psychology, politics, or languages", category: "humanities", weight: 3 },
    { text: "Economics and business basics", category: "commerce", weight: 2 },
    { text: "Design, film, or media", category: "creative", weight: 2 },
  ]},
  { id: 5, question: "Where would you like to contribute?", options: [
    { text: "Public service or community work", category: "humanities", weight: 2 },
    { text: "Research on society/economy", category: "commerce", weight: 2 },
    { text: "Creative/media projects", category: "creative", weight: 2 },
  ]},
  { id: 6, question: "Internship choice?", options: [
    { text: "Organization working for people", category: "humanities", weight: 2 },
    { text: "Research/assistant role", category: "commerce", weight: 2 },
    { text: "Studio/Media team", category: "creative", weight: 2 },
  ]},
  { id: 7, question: "Project you’d enjoy:", options: [
    { text: "Essay with interviews", category: "humanities", weight: 2 },
    { text: "Survey and findings", category: "commerce", weight: 2 },
    { text: "Short film/poster", category: "creative", weight: 2 },
  ]},
  { id: 8, question: "Team role you take:", options: [
    { text: "Coordinator/writer", category: "humanities", weight: 2 },
    { text: "Analyst", category: "commerce", weight: 2 },
    { text: "Designer/producer", category: "creative", weight: 2 },
  ]},
  { id: 9, question: "A day you’d enjoy:", options: [
    { text: "Helping people/organizing events", category: "humanities", weight: 3 },
    { text: "Understanding trends and sharing insights", category: "commerce", weight: 2 },
    { text: "Creating content that inspires", category: "creative", weight: 2 },
  ]},
  { id: 10, question: "Skill you’ll build more:", options: [
    { text: "Writing and leadership", category: "humanities", weight: 2 },
    { text: "Quantitative reasoning", category: "commerce", weight: 2 },
    { text: "Visual storytelling", category: "creative", weight: 2 },
  ]},
]

export function AptitudeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [showResults, setShowResults] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [studentClass, setStudentClass] = useState<StudentClass | null>(null)
  const [stream, setStream] = useState<Stream | null>(null)
  const { addNotification } = useNotifications()
  const router = useRouter()

  const quizQuestions: QuizQuestion[] = useMemo(() => {
    if (!studentClass) return []
    if (studentClass === "10") return tenthQuestions
    if (studentClass === "12") {
      if (stream === "science") return twelfthScience
      if (stream === "commerce") return twelfthCommerce
      if (stream === "arts") return twelfthArts
      return []
    }
    return []
  }, [studentClass, stream])

  const progress = quizQuestions.length
    ? ((currentQuestion + 1) / quizQuestions.length) * 100
    : 0

  const handleAnswer = (option: any) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setShowResults(true)
      // Add completion notification
      addNotification({
        type: "success",
        title: "Quiz Completed!",
        message: "Great job! Your career assessment results are ready to view.",
        read: false,
      })
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const calculateResults = () => {
    const categoryScores: Record<string, number> = {}

    Object.values(answers).forEach((answer: any) => {
      if (categoryScores[answer.category]) {
        categoryScores[answer.category] += answer.weight
      } else {
        categoryScores[answer.category] = answer.weight
      }
    })

    const sortedCategories = Object.entries(categoryScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)

    return {
      topCategory: sortedCategories[0],
      allScores: categoryScores,
      recommendations: getRecommendations(sortedCategories[0]?.[0] as string),
    }
  }

  const getRecommendations = (topCategory: string) => {
    const recommendations: Record<string, any> = {
      technical: {
        courses: ["B.Tech Computer Science", "B.Tech Electronics", "B.Sc. IT"],
        careers: ["Software Engineer", "Data Scientist", "Cybersecurity Analyst"],
        colleges: ["IIT Delhi", "NIT Trichy", "IIIT Hyderabad"],
      },
      medical: {
        courses: ["MBBS", "B.Sc. Nursing", "B.Pharma"],
        careers: ["Doctor", "Medical Researcher", "Healthcare Administrator"],
        colleges: ["AIIMS Delhi", "JIPMER", "Government Medical College"],
      },
      commerce: {
        courses: ["B.Com", "BBA", "B.Sc. Economics"],
        careers: ["Chartered Accountant", "Financial Analyst", "Business Manager"],
        colleges: ["Delhi School of Economics", "Shri Ram College", "Hindu College"],
      },
      humanities: {
        courses: ["B.A. English", "B.A. Psychology", "B.A. Political Science"],
        careers: ["Civil Services", "Journalist", "Social Worker"],
        colleges: ["JNU", "DU", "BHU"],
      },
      science: {
        courses: ["PCM (Engineering)", "PCB (Medical)", "PCMB (Hybrid)"],
        careers: ["Engineer", "Doctor", "Researcher"],
        colleges: ["IITs/NITs", "AIIMS", "Top Govt. Universities"],
      },
      arts: {
        courses: ["B.A. (Humanities)", "BFA", "Design"],
        careers: ["Civil Services", "Journalist", "Designer"],
        colleges: ["DU", "JNU", "NIFT/NID (Design)"],
      },
    }

    return recommendations[topCategory] || recommendations.technical
  }

  if (showResults) {
    return (
      <QuizResults
        results={calculateResults()}
        studentClass={studentClass as StudentClass}
        stream={stream as Stream | null}
        onRetake={() => {
          setCurrentQuestion(0)
          setAnswers({})
          setShowResults(false)
          setIsStarted(false)
          setStudentClass(null)
          setStream(null)
        }}
      />
    )
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto p-6 max-w-2xl">
          <BackButton className="mb-6" />
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Aptitude Assessment</CardTitle>
              <CardDescription className="text-lg">
                Discover your strengths and get personalized career recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">10</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">6</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">AI</div>
                  <div className="text-sm text-muted-foreground">Powered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">Free</div>
                  <div className="text-sm text-muted-foreground">Assessment</div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">What you'll discover:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your academic strengths and interests</li>
                  <li>• Recommended streams and career paths</li>
                  <li>• Suitable college courses and entrances</li>
                  <li>• Government college options</li>
                </ul>
              </div>

              <Button size="lg" onClick={() => setIsStarted(true)} className="w-full">
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Step 2: choose class (10th/12th)
  if (isStarted && !studentClass) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto p-6 max-w-2xl">
          <BackButton className="mb-6" />
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Which class are you in?</CardTitle>
              <CardDescription>Select your current class to personalize the test.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button className="h-auto py-4" onClick={() => setStudentClass("10")}>Class 10th</Button>
              <Button variant="outline" className="h-auto py-4" onClick={() => setStudentClass("12")}>
                Class 12th
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Step 3 (only for 12th): choose stream
  if (isStarted && studentClass === "12" && !stream) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto p-6 max-w-2xl">
          <BackButton className="mb-6" />
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Which stream did you choose in 12th?</CardTitle>
              <CardDescription>We will ask questions related to your stream.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button className="h-auto py-4" onClick={() => setStream("science")}>Science (PCM/PCB)</Button>
              <Button variant="outline" className="h-auto py-4" onClick={() => setStream("commerce")}>
                Commerce
              </Button>
              <Button variant="outline" className="h-auto py-4" onClick={() => setStream("arts")}>
                Arts/Humanities
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQ = quizQuestions[currentQuestion]
  const selectedAnswer = answers[currentQuestion]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="container mx-auto p-6 max-w-2xl">
        <BackButton className="mb-6" />
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQ.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer?.text === option.text ? "default" : "outline"}
                className="w-full justify-start text-left h-auto p-4"
                onClick={() => handleAnswer(option)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer?.text === option.text
                        ? "border-primary-foreground bg-primary-foreground"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedAnswer?.text === option.text && <CheckCircle className="h-3 w-3 text-primary" />}
                  </div>
                  <span>{option.text}</span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button onClick={handleNext} disabled={!selectedAnswer}>
            {currentQuestion === quizQuestions.length - 1 ? (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Results
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
