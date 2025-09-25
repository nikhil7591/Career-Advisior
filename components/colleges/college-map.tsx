"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapPin, Star, DollarSign, Users } from "lucide-react"

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
}

interface CollegeMapProps {
  colleges: College[]
  onCollegeSelect: (college: College) => void
}

export function CollegeMap({ colleges, onCollegeSelect }: CollegeMapProps) {
  useEffect(() => {
    // Fix default icon paths for Leaflet when bundling
    // @ts-ignore
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: typeof window !== "undefined" ? require("leaflet/dist/images/marker-icon-2x.png") : undefined,
      iconUrl: typeof window !== "undefined" ? require("leaflet/dist/images/marker-icon.png") : undefined,
      shadowUrl: typeof window !== "undefined" ? require("leaflet/dist/images/marker-shadow.png") : undefined,
    })
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Interactive College Map
          </CardTitle>
          <CardDescription>Explore government colleges across India with our interactive map</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[28rem] rounded-lg overflow-hidden">
            <MapContainer center={[22.9734, 78.6569]} zoom={5} className="w-full h-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {colleges.map((c) => (
                <Marker key={c.id} position={c.coordinates as any}>
                  <Popup>
                    <div className="space-y-2">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.location}</div>
                      <Button size="sm" className="w-full mt-2" onClick={() => onCollegeSelect(c)}>
                        View Details
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* College List for Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {colleges.map((college) => (
          <Card key={college.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <img
                  src={college.image || "/placeholder.svg"}
                  alt={college.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm line-clamp-2">{college.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{college.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{college.location}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs mb-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-green-600" />
                      <span>{college.fees}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-blue-600" />
                      <span>{college.placement}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs bg-transparent"
                    onClick={() => onCollegeSelect(college)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
