"use client"

import { useState, useEffect } from "react"
import { useApolloClient } from "@apollo/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WifiOff } from "lucide-react"

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [wsConnected, setWsConnected] = useState(true)
  const client = useApolloClient()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Monitor WebSocket connection status
    const checkConnection = () => {
      // This is a simplified check - in production you'd want more sophisticated monitoring
      setWsConnected(navigator.onLine)
    }

    const interval = setInterval(checkConnection, 5000)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(interval)
    }
  }, [])

  if (!isOnline || !wsConnected) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Alert variant="destructive" className="w-80">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            {!isOnline ? "You're offline. " : "Connection lost. "}
            Messages may not sync until connection is restored.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return null
}
