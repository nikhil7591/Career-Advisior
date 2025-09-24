"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, DollarSign, Calendar, MessageCircle, BookOpen, Award, Target, Clock, CheckCircle } from "lucide-react"
import { useUser } from "@/contexts/user-context"

export function ParentPortal() {
  const { user } = useUser()
  const [selectedTab, setSelectedTab] = useState("overview")

  // Mock child data based on parent
  const childData = {
    name: user?.childName || "Priya Sharma",
    class: "12th",
    stream: "Science",
    progress: 65,
    quizCompleted: false,
    collegesExplored: 3,
    applications: 0,
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Parent Portal</h1>
          <p className="text-muted-foreground">
            Track {childData.name}'s educational journey and participate in important decisions
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Child Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {childData.name}'s Profile
                </CardTitle>
                <CardDescription>Current academic status and progress overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">{childData.class}</div>
                    <div className="text-sm text-muted-foreground">Current Class</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">{childData.stream}</div>
                    <div className="text-sm text-muted-foreground">Stream</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">{childData.progress}%</div>
                    <div className="text-sm text-muted-foreground">Profile Complete</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">{childData.collegesExplored}</div>
                    <div className="text-sm text-muted-foreground">Colleges Explored</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                      <div className="text-sm font-medium">Profile created</div>
                      <div className="text-xs text-muted-foreground">2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-4 w-4 text-blue-500 mt-1" />
                    <div>
                      <div className="text-sm font-medium">Explored IIT Delhi</div>
                      <div className="text-xs text-muted-foreground">1 day ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-4 w-4 text-purple-500 mt-1" />
                    <div>
                      <div className="text-sm font-medium">Joined CareerPath</div>
                      <div className="text-xs text-muted-foreground">2 days ago</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      <div className="text-sm font-medium">Board Exam Registration</div>
                      <div className="text-xs text-muted-foreground">Opens in 30 days</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations for Parents */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations for You</CardTitle>
                <CardDescription>Based on your child's profile and interests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">Government vs Private College Comparison</h4>
                    <Badge variant="secondary">Important</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Understand the cost benefits and quality of education in government colleges
                  </p>
                  <Button size="sm" variant="outline">
                    View Comparison
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">Scholarship Opportunities</h4>
                    <Badge variant="secondary">Financial Aid</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Explore various scholarships available for {childData.stream} stream students
                  </p>
                  <Button size="sm" variant="outline">
                    Explore Scholarships
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Progress Tracking</CardTitle>
                <CardDescription>Monitor your child's educational journey milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">{childData.progress}%</span>
                  </div>
                  <Progress value={childData.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          childData.quizCompleted ? "bg-green-100 text-green-600" : "bg-muted"
                        }`}
                      >
                        <Award className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Aptitude Assessment</div>
                        <div className="text-xs text-muted-foreground">
                          {childData.quizCompleted ? "Completed" : "Pending"}
                        </div>
                      </div>
                    </div>
                    {!childData.quizCompleted && (
                      <p className="text-xs text-muted-foreground">
                        Encourage your child to complete the aptitude test for personalized recommendations.
                      </p>
                    )}
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">College Exploration</div>
                        <div className="text-xs text-muted-foreground">
                          {childData.collegesExplored} colleges viewed
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Great progress! Continue exploring more options together.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Target className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Applications</div>
                        <div className="text-xs text-muted-foreground">{childData.applications} submitted</div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Application season will begin soon. Stay prepared!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Planning</CardTitle>
                <CardDescription>Plan your child's education expenses and explore savings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Government College Benefits</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm">Engineering (4 years)</span>
                        <span className="font-medium text-green-600">₹1-2 Lakhs</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm">Arts/Science (3 years)</span>
                        <span className="font-medium text-green-600">₹15,000-45,000</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm">Medical (5.5 years)</span>
                        <span className="font-medium text-green-600">₹50,000-1.5 Lakhs</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Private College Comparison</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-sm">Engineering (4 years)</span>
                        <span className="font-medium text-red-600">₹8-40 Lakhs</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-sm">Arts/Science (3 years)</span>
                        <span className="font-medium text-red-600">₹1.5-6 Lakhs</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-sm">Medical (5.5 years)</span>
                        <span className="font-medium text-red-600">₹25-1.5 Crores</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="font-medium">Potential Savings</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By choosing government colleges, you can save ₹5-50 lakhs compared to private institutions, while
                    still receiving quality education and excellent career prospects.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Family Communication Hub
                </CardTitle>
                <CardDescription>Collaborate with your child on educational decisions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">Discussion: College Preferences</div>
                      <p className="text-xs text-muted-foreground mb-2">Started by {childData.name} • 2 hours ago</p>
                      <p className="text-sm">
                        "I'm interested in IIT Delhi for Computer Science. Can we discuss the preparation strategy?"
                      </p>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        Join Discussion
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">Shared Goal: JEE Preparation</div>
                      <p className="text-xs text-muted-foreground mb-2">Target: JEE Main 2024 • Progress: 30%</p>
                      <Progress value={30} className="h-2 mb-2" />
                      <Button size="sm" variant="outline">
                        Update Progress
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="h-20 flex-col gap-2">
                    <MessageCircle className="h-6 w-6" />
                    Start New Discussion
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Target className="h-6 w-6" />
                    Set Family Goals
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
