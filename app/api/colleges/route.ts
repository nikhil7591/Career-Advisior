import { NextRequest, NextResponse } from 'next/server'

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

// Mock college database - in a real app, this would be from a database
const mockColleges = [
  {
    id: "1",
    name: "Delhi University",
    lat: 28.6139,
    lng: 77.2090,
    short_address: "North Campus, Delhi",
    short_description: "Premier central university offering diverse undergraduate and postgraduate programs",
    contact: {
      phone: "+91-11-27667011",
      email: "info@du.ac.in",
      website: "https://du.ac.in"
    },
    courses: ["B.A.", "B.Sc.", "B.Com", "M.A.", "M.Sc.", "Ph.D."],
    type: "Central University",
    established: 1922,
    rating: 4.2
  },
  {
    id: "2",
    name: "Jawaharlal Nehru University",
    lat: 28.5383,
    lng: 77.1641,
    short_address: "New Mehrauli Road, Delhi",
    short_description: "Research-intensive university known for social sciences and international studies",
    contact: {
      phone: "+91-11-26704000",
      email: "registrar@jnu.ac.in",
      website: "https://jnu.ac.in"
    },
    courses: ["M.A.", "M.Sc.", "M.Phil.", "Ph.D.", "B.A. (Hons)"],
    type: "Central University",
    established: 1969,
    rating: 4.1
  },
  {
    id: "3",
    name: "Indian Institute of Technology Delhi",
    lat: 28.5449,
    lng: 77.1928,
    short_address: "Hauz Khas, Delhi",
    short_description: "Premier engineering and technology institute with world-class research facilities",
    contact: {
      phone: "+91-11-26591000",
      email: "webmaster@iitd.ac.in",
      website: "https://iitd.ac.in"
    },
    courses: ["B.Tech", "M.Tech", "M.Sc.", "Ph.D.", "MBA"],
    type: "Institute of National Importance",
    established: 1961,
    rating: 4.5
  },
  {
    id: "4",
    name: "Jamia Millia Islamia",
    lat: 28.5615,
    lng: 77.2802,
    short_address: "Jamia Nagar, Delhi",
    short_description: "Central university offering diverse programs in arts, sciences, and professional courses",
    contact: {
      phone: "+91-11-26981717",
      email: "info@jmi.ac.in",
      website: "https://jmi.ac.in"
    },
    courses: ["B.A.", "B.Tech", "MBA", "M.A.", "Ph.D."],
    type: "Central University",
    established: 1920,
    rating: 3.9
  },
  {
    id: "5",
    name: "Lady Shri Ram College",
    lat: 28.6507,
    lng: 77.2334,
    short_address: "Lajpat Nagar, Delhi",
    short_description: "Premier women's college affiliated to Delhi University",
    contact: {
      phone: "+91-11-24642020",
      email: "principal@lsr.edu.in",
      website: "https://lsr.edu.in"
    },
    courses: ["B.A. (Hons)", "B.Sc. (Hons)", "B.Com (Hons)"],
    type: "Affiliated College",
    established: 1956,
    rating: 4.3
  },
  {
    id: "6",
    name: "Shri Ram College of Commerce",
    lat: 28.6692,
    lng: 77.2265,
    short_address: "Maurice Nagar, Delhi",
    short_description: "Premier commerce college known for excellence in business education",
    contact: {
      phone: "+91-11-27667853",
      email: "principal@srcc.du.ac.in",
      website: "https://srcc.du.ac.in"
    },
    courses: ["B.Com (Hons)", "B.A. Economics (Hons)", "M.Com"],
    type: "Affiliated College",
    established: 1926,
    rating: 4.4
  },
  {
    id: "7",
    name: "All India Institute of Medical Sciences",
    lat: 28.5672,
    lng: 77.2100,
    short_address: "Ansari Nagar, Delhi",
    short_description: "Premier medical institute providing world-class medical education and healthcare",
    contact: {
      phone: "+91-11-26588500",
      email: "director@aiims.ac.in",
      website: "https://aiims.edu"
    },
    courses: ["MBBS", "MD", "MS", "DM", "MCh", "Ph.D."],
    type: "Institute of National Importance",
    established: 1956,
    rating: 4.6
  },
  {
    id: "8",
    name: "Indian Statistical Institute",
    lat: 28.6139,
    lng: 77.2090,
    short_address: "7 S.J.S. Sansanwal Marg, Delhi",
    short_description: "Premier institute for statistical sciences and research",
    contact: {
      phone: "+91-11-41493900",
      email: "office@isid.ac.in",
      website: "https://isid.ac.in"
    },
    courses: ["B.Stat", "B.Math", "M.Stat", "M.Math", "Ph.D."],
    type: "Institute of National Importance",
    established: 1931,
    rating: 4.2
  }
]

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c // Distance in kilometers
  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')
    const radius_km = parseFloat(searchParams.get('radius_km') || '10')

    // Validate parameters
    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: 'Invalid latitude or longitude values' },
        { status: 400 }
      )
    }

    if (radius_km <= 0 || radius_km > 1000) {
      return NextResponse.json(
        { error: 'Radius must be between 0 and 1000 km' },
        { status: 400 }
      )
    }

    // Calculate distances and filter colleges within radius
    const collegesWithDistance = mockColleges.map(college => ({
      ...college,
      distance: calculateDistance(lat, lng, college.lat, college.lng)
    }))

    const nearbyColleges = collegesWithDistance
      .filter(college => college.distance <= radius_km)
      .sort((a, b) => a.distance - b.distance)

    // Add some artificial delay to simulate real API
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      data: nearbyColleges,
      meta: {
        total: nearbyColleges.length,
        radius_km,
        center: { lat, lng }
      }
    })

  } catch (error) {
    console.error('Error in colleges API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
