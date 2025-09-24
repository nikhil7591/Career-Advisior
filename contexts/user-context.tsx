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
  logout: () => void
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
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
    setLoading(false)
  }, [])

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
    }
  }, [user])

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
    localStorage.removeItem("currentUser")
    setUser(null)
    router.push("/")
  }

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        logout,
        loading,
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
