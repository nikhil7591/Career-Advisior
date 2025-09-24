"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Star, DollarSign, Users, Search, Navigation, Loader2, AlertCircle, MapIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface College {
  id: string
  name: string
  location: string
  coordinates: [number, number]
  courses: string[]
  fees: string
  cutoff: string
  placement: string
  rating: number
  type: string
  image: string
  description: string
  established: string
  facilities: string[]
  contact: {
    phone: string
    email: string
    website: string
  }
  distance?: number
}

interface GoogleMapsWrapperProps {
  colleges: College[]
  onCollegeSelect: (college: College) => void
}

declare global {
  interface Window {
    google: any
    initMap: () => void
    selectCollege: (collegeId: string) => void
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function GoogleMapsWrapper({ colleges, onCollegeSelect }: GoogleMapsWrapperProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const [infoWindow, setInfoWindow] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredColleges, setFilteredColleges] = useState(colleges)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [sortedColleges, setSortedColleges] = useState(colleges)
  const [showDemoMap, setShowDemoMap] = useState(false)
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown")
  const [locationError, setLocationError] = useState<string | null>(null)

  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const getUserLocation = () => {
    setLocationLoading(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      setLocationLoading(false)
      setUserLocation({ lat: 28.6139, lng: 77.209 })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("[v0] Geolocation success:", position.coords)
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserLocation(userPos)
        setLocationPermission("granted")
        setLocationError(null)

        const collegesWithDistance = colleges
          .map((college) => ({
            ...college,
            distance: calculateDistance(userPos.lat, userPos.lng, college.coordinates[0], college.coordinates[1]),
          }))
          .sort((a, b) => (a.distance || 0) - (b.distance || 0))

        setSortedColleges(collegesWithDistance)
        setLocationLoading(false)

        if (map) {
          map.setCenter(userPos)
          map.setZoom(10)
        }
      },
      (error) => {
        console.log("[v0] Geolocation error handled:", error.message)
        setLocationLoading(false)

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationPermission("denied")
            setLocationError("Location access denied. Showing colleges across India.")
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable. Showing colleges across India.")
            break
          case error.TIMEOUT:
            setLocationError("Location request timed out. Showing colleges across India.")
            break
          default:
            setLocationError("Unable to get location. Showing colleges across India.")
            break
        }

        setUserLocation({ lat: 28.6139, lng: 77.209 })

        setSortedColleges(colleges)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          setLocationPermission(result.state as any)
          if (result.state === "granted") {
            getUserLocation()
          } else {
            setUserLocation({ lat: 28.6139, lng: 77.209 })
          }
        })
        .catch(() => {
          setUserLocation({ lat: 28.6139, lng: 77.209 })
        })
    } else {
      setUserLocation({ lat: 28.6139, lng: 77.209 })
    }
  }, [])

  useEffect(() => {
    const filtered = sortedColleges.filter(
      (college) =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.courses.some((course) => course.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredColleges(filtered)
  }, [searchTerm, sortedColleges])

  const isValidApiKey = (key: string | undefined): boolean => {
    if (!key) return false
    return key.startsWith("AIza") && key.length === 39
  }

  useEffect(() => {
    const loadGoogleMaps = () => {
      console.log("[v0] Checking API key:", GOOGLE_MAPS_API_KEY ? "Present" : "Missing")

      if (!GOOGLE_MAPS_API_KEY || !isValidApiKey(GOOGLE_MAPS_API_KEY)) {
        console.log("[v0] Invalid or missing API key, showing demo map")
        setShowDemoMap(true)
        setIsLoaded(true)
        return
      }

      if (window.google) {
        console.log("[v0] Google Maps already loaded")
        setIsLoaded(true)
        return
      }

      console.log("[v0] Loading Google Maps API...")
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`
      script.async = true
      script.defer = true

      window.initGoogleMaps = () => {
        console.log("[v0] Google Maps API loaded successfully")
        setIsLoaded(true)
        setError(null)
        setShowDemoMap(false)
      }

      script.onerror = (e) => {
        console.error("[v0] Failed to load Google Maps API:", e)
        setShowDemoMap(true)
        setIsLoaded(true)
      }

      const handleGoogleMapsError = (e: any) => {
        console.error("[v0] Google Maps Error Event:", e)
        setShowDemoMap(true)
        setIsLoaded(true)
      }

      window.addEventListener("error", handleGoogleMapsError)

      return () => {
        window.removeEventListener("error", handleGoogleMapsError)
      }
    }

    loadGoogleMaps()
  }, [GOOGLE_MAPS_API_KEY])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || error) return

    if (showDemoMap) {
      return
    }

    try {
      console.log("[v0] Initializing Google Maps")
      const initialCenter = userLocation || { lat: 20.5937, lng: 78.9629 }

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: userLocation ? 10 : 5,
        styles: [
          {
            featureType: "poi.school",
            elementType: "geometry",
            stylers: [{ color: "#f39c12" }],
          },
        ],
      })

      const infoWindowInstance = new window.google.maps.InfoWindow()
      setInfoWindow(infoWindowInstance)
      setMap(mapInstance)

      if (userLocation) {
        new window.google.maps.Marker({
          position: userLocation,
          map: mapInstance,
          title: "Your Location",
          icon: {
            url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMzYjgyZjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgo8cGF0aCBkPSJtMyA5IDktNyA5IDctNCAyLjUtNCAyLjV6Ii8+CjxwYXRoIGQ9Im0yMSAxNi0yIDJMNyA3bDItMiIvPgo8L3N2Zz4KPHN2Zz4K",
            scaledSize: new window.google.maps.Size(40, 40),
          },
        })
      }

      console.log("[v0] Adding markers for", colleges.length, "colleges")
      colleges.forEach((college) => {
        const marker = new window.google.maps.Marker({
          position: { lat: college.coordinates[0], lng: college.coordinates[1] },
          map: mapInstance,
          title: college.name,
          icon: {
            url:
              college.type === "Government"
                ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMxNjc5M2YiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgo8cGF0aCBkPSJNMjIgMTBWNmEyIDIgMCAwIDAtMi0ySDRhMiAyIDAgMCAwLTIgMnY0Ii8+CjxwYXRoIGQ9Ik0yIDEwdjEwYTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMlYxMCIvPgo8cGF0aCBkPSJNNiAxNGg0Ii8+CjxwYXRoIGQ9Ik02IDE4aDQiLz4KPHN2Zz4KPHN2Zz4K"
                : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNkYzI2MjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgo8cGF0aCBkPSJNMjIgMTBWNmEyIDIgMCAwIDAtMi0ySDRhMiAyIDAgMCAwLTIgMnY0Ii8+CjxwYXRoIGQ9Ik0yIDEwdjEwYTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMlYxMCIvPgo8cGF0aCBkPSJNNiAxNGg0Ii8+CjxwYXRoIGQ9Ik02IDE4aDQiLz4KPHN2Zz4KPHN2Zz4K",
            scaledSize: new window.google.maps.Size(40, 40),
          },
        })

        marker.addListener("click", () => {
          const distanceText =
            college.distance && locationPermission === "granted" ? ` • ${college.distance.toFixed(1)} km away` : ""
          const content = `
            <div style="max-width: 300px; font-family: system-ui;">
              <div style="position: relative; margin-bottom: 12px;">
                <img src="${college.image}" alt="${college.name}" 
                     style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;" 
                     onerror="this.src='/placeholder.svg?height=150&width=300&text=${encodeURIComponent(college.name)}'"/>
                <div style="position: absolute; top: 8px; right: 8px; background: ${college.type === "Government" ? "#16a34a" : "#dc2626"}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                  ${college.type}
                </div>
              </div>
              
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${college.name}</h3>
              
              <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px; color: #6b7280; font-size: 14px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${college.location}${distanceText}
              </div>
              
              <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 12px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                </svg>
                <span style="font-weight: 500; font-size: 14px;">${college.rating}/5</span>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; font-size: 13px;">
                <div style="display: flex; align-items: center; gap: 4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  <span>${college.fees}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span>${college.placement} placement</span>
                </div>
              </div>
              
              <p style="margin: 0 0 12px 0; font-size: 13px; color: #6b7280; line-height: 1.4;">
                ${college.description.substring(0, 100)}...
              </p>
              
              <div style="margin-bottom: 12px;">
                <div style="font-size: 12px; font-weight: 500; margin-bottom: 4px; color: #374151;">Popular Courses:</div>
                <div style="display: flex; flex-wrap: gap: 4px;">
                  ${college.courses
                    .slice(0, 2)
                    .map(
                      (course) =>
                        `<span style="background: #f3f4f6; color: #374151; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${course}</span>`,
                    )
                    .join("")}
                  ${college.courses.length > 2 ? `<span style="background: #f3f4f6; color: #374151; padding: 2px 6px; border-radius: 4px; font-size: 11px;">+${college.courses.length - 2} more</span>` : ""}
                </div>
              </div>
              
              <button onclick="window.selectCollege('${college.id}')" 
                      style="width: 100%; background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: 500;">
                View Full Details
              </button>
            </div>
          `

          infoWindowInstance.setContent(content)
          infoWindowInstance.open(mapInstance, marker)
          setSelectedCollege(college)
        })
      })

      window.selectCollege = (collegeId: string) => {
        const college = colleges.find((c) => c.id === collegeId)
        if (college) {
          onCollegeSelect(college)
          infoWindow.close()
        }
      }

      console.log("[v0] Google Maps initialization complete")
    } catch (err) {
      console.error("[v0] Error initializing Google Maps:", err)
      setShowDemoMap(true)
    }
  }, [isLoaded, colleges, onCollegeSelect, error, userLocation, showDemoMap])

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Interactive College Map
          </CardTitle>
          <CardDescription>Loading map and getting your location...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[28rem] rounded-lg bg-muted flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading interactive map...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 animate-slide-in-left">
            <MapPin className="h-5 w-5 animate-bounce-gentle" />
            Interactive College Map
            {userLocation && locationPermission === "granted" && (
              <Badge variant="outline" className="ml-2 animate-slide-in-right">
                <Navigation className="h-3 w-3 mr-1 animate-pulse" />
                Location Enabled
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="animate-slide-in-left animation-delay-200">
            {showDemoMap
              ? "Demo map showing colleges near you. Enable location for distance-based sorting."
              : "Explore government and private colleges across India. Click on markers to see detailed information."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {locationError && (
            <Alert className="mb-4 animate-slide-in-down">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {locationError}
                {locationPermission === "denied" && (
                  <span className="block mt-2 text-sm">
                    To enable location-based sorting, please allow location access in your browser settings and refresh
                    the page.
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[700px]">
            <div className="xl:col-span-4 space-y-4 animate-slide-in-left">
              <div className="space-y-2">
                <div className="relative transform hover:scale-105 transition-transform duration-200">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search nearby colleges"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 focus:border-primary transition-all duration-300"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={getUserLocation}
                  disabled={locationLoading}
                  className="w-full bg-transparent hover:bg-primary/10 transform hover:scale-105 transition-all duration-200"
                >
                  {locationLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : locationPermission === "denied" ? (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <Navigation className="h-4 w-4 mr-2 animate-pulse" />
                  )}
                  {locationLoading
                    ? "Getting Location..."
                    : locationPermission === "denied"
                      ? "Location Access Denied"
                      : "Find Colleges Near Me"}
                </Button>
              </div>

              <div className="space-y-3 h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {filteredColleges.map((college, index) => (
                  <Card
                    key={college.id}
                    className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative flex-shrink-0 group">
                          <img
                            src={college.image || "/placeholder.svg"}
                            alt={college.name}
                            className="w-20 h-20 object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `/placeholder.svg?height=80&width=80&text=${encodeURIComponent(college.name.split(" ")[0])}`
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-sm line-clamp-2 pr-2 hover:text-primary transition-colors duration-200">
                              {college.name}
                            </h3>
                            <div className="flex items-center gap-1 flex-shrink-0 animate-pulse-gentle">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium">{college.rating}</span>
                              <span className="text-xs text-muted-foreground">
                                ({Math.floor(Math.random() * 50000) + 10000})
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground mb-2 capitalize">
                            {college.type === "Government" ? "Government Institution" : "Private Institution"}
                          </p>

                          <div className="flex items-center gap-1 mb-2">
                            <MapPin className="h-3 w-3 text-muted-foreground animate-bounce-gentle" />
                            <span className="text-xs text-muted-foreground">
                              {college.location}
                              {college.distance && locationPermission === "granted" && (
                                <span className="ml-1 text-blue-600 font-medium animate-pulse">
                                  • {college.distance.toFixed(1)} km away
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs mb-3">
                            <div className="flex items-center gap-1 hover:text-green-600 transition-colors duration-200">
                              <DollarSign className="h-3 w-3 text-green-600" />
                              <span>{college.fees}</span>
                            </div>
                            <div className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200">
                              <Users className="h-3 w-3 text-blue-600" />
                              <span>{college.placement}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs bg-transparent hover:bg-primary hover:text-white transform hover:scale-105 transition-all duration-200"
                              onClick={() => onCollegeSelect(college)}
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs bg-transparent hover:bg-secondary transform hover:scale-110 transition-all duration-200"
                              onClick={() => {
                                if (map && !showDemoMap) {
                                  map.setCenter({ lat: college.coordinates[0], lng: college.coordinates[1] })
                                  map.setZoom(15)
                                }
                              }}
                            >
                              <MapPin className="h-3 w-3 animate-bounce-gentle" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredColleges.length === 0 && (
                  <div className="text-center py-8 animate-fade-in">
                    <p className="text-muted-foreground">No colleges found matching your search.</p>
                  </div>
                )}

                {filteredColleges.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full bg-transparent hover:bg-primary/10 transform hover:scale-105 transition-all duration-200 animate-fade-in"
                  >
                    Show More
                  </Button>
                )}
              </div>
            </div>

            <div className="xl:col-span-8 animate-slide-in-right">
              <div className="w-full h-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-2xl relative transform hover:scale-[1.02] transition-transform duration-300">
                {showDemoMap ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <svg viewBox="0 0 400 300" className="w-full h-full">
                        <defs>
                          <radialGradient id="mapGradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                          </radialGradient>
                        </defs>
                        <rect width="400" height="300" fill="url(#mapGradient)" />

                        <path d="M0 150 L400 150" stroke="#cbd5e1" strokeWidth="3" opacity="0.5" />
                        <path d="M200 0 L200 300" stroke="#cbd5e1" strokeWidth="3" opacity="0.5" />
                        <path d="M0 100 L400 120" stroke="#cbd5e1" strokeWidth="2" opacity="0.3" />
                        <path d="M0 200 L400 180" stroke="#cbd5e1" strokeWidth="2" opacity="0.3" />

                        {filteredColleges.slice(0, 8).map((college, index) => {
                          const x = 50 + (index % 4) * 80 + Math.random() * 40
                          const y = 50 + Math.floor(index / 4) * 100 + Math.random() * 40
                          return (
                            <g
                              key={college.id}
                              className="animate-float"
                              style={{ animationDelay: `${index * 200}ms` }}
                            >
                              <circle
                                cx={x}
                                cy={y}
                                r="15"
                                fill={college.type === "Government" ? "#16a34a" : "#dc2626"}
                                className="cursor-pointer hover:opacity-80 transition-all duration-300 drop-shadow-lg"
                                onClick={() => onCollegeSelect(college)}
                              />
                              <circle cx={x} cy={y} r="6" fill="white" />
                              <circle
                                cx={x}
                                cy={y}
                                r="3"
                                fill={college.type === "Government" ? "#16a34a" : "#dc2626"}
                              />
                            </g>
                          )
                        })}

                        {userLocation && locationPermission === "granted" && (
                          <g className="animate-pulse-ring">
                            <circle cx="200" cy="150" r="20" fill="#3b82f6" opacity="0.3" className="animate-ping" />
                            <circle cx="200" cy="150" r="15" fill="#3b82f6" />
                            <circle cx="200" cy="150" r="6" fill="white" />
                          </g>
                        )}
                      </svg>
                    </div>

                    <div className="text-center z-10 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300 animate-fade-in-up">
                      <MapIcon className="h-16 w-16 mx-auto mb-6 text-blue-600 animate-bounce-gentle" />
                      <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        Interactive College Map
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        Discover colleges near you with our interactive demo map
                        {userLocation && locationPermission === "granted" && " based on your current location"}
                      </p>
                      <div className="flex items-center justify-center gap-6 text-xs">
                        <div className="flex items-center gap-2 animate-slide-in-left">
                          <div className="w-4 h-4 rounded-full bg-green-600 shadow-lg animate-pulse"></div>
                          <span className="font-medium">Government</span>
                        </div>
                        <div className="flex items-center gap-2 animate-slide-in-up">
                          <div className="w-4 h-4 rounded-full bg-red-600 shadow-lg animate-pulse"></div>
                          <span className="font-medium">Private</span>
                        </div>
                        {userLocation && locationPermission === "granted" && (
                          <div className="flex items-center gap-2 animate-slide-in-right">
                            <div className="w-4 h-4 rounded-full bg-blue-600 shadow-lg animate-pulse"></div>
                            <span className="font-medium">Your Location</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float-random"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div ref={mapRef} className="w-full h-full" />
                )}

                {!showDemoMap && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/20 animate-slide-in-down">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-4 py-2 text-sm font-medium bg-white/50 hover:bg-white/80 transition-all duration-200"
                      onClick={() => {
                        if (map) {
                          map.setMapTypeId(map.getMapTypeId() === "roadmap" ? "satellite" : "roadmap")
                        }
                      }}
                    >
                      Map
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-4 py-2 text-sm font-medium bg-white/50 hover:bg-white/80 transition-all duration-200"
                      onClick={() => {
                        if (map) {
                          map.setMapTypeId("satellite")
                        }
                      }}
                    >
                      Satellite
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6 text-sm animate-slide-in-up">
            <div className="flex items-center gap-3 transform hover:scale-110 transition-transform duration-200">
              <div className="w-5 h-5 rounded-full bg-green-600 shadow-lg animate-pulse-gentle"></div>
              <span className="font-medium">Government Colleges</span>
            </div>
            <div className="flex items-center gap-3 transform hover:scale-110 transition-transform duration-200">
              <div className="w-5 h-5 rounded-full bg-red-600 shadow-lg animate-pulse-gentle"></div>
              <span className="font-medium">Private Colleges</span>
            </div>
            {userLocation && locationPermission === "granted" && (
              <div className="flex items-center gap-3 transform hover:scale-110 transition-transform duration-200">
                <div className="w-5 h-5 rounded-full bg-blue-600 shadow-lg animate-pulse"></div>
                <span className="font-medium">Your Location</span>
              </div>
            )}
            {showDemoMap && (
              <Badge variant="outline" className="ml-auto animate-bounce-gentle">
                Demo Mode
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
