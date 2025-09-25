"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MotionWrapper, Card3D } from "@/components/ui/motion-wrapper"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Search,
  Filter,
  Star,
  Users,
  DollarSign,
  GraduationCap,
  Building,
  Phone,
  Globe,
  Heart,
} from "lucide-react"
import { GoogleMapsWrapper } from "./google-maps-wrapper"

const colleges = [
  {
    id: "du1",
    name: "Delhi University - St. Stephen's College",
    location: "Delhi",
    coordinates: [28.6692, 77.2265] as [number, number],
    courses: ["B.A. Economics", "B.Sc. Physics", "B.A. English", "B.Sc. Mathematics"],
    fees: "₹15,000/year",
    cutoff: "98.5%",
    placement: "95%",
    rating: 4.8,
    type: "Government",
    established: "1881",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&crop=entropy&auto=format",
    description: "One of India's most prestigious colleges, known for academic excellence and vibrant campus life.",
    facilities: ["Library", "Sports Complex", "Hostels", "Cafeteria", "Labs"],
    contact: {
      phone: "+91-11-2766-7441",
      email: "admissions@ststephens.edu",
      website: "www.ststephens.edu",
    },
  },
  {
    id: "iit1",
    name: "IIT Delhi",
    location: "Delhi",
    coordinates: [28.5449, 77.1928] as [number, number],
    courses: ["B.Tech Computer Science", "B.Tech Mechanical", "B.Tech Electrical", "B.Tech Civil"],
    fees: "₹2,50,000/year",
    cutoff: "JEE Advanced Rank < 500",
    placement: "100%",
    rating: 4.9,
    type: "Government",
    established: "1961",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop&crop=entropy&auto=format",
    description: "Premier engineering institute known for cutting-edge research and excellent placement records.",
    facilities: ["Research Labs", "Innovation Hub", "Sports Complex", "Hostels", "Medical Center"],
    contact: {
      phone: "+91-11-2659-1000",
      email: "admissions@iitd.ac.in",
      website: "www.iitd.ac.in",
    },
  },
  {
    id: "jnu1",
    name: "Jawaharlal Nehru University",
    location: "Delhi",
    coordinates: [28.5383, 77.1641] as [number, number],
    courses: ["B.A. International Relations", "B.Sc. Life Sciences", "B.A. Languages", "B.A. History"],
    fees: "₹5,000/year",
    cutoff: "85%",
    placement: "80%",
    rating: 4.6,
    type: "Government",
    established: "1969",
    image: "https://images.unsplash.com/photo-1523050854058-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=entropy&auto=format",
    description: "Renowned for social sciences and liberal arts education with a diverse student community.",
    facilities: ["Central Library", "Cultural Center", "Hostels", "Health Center", "Cafeterias"],
    contact: {
      phone: "+91-11-2670-4000",
      email: "info@jnu.ac.in",
      website: "www.jnu.ac.in",
    },
  },
  {
    id: "bhu1",
    name: "Banaras Hindu University",
    location: "Varanasi",
    coordinates: [25.2677, 82.9913] as [number, number],
    courses: ["B.A. Sanskrit", "B.Sc. Chemistry", "B.Com", "B.Tech Metallurgy"],
    fees: "₹8,000/year",
    cutoff: "80%",
    placement: "75%",
    rating: 4.4,
    type: "Government",
    established: "1916",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=entropy&auto=format",
    description: "Historic university with strong traditions in arts, sciences, and engineering.",
    facilities: ["Museums", "Temple", "Sports Facilities", "Hostels", "Medical College"],
    contact: {
      phone: "+91-542-230-7000",
      email: "registrar@bhu.ac.in",
      website: "www.bhu.ac.in",
    },
  },
  {
    id: "jadavpur1",
    name: "Jadavpur University",
    location: "Kolkata",
    coordinates: [22.4991, 88.3705] as [number, number],
    courses: ["B.E. Computer Science", "B.Sc. Physics", "B.A. English", "B.E. Electronics"],
    fees: "₹12,000/year",
    cutoff: "90%",
    placement: "85%",
    rating: 4.5,
    type: "Government",
    established: "1955",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&crop=entropy&auto=format",
    description: "Leading university in Eastern India known for engineering and liberal arts programs.",
    facilities: ["Central Library", "Computer Center", "Hostels", "Auditorium", "Labs"],
    contact: {
      phone: "+91-33-2414-6666",
      email: "registrar@jadavpuruniversity.in",
      website: "www.jadavpuruniversity.in",
    },
  },
  {
    id: "hyderabad1",
    name: "University of Hyderabad",
    location: "Hyderabad",
    coordinates: [17.4569, 78.3259] as [number, number],
    courses: ["B.Sc. Mathematics", "B.A. Economics", "B.Tech Biotechnology", "B.A. Psychology"],
    fees: "₹6,000/year",
    cutoff: "82%",
    placement: "78%",
    rating: 4.3,
    type: "Government",
    established: "1974",
    image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&h=300&fit=crop&crop=entropy&auto=format",
    description: "Central university known for research excellence and interdisciplinary programs.",
    facilities: ["Research Centers", "Library", "Sports Complex", "Hostels", "Health Center"],
    contact: {
      phone: "+91-40-2313-4000",
      email: "registrar@uohyd.ac.in",
      website: "www.uohyd.ac.in",
    },
  },
  {
    id: "manipal1",
    name: "Manipal Institute of Technology",
    location: "Manipal",
    coordinates: [13.3525, 74.7854] as [number, number],
    courses: ["B.Tech Computer Science", "B.Tech Mechanical", "B.Tech Electronics", "B.Arch"],
    fees: "₹3,50,000/year",
    cutoff: "JEE Main Rank < 15000",
    placement: "92%",
    rating: 4.2,
    type: "Private",
    established: "1957",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop&crop=entropy&auto=format",
    description: "Premier private engineering institute with excellent infrastructure and industry connections.",
    facilities: ["Modern Labs", "Innovation Center", "Sports Complex", "Hostels", "Medical Facilities"],
    contact: {
      phone: "+91-820-292-3000",
      email: "admissions@manipal.edu",
      website: "www.manipal.edu",
    },
  },
  {
    id: "vit1",
    name: "VIT University",
    location: "Vellore",
    coordinates: [12.9692, 79.1559] as [number, number],
    courses: ["B.Tech CSE", "B.Tech ECE", "B.Tech Mechanical", "B.Des"],
    fees: "₹1,98,000/year",
    cutoff: "VITEEE Rank < 5000",
    placement: "88%",
    rating: 4.1,
    type: "Private",
    established: "1984",
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=300&fit=crop&crop=entropy&auto=format",
    description: "Leading private university known for technology education and international collaborations.",
    facilities: ["Tech Parks", "Research Centers", "Sports Facilities", "Hostels", "Cultural Centers"],
    contact: {
      phone: "+91-416-220-2020",
      email: "admissions@vit.ac.in",
      website: "www.vit.ac.in",
    },
  },
]

export function CollegeDirectory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedCollege, setSelectedCollege] = useState<any>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [compareList, setCompareList] = useState<string[]>([])

  const filteredColleges = colleges.filter((college) => {
    const matchesSearch =
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.courses.some((course) => course.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLocation = selectedLocation === "all" || college.location === selectedLocation
    const matchesCourse =
      selectedCourse === "all" ||
      college.courses.some((course) => course.toLowerCase().includes(selectedCourse.toLowerCase()))
    const matchesType = selectedType === "all" || college.type === selectedType

    return matchesSearch && matchesLocation && matchesCourse && matchesType
  })

  const locations = [...new Set(colleges.map((c) => c.location))]
  const allCourses = [...new Set(colleges.flatMap((c) => c.courses))]

  const toggleFavorite = (collegeId: string) => {
    setFavorites((prev) => (prev.includes(collegeId) ? prev.filter((id) => id !== collegeId) : [...prev, collegeId]))
  }

  const toggleCompare = (collegeId: string) => {
    setCompareList((prev) => {
      if (prev.includes(collegeId)) {
        return prev.filter((id) => id !== collegeId)
      } else if (prev.length < 3) {
        return [...prev, collegeId]
      }
      return prev
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="container mx-auto p-6">
        <BackButton className="mb-6" />
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-slide-in-left">
            Government & Private College Directory
          </h1>
          <p className="text-muted-foreground text-lg animate-slide-in-left animation-delay-200">
            Explore top colleges with detailed information, real images, and interactive Google Maps
          </p>
        </div>

        <Tabs defaultValue="directory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 glass-card animate-slide-in-down">
            <TabsTrigger value="directory" className="button-3d">
              College Directory
            </TabsTrigger>
            <TabsTrigger value="map" className="button-3d">
              Interactive Map
            </TabsTrigger>
            <TabsTrigger value="compare" className="button-3d">
              Compare Colleges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="directory" className="space-y-6">
            <Card className="card-3d animate-slide-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 animate-slide-in-left">
                  <Filter className="h-5 w-5 animate-bounce-gentle" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative animate-slide-in-left">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground animate-pulse-gentle" />
                    <Input
                      placeholder="Search colleges or courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-2 focus:border-primary transition-all duration-300 hover:shadow-lg"
                    />
                  </div>

                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="button-3d animate-slide-in-left animation-delay-100">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location} className="hover:bg-primary/10">
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="button-3d animate-slide-in-left animation-delay-200">
                      <SelectValue placeholder="College Type" />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="button-3d animate-slide-in-left animation-delay-300">
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="all">All Courses</SelectItem>
                      {allCourses.slice(0, 10).map((course) => (
                        <SelectItem key={course} value={course.toLowerCase()} className="hover:bg-primary/10">
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedLocation("all")
                      setSelectedCourse("all")
                      setSelectedType("all")
                    }}
                    className="button-3d animate-slide-in-left animation-delay-500 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map((college, index) => (
                <Card
                  key={college.id}
                  className="overflow-hidden card-3d animate-fade-in-up hover:shadow-2xl transition-all duration-500 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={college.image || "/placeholder.svg"}
                      alt={college.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=192&width=400&text=${encodeURIComponent(college.name.split(" ")[0])}`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleFavorite(college.id)}
                        className="h-8 w-8 p-0 glass-button animate-bounce-gentle hover:scale-110 transition-transform duration-200"
                      >
                        <Heart
                          className={`h-4 w-4 transition-colors duration-300 ${
                            favorites.includes(college.id)
                              ? "fill-red-500 text-red-500 animate-pulse"
                              : "hover:text-red-400"
                          }`}
                        />
                      </Button>
                    </div>
                    <Badge
                      className={`absolute top-2 left-2 animate-slide-in-down ${
                        college.type === "Government"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      } transition-colors duration-300`}
                    >
                      {college.type}
                    </Badge>
                  </div>

                  <CardHeader className="transform group-hover:translate-y-[-2px] transition-transform duration-300">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300">
                          {college.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-2">
                          <MapPin className="h-3 w-3 animate-bounce-gentle" />
                          {college.location}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1 animate-pulse-gentle">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{college.rating}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 hover:text-green-600 transition-colors duration-200">
                        <DollarSign className="h-4 w-4 text-green-600 animate-pulse-gentle" />
                        <span>{college.fees}</span>
                      </div>
                      <div className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-200">
                        <Users className="h-4 w-4 text-blue-600 animate-pulse-gentle" />
                        <span>{college.placement} placement</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Popular Courses:</div>
                      <div className="flex flex-wrap gap-1">
                        {college.courses.slice(0, 2).map((course, courseIndex) => (
                          <Badge
                            key={courseIndex}
                            variant="outline"
                            className="text-xs hover:bg-primary/10 hover:border-primary transition-all duration-200 animate-slide-in-up"
                            style={{ animationDelay: `${courseIndex * 100}ms` }}
                          >
                            {course}
                          </Badge>
                        ))}
                        {college.courses.length > 2 && (
                          <Badge
                            variant="outline"
                            className="text-xs hover:bg-secondary/50 transition-all duration-200 animate-slide-in-up animation-delay-200"
                          >
                            +{college.courses.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 button-3d hover:shadow-lg"
                        onClick={() => setSelectedCollege(college)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleCompare(college.id)}
                        disabled={compareList.length >= 3 && !compareList.includes(college.id)}
                        className={`button-3d transition-all duration-300 ${
                          compareList.includes(college.id)
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "hover:bg-secondary"
                        }`}
                      >
                        {compareList.includes(college.id) ? "Remove" : "Compare"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredColleges.length === 0 && (
              <Card className="animate-fade-in">
                <CardContent className="text-center py-12">
                  <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-bounce-gentle" />
                  <h3 className="text-lg font-medium mb-2">No colleges found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="map" className="animate-fade-in">
            <GoogleMapsWrapper colleges={colleges} onCollegeSelect={setSelectedCollege} />
          </TabsContent>

          <TabsContent value="compare" className="animate-fade-in">
            <Card className="card-3d">
              <CardHeader>
                <CardTitle className="animate-slide-in-left">College Comparison</CardTitle>
                <CardDescription className="animate-slide-in-left animation-delay-200">
                  Compare up to 3 colleges side by side. {compareList.length}/3 selected.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {compareList.length === 0 ? (
                  <div className="text-center py-12 animate-fade-in-up">
                    <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-bounce-gentle" />
                    <h3 className="text-lg font-medium mb-2">No colleges selected</h3>
                    <p className="text-muted-foreground">Select colleges from the directory to compare them</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {compareList.map((collegeId, index) => {
                      const college = colleges.find((c) => c.id === collegeId)
                      if (!college) return null

                      return (
                        <Card
                          key={college.id}
                          className="card-3d animate-fade-in-up hover:shadow-xl transition-all duration-300"
                          style={{ animationDelay: `${index * 200}ms` }}
                        >
                          <CardHeader>
                            <CardTitle className="text-lg hover:text-primary transition-colors duration-200">
                              {college.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 animate-bounce-gentle" />
                              {college.location}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between hover:bg-muted/50 p-1 rounded transition-colors duration-200">
                                <span>Type:</span>
                                <Badge
                                  className={`${college.type === "Government" ? "bg-green-600" : "bg-red-600"} animate-pulse-gentle`}
                                >
                                  {college.type}
                                </Badge>
                              </div>
                              <div className="flex justify-between hover:bg-muted/50 p-1 rounded transition-colors duration-200">
                                <span>Fees:</span>
                                <span className="font-medium text-green-600">{college.fees}</span>
                              </div>
                              <div className="flex justify-between hover:bg-muted/50 p-1 rounded transition-colors duration-200">
                                <span>Cutoff:</span>
                                <span className="font-medium text-orange-600">{college.cutoff}</span>
                              </div>
                              <div className="flex justify-between hover:bg-muted/50 p-1 rounded transition-colors duration-200">
                                <span>Placement:</span>
                                <span className="font-medium text-blue-600">{college.placement}</span>
                              </div>
                              <div className="flex justify-between hover:bg-muted/50 p-1 rounded transition-colors duration-200">
                                <span>Rating:</span>
                                <span className="font-medium flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 animate-pulse-gentle" />
                                  {college.rating}
                                </span>
                              </div>
                              <div className="flex justify-between hover:bg-muted/50 p-1 rounded transition-colors duration-200">
                                <span>Established:</span>
                                <span className="font-medium">{college.established}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full bg-transparent button-3d hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                              onClick={() => toggleCompare(college.id)}
                            >
                              Remove from Comparison
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedCollege && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto card-3d animate-scale-in shadow-2xl">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="animate-slide-in-left">
                    <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {selectedCollege.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2 text-base">
                      <MapPin className="h-4 w-4 animate-bounce-gentle" />
                      {selectedCollege.location} • Established {selectedCollege.established}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCollege(null)}
                    className="button-3d hover:bg-destructive/10 hover:text-destructive hover:border-destructive animate-slide-in-right"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative overflow-hidden rounded-lg animate-slide-in-up">
                  <img
                    src={selectedCollege.image || "/placeholder.svg"}
                    alt={selectedCollege.name}
                    className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `/placeholder.svg?height=256&width=800&text=${encodeURIComponent(selectedCollege.name)}`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>

                <p className="text-muted-foreground leading-relaxed animate-fade-in-up animation-delay-200">
                  {selectedCollege.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="animate-slide-in-left animation-delay-300">
                    <h4 className="font-medium mb-3 text-lg">Key Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between hover:bg-muted/50 p-2 rounded transition-colors duration-200">
                        <span>Type:</span>
                        <Badge
                          className={`${selectedCollege.type === "Government" ? "bg-green-600" : "bg-red-600"} animate-pulse-gentle`}
                        >
                          {selectedCollege.type}
                        </Badge>
                      </div>
                      <div className="flex justify-between hover:bg-muted/50 p-2 rounded transition-colors duration-200">
                        <span>Annual Fees:</span>
                        <span className="font-medium text-green-600">{selectedCollege.fees}</span>
                      </div>
                      <div className="flex justify-between hover:bg-muted/50 p-2 rounded transition-colors duration-200">
                        <span>Cutoff:</span>
                        <span className="font-medium text-orange-600">{selectedCollege.cutoff}</span>
                      </div>
                      <div className="flex justify-between hover:bg-muted/50 p-2 rounded transition-colors duration-200">
                        <span>Placement Rate:</span>
                        <span className="font-medium text-blue-600">{selectedCollege.placement}</span>
                      </div>
                      <div className="flex justify-between hover:bg-muted/50 p-2 rounded transition-colors duration-200">
                        <span>Rating:</span>
                        <span className="font-medium flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 animate-pulse-gentle" />
                          {selectedCollege.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="animate-slide-in-right animation-delay-300">
                    <h4 className="font-medium mb-3 text-lg">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
                        <Phone className="h-4 w-4 animate-bounce-gentle" />
                        <span>{selectedCollege.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
                        <Globe className="h-4 w-4 animate-bounce-gentle" />
                        <span>{selectedCollege.contact.website}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="animate-fade-in-up animation-delay-500">
                  <h4 className="font-medium mb-3 text-lg">Available Courses</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCollege.courses.map((course: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="hover:bg-primary/10 hover:border-primary transition-all duration-200 animate-slide-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="animate-fade-in-up animation-delay-700">
                  <h4 className="font-medium mb-3 text-lg">Campus Facilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCollege.facilities.map((facility: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="hover:bg-secondary/80 transition-all duration-200 animate-slide-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
