"use client"

import { Button } from "@/components/ui/button"
import { GraduationCap, LogOut, User, Settings } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SimpleNotificationBell } from "@/components/notifications/simple-notification-bell"
import { SimpleUserDropdown } from "@/components/layout/simple-user-dropdown"

export function DashboardHeader() {
  const { user, logout } = useUser()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className="glass relative z-[1000]">
      <div className="container flex h-16 items-center justify-between">
        <Link href={user?.type === "student" ? "/dashboard" : "/parent-portal"} className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary drop-shadow-sm" />
          <span className="text-xl font-bold tracking-tight">CareerPath</span>
        </Link>

        <div className="flex items-center space-x-4">
          <SimpleNotificationBell />
          <SimpleUserDropdown />
        </div>
      </div>
    </header>
  )
}
