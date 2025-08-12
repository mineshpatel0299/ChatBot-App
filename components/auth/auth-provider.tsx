"use client"

import type React from "react"

import { NhostProvider } from "@nhost/nextjs"
import { nhost } from "@/lib/nhost"

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <NhostProvider nhost={nhost}>{children}</NhostProvider>
}
