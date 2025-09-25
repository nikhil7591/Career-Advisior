"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  MapPin, 
  Navigation, 
  Search, 
  Phone, 
  Mail, 
  ExternalLink, 
  Target,
  List,
  Map as MapIcon,
  AlertCircle,
  Loader2,
  RefreshCw,
  Settings,
  GraduationCap
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface College {
  id: string
  name: string
  lat: number
  lng: number
  short_address: string
  distance: number
  short_description: string
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  courses: string[]
  type: string
  established?: number
  rating?: number
}

interface UserLocation {
  lat: number
  lng: number
  address?: string
}

export function NearbyCollegesMap() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null)
  const [manualLocation, setManualLocation] = useState("")
  const [radius, setRadius] = useState(10)
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const [hoveredCollege, setHoveredCollege] = useState<College | null>(null)
  const [view, setView] = useState<'map' | 'list'>('map')
  const [showLocationInput, setShowLocationInput] = useState(false)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Request location permission and get user location
  const requestLocation = async () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      setShowLocationInput(true)
      setLoading(false)
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        })
      })

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      setUserLocation(location)
      setLocationPermission('granted')
      await fetchNearbyColleges(location.lat, location.lng, radius)
      
      toast({
        title: "Location found!",
        description: "Showing nearby colleges based on your location.",
      })
    } catch (error: any) {
      console.error('Geolocation error:', error)
      setLocationPermission('denied')
      setShowLocationInput(true)
      
      let errorMessage = "Unable to get your location. "
      if (error.code === 1) {
        errorMessage += "Location access was denied."
      } else if (error.code === 2) {
        errorMessage += "Location information is unavailable."
      } else if (error.code === 3) {
        errorMessage += "Location request timed out."
      }
      
      setError(errorMessage)
      toast({
        title: "Location access failed",
        description: errorMessage + " Please enter your location manually.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle manual location input
  const handleManualLocation = async () => {
    if (!manualLocation.trim()) return

    setLoading(true)
    setError(null)

    try {
      // In a real app, you'd use a geocoding service like Google Maps Geocoding API
      // For demo, we'll use a mock location (Delhi coordinates)
      const mockLocation = {
        lat: 28.6139,
        lng: 77.2090,
        address: manualLocation
      }

      setUserLocation(mockLocation)
      await fetchNearbyColleges(mockLocation.lat, mockLocation.lng, radius)
      setShowLocationInput(false)
      
      toast({
        title: "Location set!",
        description: `Showing colleges near ${manualLocation}`,
      })
    } catch (error) {
      setError("Failed to find location. Please try again.")
      toast({
        title: "Location search failed",
        description: "Please check your location and try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch nearby colleges
  const fetchNearbyColleges = async (lat: number, lng: number, radiusKm: number) => {
    try {
      const response = await fetch(`/api/colleges?lat=${lat}&lng=${lng}&radius_km=${radiusKm}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setColleges(data.data)
      } else {
        throw new Error(data.error || 'Failed to fetch colleges')
      }
    } catch (error) {
      console.error('Error fetching colleges:', error)
      setError("Failed to fetch nearby colleges. Please try again.")
    }
  }

  // Handle radius change
  const handleRadiusChange = async (newRadius: string) => {
    const radiusNum = parseInt(newRadius)
    setRadius(radiusNum)
    
    if (userLocation) {
      setLoading(true)
      await fetchNearbyColleges(userLocation.lat, userLocation.lng, radiusNum)
      setLoading(false)
    }
  }

  // Re-center to user location
  const recenterToUser = () => {
    if (userLocation) {
      // In a real map implementation, this would center the map
      toast({
        title: "Map centered",
        description: "Map has been centered to your location.",
      })
    }
  }

  // Get directions to college
  const getDirections = (college: College) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${college.lat},${college.lng}`
      window.open(url, '_blank')
    }
  }

  // Initial load
  useEffect(() => {
    // Auto-request location on component mount
    requestLocation()
  }, [])

  return (
    <div className="w-full space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Nearby Colleges</h2>
          <p className="text-muted-foreground">Find colleges near your location</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Radius Filter */}
          <Select value={radius.toString()} onValueChange={handleRadiusChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 km</SelectItem>
              <SelectItem value="10">10 km</SelectItem>
              <SelectItem value="20">20 km</SelectItem>
              <SelectItem value="50">50 km</SelectItem>
            </SelectContent>
          </Select>

          {/* Re-center Button */}
          {userLocation && (
            <Button variant="outline" size="sm" onClick={recenterToUser}>
              <Target className="h-4 w-4 mr-2" />
              Re-center
            </Button>
          )}

          {/* Location Button */}
          <Button variant="outline" size="sm" onClick={() => setShowLocationInput(!showLocationInput)}>
            <Settings className="h-4 w-4 mr-2" />
            Location
          </Button>
        </div>
      </div>

      {/* Manual Location Input */}
      {showLocationInput && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter your location (city, address, etc.)"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualLocation()}
                />
              </div>
              <Button onClick={handleManualLocation} disabled={loading || !manualLocation.trim()}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            {locationPermission === 'denied' && (
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                Location access was denied. Please enter your location manually.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={requestLocation} className="ml-auto">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Finding nearby colleges...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {!loading && userLocation && colleges.length > 0 && (
        <div className="space-y-4">
          {/* Mobile View Toggle */}
          <div className="md:hidden">
            <Tabs value={view} onValueChange={(v) => setView(v as 'map' | 'list')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <MapIcon className="h-4 w-4" />
                  Map
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Desktop Layout / Mobile Tabs Content */}
          <div className="md:grid md:grid-cols-2 md:gap-6">
            {/* Map View */}
            <div className={`${view === 'list' ? 'hidden md:block' : ''}`}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Map View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Mock Map Container */}
                  <div 
                    ref={mapRef}
                    className="w-full h-96 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden"
                  >
                    {/* Mock Map Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950" />
                    
                    {/* Mock Markers */}
                    <div className="relative z-10 w-full h-full">
                      {/* User Location Marker */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded shadow">
                          You
                        </div>
                      </div>
                      
                      {/* College Markers */}
                      {colleges.slice(0, 5).map((college, index) => (
                        <div
                          key={college.id}
                          className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                            hoveredCollege?.id === college.id ? 'z-20' : 'z-10'
                          }`}
                          style={{
                            top: `${45 + (index * 8)}%`,
                            left: `${45 + (index * 10)}%`
                          }}
                          onMouseEnter={() => setHoveredCollege(college)}
                          onMouseLeave={() => setHoveredCollege(null)}
                          onClick={() => setSelectedCollege(college)}
                        >
                          <div className={`w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg transition-transform ${
                            hoveredCollege?.id === college.id ? 'scale-125' : ''
                          }`}>
                            <GraduationCap className="h-3 w-3 text-white m-0.5" />
                          </div>
                          
                          {/* Hover Popup */}
                          {hoveredCollege?.id === college.id && (
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-3 z-30">
                              <h4 className="font-semibold text-sm">{college.name}</h4>
                              <p className="text-xs text-muted-foreground mb-2">{college.short_address}</p>
                              <p className="text-xs mb-2">{college.short_description}</p>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-blue-600 font-medium">{college.distance} km away</span>
                                <Badge variant="secondary" className="text-xs">{college.type}</Badge>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Map Controls */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Button size="sm" variant="secondary" className="w-8 h-8 p-0">+</Button>
                      <Button size="sm" variant="secondary" className="w-8 h-8 p-0">-</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* List View */}
            <div className={`${view === 'map' ? 'hidden md:block' : ''}`}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <List className="h-5 w-5" />
                      Nearby Colleges ({colleges.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                  {colleges.map((college) => (
                    <div
                      key={college.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        hoveredCollege?.id === college.id ? 'border-primary bg-primary/5' : ''
                      } ${selectedCollege?.id === college.id ? 'border-primary bg-primary/10' : ''}`}
                      onMouseEnter={() => setHoveredCollege(college)}
                      onMouseLeave={() => setHoveredCollege(null)}
                      onClick={() => setSelectedCollege(college)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{college.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {college.distance} km
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{college.short_address}</p>
                      <p className="text-sm mb-3">{college.short_description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {college.courses.slice(0, 3).map((course) => (
                          <Badge key={course} variant="secondary" className="text-xs">
                            {course}
                          </Badge>
                        ))}
                        {college.courses.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{college.courses.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation()
                          getDirections(college)
                        }}>
                          <Navigation className="h-3 w-3 mr-1" />
                          Directions
                        </Button>
                        {college.contact.website && (
                          <Button size="sm" variant="outline" onClick={(e) => {
                            e.stopPropagation()
                            window.open(college.contact.website, '_blank')
                          }}>
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Website
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* No Colleges Found */}
      {!loading && userLocation && colleges.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No colleges found</h3>
              <p className="text-muted-foreground mb-4">
                No colleges found within {radius} km of your location.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => handleRadiusChange('20')}>
                  Increase radius to 20 km
                </Button>
                <Button variant="outline" onClick={() => setShowLocationInput(true)}>
                  Change location
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected College Modal/Panel */}
      {selectedCollege && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {selectedCollege.name}
                </CardTitle>
                <p className="text-muted-foreground">{selectedCollege.short_address}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedCollege(null)}>
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-sm text-muted-foreground mb-2">{selectedCollege.short_description}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span>{selectedCollege.type}</span>
                  </div>
                  {selectedCollege.established && (
                    <div className="flex justify-between">
                      <span>Established:</span>
                      <span>{selectedCollege.established}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Distance:</span>
                    <span className="text-blue-600 font-medium">{selectedCollege.distance} km</span>
                  </div>
                  {selectedCollege.rating && (
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span>⭐ {selectedCollege.rating}/5</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <div className="space-y-2">
                  {selectedCollege.contact.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${selectedCollege.contact.phone}`} className="hover:underline">
                        {selectedCollege.contact.phone}
                      </a>
                    </div>
                  )}
                  {selectedCollege.contact.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${selectedCollege.contact.email}`} className="hover:underline">
                        {selectedCollege.contact.email}
                      </a>
                    </div>
                  )}
                  {selectedCollege.contact.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="h-4 w-4" />
                      <a href={selectedCollege.contact.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Courses Offered</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCollege.courses.map((course) => (
                  <Badge key={course} variant="secondary">
                    {course}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={() => getDirections(selectedCollege)} className="flex-1">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
              {selectedCollege.contact.website && (
                <Button variant="outline" onClick={() => window.open(selectedCollege.contact.website, '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
