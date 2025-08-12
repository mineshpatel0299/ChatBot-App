"use client"

import { useState } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { MessageList } from "./message-list"
import { MessageInput } from "./message-input"
import { ConnectionStatus } from "./connection-status"

export function ChatInterface() {
  const [selectedChatId, setSelectedChatId] = useState<string>("")

  return (
    <>
      <ConnectionStatus />

      <div className="flex h-[calc(100vh-80px)] bg-gray-50">
        <ChatSidebar selectedChatId={selectedChatId} onChatSelect={setSelectedChatId} />

        <div className="flex-1 flex flex-col">
          <MessageList chatId={selectedChatId} />
          <MessageInput
            chatId={selectedChatId}
            onMessageSent={() => {
              // Real-time subscriptions handle updates automatically
            }}
          />
        </div>
      </div>
    </>
  )
}
