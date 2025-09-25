"use client"

import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, BookOpen, Building, Users, ArrowRight, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

interface QuizResultsProps {
  results: {
    topCategory: [string, number]
    allScores: Record<string, number>
    recommendations: {
      courses: string[]
      careers: string[]
      colleges: string[]
    }
  }
  studentClass: "10" | "12"
  stream: "science" | "commerce" | "arts" | null
  onRetake: () => void
}

export function QuizResults({ results, studentClass, stream, onRetake }: QuizResultsProps) {
  const router = useRouter()

  const categoryNames: Record<string, string> = {
    technical: "Technical & Engineering",
    medical: "Medical & Healthcare",
    commerce: "Business & Commerce",
    humanities: "Arts & Humanities",
    creative: "Creative & Design",
    social: "Social & Administrative",
    science: "Science (PCM/PCB)",
    arts: "Arts/Humanities",
  }

  const categoryDescriptions: Record<string, string> = {
    technical: "You have strong analytical and problem-solving skills, perfect for technology and engineering fields.",
    medical: "You show empathy and attention to detail, ideal for healthcare and medical professions.",
    commerce: "You have business acumen and leadership potential, great for commerce and management roles.",
    humanities: "You excel in communication and critical thinking, suitable for arts and social sciences.",
    creative: "You have artistic flair and innovative thinking, perfect for creative industries.",
    social: "You have strong interpersonal skills and desire to help others, ideal for social work and administration.",
  }

  const maxScore = Math.max(...Object.values(results.allScores))
  const [topCategory, topScore] = results.topCategory

  const sortedCategories = Object.entries(results.allScores).sort(([, a], [, b]) => b - a)
  const topTwo = sortedCategories.slice(0, 2).map(([cat]) => cat)
  const primaryRoadmap = buildRoadmap({ studentClass, stream, topCategory })
  const secondaryRoadmap = topTwo[1]
    ? buildRoadmap({ studentClass, stream: stream, topCategory: topTwo[1] })
    : []

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="container mx-auto p-6 max-w-4xl">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Your Assessment Results</h1>
          <p className="text-muted-foreground">Based on your responses, here's your personalized career guidance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Match */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Your Best Match
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-primary/5 rounded-lg animate-scale-in">
                  <Badge className="mb-3 text-lg px-4 py-2">{categoryNames[topCategory] || topCategory}</Badge>
                  <p className="text-muted-foreground mb-4">
                    {categoryDescriptions[topCategory] || "You have unique strengths that align with this field."}
                  </p>
                  <div className="text-2xl font-bold text-primary">
                    {Math.round((topScore / maxScore) * 100)}% Match
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle>
                <CardDescription>Your aptitude scores across different categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(results.allScores)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, score]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{categoryNames[category] || category}</span>
                        <span className="text-sm text-muted-foreground">{Math.round((score / maxScore) * 100)}%</span>
                      </div>
                      <Progress value={(score / maxScore) * 100} className="h-2" />
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="animate-fade-in" style={{animationDelay:"60ms"}}>
              <CardHeader>
                <CardTitle>Recommended Courses</CardTitle>
                <CardDescription>Based on your aptitude profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.recommendations.courses.map((course, index) => (
                    <div key={index} className="p-3 border rounded-lg animate-scale-in" style={{animationDelay:`${80 + index*40}ms`}}>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-medium">{course}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">High compatibility with your interests</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Roadmaps */}
            <Card className="animate-fade-in" style={{animationDelay:"120ms"}}>
              <CardHeader>
                <CardTitle>Personalized Roadmap</CardTitle>
                <CardDescription>Step-by-step guide based on your class and aptitude</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <div>
                  <div className="mb-4">
                    <Badge className="mr-2">Primary Opportunity</Badge>
                    <span className="font-semibold">{categoryNames[topCategory] || topCategory}</span>
                  </div>
                  <div className="relative pl-6 border-l">
                    {primaryRoadmap.map((step, idx) => (
                      <div key={idx} className="relative pb-6 animate-fade-up lift" style={{animationDelay:`${60 + idx*80}ms`}}>
                        <span className="absolute -left-2 top-1.5 h-3 w-3 rounded-full bg-primary shadow timeline-dot" />
                        <div className="p-4 rounded-lg glass tilt">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">Step {idx + 1}</Badge>
                            <span className="font-medium">{step.title}</span>
                          </div>
                          <div className="text-sm text-muted-foreground whitespace-pre-line">{step.details}</div>
                          {step.items?.length ? (
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                              {step.items.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {secondaryRoadmap.length > 0 && (
                  <div>
                    <div className="mb-4">
                      <Badge variant="outline" className="mr-2">Alternate Opportunity</Badge>
                      <span className="font-semibold">{categoryNames[topTwo[1]] || topTwo[1]}</span>
                    </div>
                    <div className="relative pl-6 border-l">
                      {secondaryRoadmap.map((step, idx) => (
                        <div key={idx} className="relative pb-6 animate-fade-up lift" style={{animationDelay:`${60 + idx*80}ms`}}>
                          <span className="absolute -left-2 top-1.5 h-3 w-3 rounded-full bg-primary/60 shadow timeline-dot" />
                          <div className="p-4 rounded-lg glass tilt">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">Step {idx + 1}</Badge>
                              <span className="font-medium">{step.title}</span>
                            </div>
                            <div className="text-sm text-muted-foreground whitespace-pre-line">{step.details}</div>
                            {step.items?.length ? (
                              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                                {step.items.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Career Paths */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Career Paths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.recommendations.careers.map((career, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium text-sm">{career}</div>
                    <div className="text-xs text-muted-foreground mt-1">High demand • Good growth</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommended Colleges */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Top Colleges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.recommendations.colleges.map((college, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium text-sm">{college}</div>
                    <div className="text-xs text-muted-foreground mt-1">Government • Affordable</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-between" onClick={() => router.push("/colleges")}>
                  Explore Colleges
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between bg-transparent"
                  onClick={() => router.push("/career-mapping")}
                >
                  View Career Map
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button variant="outline" className="w-full justify-between bg-transparent" onClick={onRetake}>
                  Retake Quiz
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Build a roadmap based on class/stream and top aptitude category
function buildRoadmap(args: { studentClass: "10" | "12"; stream: "science" | "commerce" | "arts" | null; topCategory: string }) {
  const { studentClass, stream, topCategory } = args

  // Normalize to broader paths for guidance
  const path = normalizePath(stream, topCategory)

  if (studentClass === "10") {
    return roadmapForTenth(path)
  }

  return roadmapForTwelfth(path)
}

function normalizePath(stream: "science" | "commerce" | "arts" | null, topCategory: string): "science" | "commerce" | "arts" | "technical" | "medical" | "creative" | "humanities" {
  if (stream) return stream
  if (["technical"].includes(topCategory)) return "technical"
  if (["medical"].includes(topCategory)) return "medical"
  if (["commerce"].includes(topCategory)) return "commerce"
  if (["creative"].includes(topCategory)) return "creative"
  return "humanities"
}

function roadmapForTenth(path: ReturnType<typeof normalizePath>) {
  const baseSteps = [
    {
      title: "Choose your 11th–12th stream",
      details:
        "Based on your interests, pick a stream you will enjoy studying for two years. This sets a strong base for after-12th choices.",
      items: [
        "Science: PCM (Math) for engineering/tech; PCB (Biology) for medical/health",
        "Commerce: Accounts, Business, Economics for finance/management",
        "Arts/Humanities: Psychology, Political Science, Languages for public service, media, research",
      ],
    },
  ]

  const after12 = roadmapAfter12(path)

  return [
    ...baseSteps,
    {
      title: "Build habits and skills during 10th–12th",
      details: "Focus on foundations that help in any path.",
      items: [
        "Conceptual understanding over rote learning",
        "Reading/writing practice and basic presentation skills",
        "Logical reasoning and basic data literacy",
        "Participate in clubs: coding/robotics, commerce/finance, debate/media as per interest",
      ],
    },
    ...after12,
  ]
}

function roadmapForTwelfth(path: ReturnType<typeof normalizePath>) {
  const steps = roadmapAfter12(path)
  return [
    {
      title: "Complete 12th with strong fundamentals",
      details: "Revise NCERTs/notes thoroughly, practice sample papers, and keep a balanced routine.",
    },
    ...steps,
  ]
}

function roadmapAfter12(path: ReturnType<typeof normalizePath>) {
  switch (path) {
    case "technical":
    case "science":
      return [
        {
          title: "After 12th: Pick your course direction",
          details: "Choose a program that matches your interest in technology and problem-solving.",
          items: [
            "B.Tech/BE (CSE, ECE, Mechanical, Civil, etc.)",
            "B.Sc. (Computer Science/IT/Data Science)",
            "Diploma/Polytechnic if you prefer applied learning",
          ],
        },
        {
          title: "Entrance exams (examples)",
          details: "Attempt exams as per your chosen course and state.",
          items: [
            "Engineering: JEE Main (NTA) → JEE Advanced (IITs), State exams (e.g., MHT-CET, WBJEE)",
            "General/University: CUET-UG for central universities",
          ],
        },
        {
          title: "Possible colleges",
          details: "Aim for public/government colleges first for value.",
          items: ["IITs, NITs, IIITs", "State Govt. Engineering Colleges/Technological Universities", "Central/State Universities offering B.Sc./BCA"],
        },
        {
          title: "Career opportunities after degree",
          details: "Tech roles across industries.",
          items: ["Software Developer, Data Analyst/Scientist", "Electronics/Embedded Engineer", "Civil/Mechanical Design/Project roles"],
        },
        {
          title: "Skills to build",
          details: "Develop a strong portfolio while studying.",
          items: [
            "Programming fundamentals (Python/JavaScript), DSA basics",
            "Tools: Git/GitHub, simple cloud deployment",
            "Projects: 2–3 real-world apps; internships/tech clubs",
          ],
        },
      ]

    case "medical":
      return [
        {
          title: "After 12th: Pick your course direction",
          details: "Choose from medicine and allied health based on interest.",
          items: ["MBBS/BDS", "BPT (Physiotherapy)/B.Sc. Nursing/Paramedical", "Pharmacy (B.Pharma)"]
        },
        {
          title: "Entrance exams (examples)",
          details: "Core medical entrances.",
          items: ["NEET-UG for MBBS/BDS and many allied courses", "State/college-level for Nursing/Paramedical where applicable"],
        },
        {
          title: "Possible colleges",
          details: "Prefer government institutions for quality and affordability.",
          items: ["AIIMS, JIPMER, Government Medical Colleges", "State Govt. nursing/paramedical colleges"],
        },
        {
          title: "Career opportunities after degree",
          details: "Health sector roles.",
          items: ["Doctor/Resident (post-MBBS)", "Dentist/Physiotherapist/Nurse", "Healthcare administration, public health"],
        },
        {
          title: "Skills to build",
          details: "Blend science knowledge with people skills.",
          items: ["Biology foundations, clinical etiquette", "Communication, empathy, documentation", "First aid, hygiene, community work"],
        },
      ]

    case "commerce":
      return [
        {
          title: "After 12th: Pick your course direction",
          details: "Choose a commerce/business program.",
          items: ["B.Com/B.Com (H)/BBA/BMS", "BA Economics", "Professional tracks: CA/CS/CMA (with graduation)"]
        },
        {
          title: "Entrance exams (examples)",
          details: "Depending on university and program.",
          items: ["CUET-UG (central universities)", "University-specific tests/interviews", "CA/CS/CMA foundation for professional paths"],
        },
        {
          title: "Possible colleges",
          details: "Target public institutes first.",
          items: ["Delhi University colleges (SRCC, Hindu, etc.)", "State govt. commerce colleges", "Central/State universities"],
        },
        {
          title: "Career opportunities after degree",
          details: "Business and finance roles.",
          items: ["Financial Analyst/Accountant", "Marketing/Operations/HR roles", "Business/Data Analyst (with analytics focus)"],
        },
        {
          title: "Skills to build",
          details: "Practical business toolkit.",
          items: ["Excel/spreadsheets, basic analytics/BI", "Communication, presentations, case study practice", "Clubs/internships, small business projects"],
        },
      ]

    case "creative":
      return [
        {
          title: "After 12th: Pick your course direction",
          details: "Choose a creative/design/media track.",
          items: ["B.Des/BFA/Communication Design", "Media studies/Journalism", "Short-term design/media diplomas"],
        },
        {
          title: "Entrance exams (examples)",
          details: "Some institutes conduct aptitude/portfolio tests.",
          items: ["NID/NIFT/UCEED (for design)", "University media/journalism tests/interviews"],
        },
        {
          title: "Possible colleges",
          details: "Look for public options first.",
          items: ["NID/NIFT, IITs (Design)", "Government media institutes", "State art colleges"],
        },
        {
          title: "Career opportunities after degree",
          details: "Creative professions.",
          items: ["Designer (UI/UX/Graphic)", "Content/Journalism/Production", "Advertising/Branding roles"],
        },
        {
          title: "Skills to build",
          details: "Create and showcase work.",
          items: ["Portfolio on Behance/GitHub-like repos for design", "Tools: Figma/Adobe suite; storytelling", "Freelance projects, college fests"],
        },
      ]

    case "humanities":
    default:
      return [
        {
          title: "After 12th: Pick your course direction",
          details: "Choose subjects that deepen your understanding of people and society.",
          items: ["BA (Psychology/Political Science/English/History)", "BA Social Work/Public Administration", "BA Economics (policy-leaning)"]
        },
        {
          title: "Entrance exams (examples)",
          details: "University-level selections.",
          items: ["CUET-UG (central universities)", "University/college-specific tests/interviews"],
        },
        {
          title: "Possible colleges",
          details: "Prefer reputed public universities.",
          items: ["JNU/DU/BHU and state universities", "Government colleges in your state"],
        },
        {
          title: "Career opportunities after degree",
          details: "Wide set of roles.",
          items: ["Civil services/Administration (with prep)", "Policy/NGO/Education/HR", "Media/Communication"],
        },
        {
          title: "Skills to build",
          details: "Practical communication and research skills.",
          items: ["Writing/research, presentations", "Spoken communication, event organization", "Volunteer work, internships"],
        },
      ]
  }
}
