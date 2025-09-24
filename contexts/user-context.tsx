"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  name: string
  email?: string
  type: "student" | "parent"
  class?: string
  stream?: string
  location?: string
  childName?: string
  [key: string]: any
}

interface UserContextType {
  user: User | null
  updateUser: (updates: Partial<User>) => void
  login: (user: User) => void
  logout: () => void
  loading: boolean
  isLoggingOut: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    setMounted(true)
    // Ensure we're on the client side
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } catch (error) {
          console.error("Error parsing user data:", error)
          localStorage.removeItem("currentUser")
        }
      }
    }
    // Small delay to ensure proper hydration
    const timer = setTimeout(() => setLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined' && user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
    }
  }, [user, mounted])


  const updateUser = (updates: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null
      const updatedUser = { ...prevUser, ...updates }
      
      // Also update any saved profile data
      const profileKey = `profile_${prevUser.id}`
      const savedProfile = localStorage.getItem(profileKey)
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile)
          const updatedProfile = { ...profile, ...updates }
          localStorage.setItem(profileKey, JSON.stringify(updatedProfile))
        } catch (error) {
          console.error("Error updating profile:", error)
        }
      }
      
      return updatedUser
    })
  }

  const logout = () => {
    if (!mounted) return
    
    setIsLoggingOut(true)
    if (typeof window !== 'undefined') {
      localStorage.removeItem("currentUser")
    }
    setUser(null)
    
    // Navigate to homepage
    router.replace("/")
    
    // Reset logout flag after navigation
    setTimeout(() => setIsLoggingOut(false), 500)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        login: (newUser: User) => {
          if (!mounted) return
          
          // Immediately update localStorage first
          if (typeof window !== 'undefined') {
            localStorage.setItem("currentUser", JSON.stringify(newUser))
          }
          // Then update state
          setUser(newUser)
        },
        logout,
        loading,
        isLoggingOut,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

// Backward compatibility hook
export function useCurrentUser() {
  const { user } = useUser()
  return user
}
