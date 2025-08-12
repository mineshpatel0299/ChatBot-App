import { gql } from "@apollo/client"

// Chat queries
export const GET_USER_CHATS = gql`
  query GetUserChats {
    chats(order_by: { updated_at: desc }) {
      id
      title
      created_at
      updated_at
      messages_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`

export const GET_CHAT_WITH_MESSAGES = gql`
  query GetChatWithMessages($chatId: uuid!) {
    chats_by_pk(id: $chatId) {
      id
      title
      created_at
      updated_at
      messages(order_by: { created_at: asc }) {
        id
        content
        role
        created_at
      }
    }
  }
`

// Message queries
export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      role
      created_at
    }
  }
`
