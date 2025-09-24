"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Brain,
  MapPin,
  MessageCircle,
  TrendingUp,
  Calendar,
  Award,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"

export function StudentDashboard() {
  const { user } = useUser()
  const router = useRouter()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate progress loading
    const timer = setTimeout(() => setProgress(33), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleStartQuiz = () => {
    router.push("/quiz")
  }

  const handleExploreColleges = () => {
    router.push("/colleges")
  }

  const handleCareerMapping = () => {
    router.push("/career-mapping")
  }

  const handleChatbot = () => {
    router.push("/chatbot")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="container mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Continue your journey to finding the perfect career path</p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Progress
            </CardTitle>
            <CardDescription>Complete these steps to get personalized recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Aptitude Test</div>
                    <div className="text-xs text-muted-foreground">Not started</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">College Exploration</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Career Planning</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Start with these essential steps for your career journey</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-20 flex-col gap-2" onClick={handleStartQuiz}>
                  <Brain className="h-6 w-6" />
                  Take Aptitude Quiz
                </Button>

                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 bg-transparent"
                  onClick={handleExploreColleges}
                >
                  <MapPin className="h-6 w-6" />
                  Explore Colleges
                </Button>

                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" onClick={handleCareerMapping}>
                  <TrendingUp className="h-6 w-6" />
                  Career Mapping
                </Button>

                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" onClick={handleChatbot}>
                  <MessageCircle className="h-6 w-6" />
                  AI Counselor
                </Button>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>
                  Based on your profile: {user?.class} {user?.stream} student from {user?.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">Engineering Colleges in Delhi</h4>
                      <Badge variant="secondary">Recommended</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Based on your Science stream, explore top engineering colleges near you
                    </p>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">JEE Main Preparation</h4>
                      <Badge variant="secondary">Trending</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get guidance on entrance exam preparation and important dates
                    </p>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm">Profile Completion</span>
                  </div>
                  <span className="text-sm font-medium">65%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm">Colleges Explored</span>
                  </div>
                  <span className="text-sm font-medium">0</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">Peer Connections</span>
                  </div>
                  <span className="text-sm font-medium">12</span>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                  <div>
                    <div className="text-sm font-medium">JEE Main Registration</div>
                    <div className="text-xs text-muted-foreground">Ends in 15 days</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                  <div>
                    <div className="text-sm font-medium">NEET Application</div>
                    <div className="text-xs text-muted-foreground">Ends in 25 days</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <div className="text-sm font-medium">DU Admission</div>
                    <div className="text-xs text-muted-foreground">Opens in 45 days</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <div className="text-sm">Profile created</div>
                    <div className="text-xs text-muted-foreground">2 hours ago</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <div className="text-sm">Joined CareerPath</div>
                    <div className="text-xs text-muted-foreground">Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
