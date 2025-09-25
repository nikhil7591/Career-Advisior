"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotifications } from "@/contexts/notification-context"
import { 
  Calendar, 
  Clock, 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  BookOpen, 
  GraduationCap,
  DollarSign,
  FileText,
  MapPin
} from "lucide-react"
import { format, isAfter, isBefore, addDays, differenceInDays } from "date-fns"

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: Date
  endDate?: Date
  type: "admission" | "exam" | "scholarship" | "counseling" | "result"
  priority: "high" | "medium" | "low"
  status: "upcoming" | "ongoing" | "completed" | "missed"
  college?: string
  location?: string
  eligibility?: string[]
  documents?: string[]
  fees?: string
  website?: string
  reminderSet?: boolean
}

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: "1",
    title: "DU Admission Registration Opens",
    description: "Delhi University undergraduate admission registration begins",
    date: new Date(2024, 4, 15), // May 15, 2024
    endDate: new Date(2024, 5, 15), // June 15, 2024
    type: "admission",
    priority: "high",
    status: "upcoming",
    college: "Delhi University",
    location: "Delhi",
    eligibility: ["12th Pass", "Minimum 60% marks"],
    documents: ["12th Marksheet", "Aadhar Card", "Passport Photo"],
    fees: "₹250",
    website: "du.ac.in"
  },
  {
    id: "2",
    title: "JEE Main 2024 Session 2",
    description: "Joint Entrance Examination Main second session",
    date: new Date(2024, 3, 8), // April 8, 2024
    endDate: new Date(2024, 3, 15), // April 15, 2024
    type: "exam",
    priority: "high",
    status: "upcoming",
    eligibility: ["12th Science Stream", "Physics, Chemistry, Maths"],
    documents: ["Admit Card", "Photo ID", "12th Certificate"],
    fees: "₹650",
    website: "jeemain.nta.nic.in"
  },
  {
    id: "3",
    title: "National Scholarship Portal",
    description: "Pre-matric and post-matric scholarship applications",
    date: new Date(2024, 6, 1), // July 1, 2024
    endDate: new Date(2024, 8, 30), // September 30, 2024
    type: "scholarship",
    priority: "medium",
    status: "upcoming",
    eligibility: ["Family income < ₹2.5 LPA", "Government college admission"],
    documents: ["Income Certificate", "Caste Certificate", "Bank Details"],
    website: "scholarships.gov.in"
  },
  {
    id: "4",
    title: "CUET UG Registration",
    description: "Common University Entrance Test for undergraduate programs",
    date: new Date(2024, 2, 15), // March 15, 2024
    endDate: new Date(2024, 3, 30), // April 30, 2024
    type: "exam",
    priority: "high",
    status: "upcoming",
    eligibility: ["12th Pass/Appearing", "Any stream"],
    documents: ["12th Marksheet", "Category Certificate", "Photo"],
    fees: "₹650-₹3000",
    website: "cuet.samarth.ac.in"
  },
  {
    id: "5",
    title: "BHU UET Counseling",
    description: "Banaras Hindu University counseling process",
    date: new Date(2024, 5, 20), // June 20, 2024
    endDate: new Date(2024, 6, 5), // July 5, 2024
    type: "counseling",
    priority: "medium",
    status: "upcoming",
    college: "Banaras Hindu University",
    location: "Varanasi",
    eligibility: ["BHU UET Qualified", "Document verification"],
    documents: ["UET Scorecard", "Original Certificates", "DD for fees"]
  }
]

export function TimelineTracker() {
  const [events, setEvents] = useState<TimelineEvent[]>(mockTimelineEvents)
  const [selectedTab, setSelectedTab] = useState("all")
  const { addNotification } = useNotifications()

  // Update event status based on current date
  useEffect(() => {
    const today = new Date()
    setEvents(prevEvents => 
      prevEvents.map(event => {
        const eventStart = event.date
        const eventEnd = event.endDate || event.date
        
        let status: TimelineEvent['status']
        if (isBefore(today, eventStart)) {
          status = "upcoming"
        } else if (isAfter(today, eventStart) && isBefore(today, eventEnd)) {
          status = "ongoing"
        } else if (isAfter(today, eventEnd)) {
          status = "missed"
        } else {
          status = event.status
        }
        
        return { ...event, status }
      })
    )
  }, [])

  const filteredEvents = events.filter(event => {
    if (selectedTab === "all") return true
    if (selectedTab === "upcoming") return event.status === "upcoming"
    if (selectedTab === "ongoing") return event.status === "ongoing"
    if (selectedTab === "admissions") return event.type === "admission"
    if (selectedTab === "exams") return event.type === "exam"
    if (selectedTab === "scholarships") return event.type === "scholarship"
    return true
  })

  const setReminder = (eventId: string) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, reminderSet: true }
          : event
      )
    )
    
    addNotification({
      type: "success",
      title: "Reminder Set!",
      message: "You'll be notified 3 days before this deadline.",
      read: false
    })
  }

  const getStatusIcon = (status: TimelineEvent['status']) => {
    switch (status) {
      case "upcoming": return <Clock className="h-4 w-4 text-blue-500" />
      case "ongoing": return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "missed": return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getTypeIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case "admission": return <GraduationCap className="h-4 w-4" />
      case "exam": return <FileText className="h-4 w-4" />
      case "scholarship": return <DollarSign className="h-4 w-4" />
      case "counseling": return <BookOpen className="h-4 w-4" />
      case "result": return <CheckCircle className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: TimelineEvent['priority']) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getDaysUntil = (date: Date) => {
    const today = new Date()
    const days = differenceInDays(date, today)
    if (days < 0) return `${Math.abs(days)} days ago`
    if (days === 0) return "Today"
    if (days === 1) return "Tomorrow"
    return `${days} days left`
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto p-6">
        <BackButton className="mb-6" />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Timeline Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Never miss important admission dates, exam schedules, and scholarship deadlines
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
            <TabsTrigger value="exams">Exams</TabsTrigger>
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            {filteredEvents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No events found</h3>
                  <p className="text-muted-foreground">
                    {selectedTab === "all" 
                      ? "No timeline events available" 
                      : `No ${selectedTab} events found`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {getTypeIcon(event.type)}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {event.description}
                          </CardDescription>
                          {event.college && (
                            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {event.college}
                              {event.location && `, ${event.location}`}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(event.status)}
                        <Badge className={getPriorityColor(event.priority)}>
                          {event.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Timeline</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>Starts: {format(event.date, "MMM dd, yyyy")}</span>
                          </div>
                          {event.endDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              <span>Ends: {format(event.endDate, "MMM dd, yyyy")}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium">{getDaysUntil(event.date)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {event.eligibility && (
                        <div>
                          <h4 className="font-medium mb-2">Eligibility</h4>
                          <ul className="text-sm space-y-1">
                            {event.eligibility.map((criteria, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {criteria}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {event.documents && (
                      <div>
                        <h4 className="font-medium mb-2">Required Documents</h4>
                        <div className="flex flex-wrap gap-2">
                          {event.documents.map((doc, index) => (
                            <Badge key={index} variant="outline">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm">
                        {event.fees && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            Fees: {event.fees}
                          </span>
                        )}
                        {event.website && (
                          <a 
                            href={`https://${event.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Visit Website
                          </a>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        variant={event.reminderSet ? "secondary" : "outline"}
                        onClick={() => setReminder(event.id)}
                        disabled={event.reminderSet || event.status === "missed"}
                        className="flex items-center gap-2"
                      >
                        <Bell className="h-3 w-3" />
                        {event.reminderSet ? "Reminder Set" : "Set Reminder"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
