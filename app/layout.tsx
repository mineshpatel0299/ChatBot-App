import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Roboto_Mono } from "next/font/google"

const GeistSans = Inter({ subsets: ["latin"], variable: "--font-sans" })
const GeistMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" })
import "./globals.css"
import { AuthProvider } from "@/components/auth/auth-provider"
import { AuthGuard } from "@/components/auth/auth-guard"
// Added GraphQL provider for Apollo Client
import { GraphQLProvider } from "@/components/providers/apollo-provider"

export const metadata: Metadata = {
  title: "AI Chatbot App",
  description: "Intelligent chatbot powered by AI",
  generator: "Min.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="bg-gradient-to-br from-gray-900 via-slate-900 to-black min-h-screen">
        <AuthProvider>
          <AuthGuard>
            <GraphQLProvider>{children}</GraphQLProvider>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  )
}
