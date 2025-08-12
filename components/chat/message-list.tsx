"use client"

import { useEffect, useRef, useState } from "react"
import { useSubscription } from "@apollo/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bot, User, Wifi, WifiOff } from "lucide-react"
import { SUBSCRIBE_TO_CHAT_MESSAGES } from "@/lib/graphql/subscriptions"

interface MessageListProps {
  chatId: string
}

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  created_at: string
}

export function MessageList({ chatId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("connecting")

  const { data, loading, error } = useSubscription(SUBSCRIBE_TO_CHAT_MESSAGES, {
    variables: { chatId },
    skip: !chatId,
    onSubscriptionData: () => {
      setConnectionStatus("connected")
    },
    onSubscriptionComplete: () => {
      setConnectionStatus("disconnected")
    },
    onError: () => {
      setConnectionStatus("disconnected")
    },
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [data?.messages])

  useEffect(() => {
    if (chatId && !loading && !error) {
      setConnectionStatus("connected")
    } else if (error) {
      setConnectionStatus("disconnected")
    }
  }, [chatId, loading, error])

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to AI Chatbot</h3>
          <p className="text-gray-600">Select a chat or create a new one to start conversing</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Connecting to real-time chat...</p>
        </div>
      </div>
    )
  }

  const messages: Message[] = data?.messages || []

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {connectionStatus === "connected" ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Connected</span>
              </>
            ) : connectionStatus === "connecting" ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                <span className="text-sm text-yellow-600">Connecting...</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">Disconnected</span>
              </>
            )}
          </div>
          <span className="text-xs text-gray-500">Real-time chat</span>
        </div>
      </div>

      {error && (
        <div className="px-4 py-2">
          <Alert variant="destructive">
            <AlertDescription>
              Connection error: {typeof error === "object" && error?.message ? error.message : String(error)}. Messages
              may not update in real-time.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <Card
                  className={`max-w-[70%] p-3 ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0">
                      {message.role === "user" ? (
                        <User className="h-4 w-4 mt-0.5" />
                      ) : (
                        <Bot className="h-4 w-4 mt-0.5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
