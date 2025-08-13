export interface Chat {
  id: string
  title: string
  user_id: string
  created_at: string
  updated_at: string
  messages_aggregate?: {
    aggregate: {
      count: number
    }
  }
}

export interface Message {
  id: string
  chat_id: string
  user_id: string
  content: string
  role: "user" | "assistant"
  created_at: string
}

export interface ChatbotResponse {
  success: boolean
  message: string
  response_id?: string
}
