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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border-b border-gray-600/50 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              AI Chatbot
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">Welcome, {user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="flex items-center space-x-1 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/20 border border-gray-600/30 hover:border-red-500/50 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}
