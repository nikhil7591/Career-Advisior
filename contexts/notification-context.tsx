"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface Notification {
  id: string
  type: "success" | "warning" | "info" | "reminder"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Mock initial notifications
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Quiz Completed!",
    message: "Your career assessment has been completed successfully. View your results now.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    actionUrl: "/dashboard",
  },
  {
    id: "2",
    type: "reminder",
    title: "Application Deadline",
    message: "IIT Delhi application deadline is in 3 days. Complete your application now.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    actionUrl: "/colleges",
  },
  {
    id: "3",
    type: "info",
    title: "New College Added",
    message: "NIT Trichy has been added to your recommended colleges list.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    actionUrl: "/colleges",
  },
  {
    id: "4",
    type: "warning",
    title: "Profile Incomplete",
    message: "Complete your profile to get better college recommendations.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: false,
    actionUrl: "/profile",
  },
]

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [mounted, setMounted] = useState(false)

  // Load notifications from localStorage on mount
  useEffect(() => {
    setMounted(true)
    // Ensure we're on the client side
    if (typeof window !== 'undefined') {
      const savedNotifications = localStorage.getItem("notifications")
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications)
          // Convert timestamp strings back to Date objects
          const notificationsWithDates = parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }))
          setNotifications(notificationsWithDates)
        } catch (error) {
          console.error("Error parsing notifications:", error)
          setNotifications(initialNotifications)
        }
      } else {
        setNotifications(initialNotifications)
      }
    } else {
      setNotifications(initialNotifications)
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (mounted && typeof window !== 'undefined' && notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications))
    }
  }, [notifications, mounted])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
