"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, DollarSign, Users, Clock, ArrowRight, BookOpen, Briefcase, Star } from "lucide-react"

const careerPaths = {
  "B.Tech Computer Science": {
    duration: "4 years",
    description: "Comprehensive program covering programming, algorithms, and system design",
    careers: [
      {
        title: "Software Engineer",
        salary: "₹8-25 LPA",
        demand: "Very High",
        growth: "15% annually",
        skills: ["Programming", "Problem Solving", "System Design"],
        companies: ["Google", "Microsoft", "Amazon", "Flipkart"],
      },
      {
        title: "Data Scientist",
        salary: "₹12-40 LPA",
        demand: "High",
        growth: "22% annually",
        skills: ["Python", "Machine Learning", "Statistics"],
        companies: ["Netflix", "Uber", "Zomato", "PayTM"],
      },
      {
        title: "Product Manager",
        salary: "₹15-50 LPA",
        demand: "High",
        growth: "19% annually",
        skills: ["Strategy", "Analytics", "Communication"],
        companies: ["Meta", "Google", "Swiggy", "BYJU'S"],
      },
    ],
  },
  "B.Com": {
    duration: "3 years",
    description: "Foundation in commerce, accounting, and business principles",
    careers: [
      {
        title: "Chartered Accountant",
        salary: "₹6-20 LPA",
        demand: "High",
        growth: "8% annually",
        skills: ["Accounting", "Taxation", "Auditing"],
        companies: ["Big 4 Firms", "Banks", "Corporations"],
      },
      {
        title: "Financial Analyst",
        salary: "₹5-15 LPA",
        demand: "Medium",
        growth: "10% annually",
        skills: ["Financial Modeling", "Excel", "Analysis"],
        companies: ["Investment Banks", "Mutual Funds", "Consulting"],
      },
      {
        title: "Business Analyst",
        salary: "₹7-18 LPA",
        demand: "High",
        growth: "14% annually",
        skills: ["Analytics", "Process Improvement", "Communication"],
        companies: ["Accenture", "TCS", "Deloitte", "PwC"],
      },
    ],
  },
  MBBS: {
    duration: "5.5 years",
    description: "Medical degree for becoming a practicing doctor",
    careers: [
      {
        title: "General Physician",
        salary: "₹8-25 LPA",
        demand: "Very High",
        growth: "7% annually",
        skills: ["Diagnosis", "Patient Care", "Medical Knowledge"],
        companies: ["Hospitals", "Clinics", "Private Practice"],
      },
      {
        title: "Specialist Doctor",
        salary: "₹15-50 LPA",
        demand: "Very High",
        growth: "9% annually",
        skills: ["Specialization", "Surgery", "Research"],
        companies: ["AIIMS", "Apollo", "Fortis", "Max Healthcare"],
      },
      {
        title: "Medical Researcher",
        salary: "₹10-30 LPA",
        demand: "Medium",
        growth: "12% annually",
        skills: ["Research", "Data Analysis", "Publication"],
        companies: ["Pharma Companies", "Research Institutes", "Universities"],
      },
    ],
  },
  "B.A. English": {
    duration: "3 years",
    description: "Literature, language, and communication skills development",
    careers: [
      {
        title: "Content Writer",
        salary: "₹3-12 LPA",
        demand: "High",
        growth: "13% annually",
        skills: ["Writing", "SEO", "Content Strategy"],
        companies: ["Media Houses", "Digital Agencies", "Startups"],
      },
      {
        title: "Civil Services Officer",
        salary: "₹7-15 LPA",
        demand: "Medium",
        growth: "5% annually",
        skills: ["Administration", "Policy", "Leadership"],
        companies: ["Government", "Public Sector", "Administrative Services"],
      },
      {
        title: "Journalist",
        salary: "₹4-15 LPA",
        demand: "Medium",
        growth: "6% annually",
        skills: ["Reporting", "Investigation", "Communication"],
        companies: ["News Channels", "Newspapers", "Digital Media"],
      },
    ],
  },
}

const successStories = [
  {
    name: "Rahul Sharma",
    course: "B.Tech Computer Science",
    college: "IIT Delhi",
    currentRole: "Senior Software Engineer at Google",
    salary: "₹45 LPA",
    story:
      "Started from a government college, now leading AI projects at Google. The structured curriculum and strong fundamentals helped me crack top tech interviews.",
  },
  {
    name: "Priya Patel",
    course: "B.Com",
    college: "Delhi School of Economics",
    currentRole: "Investment Banking Analyst",
    salary: "₹28 LPA",
    story:
      "Government college education gave me the perfect foundation. The affordable fees allowed me to focus on studies and internships without financial stress.",
  },
  {
    name: "Dr. Amit Kumar",
    course: "MBBS",
    college: "AIIMS Delhi",
    currentRole: "Cardiologist",
    salary: "₹60 LPA",
    story:
      "AIIMS provided world-class medical education at minimal cost. Now I'm serving patients while also conducting research in cardiac surgery.",
  },
]

export function CareerMapping() {
  const [selectedCourse, setSelectedCourse] = useState("B.Tech Computer Science")
  const [selectedCareer, setSelectedCareer] = useState<any>(null)

  const currentPath = careerPaths[selectedCourse as keyof typeof careerPaths]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto p-6">
        <BackButton className="mb-6" />
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Course-to-Career Mapping</h1>
          <p className="text-muted-foreground">Explore how different courses lead to specific career opportunities</p>
        </div>

        <Tabs defaultValue="mapping" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mapping">Career Pathways</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
          </TabsList>

          <TabsContent value="mapping" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Course Selection */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Select Course</CardTitle>
                  <CardDescription>Choose a course to explore career paths</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.keys(careerPaths).map((course) => (
                    <Button
                      key={course}
                      variant={selectedCourse === course ? "default" : "outline"}
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => {
                        setSelectedCourse(course)
                        setSelectedCareer(null)
                      }}
                    >
                      <div>
                        <div className="font-medium text-sm">{course}</div>
                        <div className="text-xs text-muted-foreground">
                          {careerPaths[course as keyof typeof careerPaths].duration}
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Course Overview */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {selectedCourse}
                  </CardTitle>
                  <CardDescription>{currentPath.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-medium">{currentPath.duration}</div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Briefcase className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-medium">{currentPath.careers.length}</div>
                      <div className="text-sm text-muted-foreground">Career Options</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-medium">High</div>
                      <div className="text-sm text-muted-foreground">Job Demand</div>
                    </div>
                  </div>

                  {/* Career Options */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Career Opportunities</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentPath.careers.map((career, index) => (
                        <Card
                          key={index}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedCareer?.title === career.title ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => setSelectedCareer(career)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-sm">{career.title}</h5>
                              <Badge variant="secondary" className="text-xs">
                                {career.demand}
                              </Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-3 w-3 text-green-600" />
                                <span>{career.salary}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-3 w-3 text-blue-600" />
                                <span>{career.growth}</span>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" className="w-full mt-3 text-xs">
                              View Details <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Career Details */}
            {selectedCareer && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    {selectedCareer.title} - Detailed Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Key Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm">Salary Range</span>
                          <Badge variant="outline">{selectedCareer.salary}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm">Market Demand</span>
                          <Badge variant="outline">{selectedCareer.demand}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm">Growth Rate</span>
                          <Badge variant="outline">{selectedCareer.growth}</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Required Skills</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedCareer.skills.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <h4 className="font-medium mb-3">Top Companies</h4>
                      <div className="space-y-2">
                        {selectedCareer.companies.map((company: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Star className="h-3 w-3 text-yellow-500" />
                            {company}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {successStories.map((story, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{story.name}</CardTitle>
                        <CardDescription>{story.currentRole}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Course:</span>
                        <Badge variant="outline">{story.course}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>College:</span>
                        <span className="font-medium">{story.college}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Current Salary:</span>
                        <Badge className="bg-green-100 text-green-800">{story.salary}</Badge>
                      </div>
                      <div className="pt-3 border-t">
                        <p className="text-sm text-muted-foreground italic">"{story.story}"</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
