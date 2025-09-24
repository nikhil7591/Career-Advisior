"use client"

import { useUser } from "@/contexts/user-context"
import { useNotifications } from "@/contexts/notification-context"

export function ContextDebug() {
  const { user } = useUser()
  const { notifications, unreadCount } = useNotifications()

  if (typeof window !== 'undefined') {
    console.log('Context Debug:', {
      user,
      notificationsCount: notifications.length,
      unreadCount
    })
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs rounded z-50">
      <div>User: {user?.name || 'None'}</div>
      <div>Notifications: {notifications.length}</div>
      <div>Unread: {unreadCount}</div>
    </div>
  )
}
