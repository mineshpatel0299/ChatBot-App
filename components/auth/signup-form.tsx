"use client"

import type React from "react"

import { useState } from "react"
import { useSignUpEmailPassword } from "@nhost/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SignupFormProps {
  onToggleMode: () => void
}

export function SignupForm({ onToggleMode }: SignupFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const { signUpEmailPassword, isLoading, error, needsEmailVerification } = useSignUpEmailPassword()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      return
    }

    await signUpEmailPassword(email, password)
  }

  if (needsEmailVerification) {
    return (
      <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 border border-gray-700/50 backdrop-blur-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text text-2xl font-bold">
            Check your email
          </CardTitle>
          <CardDescription className="text-gray-300">
            We've sent you a verification link. Please check your email and click the link to verify your account.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 border border-gray-700/50 backdrop-blur-sm shadow-2xl">
      <CardHeader>
        <CardTitle className="text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text text-2xl font-bold">
          Sign Up
        </CardTitle>
        <CardDescription className="text-gray-300">Create a new account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          {password !== confirmPassword && confirmPassword && (
            <Alert
              variant="destructive"
              className="bg-gradient-to-r from-red-900/30 to-red-800/30 border-red-700/50 text-red-200 backdrop-blur-sm"
            >
              <AlertDescription>Passwords do not match</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert
              variant="destructive"
              className="bg-gradient-to-r from-red-900/30 to-red-800/30 border-red-700/50 text-red-200 backdrop-blur-sm"
            >
              <AlertDescription>
                {typeof error === "object" && error?.message ? error.message : String(error)}
              </AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all duration-200"
            disabled={isLoading || password !== confirmPassword}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700"
            onClick={onToggleMode}
          >
            Already have an account? Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
