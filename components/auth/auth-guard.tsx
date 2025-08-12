"use client"

import type React from "react"

import { useAuthenticationStatus } from "@nhost/nextjs"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"
import { useState, useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="w-full max-w-md">
          {isLoginMode ? (
            <LoginForm onToggleMode={() => setIsLoginMode(false)} />
          ) : (
            <SignupForm onToggleMode={() => setIsLoginMode(true)} />
          )}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
