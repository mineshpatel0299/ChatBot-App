"use client"

import { useState, useEffect } from "react"
import { useApolloClient } from "@apollo/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WifiOff, Wifi } from "lucide-react"

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [wsConnected, setWsConnected] = useState(true)
  const [showStatus, setShowStatus] = useState(false)
  const client = useApolloClient()

  useEffect(() => {
    const handleOnline = () => {
      console.log("Network online detected")
      setIsOnline(true)
      setWsConnected(true)
      setShowStatus(true) // Show "connected" message briefly
      setTimeout(() => setShowStatus(false), 2000)
    }

    const handleOffline = () => {
      console.log("Network offline detected")
      setIsOnline(false)
      setWsConnected(false)
      setShowStatus(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    const checkWebSocketConnection = () => {
      try {
        const online = navigator.onLine

        if (online) {
          fetch("/api/health", {
            method: "HEAD",
            cache: "no-cache",
            signal: AbortSignal.timeout(5000),
          })
            .then(() => {
              console.log("Connection test successful")
              setIsOnline(true)
              setWsConnected(true)
              if (showStatus && (!isOnline || !wsConnected)) {
                setTimeout(() => setShowStatus(false), 2000)
              }
            })
            .catch((error) => {
              console.warn("Connection test failed:", error)
              setWsConnected(false)
              setShowStatus(true)
            })
        } else {
          setIsOnline(false)
          setWsConnected(false)
          setShowStatus(true)
        }
      } catch (error) {
        console.warn("Connection check failed:", error)
        if (!navigator.onLine) {
          setWsConnected(false)
          setShowStatus(true)
        }
      }
    }

    setIsOnline(navigator.onLine)
    setWsConnected(navigator.onLine)

    checkWebSocketConnection()
    const interval = setInterval(checkWebSocketConnection, 5000)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(interval)
    }
  }, [client, isOnline, wsConnected, showStatus])

  if (isOnline && wsConnected) {
    if (showStatus) {
      return (
        <div className="fixed top-4 right-4 z-50">
          <Alert className="w-80 bg-gradient-to-r from-green-900 to-green-800 border-green-700">
            <Wifi className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-100">Connected. Chat updates automatically.</AlertDescription>
          </Alert>
        </div>
      )
    }
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Alert variant="destructive" className="w-80 bg-gradient-to-r from-red-900 to-red-800 border-red-700">
        <WifiOff className="h-4 w-4 text-red-400" />
        <AlertDescription className="text-red-100">
          {!isOnline ? "No internet connection" : "Connection error"}. Chat may not update automatically.
        </AlertDescription>
      </Alert>
    </div>
  )
}
