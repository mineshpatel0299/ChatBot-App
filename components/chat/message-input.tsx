"use client"

import type React from "react"

import { useState } from "react"
import { useMutation } from "@apollo/client"
import { useUserData } from "@nhost/nextjs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, AlertCircle, Clock } from "lucide-react"
import { INSERT_MESSAGE } from "@/lib/graphql/mutations"
import { SEND_MESSAGE_ACTION } from "@/lib/graphql/actions"
import type { SendMessageInput } from "@/lib/graphql/actions"

interface MessageInputProps {
  chatId: string
  onMessageSent?: () => void
}

export function MessageInput({ chatId, onMessageSent }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Added optimistic message state for better UX
  const [optimisticMessage, setOptimisticMessage] = useState<string | null>(null)
  const user = useUserData()
  const [insertMessage] = useMutation(INSERT_MESSAGE)
  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION)

  const handleSend = async () => {
    if (!message.trim() || !user?.id || !chatId || isLoading) return

    setIsLoading(true)
    setError(null)
    const messageContent = message.trim()
    setMessage("")
    // Set optimistic message for immediate UI feedback
    setOptimisticMessage(messageContent)

    try {
      // Insert user message first
      await insertMessage({
        variables: {
          chatId,
          userId: user.id,
          content: messageContent,
          role: "user",
        },
      })

      const actionInput: SendMessageInput = {
        chat_id: chatId,
        message: messageContent,
      }

      const result = await sendMessageAction({
        variables: { input: actionInput },
      })

      if (!result.data?.sendMessage?.success) {
        throw new Error(result.data?.sendMessage?.message || "Failed to get chatbot response")
      }

      // Clear optimistic message on success
      setOptimisticMessage(null)
      onMessageSent?.()
    } catch (error) {
      console.error("Error sending message:", error)
      setError(error instanceof Error ? error.message : "Failed to send message")
      setMessage(messageContent) // Restore message on error
      // Clear optimistic message on error
      setOptimisticMessage(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!chatId) {
    return null
  }

  return (
    <div className="border-t border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-slate-800/80 p-4 backdrop-blur-sm">
      {error && (
        <Alert
          variant="destructive"
          className="mb-4 bg-gradient-to-r from-red-900/30 to-red-800/30 border-red-700/50 text-red-200 backdrop-blur-sm"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{String(error)}</AlertDescription>
        </Alert>
      )}

      {optimisticMessage && (
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-700/50 rounded-lg backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-sm text-blue-300">
            <Clock className="h-4 w-4 animate-pulse" />
            <span>Sending: "{String(optimisticMessage)}"</span>
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 min-h-[60px] max-h-[120px] resize-none bg-gradient-to-r from-gray-700 to-slate-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 backdrop-blur-sm"
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className="self-end bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Press Enter to send, Shift+Enter for new line
        {isLoading && " • Waiting for AI response..."}
      </p>
    </div>
  )
}
