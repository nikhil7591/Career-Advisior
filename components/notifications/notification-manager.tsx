"use client"

import { useNotifications } from "@/contexts/notification-context"
import { useUser } from "@/contexts/user-context"
import { useEffect, useState } from "react"

// This component handles automatic notifications based on user actions
export function NotificationManager() {
  const { addNotification } = useNotifications()
  const { user } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !user || typeof window === 'undefined') return

    // Add welcome notification for new users
    const hasWelcomeNotification = localStorage.getItem(`welcome_${user.id}`)
    if (!hasWelcomeNotification) {
      addNotification({
        type: "info",
        title: "Welcome to CareerPath!",
        message: `Hi ${user.name}! Complete your profile to get personalized recommendations.`,
        read: false,
        actionUrl: "/profile",
      })
      localStorage.setItem(`welcome_${user.id}`, "true")
    }

    // Check for incomplete profile
    const profileKey = `profile_${user.id}`
    const savedProfile = localStorage.getItem(profileKey)
    if (!savedProfile) {
      const timeoutId = setTimeout(() => {
        addNotification({
          type: "warning",
          title: "Complete Your Profile",
          message: "Add more details to your profile for better college recommendations.",
          read: false,
          actionUrl: "/profile",
        })
      }, 5000) // Show after 5 seconds
      
      return () => clearTimeout(timeoutId)
    }

    // Simulate periodic notifications (in a real app, these would come from the server)
    const notificationInterval = setInterval(() => {
      const notifications = [
        {
          type: "reminder" as const,
          title: "Application Deadline Approaching",
          message: "Don't forget to submit your college applications before the deadline.",
          actionUrl: "/colleges",
        },
        {
          type: "info" as const,
          title: "New Career Opportunities",
          message: "Explore new career paths that match your interests and skills.",
          actionUrl: "/career-mapping",
        },
        {
          type: "success" as const,
          title: "Profile Views Increased",
          message: "Your profile has been viewed by 5 colleges this week!",
          actionUrl: "/profile",
        },
      ]

      // Randomly show a notification (10% chance every 30 seconds)
      if (Math.random() < 0.1) {
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)]
        addNotification({
          ...randomNotification,
          read: false,
        })
      }
    }, 30000) // Check every 30 seconds

    return () => {
      clearInterval(notificationInterval)
    }
  }, [user, addNotification])

  return null // This component doesn't render anything
}

// Utility functions to add specific notifications
export const NotificationUtils = {
  addQuizCompleted: (addNotification: ReturnType<typeof useNotifications>["addNotification"]) => {
    addNotification({
      type: "success",
      title: "Quiz Completed!",
      message: "Great job! Your career assessment results are ready to view.",
      read: false,
      actionUrl: "/dashboard",
    })
  },

  addCollegeBookmarked: (addNotification: ReturnType<typeof useNotifications>["addNotification"], collegeName: string) => {
    addNotification({
      type: "info",
      title: "College Bookmarked",
      message: `${collegeName} has been added to your favorites list.`,
      read: false,
      actionUrl: "/colleges",
    })
  },

  addApplicationDeadline: (addNotification: ReturnType<typeof useNotifications>["addNotification"], collegeName: string, days: number) => {
    addNotification({
      type: "reminder",
      title: "Application Deadline",
      message: `${collegeName} application deadline is in ${days} days. Don't miss out!`,
      read: false,
      actionUrl: "/colleges",
    })
  },

  addProfileIncomplete: (addNotification: ReturnType<typeof useNotifications>["addNotification"]) => {
    addNotification({
      type: "warning",
      title: "Profile Incomplete",
      message: "Complete your profile to get better recommendations and increase your chances.",
      read: false,
      actionUrl: "/profile",
    })
  },
}
