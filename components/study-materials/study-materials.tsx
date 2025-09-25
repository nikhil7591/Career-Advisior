"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BookOpen, 
  Download, 
  Search, 
  Filter, 
  Star, 
  Eye, 
  FileText, 
  Video, 
  Headphones,
  ExternalLink,
  Clock,
  Users,
  Award
} from "lucide-react"

interface StudyMaterial {
  id: string
  title: string
  description: string
  type: "ebook" | "video" | "audio" | "pdf" | "quiz" | "notes"
  subject: string
  level: "beginner" | "intermediate" | "advanced"
  duration?: string
  pages?: number
  rating: number
  downloads: number
  views: number
  author: string
  publishDate: string
  tags: string[]
  url: string
  thumbnail: string
  size?: string
  language: "english" | "hindi" | "both"
  free: boolean
}

const mockStudyMaterials: StudyMaterial[] = [
  {
    id: "1",
    title: "Complete Guide to JEE Main Mathematics",
    description: "Comprehensive mathematics preparation guide covering all JEE Main topics with solved examples and practice questions.",
    type: "ebook",
    subject: "Mathematics",
    level: "intermediate",
    pages: 450,
    rating: 4.8,
    downloads: 15420,
    views: 28500,
    author: "Dr. Rajesh Kumar",
    publishDate: "2024-01-15",
    tags: ["JEE Main", "Mathematics", "Engineering", "Problem Solving"],
    url: "/materials/jee-math-guide.pdf",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop",
    size: "12.5 MB",
    language: "english",
    free: true
  },
  {
    id: "2",
    title: "CUET English Language Mastery",
    description: "Master English for CUET with comprehensive grammar, vocabulary, and comprehension practice materials.",
    type: "video",
    subject: "English",
    level: "beginner",
    duration: "8 hours",
    rating: 4.6,
    downloads: 8900,
    views: 45200,
    author: "Prof. Meera Sharma",
    publishDate: "2024-02-10",
    tags: ["CUET", "English", "Grammar", "Vocabulary"],
    url: "/materials/cuet-english-course",
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
    language: "both",
    free: true
  },
  {
    id: "3",
    title: "Physics Concepts for Class 12",
    description: "Interactive audio lessons covering all Class 12 Physics concepts with real-world applications.",
    type: "audio",
    subject: "Physics",
    level: "intermediate",
    duration: "12 hours",
    rating: 4.7,
    downloads: 6750,
    views: 18900,
    author: "Dr. Amit Singh",
    publishDate: "2024-01-28",
    tags: ["Class 12", "Physics", "Concepts", "Board Exam"],
    url: "/materials/physics-audio-series",
    thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=300&h=200&fit=crop",
    language: "hindi",
    free: true
  },
  {
    id: "4",
    title: "Commerce Stream Career Guide",
    description: "Complete career guidance for commerce students including course options, entrance exams, and job prospects.",
    type: "pdf",
    subject: "Career Guidance",
    level: "beginner",
    pages: 85,
    rating: 4.9,
    downloads: 12300,
    views: 22100,
    author: "Career Counseling Team",
    publishDate: "2024-03-05",
    tags: ["Commerce", "Career", "Guidance", "Courses"],
    url: "/materials/commerce-career-guide.pdf",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop",
    size: "5.2 MB",
    language: "both",
    free: true
  },
  {
    id: "5",
    title: "Government College Admission Quiz",
    description: "Interactive quiz to test your knowledge about government college admission processes and requirements.",
    type: "quiz",
    subject: "Admission Process",
    level: "beginner",
    duration: "30 minutes",
    rating: 4.5,
    downloads: 9800,
    views: 15600,
    author: "Admission Experts",
    publishDate: "2024-02-20",
    tags: ["Government Colleges", "Admission", "Quiz", "Test"],
    url: "/materials/admission-quiz",
    thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&h=200&fit=crop",
    language: "english",
    free: true
  },
  {
    id: "6",
    title: "Arts Stream Study Notes",
    description: "Comprehensive study notes for Arts stream subjects including History, Political Science, and Economics.",
    type: "notes",
    subject: "Arts",
    level: "intermediate",
    pages: 320,
    rating: 4.4,
    downloads: 7200,
    views: 13800,
    author: "Arts Faculty Team",
    publishDate: "2024-01-12",
    tags: ["Arts", "History", "Political Science", "Economics"],
    url: "/materials/arts-study-notes.pdf",
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
    size: "8.7 MB",
    language: "english",
    free: true
  }
]

export function StudyMaterials() {
  const [materials, setMaterials] = useState<StudyMaterial[]>(mockStudyMaterials)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = 
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesSubject = selectedSubject === "all" || material.subject === selectedSubject
    const matchesType = selectedType === "all" || material.type === selectedType
    const matchesLevel = selectedLevel === "all" || material.level === selectedLevel
    const matchesLanguage = selectedLanguage === "all" || 
      material.language === selectedLanguage || 
      material.language === "both"

    return matchesSearch && matchesSubject && matchesType && matchesLevel && matchesLanguage
  })

  const subjects = [...new Set(materials.map(m => m.subject))]
  const types = [...new Set(materials.map(m => m.type))]

  const getTypeIcon = (type: StudyMaterial['type']) => {
    switch (type) {
      case "ebook": return <BookOpen className="h-4 w-4" />
      case "video": return <Video className="h-4 w-4" />
      case "audio": return <Headphones className="h-4 w-4" />
      case "pdf": return <FileText className="h-4 w-4" />
      case "quiz": return <Award className="h-4 w-4" />
      case "notes": return <FileText className="h-4 w-4" />
    }
  }

  const getLevelColor = (level: StudyMaterial['level']) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800"
      case "intermediate": return "bg-yellow-100 text-yellow-800"
      case "advanced": return "bg-red-100 text-red-800"
    }
  }

  const getLanguageBadge = (language: StudyMaterial['language']) => {
    switch (language) {
      case "english": return "EN"
      case "hindi": return "हिं"
      case "both": return "EN/हिं"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto p-6">
        <BackButton className="mb-6" />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Study Materials & E-books
          </h1>
          <p className="text-muted-foreground text-lg">
            Access free study materials, e-books, and resources for your career preparation
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedSubject("all")
                  setSelectedType("all")
                  setSelectedLevel("all")
                  setSelectedLanguage("all")
                }}
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={material.thumbnail}
                  alt={material.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `/placeholder.svg?height=192&width=400&text=${encodeURIComponent(material.type)}`
                  }}
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge className="bg-black/70 text-white">
                    {getLanguageBadge(material.language)}
                  </Badge>
                  {material.free && (
                    <Badge className="bg-green-600">FREE</Badge>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90">
                    {getTypeIcon(material.type)}
                    <span className="ml-1 capitalize">{material.type}</span>
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg line-clamp-2">{material.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {material.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getLevelColor(material.level)}>
                    {material.level}
                  </Badge>
                  <Badge variant="outline">{material.subject}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>By {material.author}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{material.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{material.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{material.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{material.duration || `${material.pages} pages`}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {material.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {material.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{material.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No materials found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
