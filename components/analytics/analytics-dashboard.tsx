"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  GraduationCap, 
  Target, 
  Award,
  Calendar,
  BookOpen,
  MessageCircle,
  MapPin,
  Download,
  Eye
} from "lucide-react"

interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  quizCompletions: number
  collegeViews: number
  successfulAdmissions: number
  avgQuizScore: number
  popularCourses: { name: string; count: number }[]
  userGrowth: { month: string; users: number }[]
  featureUsage: { feature: string; usage: number; icon: any }[]
  geographicData: { state: string; users: number }[]
}

const mockAnalyticsData: AnalyticsData = {
  totalUsers: 45230,
  activeUsers: 12450,
  quizCompletions: 28900,
  collegeViews: 156780,
  successfulAdmissions: 8920,
  avgQuizScore: 78.5,
  popularCourses: [
    { name: "B.Tech Computer Science", count: 8900 },
    { name: "B.Com", count: 6750 },
    { name: "B.A. English", count: 5420 },
    { name: "B.Sc. Physics", count: 4230 },
    { name: "BBA", count: 3890 }
  ],
  userGrowth: [
    { month: "Jan", users: 5200 },
    { month: "Feb", users: 7800 },
    { month: "Mar", users: 12100 },
    { month: "Apr", users: 18900 },
    { month: "May", users: 28400 },
    { month: "Jun", users: 35600 },
    { month: "Jul", users: 45230 }
  ],
  featureUsage: [
    { feature: "Aptitude Quiz", usage: 89, icon: Target },
    { feature: "College Directory", usage: 76, icon: GraduationCap },
    { feature: "Timeline Tracker", usage: 68, icon: Calendar },
    { feature: "Study Materials", usage: 54, icon: BookOpen },
    { feature: "AI Chatbot", usage: 45, icon: MessageCircle },
    { feature: "Career Mapping", usage: 38, icon: TrendingUp }
  ],
  geographicData: [
    { state: "Uttar Pradesh", users: 8900 },
    { state: "Maharashtra", users: 7650 },
    { state: "Bihar", users: 6420 },
    { state: "West Bengal", users: 5230 },
    { state: "Rajasthan", users: 4890 },
    { state: "Delhi", users: 4560 },
    { state: "Gujarat", users: 3890 },
    { state: "Others", users: 3690 }
  ]
}

export function AnalyticsDashboard() {
  const [data] = useState<AnalyticsData>(mockAnalyticsData)
  const [selectedPeriod, setSelectedPeriod] = useState("7d")

  const getSuccessRate = () => {
    return ((data.successfulAdmissions / data.quizCompletions) * 100).toFixed(1)
  }

  const getEngagementRate = () => {
    return ((data.activeUsers / data.totalUsers) * 100).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto p-6">
        <BackButton className="mb-6" />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time insights into platform usage and student success metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz Completions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.quizCompletions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.2%</span> completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getSuccessRate()}%</div>
              <p className="text-xs text-muted-foreground">
                Students who got college admission
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getEngagementRate()}%</div>
              <p className="text-xs text-muted-foreground">
                Active users in last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Feature Usage</TabsTrigger>
            <TabsTrigger value="geography">Geographic Data</TabsTrigger>
            <TabsTrigger value="courses">Popular Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth Trend</CardTitle>
                  <CardDescription>Monthly user registration growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.userGrowth.map((month, index) => (
                      <div key={month.month} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{month.month} 2024</span>
                        <div className="flex items-center gap-3 flex-1 ml-4">
                          <Progress 
                            value={(month.users / data.totalUsers) * 100} 
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground w-16 text-right">
                            {month.users.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Impact</CardTitle>
                  <CardDescription>Key success metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">College Views</span>
                    </div>
                    <span className="font-semibold">{data.collegeViews.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Successful Admissions</span>
                    </div>
                    <span className="font-semibold">{data.successfulAdmissions.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Average Quiz Score</span>
                    </div>
                    <span className="font-semibold">{data.avgQuizScore}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Active Users</span>
                    </div>
                    <span className="font-semibold">{data.activeUsers.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage Statistics</CardTitle>
                <CardDescription>How students are using different platform features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.featureUsage.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <div key={feature.feature} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="font-medium">{feature.feature}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-1 ml-4">
                          <Progress value={feature.usage} className="flex-1" />
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {feature.usage}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geography" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>User distribution across Indian states</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.geographicData.map((state, index) => (
                    <div key={state.state} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{state.state}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-1 ml-4">
                        <Progress 
                          value={(state.users / data.totalUsers) * 100} 
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground w-16 text-right">
                          {state.users.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Courses</CardTitle>
                <CardDescription>Courses with highest student interest</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.popularCourses.map((course, index) => (
                    <div key={course.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{course.name}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-1 ml-4">
                        <Progress 
                          value={(course.count / data.popularCourses[0].count) * 100} 
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground w-16 text-right">
                          {course.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
