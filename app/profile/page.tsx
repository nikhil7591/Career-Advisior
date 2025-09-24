"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useUser } from "@/contexts/user-context"
import { useNotifications } from "@/contexts/notification-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { MotionWrapper, Card3D } from "@/components/ui/motion-wrapper"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, GraduationCap, BookOpen, Target, Award, Save, Upload, Edit3, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  location: string
  type: "student" | "parent"
  avatar?: string

  // Academic Information
  currentClass?: string
  school?: string
  board?: string
  subjects?: string[]

  // Career Preferences
  careerInterests?: string[]
  preferredStreams?: string[]
  targetColleges?: string[]

  // Additional Info
  bio?: string
  achievements?: string[]
  extracurriculars?: string[]
}

const CAREER_INTERESTS = [
  "Engineering",
  "Medicine",
  "Law",
  "Business",
  "Arts",
  "Science",
  "Technology",
  "Design",
  "Teaching",
  "Research",
  "Sports",
  "Music",
]

const STREAMS = ["Science (PCM)", "Science (PCB)", "Commerce", "Arts/Humanities", "Vocational"]

const CLASSES = ["9th", "10th", "11th", "12th", "Undergraduate", "Postgraduate"]

const BOARDS = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"]

export default function ProfilePage() {
  const { user: currentUser, updateUser } = useUser()
  const { addNotification } = useNotifications()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    location: "",
    type: "student",
    bio: "",
    currentClass: "",
    school: "",
    board: "",
    subjects: [],
    careerInterests: [],
    preferredStreams: [],
    targetColleges: [],
    achievements: [],
    extracurriculars: [],
  })

  useEffect(() => {
    if (currentUser) {
      // Load profile from localStorage or set defaults
      const savedProfile = localStorage.getItem(`profile_${currentUser.id}`)
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile))
      } else {
        setProfile((prev) => ({
          ...prev,
          id: currentUser.id,
          name: currentUser.name,
          type: currentUser.type,
          email: currentUser.email || "",
        }))
      }
    }
  }, [currentUser])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem(`profile_${profile.id}`, JSON.stringify(profile))

      // Update current user context
      updateUser({ name: profile.name, email: profile.email })

      // Add success notification
      addNotification({
        type: "success",
        title: "Profile Updated",
        message: "Your profile has been successfully updated.",
        read: false,
      })

      setIsEditing(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const addItem = (field: keyof UserProfile, item: string) => {
    if (item.trim()) {
      const currentArray = (profile[field] as string[]) || []
      if (!currentArray.includes(item.trim())) {
        handleInputChange(field, [...currentArray, item.trim()])
      }
    }
  }

  const removeItem = (field: keyof UserProfile, item: string) => {
    const currentArray = (profile[field] as string[]) || []
    handleInputChange(
      field,
      currentArray.filter((i) => i !== item),
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <DashboardHeader />

        <div className="container py-6">
          <BackButton className="mb-6" />
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">Manage your personal information and preferences</p>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Picture & Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">{getInitials(profile.name)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      disabled={!isEditing}
                      placeholder="City, State"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            {profile.type === "student" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="class">Current Class</Label>
                      <Select
                        value={profile.currentClass}
                        onValueChange={(value) => handleInputChange("currentClass", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {CLASSES.map((cls) => (
                            <SelectItem key={cls} value={cls}>
                              {cls}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="board">Board</Label>
                      <Select
                        value={profile.board}
                        onValueChange={(value) => handleInputChange("board", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select board" />
                        </SelectTrigger>
                        <SelectContent>
                          {BOARDS.map((board) => (
                            <SelectItem key={board} value={board}>
                              {board}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="school">School/Institution</Label>
                      <Input
                        id="school"
                        value={profile.school}
                        onChange={(e) => handleInputChange("school", e.target.value)}
                        disabled={!isEditing}
                        placeholder="Your school name"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Career Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Career Preferences
                </CardTitle>
                <CardDescription>Help us provide better recommendations by sharing your interests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Career Interests</Label>
                  <div className="flex flex-wrap gap-2">
                    {CAREER_INTERESTS.map((interest) => (
                      <Badge
                        key={interest}
                        variant={profile.careerInterests?.includes(interest) ? "default" : "outline"}
                        className={`cursor-pointer ${isEditing ? "hover:bg-primary/80" : ""}`}
                        onClick={() => {
                          if (isEditing) {
                            if (profile.careerInterests?.includes(interest)) {
                              removeItem("careerInterests", interest)
                            } else {
                              addItem("careerInterests", interest)
                            }
                          }
                        }}
                      >
                        {interest}
                        {profile.careerInterests?.includes(interest) && <CheckCircle className="h-3 w-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Preferred Streams</Label>
                  <div className="flex flex-wrap gap-2">
                    {STREAMS.map((stream) => (
                      <Badge
                        key={stream}
                        variant={profile.preferredStreams?.includes(stream) ? "default" : "outline"}
                        className={`cursor-pointer ${isEditing ? "hover:bg-primary/80" : ""}`}
                        onClick={() => {
                          if (isEditing) {
                            if (profile.preferredStreams?.includes(stream)) {
                              removeItem("preferredStreams", stream)
                            } else {
                              addItem("preferredStreams", stream)
                            }
                          }
                        }}
                      >
                        {stream}
                        {profile.preferredStreams?.includes(stream) && <CheckCircle className="h-3 w-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements & Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profile.achievements?.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">{achievement}</span>
                        {isEditing && (
                          <Button variant="ghost" size="sm" onClick={() => removeItem("achievements", achievement)}>
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <Input
                        placeholder="Add achievement..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            addItem("achievements", e.currentTarget.value)
                            e.currentTarget.value = ""
                          }
                        }}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Extracurriculars
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profile.extracurriculars?.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">{activity}</span>
                        {isEditing && (
                          <Button variant="ghost" size="sm" onClick={() => removeItem("extracurriculars", activity)}>
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <Input
                        placeholder="Add activity..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            addItem("extracurriculars", e.currentTarget.value)
                            e.currentTarget.value = ""
                          }
                        }}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
