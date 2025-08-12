"use client"

import type React from "react"

import { useState } from "react"
import { useSubscription, useMutation } from "@apollo/client"
import { useUserData } from "@nhost/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, MessageCircle, Trash2, Edit2, Wifi, WifiOff } from "lucide-react"
import { SUBSCRIBE_TO_USER_CHATS } from "@/lib/graphql/subscriptions"
import { CREATE_CHAT, DELETE_CHAT, UPDATE_CHAT_TITLE } from "@/lib/graphql/mutations"

interface ChatSidebarProps {
  selectedChatId?: string
  onChatSelect: (chatId: string) => void
}

export function ChatSidebar({ selectedChatId, onChatSelect }: ChatSidebarProps) {
  const user = useUserData()
  const [isCreating, setIsCreating] = useState(false)
  const [newChatTitle, setNewChatTitle] = useState("")
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("connecting")

  const { data, loading, error } = useSubscription(SUBSCRIBE_TO_USER_CHATS, {
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

  const [createChat] = useMutation(CREATE_CHAT)
  const [deleteChat] = useMutation(DELETE_CHAT)
  const [updateChatTitle] = useMutation(UPDATE_CHAT_TITLE)

  const handleCreateChat = async () => {
    if (!user?.id || !newChatTitle.trim()) return

    try {
      const result = await createChat({
        variables: {
          title: newChatTitle.trim(),
          userId: user.id,
        },
      })

      if (result.data?.insert_chats_one) {
        onChatSelect(result.data.insert_chats_one.id)
        setNewChatTitle("")
        setIsCreating(false)
      }
    } catch (error) {
      console.error("Error creating chat:", error)
    }
  }

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      await deleteChat({ variables: { chatId } })
      if (selectedChatId === chatId) {
        onChatSelect("")
      }
    } catch (error) {
      console.error("Error deleting chat:", error)
    }
  }

  const handleUpdateTitle = async (chatId: string) => {
    if (!editTitle.trim()) return

    try {
      await updateChatTitle({
        variables: {
          chatId,
          title: editTitle.trim(),
        },
      })
      setEditingChatId(null)
      setEditTitle("")
    } catch (error) {
      console.error("Error updating chat title:", error)
    }
  }

  const startEditing = (chatId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingChatId(chatId)
    setEditTitle(currentTitle)
  }

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Chats</h2>
          <Button size="sm" onClick={() => setIsCreating(true)} className="flex items-center space-x-1">
            <Plus className="h-4 w-4" />
            <span>New</span>
          </Button>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          {connectionStatus === "connected" ? (
            <>
              <Wifi className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">Live updates</span>
            </>
          ) : connectionStatus === "connecting" ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-500"></div>
              <span className="text-xs text-yellow-600">Connecting...</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-600">Offline</span>
            </>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-3">
            <AlertDescription className="text-xs">
              Connection error. Chat list may not update automatically.
            </AlertDescription>
          </Alert>
        )}

        {/* New Chat Form */}
        {isCreating && (
          <div className="space-y-2">
            <Input
              placeholder="Chat title..."
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateChat()
                if (e.key === "Escape") {
                  setIsCreating(false)
                  setNewChatTitle("")
                }
              }}
              autoFocus
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleCreateChat} disabled={!newChatTitle.trim()}>
                Create
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsCreating(false)
                  setNewChatTitle("")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {data?.chats?.map((chat: any) => (
            <Card
              key={chat.id}
              className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 group ${
                selectedChatId === chat.id ? "bg-blue-50 border-blue-200" : ""
              }`}
              onClick={() => onChatSelect(chat.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <MessageCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  {editingChatId === chat.id ? (
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdateTitle(chat.id)
                        if (e.key === "Escape") {
                          setEditingChatId(null)
                          setEditTitle("")
                        }
                      }}
                      onBlur={() => handleUpdateTitle(chat.id)}
                      className="h-6 text-sm"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-900 truncate">{chat.title}</span>
                  )}
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => startEditing(chat.id, chat.title, e)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {chat.messages_aggregate?.aggregate?.count || 0} messages
              </div>
            </Card>
          ))}

          {(!data?.chats || data.chats.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chats yet</p>
              <p className="text-xs">Create your first chat to get started</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
