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
    <div className="border-t border-gray-200 bg-white p-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{String(error)}</AlertDescription>
        </Alert>
      )}

      {/* Added optimistic message preview */}
      {optimisticMessage && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-blue-700">
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
          className="flex-1 min-h-[60px] max-h-[120px] resize-none"
          disabled={isLoading}
        />
        <Button onClick={handleSend} disabled={!message.trim() || isLoading} className="self-end">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Press Enter to send, Shift+Enter for new line
        {isLoading && " • Waiting for AI response..."}
      </p>
    </div>
  )
}
