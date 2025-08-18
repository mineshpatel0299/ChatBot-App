"use client";

import { useState } from "react";
import { ChatSidebar } from "./chat-sidebar";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { ConnectionStatus } from "./connection-status";

export function ChatInterface() {
  const [selectedChatId, setSelectedChatId] = useState<string>("");

  return (
    <>
      <ConnectionStatus />

      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <ChatSidebar
          selectedChatId={selectedChatId}
          onChatSelect={setSelectedChatId}
        />

        <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900/50 to-slate-900/50 backdrop-blur-sm">
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
  );
}
