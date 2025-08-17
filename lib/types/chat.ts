export interface Chat {
  id: string
  title: string
  user_id: string
  created_at: string
  messages_aggregate?: {
    aggregate: {
      count: number
    }
  }
}

export interface Message {
  id: string
  chat_id: string
  sender_id: string
  content: string
  sender_type: "user" | "bot"
  created_at: string
}

export interface ChatbotResponse {
  success: boolean
  reply: string
}