"use client"

import type React from "react"

import { useUserData, useSignOut } from "@nhost/nextjs"
import { Button } from "@/components/ui/button"
import { LogOut, MessageCircle } from "lucide-react"

interface ChatLayoutProps {
  children: React.ReactNode
}

export function ChatLayout({ children }: ChatLayoutProps) {
  const user = useUserData()
  const { signOut } = useSignOut()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">AI Chatbot</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut} className="flex items-center space-x-1">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
