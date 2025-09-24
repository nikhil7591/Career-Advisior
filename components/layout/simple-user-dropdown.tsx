"use client"

import { useState, useEffect, useRef } from "react"
import { User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { Portal } from "@/components/ui/portal"
import Link from "next/link"

export function SimpleUserDropdown() {
  const { user, logout } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      
      // Calculate dropdown position
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right
        })
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        ref={buttonRef}
        variant="ghost" 
        size="sm" 
        className="hover:bg-primary/10 flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium">{user.name}</span>
      </Button>
      
      {isOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99998]" onClick={() => setIsOpen(false)} />
          <div 
            ref={dropdownRef}
            className="fixed w-56 bg-white dark:bg-gray-800 border rounded-lg shadow-xl z-[99999] backdrop-blur-sm"
            style={{
              top: `${dropdownPosition.top}px`,
              right: `${dropdownPosition.right}px`
            }}
          >
            <div className="p-3 border-b">
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {user.email || `${user.type === "student" ? "Student" : "Parent"}`}
              </p>
            </div>
            <div className="py-2">
              <Link href="/profile" onClick={() => setIsOpen(false)}>
                <div className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </div>
              </Link>
              <Link href="/career-mapping" onClick={() => setIsOpen(false)}>
                <div className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Career Path
                </div>
              </Link>
              <Link href="/colleges" onClick={() => setIsOpen(false)}>
                <div className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Colleges
                </div>
              </Link>
              <Link href="/chatbot" onClick={() => setIsOpen(false)}>
                <div className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                  <User className="h-4 w-4" />
                  AI Counselor
                </div>
              </Link>
              <div className="border-t mt-2 pt-2">
                <div 
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 text-red-600"
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}
