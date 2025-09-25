"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, User, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"

const mockUsers = [
  {
    id: "student1",
    name: "Priya Sharma",
    type: "student" as const,
    class: "12th",
    stream: "Science",
    location: "Delhi",
  },
  {
    id: "student2",
    name: "Arjun Patel",
    type: "student" as const,
    class: "12th",
    stream: "Commerce",
    location: "Mumbai",
  },
  {
    id: "parent1",
    name: "Rajesh Sharma",
    type: "parent" as const,
    childName: "Priya Sharma",
  },
  {
    id: "parent2",
    name: "Meera Patel",
    type: "parent" as const,
    childName: "Arjun Patel",
  },
]

export default function AuthPage() {
  const [userType, setUserType] = useState<"student" | "parent" | null>(null)
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [mounted, setMounted] = useState(false)
  const { login } = useUser()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Check if user is already logged in
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const user = JSON.parse(currentUser)
      if (user.type === "student") {
        router.push("/dashboard")
      } else {
        router.push("/parent-portal")
      }
    }
  }, [])

  const handleLogin = () => {
    if (selectedUser) {
      const user = mockUsers.find((u) => u.id === selectedUser)
      if (user) {
        // Login user
        login(user)
        
        // Navigate to appropriate dashboard using replace to avoid back navigation issues
        if (user.type === "student") {
          router.replace("/dashboard")
        } else {
          router.replace("/parent-portal")
        }
      }
    }
  }

  const filteredUsers = mockUsers.filter((user) => user.type === userType)

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to CareerPath</h1>
          <p className="text-muted-foreground mt-2">Choose your role to access the demo</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Demo Login</CardTitle>
            <CardDescription>Select your role and a demo profile to explore the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={userType === "student" ? "default" : "outline"}
                className="h-20 flex-col"
                onClick={() => {
                  setUserType("student")
                  setSelectedUser("")
                }}
              >
                <User className="h-6 w-6 mb-2" />
                Student
              </Button>
              <Button
                variant={userType === "parent" ? "default" : "outline"}
                className="h-20 flex-col"
                onClick={() => {
                  setUserType("parent")
                  setSelectedUser("")
                }}
              >
                <Users className="h-6 w-6 mb-2" />
                Parent
              </Button>
            </div>

            {userType && (
              <div className="space-y-4">
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select a demo ${userType} profile`} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {user.type === "student"
                              ? `${user.class} ${user.stream} - ${user.location}`
                              : `Parent of ${user.childName}`}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button className="w-full" onClick={handleLogin} disabled={!selectedUser}>
                  Continue to Demo
                </Button>
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground">
              <p>This is a demo version </p>
              <p>No real registration required</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
